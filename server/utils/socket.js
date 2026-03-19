import { Server } from "socket.io";

const userSocketMap = {}; // userId -> socketId

let io;

export function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // get userId from frontend
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap[userId] = socket.id;
        }

        // disconnect
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            delete userSocketMap[userId];
        });
    });
}

// helper to access io
export function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
}

//helper to get receiver socket
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}