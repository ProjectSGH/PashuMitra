import express from "express";
import ChatMessage from "../../models/Common/chatModel.js";
import User from "../../models/UserModel.js";
import Farmer from "../../models/Farmer/FarmerModel.js";
import { getIO } from "../../services/socket.js"; // import socket instance

const router = express.Router();

// 🔹 Get all messages between farmer & doctor
router.get("/messages/:farmerId/:doctorId", async (req, res) => {
  try {
    const { farmerId, doctorId } = req.params;
    const messages = await ChatMessage.find({ farmerId, doctorId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages", details: err.message });
  }
});

// 🔹 Send a new message
router.post("/send", async (req, res) => {
  try {
    const { farmerId, doctorId, message, sender } = req.body;

    const newMessage = new ChatMessage({ farmerId, doctorId, message, sender });
    await newMessage.save();

    // Emit to socket room after saving
    const io = getIO();
    const room = `${doctorId}_${farmerId}`;
    io.to(room).emit("receiveMessage", newMessage);

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

    // farmerIds here are actually userIds
    const farmerIds = await ChatMessage.distinct("farmerId", { doctorId });
    if (!farmerIds.length) return res.json([]);

    // fetch user info
    const users = await User.find(
      { _id: { $in: farmerIds }, role: "Farmer" },
      "email phone role"
    );

    // fetch Farmer model for fullName using userId
    const farmers = await Farmer.find({ userId: { $in: farmerIds } }, "fullName userId");

    // combine
    const result = users.map((u) => {
      const f = farmers.find((farmer) => farmer.userId.toString() === u._id.toString());
      return {
        _id: u._id,
        email: u.email,
        phone: u.phone,
        role: u.role,
        fullName: f?.fullName || "",
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while fetching farmers" });
  }
});

export default router;
