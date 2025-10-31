import express from "express";
import CommunityMedicine from "../../models/MedicalStore/CommunityMedicine.js";

const router = express.Router();

// ✅ Add new donated medicine
router.post("/", async (req, res) => {
  try {
    const newMedicine = new CommunityMedicine(req.body);
    const saved = await newMedicine.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error saving medicine:", error);
    res.status(500).json({ message: "Error saving medicine" });
  }
});

// ✅ Get all available medicines
router.get("/", async (req, res) => {
  try {
    const medicines = await CommunityMedicine.find().sort({ createdAt: -1 });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Error fetching medicines" });
  }
});

export default router;
