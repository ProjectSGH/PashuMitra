// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const Farmer = require('../models/Farmer/FarmerModel');
const Doctor = require('../models/Doctor/DoctorModel');
const Store = require('../models/MedicalStore/StoreModel');
const { loginUser } = require('../controllers/userController');
const userController = require('../controllers/userController');

router.post('/signup/farmer', userController.registerFarmer);
router.post('/signup/doctor', userController.registerDoctor);
router.post('/signup/store', userController.registerStore);
router.post('/login', loginUser);

// GET all doctors with their profile
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ role: "Doctor" }).select("-password");

    const doctorProfiles = await Promise.all(
      doctors.map(async (user) => {
        const doctorData = await Doctor.findOne({ userId: user._id });
        return { ...user.toObject(), doctorProfile: doctorData };
      })
    );

    res.json(doctorProfiles);
  } catch (err) {
    console.error("Error in GET /doctors:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'Farmer') {
      const farmerData = await Farmer.findOne({ userId: user._id });
      return res.json({ ...user.toObject(), farmerProfile: farmerData });
    }

    if (user.role === 'Doctor') {
      const doctorData = await Doctor.findOne({ userId: user._id });
      return res.json({ ...user.toObject(), doctorProfile: doctorData });
    }

    if (user.role === 'MedicalStore') {
      const storeData = await Store.findOne({ userId: user._id });
      return res.json({ ...user.toObject(), storeProfile: storeData });
    }

    res.json(user); // fallback
  } catch (err) {
    console.error("Error in GET /:id:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
// routes/userRoutes.js
router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Update User (common fields)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        email: req.body.email,
        phone: req.body.phone,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    let updatedProfile = null;

    if (updatedUser.role === "Farmer") {
      updatedProfile = await Farmer.findOneAndUpdate(
        { userId },
        {
          fullName: req.body.fullName,
          address: req.body.address,
          village: req.body.village,
          city: req.body.city,
          state: req.body.state,
          pincode: req.body.pincode,
        },
        { new: true, runValidators: true }
      );
    }

    if (updatedUser.role === "Doctor") {
      updatedProfile = await Doctor.findOneAndUpdate(
        { userId },
        {
          fullName: req.body.fullName,
          specialization: req.body.specialization,
          hospitalname: req.body.hospitalname,
          experience: req.body.experience,
          state: req.body.state,
          city: req.body.city,
          schedule: req.body.schedule, // <- add this line if not already present
          fee: req.body.fee,
        },
        { new: true, runValidators: true }
      );
    }

    if (updatedUser.role === "MedicalStore") {
      updatedProfile = await Store.findOneAndUpdate(
        { userId },
        {
          storeName: req.body.storeName,
          ownerName: req.body.ownerName,
          specialization: req.body.specialization,
          established: req.body.established,
          address: req.body.address,
          state: req.body.state,
          city: req.body.city,
          pincode: req.body.pincode,
        },
        { new: true, runValidators: true }
      );
    }
    // Combine for frontend
    const responseUser = {
      ...updatedUser.toObject(),
      [`${updatedUser.role.toLowerCase()}Profile`]: updatedProfile,
    };

    res.status(200).json({ message: "Profile updated", user: responseUser });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

module.exports = router;
