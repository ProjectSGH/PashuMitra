import mongoose from "mongoose";

const ConsultationRequestSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor_User",
      required: true,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer_User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
    },
    fee: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed",],
      default: "pending",
    },
  },
  { timestamps: true } // ⬅ auto adds createdAt & updatedAt
);

export default mongoose.model("ConsultationRequest", ConsultationRequestSchema);
