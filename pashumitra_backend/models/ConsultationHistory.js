const mongoose = require('mongoose');
const consultationHistorySchema = new mongoose.Schema({
    consultationId: { type: mongoose.Schema.Types.ObjectId, ref: 'pashumitra_consultations', required: true},
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'pashumitra_user', required: true},
    note: { type: String, required: true},
    createdAt: { type: Date, default: Date.now }}, { timestamps: true });
module.exports = mongoose.model('pashumitra_consultationhistory', consultationHistorySchema);