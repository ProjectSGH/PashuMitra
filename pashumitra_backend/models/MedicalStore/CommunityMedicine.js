import mongoose from "mongoose";

const communityMedicineBankSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store_User",
    required: true,
  },
  organizationName: {
    type: String,
    required: true,
    trim: true,
  },
  contactPerson: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  medicineName: {
    type: String,
    required: true,
    trim: true,
  },
  composition: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  manufacturer: {
    type: String,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  expiryDate: {
    type: Date,
  },
  batchNumber: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["Available", "Distributed", "Expired"],
    default: "Available",
  },
  isFree: {
    type: Boolean,
    default: true,
  },
  distributionLimit: {
    type: Number,
    default: 1, // maximum units one farmer can claim
  },
  description: {
    type: String,
    trim: true,
  },
  donationDate: {
    type: Date,
    default: Date.now,
  },
  proofDocument: {
    type: String, // optional URL for certificate/invoice
  },
  verifiedByAdmin: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model("CommunityMedicineBank", communityMedicineBankSchema);
