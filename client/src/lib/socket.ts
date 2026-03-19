import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (userId: string) => {

    socket = io(
        import.meta.env.VITE_BACKEND_URL,
        {
            query: { userId },
            withCredentials: true
        }
    );
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null; // clear reference
    }
};