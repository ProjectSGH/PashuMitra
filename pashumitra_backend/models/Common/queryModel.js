import mongoose from "mongoose";

const querySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: "pending" }, // pending / resolved
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Query", querySchema);
