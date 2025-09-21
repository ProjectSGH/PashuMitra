const express = require('express');
const router = express.Router();
const User = require('../../models/UserModel');
const Farmer = require('../../models/Farmer/FarmerModel');
const Doctor = require('../../models/Doctor/DoctorModel');
const Store = require('../../models/MedicalStore/StoreModel');
const UserVerification = require('../../models/Common/userVerificationModel');

router.get("/stats", async (req, res) => {
  try {
    const totalFarmers = await User.countDocuments({ role: "Farmer" });
    const totalDoctors = await User.countDocuments({ role: "Doctor" });
    const totalStores = await User.countDocuments({ role: "MedicalStore" });
    const pendingVerifications = await UserVerification.countDocuments({ verificationStatus: "Pending" });

    res.json({
      totalFarmers,
      totalDoctors,
      totalStores,
      pendingVerifications,
    });
  } catch (err) {
    console.error("Stats fetch error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET all users by role (Admin)
router.get('/users/:role', async (req, res) => {
  try {
    const role = req.params.role; // Farmer, Doctor, MedicalStore
    const users = await User.find({ role }).select("-password");

    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        let profileData = null;
        let profileKey = null;

        if (role === "Farmer") {
          profileData = await Farmer.findOne({ userId: user._id });
          profileKey = "farmerProfile";
        } else if (role === "Doctor") {
          profileData = await Doctor.findOne({ userId: user._id });
          profileKey = "doctorProfile";
        } else if (role === "MedicalStore") {
          profileData = await Store.findOne({ userId: user._id });
          profileKey = "storeProfile";
        }

        // Fetch verification status
        const verification = await UserVerification.findOne({ userId: user._id });

        return {
          ...user.toObject(),
          id: user._id, // needed for frontend tables
          ...(profileKey ? { [profileKey]: profileData } : {}),
          verificationStatus: verification ? verification.verificationStatus : "not_submitted",
          isVerified: verification ? verification.isVerified : false,
        };
      })
    );

    res.json(usersWithProfiles);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE a user and their profile
router.delete('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete role-specific profile
    if (user.role === "Farmer") {
      await Farmer.findOneAndDelete({ userId });
    } else if (user.role === "Doctor") {
      await Doctor.findOneAndDelete({ userId });
    } else if (user.role === "MedicalStore") {
      await Store.findOneAndDelete({ userId });
    }

    // Delete verification record
    await UserVerification.findOneAndDelete({ userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
});

module.exports = router;
