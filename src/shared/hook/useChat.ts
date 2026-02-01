import { useEffect, useRef, useState } from 'react';
import { socket } from '@/src/socket/socket';
import { useAuthStore } from '@/store/auth';
import {
  useMessageControllerGetMessages,
  useMessageControllerSendMessage,
  type CreateMessageDto,
  type MessageResponseDto,
} from '@/api/generated';

export const useChat = (conversationId: string) => {
  const [messages, setMessages] = useState<MessageResponseDto[]>([]);
  const { user } = useAuthStore();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const emitMarkRead = () => {
    if (socket.connected) {
      socket.emit('mark-read', { conversationId });
    }
  };

  /* ---------------- SOCKET LISTENERS ---------------- */

  useEffect(() => {
    if (!user?.id) return;

    socket.on('new-message', (msg: MessageResponseDto) => {
      setMessages((prev) => [...prev, msg]);

      if (msg.senderId !== user.id) {
        socket.emit('mark-read', { conversationId });
      }
    });

    socket.on('messages-read', (data) => {
      console.log('Peer read:', data);
    });

    socket.on('typing', ({ userId, isTyping }) => {
      if (userId === user.id) return;

      setTypingUsers((prev) =>
        isTyping
          ? prev.includes(userId)
            ? prev
            : [...prev, userId]
          : prev.filter((id) => id !== userId),
      );
    });

    socket.emit('mark-read', { conversationId });

    return () => {
      socket.off('new-message');
      socket.off('messages-read');
      socket.off('typing');
    };
  }, [conversationId, user?.id]);

  /* ---------------- LOAD HISTORY ---------------- */

  const { data: allMessages } = useMessageControllerGetMessages(conversationId);

  useEffect(() => {
    if (allMessages) {
      setMessages(allMessages);
      emitMarkRead();
    }
  }, [allMessages, conversationId]);

  /* ---------------- SEND MESSAGE ---------------- */

  const sendMessageMutation = useMessageControllerSendMessage();

  const sendMessage = async (dto: CreateMessageDto) => {
    try {
      if (socket.connected) {
        socket.emit('send-message', dto);
      } else {
        await sendMessageMutation.mutateAsync({ data: dto });
      }
    } catch {
      await sendMessageMutation.mutateAsync({ data: dto });
    }
  };

  /* ---------------- TYPING ---------------- */

  const emitTypingStart = () => {
    if (!socket.connected) return;

    socket.emit('typing:start', { conversationId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing:stop', { conversationId });
    }, 1000);
  };

  const emitTypingStop = () => {
    if (!socket.connected) return;

    socket.emit('typing:stop', { conversationId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  return {
    messages,
    sendMessage,
    markRead: emitMarkRead,
    typingUsers,
    emitTypingStart,
    emitTypingStop,
  };
};
