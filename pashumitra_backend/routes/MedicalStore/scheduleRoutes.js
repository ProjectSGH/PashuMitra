const express = require("express");
const MedicalSchedule = require("../../models/MedicalStore/MedicalScheduleModel.js");
const router = express.Router();

// Default structure for a blank weekly schedule
const defaultScheduleStructure = {
  Monday: { available: false, startTime: "", endTime: "" },
  Tuesday: { available: false, startTime: "", endTime: "" },
  Wednesday: { available: false, startTime: "", endTime: "" },
  Thursday: { available: false, startTime: "", endTime: "" },
  Friday: { available: false, startTime: "", endTime: "" },
  Saturday: { available: false, startTime: "", endTime: "" },
  Sunday: { available: false, startTime: "", endTime: "" },
};

// ✅ Get or create schedule for a user
router.get("/:userId", async (req, res) => {
  try {
    let schedule = await MedicalSchedule.findOne({ userId: req.params.userId });

    if (!schedule) {
      // Create new default schedule if not found
      schedule = await MedicalSchedule.create({
        userId: req.params.userId,
        ...defaultScheduleStructure,
      });
      console.log(`✅ Default schedule created for user: ${req.params.userId}`);
    }

    res.json(schedule);
  } catch (err) {
    console.error("❌ Error in GET /schedules/:userId", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update or create schedule
router.put("/:userId", async (req, res) => {
  try {
    const scheduleData = req.body;
    const schedule = await MedicalSchedule.findOneAndUpdate(
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
