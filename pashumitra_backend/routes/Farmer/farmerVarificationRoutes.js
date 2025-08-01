const express = require("express");
const router = express.Router();
const Farmer = require("../../models/FarmerModel");
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
    console.log("Incoming file:", req.file); // ✅ Debug
    console.log("Farmer ID:", req.params.farmerId); // ✅ Debug

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const farmer = await Farmer.findById(req.params.farmerId);
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });

    // Upload to Cloudinary
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

    farmer.verificationDocument = {
      url: result.secure_url,
      public_id: result.public_id,
    };
    farmer.verificationStatus = "pending";
    await farmer.save();

    res.status(200).json({
      message: "Document uploaded successfully",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Upload failed:", error); // ✅ Show full error
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

module.exports = router;