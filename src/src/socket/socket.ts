import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_API_URL;

if (!SOCKET_URL) {
  throw new Error('VITE_SOCKET_URL is missing');
}

export const socket = io(`${SOCKET_URL}/chat`, {
  autoConnect: false,
  transports: ['websocket'],
});
