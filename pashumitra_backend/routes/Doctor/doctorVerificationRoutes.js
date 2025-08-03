// routes/Doctor/doctorVerificationRoutes.js
const express = require("express");
const Doctor = require("../../models/Doctor/DoctorVerificationModel");
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const router = express.Router();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload/:userId", upload.single("document"), async (req, res) => {
  try {
    const { licenseNumber } = req.body;
    const userId = req.params.userId;

    // Step 1: Find doctor profile by userId
    const doctorProfile = await require("../../models/DoctorModel").findOne({ userId });

    if (!doctorProfile)
      return res.status(404).json({ message: "Doctor profile not found" });

    // Step 2: Find or create DoctorVerification for this doctor
    let verification = await Doctor.findOne({ doctorId: doctorProfile._id });

    if (!verification) {
      verification = new Doctor({
        doctorId: doctorProfile._id,
        licenseNumber,
      });
    } else {
      verification.licenseNumber = licenseNumber;
    }

    // Step 3: Upload to Cloudinary
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "doctor_verification" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    verification.verificationDocument = {
      url: result.secure_url,
      public_id: result.public_id,
    };
    verification.verificationStatus = "pending";
    verification.isVerified = false;

    await verification.save();

    res.status(200).json({
      message: "Verification document uploaded successfully",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
});

router.get("/status/:userId", async (req, res) => {
  try {
    const doctorProfile = await require("../../models/DoctorModel").findOne({ userId: req.params.userId });
    if (!doctorProfile)
      return res.status(404).json({ message: "Doctor not found" });

    const verification = await Doctor.findOne({ doctorId: doctorProfile._id });
    if (!verification)
      return res.status(404).json({ message: "Verification not submitted yet" });

    res.json({
      status: verification.verificationStatus,
      licenseNumber: verification.licenseNumber,
      documentUrl: verification.verificationDocument?.url || null,
      isVerified: verification.isVerified,
    });
  } catch (error) {
    console.error("Status fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
