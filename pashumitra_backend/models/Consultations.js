const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'pashumitra_user', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'pashumitra_user', required: true },
    symptoms: { type: String, required: true },
    diagnosis: { type: String, required: true },
    prescribedMedicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'pashumitra_medicines', required: true }],
    status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model('pashumitra_consultations', consultationSchema);
