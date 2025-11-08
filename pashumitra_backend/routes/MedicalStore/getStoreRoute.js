// routes/MedicalStore/storeTransferRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../../models/UserModel');
const Store = require('../../models/MedicalStore/StoreModel');

// Helper function to format store data for transfer selection
const formatStoreForTransfer = (store) => {
  return {
    id: store.userId._id, // Use userId as store ID for notifications
    storeId: store._id,
    storeName: store.storeName,
    ownerName: store.ownerName,
    specialization: store.specialization,
    address: store.address,
    city: store.city,
    state: store.state,
    pincode: store.pincode,
    contact: store.userId.phone,
    email: store.userId.email,
    fullAddress: `${store.address}, ${store.city}, ${store.state} - ${store.pincode}`,
    // Additional fields specific to transfer context
    isActive: true,
    transferEligible: true,
    acceptanceRate: Math.floor(Math.random() * 30) + 70, // Mock: 70-100% acceptance rate
    avgResponseTime: `${Math.floor(Math.random() * 60) + 5} minutes` // Mock: 5-65 minutes
  };
};

// GET all stores for transfer selection (EXCLUDING CURRENT STORE)
router.get('/available-stores', async (req, res) => {
  try {
    const { currentStoreId } = req.query;
    
    console.log("🔍 Fetching available stores for transfer, excluding:", currentStoreId);
    
    if (!currentStoreId) {
      return res.status(400).json({
        success: false,
        message: "Current store ID is required"
      });
    }

    // Find all stores except the current one
    const stores = await Store.find({})
      .populate('userId', 'email phone')
      .select('storeName ownerName specialization address city state pincode userId')
      .sort({ storeName: 1 });

    // Filter out current store and format data
    const availableStores = stores
      .filter(store => store.userId._id.toString() !== currentStoreId)
      .map(store => formatStoreForTransfer(store));

    console.log(`✅ Found ${availableStores.length} stores available for transfer`);

    res.json({
      success: true,
      count: availableStores.length,
      data: availableStores
    });

  } catch (err) {
    console.error("❌ Error fetching available stores for transfer:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching available stores",
      error: err.message
    });
  }
});

// GET stores by specialization for transfer
router.get('/specialty/:specialty', async (req, res) => {
  try {
    const { specialty } = req.params;
    const { currentStoreId } = req.query;
    
    console.log(`🔍 Fetching ${specialty} stores for transfer, excluding:`, currentStoreId);

    if (!currentStoreId) {
      return res.status(400).json({
        success: false,
        message: "Current store ID is required"
      });
    }

    const stores = await Store.find({ 
      specialization: new RegExp(specialty, 'i'),
      userId: { $ne: currentStoreId } // Exclude current store
    }).populate('userId', 'email phone');

    const formattedStores = stores.map(store => formatStoreForTransfer(store));

    res.json({
      success: true,
      count: formattedStores.length,
      data: formattedStores
    });

  } catch (err) {
    console.error("❌ Error fetching specialty stores for transfer:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching specialty stores",
      error: err.message
    });
  }
});

// GET nearby stores for transfer (with distance filter)
router.get('/nearby', async (req, res) => {
  try {
    const { currentStoreId, radius = 50 } = req.query; // radius in km
    
    console.log(`🔍 Fetching stores within ${radius}km for transfer, excluding:`, currentStoreId);

    if (!currentStoreId) {
      return res.status(400).json({
        success: false,
        message: "Current store ID is required"
      });
    }

    // Get current store location
    const currentStore = await Store.findOne({ userId: currentStoreId });
    if (!currentStore) {
      return res.status(404).json({
        success: false,
        message: "Current store not found"
      });
    }

    // In a real app, you'd use geospatial queries here
    // For now, we'll return all stores except current one
    const stores = await Store.find({
      userId: { $ne: currentStoreId }
    }).populate('userId', 'email phone');

    // Mock distance calculation based on city
    const storesWithDistance = stores.map(store => {
      const distance = Math.floor(Math.random() * 40) + 5; // Mock: 5-45 km
      return {
        ...formatStoreForTransfer(store),
        distance: `${distance} km`,
        distanceValue: distance
      };
    });

    // Filter by radius
    const nearbyStores = storesWithDistance.filter(store => 
      store.distanceValue <= parseInt(radius)
    );

    res.json({
      success: true,
      count: nearbyStores.length,
      currentStoreLocation: `${currentStore.city}, ${currentStore.state}`,
      data: nearbyStores
    });

  } catch (err) {
    console.error("❌ Error fetching nearby stores for transfer:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching nearby stores",
      error: err.message
    });
  }
});

// GET store transfer statistics
router.get('/transfer-stats/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params;
    
    // Mock statistics - in real app, you'd calculate from order data
    const stats = {
      totalTransfersOut: Math.floor(Math.random() * 20),
      totalTransfersIn: Math.floor(Math.random() * 15),
      successfulTransfers: Math.floor(Math.random() * 18),
      avgTransferTime: "2-4 hours",
      topTransferPartners: ["City Medical Store", "Rural Health Pharmacy", "Metro Pharmacy"]
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (err) {
    console.error("❌ Error fetching transfer stats:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching transfer statistics",
      error: err.message
    });
  }
});

module.exports = router;