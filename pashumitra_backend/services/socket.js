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

  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

    // Join chat room for doctor & farmer
    socket.on("joinRoom", ({ farmerId, doctorId }) => {
      if (farmerId && doctorId) {
        const room = `${doctorId}_${farmerId}`;
        socket.join(room);
        console.log(`Socket ${socket.id} joined room: ${room}`);
      }
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
