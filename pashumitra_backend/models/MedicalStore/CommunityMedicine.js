import mongoose from "mongoose";

const communityMedicineSchema = new mongoose.Schema({
  medicineName: { type: String, required: true },
  medicineType: { type: String, required: true },
  quantity: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  condition: { type: String, required: true },
  contactNumber: { type: String, required: true },
  location: { type: String, required: true },
  additionalNotes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("CommunityMedicine", communityMedicineSchema);
