// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ["Farmer", "MedicalStore", "Doctor"], required: true },
  address: { type: String, required: true },
  village: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('pashumitra_user', userSchema);
