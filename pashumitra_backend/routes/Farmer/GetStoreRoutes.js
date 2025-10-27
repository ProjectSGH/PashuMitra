const express = require('express');
const router = express.Router();
const User = require('../../models/UserModel');
const Store = require('../../models/MedicalStore/StoreModel');
const MedicalSchedule = require('../../models/MedicalStore/MedicalScheduleModel');

// Helper functions
const calculateDistance = (storeProfile) => {
  const distances = ['2.5 km', '4.2 km', '6.8 km', '1.2 km', '3.7 km'];
  return distances[Math.floor(Math.random() * distances.length)];
};

const formatStoreHours = async (userId) => {
  try {
    const schedule = await MedicalSchedule.findOne({ userId });
    if (!schedule) return "9:00 AM - 7:00 PM";

    // Find today's schedule
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    const todaySchedule = schedule[today];

    if (todaySchedule && todaySchedule.available) {
      return `${todaySchedule.startTime} - ${todaySchedule.endTime}`;
    }
    
    return "9:00 AM - 7:00 PM"; // Default fallback
  } catch (error) {
    return "9:00 AM - 7:00 PM";
  }
};

const formatSpecialties = (storeProfile) => {
  if (!storeProfile?.specialization) return ['General Veterinary Medicine'];
  return [storeProfile.specialization];
};

const calculateMedicineStock = () => {
  const available = Math.floor(Math.random() * 50) + 30;
  const total = available + Math.floor(Math.random() * 20);
  return { available, total };
};

const formatStoreData = async (user) => {
  const storeProfile = user.storeProfile;
  const hours = await formatStoreHours(user._id);
  
  return {
    id: user._id || user.id,
    name: storeProfile?.storeName || 'Medical Store',
    ownerName: storeProfile?.ownerName,
    specialization: storeProfile?.specialization,
    address: storeProfile?.address,
    state: storeProfile?.state,
    city: storeProfile?.city,
    pincode: storeProfile?.pincode,
    email: user.email,
    phone: user.phone,
    established: storeProfile?.established,
    rating: 4.5,
    distance: calculateDistance(storeProfile),
    hours: hours,
    specialties: formatSpecialties(storeProfile),
    medicineStock: calculateMedicineStock(),
  };
};

// GET all medical stores with formatted data for farmers
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ role: "MedicalStore" }).select("-password");

    const storesWithProfiles = await Promise.all(
      users.map(async (user) => {
        const storeData = await Store.findOne({ userId: user._id });
        const userWithProfile = {
          ...user.toObject(),
          storeProfile: storeData
        };
        return await formatStoreData(userWithProfile);
      })
    );

    res.json(storesWithProfiles);
  } catch (err) {
    console.error("Error in GET /stores:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET single medical store by ID with formatted data
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Store not found" });

    if (user.role !== "MedicalStore") {
      return res.status(404).json({ message: "Store not found" });
    }

    const storeData = await Store.findOne({ userId: user._id });
    const userWithProfile = {
      ...user.toObject(),
      storeProfile: storeData
    };

    const formattedStore = await formatStoreData(userWithProfile);
    res.json(formattedStore);
  } catch (err) {
    console.error("Error in GET /stores/:id:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET stores with filters (distance, specialty, open status)
router.get('/filter/stores', async (req, res) => {
  try {
    const { distance, specialty, openOnly } = req.query;
    
    const users = await User.find({ role: "MedicalStore" }).select("-password");

    let storesWithProfiles = await Promise.all(
      users.map(async (user) => {
        const storeData = await Store.findOne({ userId: user._id });
        const userWithProfile = {
          ...user.toObject(),
          storeProfile: storeData
        };
        return await formatStoreData(userWithProfile);
      })
    );

    // Apply filters
    if (distance && distance !== "All") {
      storesWithProfiles = storesWithProfiles.filter(store => {
        const distanceValue = parseFloat(store.distance);
        const filterDistance = parseInt(distance.replace(/\D/g, ''));
        
        if (distance.includes("5") && distanceValue > 5) return false;
        if (distance.includes("10") && distanceValue > 10) return false;
        if (distance.includes("20") && distanceValue > 20) return false;
        return true;
      });
    }

    if (specialty && specialty !== "All Specialties") {
      storesWithProfiles = storesWithProfiles.filter(store => 
        store.specialties.includes(specialty)
      );
    }

    if (openOnly === 'true') {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      
      storesWithProfiles = storesWithProfiles.filter(store => {
        // Simple time check - you can enhance this with actual schedule data
        const isOpen = Math.random() > 0.3; // Mock: 70% chance store is open
        return isOpen;
      });
    }

    res.json(storesWithProfiles);
  } catch (err) {
    console.error("Error in GET /stores/filter/stores:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET stores by specialty
router.get('/specialty/:specialty', async (req, res) => {
  try {
    const { specialty } = req.params;
    
    const stores = await Store.find({ 
      specialization: new RegExp(specialty, 'i') 
    }).populate('userId', 'email phone -password');

    const formattedStores = await Promise.all(
      stores.map(async (store) => {
        const userWithProfile = {
          ...store.userId.toObject(),
          storeProfile: store
        };
        return await formatStoreData(userWithProfile);
      })
    );

    res.json(formattedStores);
  } catch (err) {
    console.error("Error in GET /stores/specialty/:specialty:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET nearby stores (with distance calculation - mock)
router.get('/nearby/location', async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query; // radius in km
    
    const users = await User.find({ role: "MedicalStore" }).select("-password");

    const storesWithProfiles = await Promise.all(
      users.map(async (user) => {
        const storeData = await Store.findOne({ userId: user._id });
        const userWithProfile = {
          ...user.toObject(),
          storeProfile: storeData
        };
        return await formatStoreData(userWithProfile);
      })
    );

    // Filter by radius (mock implementation)
    // In real app, you'd use geospatial queries with actual coordinates
    const nearbyStores = storesWithProfiles.filter(store => {
      const distanceValue = parseFloat(store.distance);
      return distanceValue <= parseInt(radius);
    });

    res.json(nearbyStores);
  } catch (err) {
    console.error("Error in GET /stores/nearby/location:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;