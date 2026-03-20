import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (userId: string): Socket => {
  socket = io(import.meta.env.VITE_BACKEND_URL, {
    query: { userId },
    withCredentials: true,
  });

  return socket; // ✅ IMPORTANT
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};