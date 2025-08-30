import { Server } from "socket.io";
import ChatMessage from "../models/Common/chatModel.js"; // adjust path if needed

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // console.log("User connected:", socket.id);

    // join room
    socket.on("joinRoom", ({ farmerId, doctorId }) => {
      const roomId = [farmerId, doctorId].sort().join("_");
      socket.join(roomId);
    //   console.log(`User joined room: ${roomId}`);
    });

    // send + save message
    socket.on("sendMessage", async (data) => {
      const { farmerId, doctorId, sender, message } = data;

      const newMessage = new ChatMessage({
        farmerId,
        doctorId,
        sender,
        message,
      });
      await newMessage.save();

      const roomId = [farmerId, doctorId].sort().join("_");
      io.to(roomId).emit("receiveMessage", newMessage);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
