import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer_User", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor_User", required: true },
  sender: { type: String, enum: ["farmer", "doctor"], required: true },
  message: { type: String, required: true },
  seen: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("ChatMessage", chatMessageSchema);
