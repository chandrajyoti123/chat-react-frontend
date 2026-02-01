import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton, Avatar, Badge, Paper, MenuItem, Chip } from '@mui/material';
import {
  ArrowLeft,
  Phone,
  Video,
  Smile,
  Paperclip,
  Send,
  Reply,
  Trash2,
  Info,
  CheckCheck,
} from 'lucide-react';
// import type { Chat, Message } from '../App';
import { TypingIndicator } from './TypingIndicator';
import { AttachmentPreview, type AttachmentFile } from './AttachmentPreview';
import { MessageAttachment } from './MessageAttachment';
// import { ChatDetailsPanel, GroupParticipant, ChatMedia } from './ChatDetailsPanel';
import * as Yup from 'yup';
import { useAuthStore } from '@/store/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChat } from '@/shared/hook/useChat';
import {
  useConversationControllerGetConversationById,
  // useConversationControllerGetOppositeMember,
  useMessageControllerDeleteForEveryone,
  useMessageControllerDeleteForMe,
  type MessageResponseDto,
} from '@/api/generated';
import { Field, Form, Formik } from 'formik';
import { TextFormField } from '@/components/FormFields/TextFormField';
import { formatMessageTime, getLastSeen } from '@/shared/formatter';
import { ChatDetailsPanel } from './ChatDetailsPanel';
import { ENV } from '@/config/env';

// import { useCall } from '@/shared/hook/useCall';

type ChatScreenProps = {
  // chat: Chat;
  // currentUserId: string;
  // onBack: () => void;
  // onSendMessage: (text: string, replyTo?: { text: string; senderName: string }, attachment?: any) => void;
  // onDeleteMessage: (messageId: string) => void;
  // onAudioCall: () => void;
  // onVideoCall: () => void;
  // theme: 'light' | 'dark';
};

