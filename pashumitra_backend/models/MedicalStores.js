const mongoose = require('mongoose');

const medicalStoreSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'pashumitra_user', required: true },
    storeName: { type: String, required: true },
    storeAddress: { type: String, required: true },
    storePhone: { type: String, required: true },
    storeEmail: { type: String, required: true },
    latitude: { type: Number, required: true}, 
    longitude: { type: Number, required: true}, 
    varificationStatus: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('pashumitra_medicalstore', medicalStoreSchema);
