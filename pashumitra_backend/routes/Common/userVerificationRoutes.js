// routes/Common/userVerificationRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../../models/UserModel");
const UserVerification = require("../../models/Common/userVerificationModel");
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload verification document
router.post("/upload/:userId", upload.single("document"), async (req, res) => {
  try {
    const { licenseNumber } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Role-based requirement
    if (["Doctor", "MedicalStore"].includes(user.role) && !licenseNumber) {
      return res.status(400).json({ message: "License number is required" });
    }

    // Upload to Cloudinary
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: `${user.role.toLowerCase()}_verification` },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    // Create/Update verification
    const verification = await UserVerification.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        licenseNumber: licenseNumber || null,
        verificationDocument: {
          url: result.secure_url,
          public_id: result.public_id,
        },
        verificationStatus: "pending",
        isVerified: false,
      },
      { upsert: true, new: true }
    );

    res.json({ message: "Uploaded successfully", verification });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get status for user
router.get("/status/:userId", async (req, res) => {
  try {
    const verification = await UserVerification.findOne({ userId: req.params.userId });
    if (!verification) {
      return res.json({ verificationStatus: "not_submitted", isVerified: false });
    }
    res.json(verification);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

// ✅ Admin approve/reject
router.patch("/verify/:verificationId", async (req, res) => {
  try {
    const { action } = req.body;
    const verification = await UserVerification.findById(req.params.verificationId).populate("userId", "role email");

    if (!verification) return res.status(404).json({ message: "Verification not found" });

    if (action === "approve") {
      verification.verificationStatus = "approved";
      verification.isVerified = true;
    } else if (action === "reject") {
      verification.verificationStatus = "rejected";
      verification.isVerified = false;
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await verification.save();

    res.json({ message: `${verification.userId.role} verification ${action}d`, verification });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

// ✅ Admin get all
router.get("/", async (req, res) => {
  try {
    const verifications = await UserVerification.find().populate("userId", "email phone role");
    res.json(verifications);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

module.exports = router;
