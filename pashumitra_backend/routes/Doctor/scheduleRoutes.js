const express = require("express");
const DoctorSchedule = require("../models/Doctor/Doctor_Schedule");
const router = express.Router();

// Get schedule for a user
router.get("/:userId", async (req, res) => {
  try {
    const schedule = await DoctorSchedule.findOne({ userId: req.params.userId });
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update or create schedule
router.put("/:userId", async (req, res) => {
  try {
    const scheduleData = req.body;
    const schedule = await DoctorSchedule.findOneAndUpdate(
      { userId: req.params.userId },
      { ...scheduleData, userId: req.params.userId },
      { new: true, upsert: true }
    );
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
