import { Server } from "socket.io";
import ChatMessage from "../models/Common/chatModel.js"; // Add this import

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

    // User joins their personal notification room
    socket.on("joinUserRoom", (userId) => {
      if (userId) {
        socket.join(userId);
        console.log(`User ${userId} joined their notification room`);
      }
    });

    // Join chat room for doctor & farmer - FIXED: Consistent room naming
    socket.on("joinRoom", ({ farmerId, doctorId }) => {
      if (farmerId && doctorId) {
        const room = `chat_${doctorId}_${farmerId}`;
        socket.join(room);
        console.log(`Socket ${socket.id} joined room: ${room}`);
      }
    });

    // Remove the sendMessage listener - backend handles saving via HTTP API only
    // This prevents duplicate saving

    // Consultation request notification
    socket.on("consultationRequest", (data) => {
      const { doctorId, farmerId, date, startTime, doctorName } = data;
      
      // Notify doctor in their personal room
      socket.to(doctorId).emit("newConsultationRequest", {
        farmerId,
        date,
        startTime,
        doctorName,
        message: "New consultation request received"
      });
    });

    // Consultation approved notification
    socket.on("consultationApproved", (data) => {
      const { requestId, farmerId, doctorId, status } = data;
      
      // Notify farmer
      socket.to(farmerId).emit("consultationStatusChanged", {
        doctorId,
        status: "approved",
        doctorName: "Doctor",
        message: "Your consultation has been approved"
      });

      // Notify doctor (for consistency)
      socket.to(doctorId).emit("consultationStatusUpdated", {
        requestId,
        status: "approved"
      });
    });

    // Consultation rejected notification
    socket.on("consultationRejected", (data) => {
      const { requestId, farmerId, doctorId, status } = data;
      
      // Notify farmer
      socket.to(farmerId).emit("consultationStatusChanged", {
        doctorId,
        status: "rejected",
        doctorName: "Doctor",
        message: "Your consultation has been rejected"
      });

      // Notify doctor (for consistency)
      socket.to(doctorId).emit("consultationStatusUpdated", {
        requestId,
        status: "rejected"
      });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

// Getter to use io elsewhere
export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};