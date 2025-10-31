import express from "express";
import CommunityMedicine from "../../models/MedicalStore/CommunityMedicine.js";

const router = express.Router();

/**
 * 🔍 Get all pending or verified medicines
 * Example:
 *  /api/admin/communitymedicines?verified=false
 */
router.get("/", async (req, res) => {
  try {
    const { verified } = req.query;
    const filter = {};

    if (verified === "true") filter.verifiedByAdmin = true;
    else if (verified === "false") filter.verifiedByAdmin = false;

    const medicines = await CommunityMedicine.find(filter)
      .populate("storeId", "storeName address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines,
    });
  } catch (error) {
    console.error("❌ Error fetching community medicines (admin):", error);
    res.status(500).json({
      success: false,
      message: "Error fetching medicines for admin",
      error: error.message,
    });
  }
});

/**
 * ✅ Verify a community medicine
 */
router.patch("/:id/verify", async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await CommunityMedicine.findByIdAndUpdate(
      id,
      { verifiedByAdmin: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.json({
      success: true,
      message: "Medicine verified successfully",
      data: updated,
    });
  } catch (error) {
    console.error("❌ Error verifying medicine (admin):", error);
    res.status(500).json({
      success: false,
      message: "Error verifying medicine",
      error: error.message,
    });
  }
});

/**
 * ❌ Delete a medicine (optional admin control)
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CommunityMedicine.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.json({
      success: true,
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting medicine (admin):", error);
    res.status(500).json({
      success: false,
      message: "Error deleting medicine",
      error: error.message,
    });
  }
});

export default router;