export function ChatScreen(
  {
    // chat,
    // currentUserId,
    // onBack,
    // onSendMessage,
    // onDeleteMessage,
    // onAudioCall,
    // onVideoCall,
    // theme,
  }: ChatScreenProps,
) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const location = useLocation();
  const { conversationId } = location.state as { conversationId: string; contactId: string };

  const { messages, sendMessage, typingUsers, emitTypingStart, emitTypingStop } =
    useChat(conversationId);
  console.log(typingUsers, 'typingUsers in chat screen');
  // const { startCall, acceptCall, rejectCall, incomingCall, endCall } = useCal(conversationId);
  // const { data: oppositeMember } = useConversationControllerGetOppositeMember(conversationId);

  // const { data: contact } = useContactControllerGetContact(contactId)
  const { data: conversation } = useConversationControllerGetConversationById(conversationId);
  const deleteForEveryOneMutation = useMessageControllerDeleteForEveryone();
  const deleteForMeMutation = useMessageControllerDeleteForMe();

  // const [message, setMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    text: string;
    senderName: string;
  } | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    messageId: string;
    x: number;
    y: number;
  } | null>(null);
  // const [isTyping, setIsTyping] = useState(false);
  // const [typingUser, setTypingUser] = useState<string>('');
  const [attachmentPreview, setAttachmentPreview] = useState<AttachmentFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showChatDetails, setShowChatDetails] = useState(false);
  // const [isMuted, setIsMuted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const emojis = ['😊', '😂', '❤️', '👍', '🎉', '😍', '🔥', '💯', '👏', '🙌'];

  // Mock group participants (for demo)
  // const mockParticipants: GroupParticipant[] = [
  //     {
  //         id: 'p1',
  //         name: 'John Doe',
  //         email: 'john@example.com',
  //         phone: '+1234567890',
  //         status: 'Available',
  //         online: true,
  //         role: 'admin',
  //     },
  //     {
  //         id: 'p2',
  //         name: 'Alice Johnson',
  //         email: 'alice@example.com',
  //         phone: '+1234567891',
  //         status: 'Busy',
  //         online: true,
  //         role: 'member',
  //     },
  //     {
  //         id: 'p3',
  //         name: 'Bob Smith',
  //         email: 'bob@example.com',
  //         phone: '+1234567892',
  //         status: 'Away',
  //         online: false,
  //         role: 'member',
  //     },
  // ];

  // // Mock media for demo
  // const mockMedia: ChatMedia[] = [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Simulate typing indicator
  // useEffect(() => {
  //     if (message.length > 0) {
  //         // Simulate receiving typing indicator
  //         const timeout = setTimeout(() => {
  //             if (Math.random() > 0.7) {
  //                 setIsTyping(true);
  //                 setTypingUser(chat.contact.name);
  //                 setTimeout(() => setIsTyping(false), 3000);
  //             }
  //         }, 2000);
  //         return () => clearTimeout(timeout);
  //     }
  // }, [message, chat.contact.name]);

  // const handleSendMessage = (e?: React.FormEvent, caption?: string) => {
  //     if (e) e.preventDefault();

  //     const textToSend = caption || message;
  //     if (textToSend.trim() || attachmentPreview) {
  //         const attachmentData = attachmentPreview ? {
  //             id: `att${Date.now()}`,
  //             type: attachmentPreview.type,
  //             url: attachmentPreview.preview || '',
  //             fileName: attachmentPreview.file.name,
  //             fileSize: attachmentPreview.size,
  //         } : undefined;

  //         // onSendMessage(
  //         //     textToSend,
  //         //     replyingTo ? { text: replyingTo.text, senderName: replyingTo.senderName } : undefined,
  //         //     attachmentData
  //         // );
  //         setMessage('');
  //         setReplyingTo(null);
  //         setAttachmentPreview(null);
  //         // setUploading(false);
  //         setUploadProgress(0);
  //     }
  // };

  // const handleEmojiClick = (emoji: string) => {
  //     // setMessage(message + emoji);
  //     // setShowEmoji(false);
  // };

  const handleContextMenu = (e: React.MouseEvent, msg: MessageResponseDto) => {
    e.preventDefault();
    if (msg.type === 'SYSTEM') return;
    setContextMenu({ messageId: msg.id, x: e.clientX, y: e.clientY });
  };

  const handleReply = (msg: MessageResponseDto) => {
    const senderName = msg.senderId === user?.id ? 'You' : msg.sender.name;
    setReplyingTo({ id: msg.id, text: msg.content, senderName });
    setContextMenu(null);
  };

  // const handleDelete = (messageId: string) => {
  //     onDeleteMessage(messageId);
  //     setContextMenu(null);
  // };

  const handleDeleteForMe = (messageId: string) => {
    deleteForMeMutation.mutate({ messageId: messageId });
    setContextMenu(null);
  };
  const handleDeleteForEveryOne = (messageId: string) => {
    deleteForEveryOneMutation.mutate({ messageId: messageId });
    setContextMenu(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formatSize = (bytes: number) => {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    let type: 'image' | 'video' | 'document' = 'document';
    if (file.type.startsWith('image/')) type = 'image';
    else if (file.type.startsWith('video/')) type = 'video';

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachmentPreview({
        file,
        type,
        preview: event.target?.result as string,
        size: formatSize(file.size),
      });
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // const handleSendAttachment = async (caption: string) => {
  //     setUploading(true);
  //     const formData = new FormData();
  //     formData.append('file', attachmentPreview?.file);
  //     const response = await fetch(
  //         'https://crud-nest-production-ac29.up.railway.app/upload/chat-file',
  //         {
  //             method: 'POST',
  //             body: formData,
  //         },
  //     );
  //     console.log(response, "reponse")
  //     if (!response.ok) throw new Error('Upload failed');
  //     // ✅ THIS is what Swagger shows
  //     const result = await response.json();

  //     console.log(result, 'parsed swagger response');

  //     sendMessage({
  //         conversationId,
  //         content: caption || '',
  //         meta: {
  //             fileName: attachmentPreview.file.name,
  //             fileSize: attachmentPreview.size,
  //             fileType: attachmentPreview.type,
  //             ...result
  //         }
  //     });
  //     setUploading(false);

  //     setUploadedFile(null);
  //     setAttachmentPreview(null)

  //     setUploadProgress(0);

  //     // Simulate upload progress
  //     const interval = setInterval(() => {
  //         setUploadProgress(prev => {
  //             if (prev >= 100) {
  //                 clearInterval(interval);
  //                 // sendMessage(undefined, caption);
  //                 return 100;
  //             }
  //             return prev + 10;
  //         });
  //     }, 200);
  // };

  const handleSendAttachment = async (caption: string) => {
    if (!attachmentPreview?.file) return;

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', attachmentPreview.file);

    const xhr = new XMLHttpRequest();

    xhr.open('POST', `${ENV.API_URL}/upload/chat-file`, true);

    // ✅ REAL upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    };

    xhr.onload = () => {
      setUploading(false);

      if (xhr.status >= 200 && xhr.status < 300) {
        const result = JSON.parse(xhr.responseText);

        sendMessage({
          conversationId,
          content: caption || '',
          meta: {
            fileName: attachmentPreview.file.name,
            fileSize: attachmentPreview.size,
            fileType: attachmentPreview.type,
            ...result,
          },
        });

        setAttachmentPreview(null);
        setUploadProgress(100);
      } else {
        console.error('Upload failed', xhr.responseText);
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      console.error('Upload error');
    };

    xhr.send(formData);
  };

  const handleCancelAttachment = () => {
    setAttachmentPreview(null);
    setUploading(false);
    setUploadProgress(0);
  };

  const isMessageRead = (msg: any) => {
    if (!conversation || !user) return false;

    // One-to-one chat
    if (!conversation.isGroup) {
      return msg.reads?.length > 0;
    }

    // Group chat
    // Exclude sender from participants
    const otherParticipantsCount = conversation.participants.filter(
      (p) => p.userId !== msg.senderId,
    ).length;

    return msg.reads?.length === otherParticipantsCount;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', px: 2, py: 1.5, boxShadow: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton
              onClick={() => {
                navigate(-1);
              }}
              sx={{
                display: { md: 'none' },
                color: 'white',
                '&:hover': {
                  color: 'rgba(197, 202, 233, 1)',
                },
              }}
            >
              <ArrowLeft size={24} />
            </IconButton>

            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              sx={{
                ...(!conversation?.isGroup
                  ? {
                      '& .MuiBadge-badge': {
                        backgroundColor: conversation?.participants?.[0]?.user?.isOnline
                          ? '#34D399'
                          : 'transparent',
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        border: '2px solid',
                        borderColor: 'primary.main',
                      },
                    }
                  : {}),
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: 'secondary.main',
                  boxShadow: 3,
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setShowChatDetails(true);
                }}
              >
                {conversation?.isGroup
                  ? conversation?.name?.charAt(0).toUpperCase()
                  : conversation?.participants?.[0]?.user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </Badge>
            <Box
              onClick={() => {
                setShowChatDetails(true);
              }}
              sx={{ cursor: 'pointer' }}
            >
              <Typography sx={{ color: 'white' }}>
                {conversation?.isGroup
                  ? `${conversation?.name}`
                  : conversation?.participants?.[0]?.user?.name}
              </Typography>
              {/* <Typography variant="caption" sx={{ color: 'rgba(197, 202, 233, 1)' }}>
                                {chat.isGroup
                                    ? `${mockParticipants.length} participants`
                                    : chat.contact.online ? 'Online' : 'Offline'
                                }
                            </Typography> */}
              <Typography variant="caption" sx={{ color: 'rgba(197, 202, 233, 1)' }}>
                {conversation?.isGroup
                  ? `${conversation?.participants?.length} participants`
                  : conversation?.participants?.[0]?.user?.isOnline
                    ? 'Online'
                    : `Last seen ${getLastSeen(conversation?.participants?.[0]?.user?.lastSeenAt)}`}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              onClick={() => {}}
              sx={{
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <Phone size={20} />
            </IconButton>
            <IconButton
              onClick={() => {}}
              sx={{
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <Video size={20} />
            </IconButton>
            <IconButton
              onClick={() => {
                setShowChatDetails(true);
              }}
              sx={{
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <Info size={20} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <TypingIndicator
          conversationId={conversationId}
          typingUsers={typingUsers}
          // userName={conversation?.participants?.[0]?.user?.name}
          // userAvatar={conversation?.participants?.[0]?.user?.name}
          // isGroup={conversation?.isGroup}
        />
      )}

      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
        {messages.map((msg) => {
          const isOwn = msg.senderId === user?.id;

          // System message
          if (msg.type === 'SYSTEM') {
            return (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <Chip
                  label={msg.content}
                  size="small"
                  sx={{
                    bgcolor: (theme: { palette: { mode: string } }) =>
                      theme.palette.mode === 'light' ? '#E8EAF6' : 'rgba(63, 81, 181, 0.2)',
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                  }}
                />
              </Box>
            );
          }

          return (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isOwn ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              {/* Show sender info for group messages */}
              {conversation?.isGroup && !isOwn && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, ml: 1 }}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      background: 'linear-gradient(135deg, #3F51B5 0%, #42A5F5 100%)',
                      fontSize: '0.75rem',
                    }}
                  >
                    {msg.sender?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="caption" sx={{ color: 'primary.main' }}>
                    {msg.sender?.name}
                  </Typography>
                </Box>
              )}

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: isOwn ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                }}
                onContextMenu={(e) => handleContextMenu(e, msg)}
              >
                <Paper
                  elevation={isOwn ? 1 : 3}
                  sx={{
                    px: 2,
                    py: 1.25,
                    bgcolor: isOwn ? '#E8EAF6' : 'background.paper',
                    color: 'text.primary',
                    borderRadius: isOwn ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  }}
                >
                  {msg?.replyTo && (
                    <Box
                      sx={{
                        mb: 1,
                        pb: 1,
                        borderLeft: 4,
                        borderColor: isOwn ? 'primary.main' : 'secondary.main',
                        pl: 1.25,
                        bgcolor: isOwn
                          ? 'rgba(255, 255, 255, 0.5)'
                          : (theme) =>
                              theme.palette.mode === 'light' ? '#FAFAFA' : 'rgba(55, 65, 81, 0.5)',
                        borderRadius: 1,
                        p: 1,
                        mx: -0.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: isOwn ? 'primary.main' : 'secondary.main',
                        }}
                      >
                        {msg?.replyTo?.sender?.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          opacity: 0.75,
                        }}
                      >
                        {msg.replyTo.content}
                      </Typography>
                    </Box>
                  )}

                  {/* Attachment */}
                  {msg.meta?.url && (
                    <Box sx={{ mb: msg.content ? 1 : 0 }}>
                      <MessageAttachment attachment={msg.meta} isOwn={isOwn} />
                    </Box>
                  )}

                  {msg.content && (
                    <Typography sx={{ wordBreak: 'break-word' }}>{msg.content}</Typography>
                  )}

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: isOwn ? 'grey.600' : 'text.secondary',
                      }}
                    >
                      {formatMessageTime(msg.createdAt)}
                    </Typography>
                    {/* {isOwn && (
                      <Box sx={{ color: 'grey.600' }}>
                        {msg?.reads?.[0]?.id ? (
                          <CheckCheck size={16} color="#42A5F5" />
                        ) : (
                          <CheckCheck size={16} />
                        )}
                      </Box>
                    )} */}
                    {isOwn && (
                      <Box sx={{ color: 'grey.600' }}>
                        {isMessageRead(msg) ? (
                          <CheckCheck size={16} color="#42A5F5" />
                        ) : (
                          <CheckCheck size={16} />
                        )}
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Box>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      {/* Reply Banner */}
      {replyingTo && (
        <Box
          sx={{
            bgcolor: (theme) => (theme.palette.mode === 'light' ? '#E8EAF6' : '#1F2937'),
            borderTop: 2,
            borderColor: 'primary.main',
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Reply size={16} color="#3F51B5" />
              <Typography variant="body2" sx={{ color: 'primary.main' }}>
                Replying to {replyingTo.senderName}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: 'text.primary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {replyingTo.text}
            </Typography>
          </Box>
          <IconButton
            onClick={() => setReplyingTo(null)}
            sx={{
              color: 'text.primary',
              '&:hover': {
                color: 'text.primary',
              },
            }}
          >
            <Typography sx={{ fontSize: '1.5rem' }}>×</Typography>
          </IconButton>
        </Box>
      )}

      {/* Input */}
      <Box sx={{ bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', p: 2 }}>
        {showEmoji && (
          <Box
            sx={{
              mb: 2,
              p: 1.5,
              bgcolor: (theme) => (theme.palette.mode === 'light' ? '#FAFAFA' : '#374151'),
              borderRadius: 3,
              boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {emojis.map((emoji) => (
                <IconButton
                  key={emoji}
                  onClick={() => {}}
                  sx={{
                    fontSize: '1.5rem',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.25)',
                      bgcolor: (theme) => (theme.palette.mode === 'light' ? 'white' : '#4B5563'),
                    },
                    p: 0.5,
                  }}
                >
                  {emoji}
                </IconButton>
              ))}
            </Box>
          </Box>
        )}
        {/* <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                        onClick={() => setShowEmoji(!showEmoji)}
                        sx={{
                            color: 'primary.main',
                            '&:hover': {
                                bgcolor: (theme) => theme.palette.mode === 'light' ? '#E8EAF6' : '#374151',
                            },
                        }}
                    >
                        <Smile size={20} />
                    </IconButton>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*,.pdf,.doc,.docx"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                    <IconButton
                        onClick={() => fileInputRef.current?.click()}
                        sx={{
                            color: 'primary.main',
                            '&:hover': {
                                bgcolor: (theme) => theme.palette.mode === 'light' ? '#E8EAF6' : '#374151',
                            },
                        }}
                    >
                        <Paperclip size={20} />
                    </IconButton>
                    <TextField
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message"
                        fullWidth
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                bgcolor: (theme) => theme.palette.mode === 'light' ? '#FAFAFA' : '#374151',
                                borderRadius: 2,
                                '& fieldset': {
                                    borderColor: (theme) => theme.palette.mode === 'light' ? '#E5E7EB' : '#4B5563',
                                },
                                '&:hover fieldset': {
                                    borderColor: (theme) => theme.palette.mode === 'light' ? '#E5E7EB' : '#4B5563',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'primary.main',
                                },
                            },
                        }}
                    />
                    <IconButton
                        type="submit"
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            boxShadow: 3,
                            '&:hover': {
                                bgcolor: 'primary.dark',
                            },
                        }}
                    >
                        <Send size={20} />
                    </IconButton>
                </Box> */}

        <Formik
          initialValues={{
            message: '',
            chatFile: { file: null, fileMeta: null },
          }}
          validationSchema={Yup.object({
            // message: Yup.string(),
            // chatFile: Yup.object().shape({
            //   fileMeta: Yup.object().nullable(),
            //   file: Yup.mixed().nullable(),
            // }),
          })}
          onSubmit={(values, { resetForm }) => {
            sendMessage({
              conversationId,
              content: values.message,
              replyToId: replyingTo?.id,
              // meta: filePreview,
            });
            setReplyingTo(null);
            resetForm();
          }}
        >
          {() => (
            <Form>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={() => setShowEmoji(!showEmoji)}
                  sx={{
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: (theme) => (theme.palette.mode === 'light' ? '#E8EAF6' : '#374151'),
                    },
                  }}
                >
                  <Smile size={20} />
                </IconButton>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <IconButton
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: (theme) => (theme.palette.mode === 'light' ? '#E8EAF6' : '#374151'),
                    },
                  }}
                >
                  <Paperclip size={20} />
                </IconButton>

                <Field
                  name="message"
                  placeholder="Type message..."
                  component={TextFormField}
                  fullWidth
                  inputProps={{
                    onChange: () => emitTypingStart(),
                    onBlur: () => emitTypingStop(),
                  }}
                />

                <IconButton
                  type="submit"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    boxShadow: 3,
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  <Send size={20} />
                </IconButton>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>

      {/* Context Menu */}
      {contextMenu && (
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            left: contextMenu.x,
            top: contextMenu.y,
            borderRadius: 3,
            border: 1,
            borderColor: 'divider',
            py: 1,
            zIndex: 50,
          }}
        >
          <MenuItem
            onClick={() => {
              const msg = messages.find((m) => m.id === contextMenu.messageId);
              if (msg) handleReply(msg);
            }}
            sx={{ gap: 1, color: 'text.primary' }}
          >
            <Reply size={16} />
            Reply
          </MenuItem>
          <MenuItem
            onClick={() => handleDeleteForMe(contextMenu.messageId)}
            sx={{
              gap: 1,
              color: 'error.main',
              '&:hover': {
                bgcolor: (theme: { palette: { mode: string } }) =>
                  theme.palette.mode === 'light'
                    ? 'rgba(239, 68, 68, 0.1)'
                    : 'rgba(220, 38, 38, 0.2)',
              },
            }}
          >
            <Trash2 size={16} />
            Delete for Me
          </MenuItem>
          <MenuItem
            onClick={() => handleDeleteForEveryOne(contextMenu.messageId)}
            sx={{
              gap: 1,
              color: 'error.main',
              '&:hover': {
                bgcolor: (theme: { palette: { mode: string } }) =>
                  theme.palette.mode === 'light'
                    ? 'rgba(239, 68, 68, 0.1)'
                    : 'rgba(220, 38, 38, 0.2)',
              },
            }}
          >
            <Trash2 size={16} />
            Delete for EveryOne
          </MenuItem>
        </Paper>
      )}

      {/* Attachment Preview */}
      {attachmentPreview && (
        <AttachmentPreview
          attachment={attachmentPreview}
          onSend={handleSendAttachment}
          onCancel={handleCancelAttachment}
          uploading={uploading}
          uploadProgress={uploadProgress}
        />
      )}

      {/* <IncomingCall
        conversationId={conversationId}
        // callData={callData}
        onAccept={acceptCall}
        onReject={rejectCall}
      // theme={theme}
      />

      <OngoingCall
          conversationId={conversationId}
        // callData={callData}
        onEndCall={endCall}
      // theme={theme}
      /> */}

      {/* Chat Details Panel */}
      <ChatDetailsPanel
        open={showChatDetails}
        onClose={() => setShowChatDetails(false)}
        // contact={chat.contact}
        isGroup={false}
        // participants={chat.isGroup ? mockParticipants : undefined}
        // media={mockMedia}
        // onAddParticipants={chat.isGroup ? () => console.log('Add participants') : undefined}
        // onExitGroup={chat.isGroup ? () => console.log('Exit group') : undefined}
        // onMuteToggle={() => setIsMuted(!isMuted)}
        // onBlock={!chat.isGroup ? () => console.log('Block user') : undefined}
        // isMuted={isMuted}
        // theme={theme}
      />
    </Box>
  );
}
