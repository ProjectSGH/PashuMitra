import express from "express";
import Notification from "../../models/Common/notificationModel.js";
import Farmer from "../../models/Farmer/FarmerModel.js";

const router = express.Router();

// Get unread count
router.get("/unreadCount/:userId", async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.params.userId,
      isRead: false,
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch count" });
  }
});

// Mark all as read for a user
router.put("/user/:userId/readall", async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.params.userId },
      { $set: { isRead: true } }
    );
    res.json({ message: "All marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all notifications for a doctor (or user)
router.get("/:userId", async (req, res) => {
  try {
    const notes = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark one notification as read
router.put("/:id/read", async (req, res) => {
  try {
    const note = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a notification
router.delete("/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/farmer/:userId", async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.params.userId });
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });
    res.json(farmer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark one notification as read (call this from Notification page)
export const markNotificationAsRead = async (id) => {
  try {
    await axios.put(`http://localhost:5000/api/notifications/${id}/read`);
    // Remove one from unread count
    setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
    // Optional: remove from notifications list in header if you store them
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  } catch (err) {
    console.error("Error marking notification as read:", err);
  }
};

export default router;
