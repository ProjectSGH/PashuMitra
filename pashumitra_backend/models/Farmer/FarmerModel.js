const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema({
  userId : { type:mongoose.Schema.Types.ObjectId, ref:'User' },
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  village: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Farmer_User', FarmerSchema);
