const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
   userId : { type:mongoose.Schema.Types.ObjectId, ref:'User' },
   fullName: { type: String, required: true },
   specialization: { type: String, required: true },
   hospitalname: { type: String, required: true },
   experience: { type: Number, required: true },
   state: { type: String, required: true },
   city: { type: String, required: true },

}, { timestamps: true });

module.exports = mongoose.model('Doctor_User', DoctorSchema);
