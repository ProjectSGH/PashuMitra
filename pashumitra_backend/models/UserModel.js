const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ["Farmer", "MedicalStore", "Doctor"], required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
