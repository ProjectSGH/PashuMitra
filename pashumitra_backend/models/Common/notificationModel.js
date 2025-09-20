import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // list of recipients
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["consultation", "info", "alert", "important"], default: "consultation" },
  isReadBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // users who have read
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
