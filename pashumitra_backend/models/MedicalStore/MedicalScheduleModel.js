const mongoose = require("mongoose");

const dayScheduleSchema = new mongoose.Schema({
  available: { type: Boolean, default: false },
  startTime: { type: String, default: "" }, // format: "HH:mm"
  endTime: { type: String, default: "" },
});

const MedicalScheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  Monday: { type: dayScheduleSchema, default: () => ({}) },
  Tuesday: { type: dayScheduleSchema, default: () => ({}) },
  Wednesday: { type: dayScheduleSchema, default: () => ({}) },
  Thursday: { type: dayScheduleSchema, default: () => ({}) },
  Friday: { type: dayScheduleSchema, default: () => ({}) },
  Saturday: { type: dayScheduleSchema, default: () => ({}) },
  Sunday: { type: dayScheduleSchema, default: () => ({}) },
});

module.exports = mongoose.model("MedicalSchedule", MedicalScheduleSchema);
