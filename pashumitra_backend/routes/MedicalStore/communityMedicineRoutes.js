// In communityMedicineRoutes.js - CORRECTED VERSION
import express from "express";
import mongoose from "mongoose";
import CommunityMedicine from "../../models/MedicalStore/CommunityMedicine.js";

const router = express.Router();

/**
 * 🧾 Add new donated (free) medicine — only accessible by a verified store
 */
router.post("/", async (req, res) => {
  try {
    const { storeId, organizationName, medicineName, quantity } = req.body;

    // Basic validation
    if (!storeId || !organizationName || !medicineName || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newMedicine = new CommunityMedicine(req.body);
    const savedMedicine = await newMedicine.save();

    res.status(201).json({
      success: true,
      message: "Medicine added successfully to Community Bank",
      data: savedMedicine,
    });
  } catch (error) {
    console.error("❌ Error adding community medicine:", error);
    res.status(500).json({
      success: false,
      message: "Error saving medicine",
      error: error.message,
    });
  }
});

/**
 * 🔍 Get single community medicine by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await CommunityMedicine.findById(id)
      .populate("storeId", "email phone role"); // Populate User fields

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    // Get store profile separately if needed
    if (medicine.storeId) {
      const storeProfile = await mongoose.model("Store_User").findOne({ userId: medicine.storeId._id });
      medicine.storeProfile = storeProfile; // Add to response
    }

    res.status(200).json({
      success: true,
      data: medicine
    });

  } catch (error) {
    console.error("❌ Error fetching medicine:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching medicine",
      error: error.message
    });
  }
});

// CORRECTED VERSION - Fix population logic
router.get("/", async (req, res) => {
  try {
    const { status, storeId, verified } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (storeId) filter.storeId = storeId;
    if (verified) filter.verifiedByAdmin = verified === "true";

    // First, get medicines with basic store info
    const medicines = await CommunityMedicine.find(filter)
      .populate("storeId", "email phone role") // Populate User model fields only
      .sort({ createdAt: -1 });

    // Then, get store profiles for each medicine
    const medicinesWithStoreProfiles = await Promise.all(
      medicines.map(async (medicine) => {
        if (medicine.storeId) {
          const storeProfile = await mongoose.model("Store_User").findOne({ 
            userId: medicine.storeId._id 
          });
          
          // Convert to plain object and add storeProfile
          const medicineObj = medicine.toObject();
          medicineObj.storeProfile = storeProfile;
          return medicineObj;
        }
        return medicine.toObject();
      })
    );

    res.status(200).json({
      success: true,
      count: medicinesWithStoreProfiles.length,
      data: medicinesWithStoreProfiles,
    });
  } catch (error) {
    console.error("❌ Error fetching community medicines:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching medicines",
      error: error.message
    });
  }
});

export default router;