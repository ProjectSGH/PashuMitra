import mongoose from "mongoose";

const communityMedicineOrderSchema = new mongoose.Schema({
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CommunityMedicineBank",
    required: true,
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  medicineName: {
    type: String,
    required: true,
    trim: true,
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
  organizationName: {
    type: String,
    trim: true,
  },
  quantityRequested: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
    validate: {
      validator: function(value) {
        return value > 0;
      },
      message: "Quantity must be at least 1"
    }
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "completed", "cancelled"],
    default: "pending",
  },
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
  storeNotes: {
    type: String,
    trim: true,
  },
  farmerNotes: {
    type: String,
    trim: true,
  },
  isFree: {
    type: Boolean,
    default: true,
  },
  // Track if farmer has been notified about this medicine type recently
  lastRequestNotification: {
    type: Date
  }
}, { 
  timestamps: true,
  // Add index for better query performance
  indexes: [
    { fields: { farmerId: 1, medicineId: 1, status: 1 } },
    { fields: { storeId: 1, status: 1 } },
    { fields: { createdAt: -1 } }
  ]
});

// Pre-save middleware to validate quantity against distribution limit
communityMedicineOrderSchema.pre('save', async function(next) {
  if (this.isModified('quantityRequested')) {
    try {
      const Medicine = mongoose.model('CommunityMedicineBank');
      const medicine = await Medicine.findById(this.medicineId);
      
      if (medicine) {
        const distributionLimit = medicine.distributionLimit || 5;
        
        if (this.quantityRequested > distributionLimit) {
          throw new Error(`Requested quantity exceeds distribution limit of ${distributionLimit}`);
        }
        
        if (this.quantityRequested > medicine.quantity) {
          throw new Error(`Requested quantity exceeds available quantity of ${medicine.quantity}`);
        }
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

export default mongoose.model("CommunityMedicineOrder", communityMedicineOrderSchema);