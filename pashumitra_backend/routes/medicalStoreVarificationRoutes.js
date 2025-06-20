const express = require("express");
const router = express.Router();
const MedicalStore = require("../models/MedicalStores");
const mongoose = require("mongoose");
const axios = require("axios");
require('dotenv').config();

// ✅ GET store by userId (cast to ObjectId)
router.get("/:userId", async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.userId); // ✅ cast string to ObjectId

        const store = await MedicalStore.findOne({ userId });

        if (!store) {
            console.log("❌ No store found for userId:", req.params.userId);
            return res.status(404).send("No store found");
        }

        console.log("✅ Store found:", store);
        res.json(store);
    } catch (err) {
        console.error("❌ Error fetching store:", err.message);
        res.status(500).send("Server error: " + err.message);
    }
});

function cleanAddress(address) {
  return address
    .replace(/\s+/g, " ")         // Remove extra spaces
    .replace(/,+/g, ",")          // Remove multiple commas
    .replace(/,\s*$/, "")         // Remove trailing comma
    .trim();
}

async function getCoordinatesFromAddress(address) {
  const cleanedAddress = encodeURIComponent(cleanAddress(address) + ", India"); // Append India for accuracy
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${cleanedAddress}&key=${process.env.OPENCAGE_API_KEY}`;

  try {
    const response = await axios.get(url);

    if (response.data.results.length === 0) {
      console.warn("⚠️ No results from geocoding for:", address);
      throw new Error("Unable to determine location from address");
    }

    const { lat, lng } = response.data.results[0].geometry;
    return { latitude: lat, longitude: lng };
  } catch (err) {
    console.error("❌ Geocoding error:", err.message);
    throw err;
  }
}

// POST store details
router.post("/", async (req, res) => {
  try {
    const { storeAddress, userId } = req.body;

    // ✅ FIX
    const objectUserId = new mongoose.Types.ObjectId(req.body.userId);

    const { latitude, longitude } = await getCoordinatesFromAddress(storeAddress);

    const store = new MedicalStore({
      ...req.body,
      userId: objectUserId, // Ensure we pass the ObjectId version here
      latitude,
      longitude,
    });

    await store.save();
    res.status(201).json(store);
  } catch (err) {
    console.error("❌ Store creation failed:", err.message);
    res.status(500).send("Server error: " + err.message);
  }
});

router.put("/:id", async (req, res) => {
    try {
        const updatedStore = await MedicalStore.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                varificationStatus: "Pending", // Reset verification on update
                updatedAt: Date.now(),
            },
            { new: true }
        );

        if (!updatedStore) return res.status(404).send("Store not found");

        res.json(updatedStore);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
