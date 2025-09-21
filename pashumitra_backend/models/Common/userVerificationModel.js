// models/UserVerification.js
const mongoose = require("mongoose");

const UserVerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    licenseNumber: {
      type: String,
      required: false, // only enforced for doctors/medical stores
    },
    verificationDocument: {
      url: { type: String },
      public_id: { type: String },
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

module.exports = mongoose.model("UserVerification", UserVerificationSchema);
