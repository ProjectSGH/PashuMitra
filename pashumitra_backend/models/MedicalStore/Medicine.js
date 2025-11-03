// models/MedicalStore/Medicine.js
import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    medicineId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "medicines_list",
      required: true 
    },
    storeId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true 
    },
    name: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    type: { type: String, trim: true }, 
    composition: { type: String, trim: true }, 
    quantity: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["In Stock", "Out of Stock", "Expired"],
      default: "In Stock",
    },
    expiry: { type: String }, 
    price: { type: Number, default: 0 },
    supplier: { type: String, trim: true },
    manufacturer: { type: String, trim: true },
    description: { type: String, trim: true },
    expiryRange: { type: String, trim: true },
    // Additional fields for better inventory management
    minStockLevel: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("medicines", medicineSchema);