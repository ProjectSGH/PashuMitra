const mongoose = require('mongoose');
const medicineBankSchema = new mongoose.Schema({
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'pashumitra_medicines', required: true },
    donerId: { type: mongoose.Schema.Types.ObjectId, ref: 'pashumitra_user', required: true },
    quantity: { type: Number, required: true },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'pashumitra_medicalstore', default: null },
    status: { type: String, enum: ["Available", "Expired", "Used"], default: "Available" },
    expiryDate: { type: Date, default: Date.now }});
module.exports = mongoose.model('pashumitra_medicinebank', medicineBankSchema);