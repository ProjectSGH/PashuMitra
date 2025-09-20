const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UserVerification = require("../../models/Common/userVerificationModel");
const User = require("../../models/UserModel");

// ✅ Get all verification requests
router.get("/", async (req, res) => {
  try {
    const verifications = await UserVerification.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "farmer_users",
          localField: "user._id",
          foreignField: "userId",
          as: "farmer",
        },
      },
      {
        $lookup: {
          from: "doctor_users",
          localField: "user._id",
          foreignField: "userId",
          as: "doctor",
        },
      },
      {
        $lookup: {
          from: "store_users",
          localField: "user._id",
          foreignField: "userId",
          as: "store",
        },
      },
      {
        $addFields: {
          fullName: {
            $ifNull: [
              { $arrayElemAt: ["$farmer.fullName", 0] },
              { $arrayElemAt: ["$doctor.fullName", 0] },
            ],
          },
          storeName: { $arrayElemAt: ["$store.storeName", 0] },
        },
      },
      {
        $project: {
          verificationDocument: 1,
          verificationStatus: 1,
          createdAt: 1,
          "user.email": 1,
          "user.phone": 1,
          "user.role": 1,
          fullName: 1,
          storeName: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.json(verifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch verifications" });
  }
});

// ✅ Get details of a single verification
router.get("/:id", async (req, res) => {
  try {
    const objectId = new mongoose.Types.ObjectId(req.params.id);

    const verification = await UserVerification.aggregate([
      { $match: { _id: objectId } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "farmer_users",
          localField: "user._id",
          foreignField: "userId",
          as: "farmer",
        },
      },
      {
        $lookup: {
          from: "doctor_users",
          localField: "user._id",
          foreignField: "userId",
          as: "doctor",
        },
      },
      {
        $lookup: {
          from: "store_users",
          localField: "user._id",
          foreignField: "userId",
          as: "store",
        },
      },
      {
        $addFields: {
          fullName: {
            $ifNull: [
              { $arrayElemAt: ["$farmer.fullName", 0] },
              { $arrayElemAt: ["$doctor.fullName", 0] },
            ],
          },
          storeName: { $arrayElemAt: ["$store.storeName", 0] },
        },
      },
      {
        $project: {
          verificationDocument: 1,
          verificationStatus: 1,
          createdAt: 1,
          "user.email": 1,
          "user.phone": 1,
          "user.role": 1,
          fullName: 1,
          storeName: 1,
          farmer: 1,
          doctor: 1,
          store: 1,
        },
      },
    ]);

    if (!verification || verification.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(verification[0]);
  } catch (err) {
    console.error("Error fetching verification details:", err);
    res.status(500).json({ error: "Failed to fetch verification details" });
  }
});

// ✅ Approve verification
router.put("/:id/approve", async (req, res) => {
  try {
    const verification = await UserVerification.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: "approved", isVerified: true },
      { new: true }
    );
    res.json({ success: true, verification });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve" });
  }
});

// ✅ Reject verification
router.put("/:id/reject", async (req, res) => {
  try {
    const { reason } = req.body;
    const verification = await UserVerification.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: "rejected", isVerified: false },
      { new: true }
    );
    res.json({ success: true, verification, reason });
  } catch (err) {
    res.status(500).json({ error: "Failed to reject" });
  }
});

module.exports = router;
