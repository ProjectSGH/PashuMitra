const mongoose = require("mongoose");

const FarmerVerificationSchema = new mongoose.Schema({
    farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farmer_User",
    required: true,
    unique: true,
},
    verificationDocument: {
    url: { type: String },
    public_id: { type: String },
},
    isVerified: {
    type: Boolean,
    default: false,
},
    verificationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
},
}, { timestamps: true });

module.exports = mongoose.model("FarmerVerification", FarmerVerificationSchema);
