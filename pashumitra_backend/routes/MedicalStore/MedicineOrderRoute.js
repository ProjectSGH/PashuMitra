// routes/MedicalStore/regularMedicineOrderRoutes.js
import express from "express";
import mongoose from "mongoose";
import RegularMedicineOrder from "../../models/MedicalStore/MedicineOrder.js";
import Medicine from "../../models/MedicalStore/Medicine.js";
import Notification from "../../models/Common/notificationModel.js";

const router = express.Router();

// Dynamic import for Farmer model to handle CommonJS/ES6 compatibility
let Farmer;

const loadFarmerModel = async () => {
  if (!Farmer) {
    try {
      // Try ES6 import first
      const farmerModule = await import("../../models/Farmer/FarmerModel.js");
      Farmer = farmerModule.default;
      // console.log("✅ Farmer model loaded via ES6 import");
    } catch (es6Error) {
      try {
        // Fallback to require for CommonJS
        Farmer = require("../../models/Farmer/FarmerModel.js");
        // console.log("✅ Farmer model loaded via CommonJS require");
      } catch (requireError) {
        console.error("❌ Failed to load Farmer model:", requireError);
        Farmer = null;
      }
    }
  }
  return Farmer;
};

// Helper function to get farmer details
const getFarmerDetails = async (farmerId) => {
  try {
    const FarmerModel = await loadFarmerModel();
    if (!FarmerModel) {
      return null;
    }

    const farmer = await FarmerModel.findOne({ userId: farmerId })
      .populate('userId', 'email phone');
    
    return farmer;
  } catch (error) {
    console.error("❌ Error fetching farmer details:", error);
    return null;
  }
};

