// models/DoctorVerification.js
const mongoose = require("mongoose");

const DoctorVerificationSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor_User",
      required: true,
      unique: true,
    },
    licenseNumber: {
      type: String,
      required: true,
    },
    verificationDocument: {
      url: String,
      public_id: String,
    },
    verificationStatus: {
      type: String,
      enum: ["not_submitted", "pending", "approved", "rejected"],
      default: "not_submitted",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DoctorVerification", DoctorVerificationSchema);
