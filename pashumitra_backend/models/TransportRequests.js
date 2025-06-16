const mongoose = require('mongoose');
const transportRequestSchema = new mongoose.Schema({
    requstedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'pashumitra_user', required: true},
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'pashumitra_medicines', required: true},
    fromStoreId: { type: mongoose.Schema.Types.ObjectId, ref: 'pashumitra_medicalstore', required: true},
    toStoreId: { type: mongoose.Schema.Types.ObjectId, ref: 'pashumitra_medicalstore', required: true},
    status: { type: String,  enum: ["Pending", "Approved", "in-transit"], default: "Pending" },
    quantity: { type: Number, required: true},
    createdAt: { type: Date, default: Date.now }}, { timestamps: true });
module.exports = mongoose.model('pashumitra_trasportrequests', transportRequestSchema);