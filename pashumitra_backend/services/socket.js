import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:3000"], // allow Vite & CRA
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // socket.js - Enhanced with notification support

io.on("connection", (socket) => {
  console.log("New socket connected:", socket.id);

  // User joins their personal notification room
  socket.on("joinUserRoom", (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`User ${userId} joined their notification room`);
    }
  });

  // Join chat room for doctor & farmer
  socket.on("joinRoom", ({ farmerId, doctorId }) => {
    if (farmerId && doctorId) {
      const room = `${doctorId}_${farmerId}`;
      socket.join(room);
      console.log(`Socket ${socket.id} joined room: ${room}`);
    }
  });

  // Consultation request notification
  socket.on("consultationRequest", async (data) => {
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
