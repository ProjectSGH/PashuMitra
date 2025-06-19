const mongoose = require('mongoose');
const medicineSchema = new mongoose.Schema({
    medicineName: { type: String, required: true},
    medicineType: { type: String, required: true, enum: ["Allopathic", "Homeopathic", "Ayurvedic", "Veterinary"]},
    medicineDescription: { type: String, required: true },
    diseaseTags: [{ type: String}],
    prescriptionRequired: { type: Boolean, default: false },
});
module.exports = mongoose.model("pashumitra_medicines", medicineSchema);