// routes/user/notifications.js
import express from "express";
import Notification from "../../models/Common/notificationModel.js";
const router = express.Router();

// ✅ Get all notifications for a specific user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({
      userIds: userId,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error("Error fetching user notifications:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get unread count for a user
router.get("/unreadCount/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const count = await Notification.countDocuments({
      userIds: userId,
      isReadBy: { $ne: userId }, // not read by this user
    });
    res.json({ count });
  } catch (err) {
    console.error("Error fetching unread count:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Mark a notification as read (frontend can call /:id/read without userId)
// ✅ Mark a notification as read (with userId in URL)
router.put("/:id/read/:userId", async (req, res) => {
  const { id, userId } = req.params;

  try {
    const note = await Notification.findByIdAndUpdate(
      id,
      { $addToSet: { isReadBy: userId } }, // add userId to isReadBy array
      { new: true }
    );
    if (!note) return res.status(404).json({ error: "Notification not found" });
    res.json(note);
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Mark all notifications as read for a user
router.put("/user/:userId/readall", async (req, res) => {
  const { userId } = req.params;

  try {
    await Notification.updateMany(
      { userIds: userId },
      { $addToSet: { isReadBy: userId } }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("Error marking all notifications as read:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a notification
router.delete("/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    console.error("Error deleting notification:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
