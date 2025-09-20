import express from "express";
import Medicine from "../../models/MedicalStore/Medicine.js";


const router = express.Router();

// GET all medicines
router.get("/", async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add new medicine
router.post("/", async (req, res) => {
  try {
    const newMedicine = new Medicine(req.body);
    await newMedicine.save();
    res.status(201).json(newMedicine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
