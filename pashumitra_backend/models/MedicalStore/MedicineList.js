// models/MedicineList.js
import mongoose from "mongoose";

const medicineListSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    category: { 
      type: String, 
      required: true,
      trim: true 
    },
    manufacturer: { 
      type: String, 
      required: true,
      trim: true 
    },
    composition: { 
      type: String, 
      required: true,
      trim: true 
    },
    description: { 
      type: String, 
      trim: true 
    },
    defaultPrice: { 
      type: Number, 
      required: true,
      min: 10,
      max: 800 
    },
    type: { 
      type: String, 
      required: true,
      trim: true 
    },
    expiryRange: { 
      type: String, 
      required: true,
      trim: true 
    }
  },
  { timestamps: true }
);

export default mongoose.model("medicines_list", medicineListSchema);