const express = require("express");
const router = express.Router();
const Farmer = require("../../models/Farmer/FarmerModel");
const FarmerVerification = require("../../models/Farmer/FarmerVerificationModel");
const { uploader } = require("cloudinary").v2;
const multer = require("multer");
const streamifier = require("streamifier");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("✅ Cloudinary configured:", cloudinary.config().cloud_name);

// Multer setup for buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload/:farmerId", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const farmerExists = await Farmer.findById(req.params.farmerId);
    if (!farmerExists) return res.status(404).json({ message: "Farmer not found" });

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = uploader.upload_stream(
          { folder: "farmer_verification" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    const verificationDoc = await FarmerVerification.findOneAndUpdate(
      { farmerId: req.params.farmerId },
      {
        farmerId: req.params.farmerId,
        verificationDocument: {
          url: result.secure_url,
          public_id: result.public_id,
        },
        verificationStatus: "pending",
        isVerified: false,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Verification document uploaded successfully",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Failed to upload", error });
  }
});

router.put("/approve/:farmerId", async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.farmerId);
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });

    farmer.isVerified = true;
    farmer.verificationStatus = "approved";
    await farmer.save();

    res.json({ message: "Farmer verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Verification failed", error: err });
  }
});

router.get("/status/:farmerId", async (req, res) => {
  try {
    const verification = await FarmerVerification.findOne({
      farmerId: req.params.farmerId,
    });

    if (!verification) {
      return res.status(200).json({
        verificationStatus: "not_submitted",
        isVerified: false,
      });
    }

    return res.status(200).json({
      verificationStatus: verification.verificationStatus,
      isVerified: verification.isVerified,
    });
  } catch (err) {
    console.error("Verification status fetch failed:", err);
    return res.status(500).json({ message: "Server error", error: err });
  }
});

// Add to your farmer verification routes
router.get("/", async (req, res) => {
    try {
        const verifications = await FarmerVerification.find()
            .populate({
                path: "farmerId",
                select: "fullName village city state"
            });
        res.json(verifications);
    } catch (error) {
        console.error("Fetch all farmer verifications error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Add to your farmer verification routes
router.patch("/verify/:farmerId", async (req, res) => {
    try {
        const { action } = req.body; // "approve" or "reject"

        const verification = await FarmerVerification.findOne({ farmerId: req.params.farmerId });
        if (!verification) {
            return res.status(404).json({ message: "Verification not found" });
        }

        if (action === "approve") {
            verification.verificationStatus = "approved";
            verification.isVerified = true;
            
            // Also update the farmer model
            await Farmer.findByIdAndUpdate(req.params.farmerId, {
                isVerified: true,
                verificationStatus: "approved"
            });
        } else if (action === "reject") {
            verification.verificationStatus = "rejected";
            verification.isVerified = false;
            
            // Also update the farmer model
            await Farmer.findByIdAndUpdate(req.params.farmerId, {
                isVerified: false,
                verificationStatus: "rejected"
            });
        } else {
            return res.status(400).json({ message: "Invalid action" });
        }

        await verification.save();

        res.json({
            message: `Farmer verification ${action}d successfully`,
            verification,
        });
    } catch (error) {
        console.error("Farmer verification update error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
module.exports = router;