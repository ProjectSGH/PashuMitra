import express from "express";
import CommunityMedicine from "../../models/MedicalStore/CommunityMedicine.js";
import Store from "../../models/MedicalStore/StoreModel.js"; // Import Store model

const router = express.Router();

/**
 * 🔍 Get all pending or verified medicines with store details
 */
router.get("/", async (req, res) => {
  try {
    const { verified } = req.query;
    const filter = {};

    if (verified === "true") filter.verifiedByAdmin = true;
    else if (verified === "false") filter.verifiedByAdmin = false;

    // First get all medicines
    const medicines = await CommunityMedicine.find(filter)
      .sort({ createdAt: -1 });

    // Manually populate store details from Store_User model
    const medicinesWithStoreDetails = await Promise.all(
      medicines.map(async (medicine) => {
        const medicineObj = medicine.toObject();
        
        try {
          // Find the store details using the storeId (which is User _id)
          const storeDetails = await Store.findOne({ userId: medicine.storeId });
          
          if (storeDetails) {
            medicineObj.storeDetails = {
              storeName: storeDetails.storeName,
              ownerName: storeDetails.ownerName,
              address: storeDetails.address,
              city: storeDetails.city,
              state: storeDetails.state,
              pincode: storeDetails.pincode,
              specialization: storeDetails.specialization,
              established: storeDetails.established
            };
          } else {
            medicineObj.storeDetails = null;
          }
        } catch (storeError) {
          console.error("Error fetching store details:", storeError);
          medicineObj.storeDetails = null;
        }
        
        return medicineObj;
      })
    );

    console.log("✅ Medicines with store details:", medicinesWithStoreDetails.length);

    res.status(200).json({
      success: true,
      count: medicinesWithStoreDetails.length,
      data: medicinesWithStoreDetails,
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

    // Get store details for the response
    const storeDetails = await Store.findOne({ userId: updated.storeId });
    const responseData = updated.toObject();
    responseData.storeDetails = storeDetails ? {
      storeName: storeDetails.storeName,
      ownerName: storeDetails.ownerName,
      address: storeDetails.address,
      city: storeDetails.city,
      state: storeDetails.state,
      pincode: storeDetails.pincode,
      specialization: storeDetails.specialization,
      established: storeDetails.established
    } : null;

    res.json({
      success: true,
      message: "Medicine verified successfully",
      data: responseData,
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
 * ❌ Delete a medicine
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