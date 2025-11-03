// models/MedicalStore/RegularMedicineOrder.js
import mongoose from "mongoose";

const regularMedicineOrderSchema = new mongoose.Schema({
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "medicines",
    required: true,
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  farmerName: {
    type: String,
    required: true,
    trim: true,
  },
  farmerContact: {
    type: String,
    required: true,
    trim: true,
  },
  farmerLocation: {
    type: String,
    trim: true,
  },
  // Animal and stock details
  animalType: {
    type: String,
    required: true,
    trim: true,
  },
  animalCount: {
    type: Number,
    required: true,
    min: 1,
  },
  animalWeight: {
    type: Number,
    required: false,
  },
  animalAge: {
    type: String,
    required: false,
  },
  symptoms: {
    type: String,
    trim: true,
  },
  // Order details
  medicineName: {
    type: String,
    required: true,
    trim: true,
  },
  quantityRequested: {
    type: Number,
    required: true,
    min: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "completed", "cancelled", "transferred"],
    default: "pending",
  },
  // Store transfer details
  transferredToStore: {
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    storeName: { type: String },
    transferDate: { type: Date },
    transferReason: { type: String }
  },
  // Delivery details
  deliveryOption: {
    type: String,
    enum: ["pickup", "delivery"],
    default: "pickup"
  },
  deliveryAddress: {
    type: String,
    trim: true,
  },
  expectedDeliveryDate: {
    type: Date,
  },
  // Timestamps
  requestDate: {
    type: Date,
    default: Date.now,
  },
  responseDate: {
    type: Date,
  },
  completionDate: {
    type: Date,
  },
  // Notes
  farmerNotes: {
    type: String,
    trim: true,
  },
  storeNotes: {
    type: String,
    trim: true,
  },
  prescriptionDocument: {
    type: String, // URL for prescription if any
  }
}, { 
  timestamps: true,
  indexes: [
    { farmerId: 1, status: 1 },
    { storeId: 1, status: 1 },
    { createdAt: -1 }
  ]
});

export default mongoose.model("RegularMedicineOrder", regularMedicineOrderSchema);