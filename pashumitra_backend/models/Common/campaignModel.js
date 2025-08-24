import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    location: String,

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    startTime: String,
    endTime: String,

    organizerDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    organizerOrg: String,

    benefits: String,
    contact: String,

    campaignType: { type: String, enum: ["awareness", "with_animals"], default: "awareness" },
    animalType: String,

    participants: { type: Number, default: 0 },
    progress: { type: Number, default: 0 },
    maxParticipants: Number,

    isActive: { type: Boolean, default: true }, // 🔹 चालू आहे की नाही
    status: { type: String, enum: ["upcoming", "ongoing", "completed"], default: "upcoming" },
    completedAt: { type: Date }, // 🔹 कधी complete झाला ते track
  },
  { timestamps: true }
);

export default mongoose.model("Campaign", campaignSchema);
