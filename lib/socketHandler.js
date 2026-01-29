import { Server } from "socket.io";

// Store online users
export const userSocketMap = {}; // {userId:socketId}

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  // Socket.io connection handler
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected with ID:", userId);

    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("User disconnected with ID:", userId);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return io;
};
