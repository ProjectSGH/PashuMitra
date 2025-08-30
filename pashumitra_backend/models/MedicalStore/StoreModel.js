const mongoose = require('mongoose');

const vetSpecializations = [
  "General Veterinary Medicine",
  "Small Animal Medicine",
  "Large Animal Medicine",
  "Equine Medicine",
  "Canine and Feline Practice",
  "Food Animal Medicine",
  "Poultry Medicine",
  "Wildlife and Zoo Medicine",
  "Exotic Animal Medicine",
  "Veterinary Surgery",
  "Veterinary Internal Medicine",
  "Veterinary Dermatology",
  "Veterinary Ophthalmology",
  "Veterinary Dentistry",
  "Veterinary Anesthesiology",
  "Veterinary Radiology & Imaging",
  "Veterinary Pathology",
  "Veterinary Microbiology",
  "Veterinary Pharmacology",
  "Veterinary Parasitology",
  "Veterinary Public Health",
  "Veterinary Toxicology",
  "Veterinary Epidemiology",
  "Veterinary Oncology",
  "Veterinary Neurology",
  "Veterinary Nutrition",
  "Aquatic Animal Health",
  "Dairy Science",
  "Animal Reproduction & Gynecology",
  "Veterinary Emergency & Critical Care",
  "Veterinary Preventive Medicine",
  "Veterinary Biotechnology",
  "other"
];

const StoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  storeName: { type: String, required: true },
  ownerName: { type: String, required: true },
  specialization: {
    type: String,
    required: true,
    enum: vetSpecializations,
  },
  established: { type: Date, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Store_User', StoreSchema);
