const mongoose = require('mongoose');
const storeInventorySchema = new mongoose.Schema({
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'pashumitra_medicalstore', required: true },
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'pashumitra_medicines', required: true},
    quantity: { type: Number, required: true},
    price: { type: Number, required: true},
    expiryDate: { type: Date, required: true},
    lastUpdated: { type: Date, default: Date.now}},{timestamps: true});
module.exports = mongoose.model("pashumitra_storeinventory", storeInventorySchema);