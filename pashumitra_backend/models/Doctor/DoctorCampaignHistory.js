import mongoose from "mongoose";

const doctorHistorySchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    campaignData: { type: Object, required: true }, // सगळा campaign डेटा copy करून ठेवू
    deletedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("DoctorHistory", doctorHistorySchema);
