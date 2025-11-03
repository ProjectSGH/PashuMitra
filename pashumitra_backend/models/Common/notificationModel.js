// models/Common/notificationModel.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["consultation", "info", "alert", "important", "medicine_order"], 
    default: "info" 
  },
  isReadBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  metadata: {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "CommunityMedicineOrder" },
    type: { type: String }, 
    farmerName: { type: String },
    medicineName: { type: String },
    storeName: { type: String },
    quantity: { type: Number }
  }
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);