import mongoose from "mongoose"

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  quantity: Number,
  status: { type: String, default: "In Stock" },
  expiry: String,
  price: Number,
  supplier: String,
}, { timestamps: true })

export default mongoose.model("Medicine", medicineSchema)
