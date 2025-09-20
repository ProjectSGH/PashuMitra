import express from "express";
import Notification from "../../models/Common/notificationModel.js";
import User from "../../models/UserModel.js";
const router = express.Router();
// ✅ Role mapping: frontend -> DB
const roleMap = {
  farmers: "Farmer",
  doctors: "Doctor",
  stores: "Store",
};

router.post("/send", async (req, res) => {
  const { title, message, type, role } = req.body;

  try {
    let users;

    if (!role || role === "all") {
      users = await User.find(); // all users
    } else {
      const dbRole = roleMap[role]; // map frontend role to DB role
      if (!dbRole) return res.status(400).json({ message: "Invalid role selected" });

      users = await User.find({ role: dbRole });
    }

    if (!users.length) return res.status(404).json({ message: "No users found for this role" });

    console.log("Users found:", users.map(u => u.email)); // debug log

    const notification = new Notification({
      userIds: users.map(u => u._id),
      title,
      message,
      type: type || "info",
      isReadBy: [],
    });

    await notification.save();

    res.json({ message: `Notification sent to ${users.length} users` });
  } catch (err) {
    console.error("Error sending notification:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all notifications (admin view)
router.get("/", async (req, res) => {
  try {
    const notes = await Notification.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a notification
router.delete("/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Mark a notification as read
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

export default router;
