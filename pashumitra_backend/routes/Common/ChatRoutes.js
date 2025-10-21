
import express from "express";
import ChatMessage from "../../models/Common/chatModel.js";
import User from "../../models/UserModel.js";
import Farmer from "../../models/Farmer/FarmerModel.js";
import { getIO } from "../../services/socket.js";

const router = express.Router();

// 🔹 Get all messages between farmer & doctor
router.get("/messages/:farmerId/:doctorId", async (req, res) => {
  try {
    const { farmerId, doctorId } = req.params;
    
    const messages = await ChatMessage.find({ 
      farmerId, 
      doctorId 
    }).sort({ timestamp: 1 });
    
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages", details: err.message });
  }
});

// 🔹 Send a new message - FIXED: Better socket emission
router.post("/send", async (req, res) => {
  try {
    const { farmerId, doctorId, message, sender } = req.body;

    if (!farmerId || !doctorId || !message || !sender) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newMessage = new ChatMessage({ 
      farmerId, 
      doctorId, 
      message, 
      sender 
    });
    await newMessage.save();

    console.log("Message saved to DB:", newMessage._id);

    // Emit to socket room after saving - FIXED: Use consistent room naming
    const io = getIO();
    const room = `chat_${doctorId}_${farmerId}`;
    
    // Emit to everyone in the room including sender
    io.to(room).emit("receiveMessage", newMessage);
    
    // Also emit to both users' personal rooms for backup
    io.to(farmerId).emit("receiveMessage", newMessage);
    io.to(doctorId).emit("receiveMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Failed to send message", details: err.message });
  }
});

// 🔹 Mark messages as seen
router.put("/seen/:farmerId/:doctorId", async (req, res) => {
  try {
    const { farmerId, doctorId } = req.params;

    await ChatMessage.updateMany(
      { farmerId, doctorId, sender: "farmer", seen: false },
      { $set: { seen: true } }
    );

    res.json({ message: "Messages marked as seen" });
  } catch (err) {
    console.error("Error updating seen status:", err);
    res.status(500).json({ error: "Failed to update seen status", details: err.message });
  }
});

// 🔹 Get all farmers who have chatted with this doctor
router.get("/doctor/:doctorId/farmers", async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Get distinct farmer user IDs from chat messages
    const farmerUserIds = await ChatMessage.distinct("farmerId", { doctorId });
    
    if (!farmerUserIds.length) return res.json([]);

    // Fetch user info
    const users = await User.find(
      { _id: { $in: farmerUserIds }, role: "Farmer" },
      "email phone role"
    );

    // Fetch Farmer profiles using userId
    const farmers = await Farmer.find({ userId: { $in: farmerUserIds } }, "fullName userId");

    // Combine data
    const result = users.map((user) => {
      const farmerProfile = farmers.find((farmer) => 
        farmer.userId.toString() === user._id.toString()
      );
      
      return {
        _id: user._id, // This is the user ID used in chat messages
        email: user.email,
        phone: user.phone,
        role: user.role,
        fullName: farmerProfile?.fullName || "Unknown Farmer",
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Error fetching chat farmers:", err);
    res.status(500).json({ error: "Server error while fetching farmers" });
  }
});

export default router;