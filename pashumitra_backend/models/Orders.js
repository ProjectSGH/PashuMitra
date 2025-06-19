const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'pashumitra_user', required: true },
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'pashumitra_medicines', required: true },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'pashumitra_medicalstore', required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Delivered', 'Cancelled'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('pashumitra_orders', orderSchema);
