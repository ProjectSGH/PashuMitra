import mongoose from "mongoose";

const campaignRegistrationSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    animalsCount: { type: Number, default: 0 },

    // 👇 Farmer selects from allowed animalTypes of campaign
    animalType: { type: String },  

    membersAttending: { type: Number, default: 1 },

    timeSlot: { type: String }, // optional (for vaccination, etc.)
    remarks: String,

    attendanceStatus: {
      type: String,
      enum: ["registered", "attended", "missed"],
      default: "registered",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CampaignRegistration", campaignRegistrationSchema);
