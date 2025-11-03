import mongoose from "mongoose";

const communityMedicineBankSchema = new mongoose.Schema({
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
  medicineType: {
    type: String,
    required: true,
    trim: true,
  },
  manufacturer: {
    type: String,
    trim: true,
  },
  composition: {
    type: String,
    trim: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  // Add distribution limit per request
  distributionLimit: {
    type: Number,
    default: 5,
    min: 1,
    validate: {
      validator: function(value) {
        return value <= this.quantity;
      },
      message: "Distribution limit cannot exceed available quantity"
    }
  },
  condition: {
    type: String,
    enum: ["New/Unopened", "Good", "Fair"],
    default: "Good",
  },
  status: {
    type: String,
    enum: ["Available", "Distributed", "Expired"],
    default: "Available",
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  organizationName: {
    type: String,
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
  description: {
    type: String,
    trim: true,
  },
  isFree: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationNotes: {
    type: String,
    trim: true,
  },
  // Track total distributed quantity
  totalDistributed: {
    type: Number,
    default: 0,
  },
  // Track requests per farmer (for analytics)
  requestStats: {
    totalRequests: { type: Number, default: 0 },
    approvedRequests: { type: Number, default: 0 },
    uniqueFarmers: { type: Number, default: 0 }
  }
}, { 
  timestamps: true,
  indexes: [
    { fields: { storeId: 1, status: 1 } },
    { fields: { status: 1, isVerified: 1 } },
    { fields: { expiryDate: 1 } }
  ]
});

// Index for better search performance
communityMedicineBankSchema.index({ medicineName: "text", manufacturer: "text" });

// Pre-save middleware to update status based on quantity
communityMedicineBankSchema.pre('save', function(next) {
  if (this.quantity === 0) {
    this.status = "Distributed";
  }
  next();
});

// Static method to find available medicines with quantity
communityMedicineBankSchema.statics.findAvailable = function() {
  return this.find({ 
    status: "Available", 
    quantity: { $gt: 0 },
    isVerified: true,
    expiryDate: { $gt: new Date() }
  });
};

export default mongoose.model("CommunityMedicineBank", communityMedicineBankSchema);