// Create regular medicine order
router.post("/", async (req, res) => {
  try {
    const {
      medicineId,
      storeId,
      farmerId,
      animalType,
      animalCount,
      animalWeight,
      animalAge,
      symptoms,
      quantityRequested,
      deliveryOption,
      deliveryAddress,
      farmerNotes,
      prescriptionDocument
    } = req.body;

    // console.log("📦 Creating regular medicine order:", { medicineId, storeId, farmerId });

    // Validate required fields
    if (!medicineId || !storeId || !farmerId || !animalType || !animalCount || !quantityRequested) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Check medicine availability
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    if (medicine.status !== "In Stock") {
      return res.status(400).json({
        success: false,
        message: "Medicine is out of stock"
      });
    }

    if (quantityRequested > medicine.quantity) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity exceeds available stock. Available: ${medicine.quantity}`
      });
    }

    // Fetch farmer details from Farmer_User model
    const farmer = await getFarmerDetails(farmerId);
    
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer details not found"
      });
    }

    // Extract farmer information
    const farmerName = farmer.fullName;
    const farmerContact = farmer.userId.phone;
    const farmerLocation = `${farmer.village ? farmer.village + ', ' : ''}${farmer.city}, ${farmer.state} - ${farmer.pincode}`;
    const farmerAddress = farmer.address;

    // Use delivery address if provided, otherwise use farmer's address
    const finalDeliveryAddress = deliveryOption === "delivery" && deliveryAddress 
      ? deliveryAddress 
      : farmerAddress;

    // Calculate total price
    const totalPrice = medicine.price * quantityRequested;

    // Create new order
    const newOrder = new RegularMedicineOrder({
      medicineId,
      storeId,
      farmerId,
      farmerName,
      farmerContact,
      farmerLocation,
      farmerAddress,
      animalType,
      animalCount,
      animalWeight,
      animalAge,
      symptoms,
      medicineName: medicine.name,
      quantityRequested,
      totalPrice,
      deliveryOption,
      deliveryAddress: finalDeliveryAddress,
      farmerNotes,
      prescriptionDocument
    });

    const savedOrder = await newOrder.save();

    // 🔔 NOTIFICATION FOR STORE
    try {
      const notification = new Notification({
        userIds: [storeId],
        title: "New Regular Medicine Order",
        message: `Farmer ${farmerName} has ordered ${quantityRequested} units of ${medicine.name} for ${animalType}.`,
        type: "medicine_order",
        metadata: {
          orderId: savedOrder._id,
          type: "regular_medicine_order",
          farmerName,
          medicineName: medicine.name,
          quantity: quantityRequested,
          animalType
        }
      });
      await notification.save();
      // console.log("🔔 Notification created for store");
    } catch (notificationError) {
      console.error("❌ Failed to create notification:", notificationError);
    }

    res.status(201).json({
      success: true,
      message: "Medicine order created successfully",
      data: savedOrder
    });

  } catch (error) {
    console.error("❌ Error creating regular medicine order:", error);
    res.status(500).json({
      success: false,
      message: "Error creating medicine order",
      error: error.message
    });
  }
});

// Get orders for store - Updated with dynamic import
router.get("/store/:storeId", async (req, res) => {
  try {
    const { storeId } = req.params;
    const { status } = req.query;

    // console.log("🔍 Fetching orders for store:", storeId);

    const filter = { storeId };
    if (status) filter.status = status;

    // Get basic orders first
    const orders = await RegularMedicineOrder.find(filter)
      .populate("medicineId", "name price manufacturer composition")
      .sort({ createdAt: -1 });

    // console.log(`✅ Found ${orders.length} orders`);

    // Load Farmer model
    const FarmerModel = await loadFarmerModel();
    
    // Add farmer details to each order
    const ordersWithFarmerDetails = await Promise.all(
      orders.map(async (order) => {
        try {
          const orderObj = order.toObject();
          
          if (FarmerModel) {
            // Fetch farmer details using the dynamic model
            const farmer = await FarmerModel.findOne({ userId: order.farmerId })
              .populate('userId', 'email phone');

            if (farmer && farmer.userId) {
              orderObj.farmerDetails = {
                name: farmer.fullName,
                email: farmer.userId.email,
                phone: farmer.userId.phone,
                address: farmer.address,
                village: farmer.village,
                city: farmer.city,
                state: farmer.state,
                pincode: farmer.pincode,
                completeAddress: `${farmer.address}${farmer.village ? ', ' + farmer.village : ''}, ${farmer.city}, ${farmer.state} - ${farmer.pincode}`
              };
            } else {
              orderObj.farmerDetails = {
                name: "Farmer details not found",
                email: "N/A",
                phone: "N/A",
                address: "N/A"
              };
            }
          } else {
            orderObj.farmerDetails = {
              name: "Farmer model not available",
              email: "N/A",
              phone: "N/A",
              address: "N/A"
            };
          }
          
          return orderObj;
        } catch (farmerError) {
          console.error(`❌ Error fetching farmer for order ${order._id}:`, farmerError);
          const orderObj = order.toObject();
          orderObj.farmerDetails = {
            name: "Error loading farmer details",
            email: "N/A",
            phone: "N/A",
            address: "N/A"
          };
          return orderObj;
        }
      })
    );

    res.json({
      success: true,
      count: ordersWithFarmerDetails.length,
      data: ordersWithFarmerDetails
    });

  } catch (error) {
    console.error("❌ Error fetching store orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message
    });
  }
});

// Get orders for farmer - FIXED VERSION
router.get("/farmer/:farmerId", async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { status } = req.query;

    // console.log("🔍 Fetching REGULAR orders for farmer:", farmerId);

    const filter = { farmerId };
    if (status) filter.status = status;

    const orders = await RegularMedicineOrder.find(filter)
      .populate("medicineId", "name price manufacturer composition")
      .populate("storeId", "email")
      .populate("transferredToStore.storeId", "email")
      .sort({ createdAt: -1 });

    // console.log(`✅ Found ${orders.length} REGULAR orders for farmer ${farmerId}`);

    // Load Farmer model
    let FarmerModel;
    try {
      const farmerModule = await import("../../models/Farmer/FarmerModel.js");
      FarmerModel = farmerModule.default;
      // console.log("✅ Farmer_User model loaded successfully");
    } catch (error) {
      console.error("❌ Failed to load Farmer_User model:", error);
      FarmerModel = null;
    }

    // Add farmer details to each order - FIXED LOGIC
    const ordersWithFarmerDetails = await Promise.all(
      orders.map(async (order) => {
        try {
          const orderObj = order.toObject();
          
          if (FarmerModel) {
            const farmer = await FarmerModel.findOne({ userId: order.farmerId });
            
            // console.log("👨‍🌾 Farmer details found for order:", order._id, farmer ? {
            //   fullName: farmer.fullName,
            //   address: farmer.address,
            //   village: farmer.village,
            //   city: farmer.city,
            //   state: farmer.state,
            //   pincode: farmer.pincode
            // } : 'No farmer found');

            if (farmer) {
              // Create complete address
              const completeAddress = `${farmer.address}${farmer.village ? ', ' + farmer.village : ''}, ${farmer.city}, ${farmer.state} - ${farmer.pincode}`;
              
              orderObj.farmerDetails = {
                name: farmer.fullName,
                address: farmer.address,
                village: farmer.village,
                city: farmer.city,
                state: farmer.state,
                pincode: farmer.pincode,
                completeAddress: completeAddress
              };
              
              // CRITICAL FIX: Override farmerLocation with the complete address
              orderObj.farmerLocation = completeAddress; // This is the key fix!
              
              // Also set farmerAddress if missing
              if (!orderObj.farmerAddress) {
                orderObj.farmerAddress = farmer.address;
              }
            } else {
              console.log("❌ No farmer found for userId:", order.farmerId);
              orderObj.farmerDetails = {
                name: order.farmerName || "Farmer details not found",
                address: "Not specified",
                village: "Not specified", 
                city: "Not specified",
                state: "Not specified",
                pincode: "Not specified",
                completeAddress: "Location not specified"
              };
              
              // Set fallback location
              orderObj.farmerLocation = "Location not specified";
            }
          } else {
            orderObj.farmerDetails = {
              name: order.farmerName || "Farmer model not available",
              address: "Not specified",
              completeAddress: "Location not specified"
            };
            
            orderObj.farmerLocation = "Location not specified";
          }
          
          // console.log("📦 Final order data for farmer:", {
          //   id: orderObj._id,
          //   farmerLocation: orderObj.farmerLocation, // This should now show the complete address
          //   deliveryAddress: orderObj.deliveryAddress,
          //   hasFarmerDetails: !!orderObj.farmerDetails,
          //   farmerDetailsCompleteAddress: orderObj.farmerDetails?.completeAddress
          // });
          
          return orderObj;
        } catch (farmerError) {
          console.error(`❌ Error fetching farmer for order ${order._id}:`, farmerError);
          const orderObj = order.toObject();
          orderObj.farmerDetails = {
            name: order.farmerName || "Error loading farmer details",
            address: "Not specified",
            completeAddress: "Location not specified"
          };
          orderObj.farmerLocation = "Location not specified";
          return orderObj;
        }
      })
    );

    res.json({
      success: true,
      count: orders.length,
      data: ordersWithFarmerDetails
    });

  } catch (error) {
    console.error("❌ Error fetching REGULAR farmer orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message
    });
  }
});

// Get farmer details for a specific order - Updated with dynamic import
router.get("/:orderId/farmer-details", async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await RegularMedicineOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const farmer = await getFarmerDetails(order.farmerId);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer details not found"
      });
    }

    const farmerDetails = {
      name: farmer.fullName,
      email: farmer.userId.email,
      phone: farmer.userId.phone,
      address: farmer.address,
      village: farmer.village,
      city: farmer.city,
      state: farmer.state,
      pincode: farmer.pincode,
      completeAddress: `${farmer.address}${farmer.village ? ', ' + farmer.village : ''}, ${farmer.city}, ${farmer.state} - ${farmer.pincode}`
    };

    res.json({
      success: true,
      data: farmerDetails
    });

  } catch (error) {
    console.error("❌ Error fetching farmer details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching farmer details",
      error: error.message
    });
  }
});

// Simple endpoint without farmer details (fallback)
router.get("/store-simple/:storeId", async (req, res) => {
  try {
    const { storeId } = req.params;
    const { status } = req.query;

    const filter = { storeId };
    if (status) filter.status = status;

    const orders = await RegularMedicineOrder.find(filter)
      .populate("medicineId", "name price manufacturer composition")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });

  } catch (error) {
    console.error("❌ Error in simple store orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message
    });
  }
});

// The other routes (approve, reject, transfer) remain the same
// Approve regular medicine order
router.patch("/:orderId/approve", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { storeNotes, expectedDeliveryDate } = req.body;

    const order = await RegularMedicineOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check medicine availability
    const medicine = await Medicine.findById(order.medicineId);
    if (!medicine || medicine.quantity < order.quantityRequested) {
      return res.status(400).json({
        success: false,
        message: "Insufficient medicine quantity"
      });
    }

    // Update medicine quantity
    medicine.quantity -= order.quantityRequested;
    if (medicine.quantity === 0) {
      medicine.status = "Out of Stock";
    }
    await medicine.save();

    // Update order status
    order.status = "approved";
    order.responseDate = new Date();
    order.storeNotes = storeNotes;
    if (expectedDeliveryDate) order.expectedDeliveryDate = expectedDeliveryDate;

    const updatedOrder = await order.save();

    // 🔔 NOTIFICATION FOR FARMER
    try {
      const notification = new Notification({
        userIds: [order.farmerId],
        title: "Medicine Order Approved",
        message: `Your order for ${order.medicineName} has been approved by the store. ${storeNotes || 'Please contact the store for delivery details.'}`,
        type: "important",
        metadata: {
          orderId: updatedOrder._id,
          type: "regular_medicine_approved",
          medicineName: order.medicineName,
          storeNotes
        }
      });
      await notification.save();
    } catch (notificationError) {
      console.error("❌ Failed to create approval notification:", notificationError);
    }

    res.json({
      success: true,
      message: "Order approved successfully",
      data: updatedOrder
    });

  } catch (error) {
    console.error("❌ Error approving order:", error);
    res.status(500).json({
      success: false,
      message: "Error approving order",
      error: error.message
    });
  }
});

// Reject regular medicine order
router.patch("/:orderId/reject", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { storeNotes } = req.body;

    const order = await RegularMedicineOrder.findByIdAndUpdate(
      orderId,
      {
        status: "rejected",
        responseDate: new Date(),
        storeNotes
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // 🔔 NOTIFICATION FOR FARMER
    try {
      const notification = new Notification({
        userIds: [order.farmerId],
        title: "Medicine Order Rejected",
        message: `Your order for ${order.medicineName} has been rejected. ${storeNotes ? `Reason: ${storeNotes}` : ''}`,
        type: "alert",
        metadata: {
          orderId: order._id,
          type: "regular_medicine_rejected",
          medicineName: order.medicineName
        }
      });
      await notification.save();
    } catch (notificationError) {
      console.error("❌ Failed to create rejection notification:", notificationError);
    }

    res.json({
      success: true,
      message: "Order rejected successfully",
      data: order
    });

  } catch (error) {
    console.error("❌ Error rejecting order:", error);
    res.status(500).json({
      success: false,
      message: "Error rejecting order",
      error: error.message
    });
  }
});

// Transfer order to another store
router.patch("/:orderId/transfer", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { targetStoreId, targetStoreName, transferReason } = req.body;

    const order = await RegularMedicineOrder.findByIdAndUpdate(
      orderId,
      {
        status: "transferred",
        transferredToStore: {
          storeId: targetStoreId,
          storeName: targetStoreName,
          transferDate: new Date(),
          transferReason
        },
        responseDate: new Date()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // 🔔 NOTIFICATION TO FARMER
    try {
      const notification = new Notification({
        userIds: [order.farmerId],
        title: "Order Transferred to Another Store",
        message: `Your order for ${order.medicineName} has been transferred to ${targetStoreName}. ${transferReason ? `Reason: ${transferReason}` : ''}`,
        type: "info",
        metadata: {
          orderId: order._id,
          type: "medicine_transferred",
          medicineName: order.medicineName,
          newStoreName: targetStoreName
        }
      });
      await notification.save();
    } catch (notificationError) {
      console.error("❌ Failed to create transfer notification:", notificationError);
    }

    res.json({
      success: true,
      message: "Order transferred successfully",
      data: order
    });

  } catch (error) {
    console.error("❌ Error transferring order:", error);
    res.status(500).json({
      success: false,
      message: "Error transferring order",
      error: error.message
    });
  }
});

export default router;