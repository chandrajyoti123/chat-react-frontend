import { useEffect, type ReactNode } from 'react';
import { socket } from '@/src/socket/socket';
import { useAuthStore } from '@/store/auth';

interface ChatSocketProviderProps {
  children: ReactNode;
}

export const ChatSocketProvider: React.FC<ChatSocketProviderProps> = ({ children }) => {
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.id) return;

    socket.auth = { userId: user.id };
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [user?.id]);

  return <>{children}</>;
};
