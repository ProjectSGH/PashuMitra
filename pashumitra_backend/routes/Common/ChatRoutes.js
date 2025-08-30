import express from "express";
import ChatMessage from "../../models/Common/chatModel.js"; // ✅ Correct import

const router = express.Router();

// ✅ Get all messages between farmer & doctor
router.get("/messages/:farmerId/:doctorId", async (req, res) => {
  try {
    const { farmerId, doctorId } = req.params;
    const messages = await ChatMessage.find({
      $or: [
        { farmerId, doctorId },
        { farmerId: doctorId, doctorId: farmerId } // doctor replies
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// ✅ Send new message
router.post("/send", async (req, res) => {
  try {
    const { farmerId, doctorId, message, sender } = req.body;

    const newMessage = new ChatMessage({
      farmerId,
      doctorId,
      message,
      sender // 👈 we'll add sender in schema below
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// ✅ Mark messages as seen
router.put("/seen/:farmerId/:doctorId", async (req, res) => {
  try {
    const { farmerId, doctorId } = req.params;

    await ChatMessage.updateMany(
      { farmerId, doctorId, sender: "doctor", seen: false },
      { $set: { seen: true } }
    );

    res.json({ message: "Messages marked as seen" });
  } catch (error) {
    console.error("Error updating seen status:", error);
    res.status(500).json({ error: "Failed to update seen status" });
  }
});

export default router;
