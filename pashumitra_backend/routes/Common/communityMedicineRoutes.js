import express from "express";
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
 * 🌍 Get all available community medicines (visible to farmers)
 * Optional query params:
 *   - status=Available
 *   - storeId=<id>
 *   - verified=true
 */
router.get("/", async (req, res) => {
  try {
    const { status, storeId, verified } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (storeId) filter.storeId = storeId;
    if (verified) filter.verifiedByAdmin = verified === "true";

    const medicines = await CommunityMedicine.find(filter)
      .populate("storeId", "storeName address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines,
    });
  } catch (error) {
    console.error("❌ Error fetching community medicines:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching medicines",
      error: error.message,
    });
  }
});

export default router;
