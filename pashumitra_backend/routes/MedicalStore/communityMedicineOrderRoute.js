// In communityMedicineOrderRoute.js - WITH ENHANCED VALIDATION & NOTIFICATIONS
import express from "express";
import mongoose from "mongoose";
import CommunityMedicineOrder from "../../models/MedicalStore/CommunityMedicineOrder.js";
import CommunityMedicine from "../../models/MedicalStore/CommunityMedicine.js";
import Notification from "../../models/Common/notificationModel.js";

const router = express.Router();

// Create medicine order with enhanced validation
router.post("/", async (req, res) => {
  try {
    const {
      medicineId,
      medicineName,
      farmerId,
      farmerName,
      farmerContact,
      farmerLocation,
      storeId,
      quantityRequested = 1,
      farmerNotes
    } = req.body;

    console.log("📦 Creating order with data:", req.body);

    // Enhanced validation
    if (!medicineId || !farmerId || !farmerName || !farmerContact || !storeId) {
      console.log("🔴 Missing required fields")
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missing: {
          medicineId: !medicineId,
          farmerId: !farmerId,
          farmerName: !farmerName,
          farmerContact: !farmerContact,
          storeId: !storeId
        }
      });
    }

    // Validate quantity
    if (!quantityRequested || quantityRequested < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1"
      });
    }

    // Check if medicine exists and is available
    console.log("🔍 Looking for medicine:", medicineId)
    const medicine = await CommunityMedicine.findById(medicineId);
    if (!medicine) {
      console.log("🔴 Medicine not found:", medicineId)
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    console.log("✅ Found medicine:", {
      id: medicine._id,
      name: medicine.medicineName,
      status: medicine.status,
      quantity: medicine.quantity,
      distributionLimit: medicine.distributionLimit,
      storeId: medicine.storeId
    });

    if (medicine.status !== "Available") {
      console.log("🔴 Medicine not available. Status:", medicine.status)
      return res.status(400).json({
        success: false,
        message: "Medicine is not available"
      });
    }

    // Check quantity availability
    if (quantityRequested > medicine.quantity) {
      console.log("🔴 Insufficient quantity. Requested:", quantityRequested, "Available:", medicine.quantity)
      return res.status(400).json({
        success: false,
        message: `Requested quantity exceeds available quantity. Available: ${medicine.quantity}`
      });
    }

    // Check distribution limit
    const distributionLimit = medicine.distributionLimit || 5;
    if (quantityRequested > distributionLimit) {
      console.log("🔴 Exceeds distribution limit. Requested:", quantityRequested, "Limit:", distributionLimit)
      return res.status(400).json({
        success: false,
        message: `Requested quantity exceeds distribution limit of ${distributionLimit} units per request`
      });
    }

    // Check if farmer has any pending requests for the same medicine
    const existingPendingRequest = await CommunityMedicineOrder.findOne({
      farmerId,
      medicineId,
      status: "pending"
    });

    if (existingPendingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending request for this medicine. Please wait for store response."
      });
    }

    // Validate store exists in User model
    console.log("🔍 Validating store in User model:", storeId)
    const storeUser = await mongoose.model("User").findById(storeId);
    if (!storeUser || storeUser.role !== "MedicalStore") {
      console.log("🔴 Store User not found or not a MedicalStore:", storeId)
      return res.status(400).json({
        success: false,
        message: "Store not found"
      });
    }
    console.log("✅ Store user validated:", storeUser.email)

    // Also get the store profile for reference
    const storeProfile = await mongoose.model("Store_User").findOne({ userId: storeId });
    if (storeProfile) {
      console.log("✅ Store profile found:", storeProfile.storeName);
    }

    // Create new order
    const newOrder = new CommunityMedicineOrder({
      medicineId,
      medicineName: medicineName || medicine.medicineName,
      farmerId,
      farmerName,
      farmerContact,
      farmerLocation,
      storeId,
      organizationName: medicine.organizationName,
      quantityRequested,
      farmerNotes: farmerNotes || `Requesting ${quantityRequested} unit(s) of ${medicine.medicineName}`,
      isFree: medicine.isFree
    });

    console.log("💾 Saving order to database...")
    const savedOrder = await newOrder.save();
    console.log("✅ Order created successfully:", savedOrder._id)

    // 🔔 CREATE NOTIFICATION FOR STORE
    try {
      const notification = new Notification({
        userIds: [storeId],
        title: "New Medicine Order Request",
        message: `Farmer ${farmerName} has requested ${quantityRequested} unit(s) of ${medicine.medicineName}. Please review the order.`,
        type: "medicine_order",
        metadata: {
          orderId: savedOrder._id,
          type: "medicine_order",
          farmerName: farmerName,
          medicineName: medicine.medicineName,
          quantity: quantityRequested,
          storeName: storeProfile?.storeName || "Medical Store"
        }
      });

      await notification.save();
      console.log("🔔 Notification created for store:", storeId);
    } catch (notificationError) {
      console.error("❌ Failed to create notification:", notificationError);
    }

    res.status(201).json({
      success: true,
      message: "Medicine order created successfully",
      data: savedOrder
    });

  } catch (error) {
    console.error("❌ Error creating medicine order:", error);
    res.status(500).json({
      success: false,
      message: "Error creating medicine order",
      error: error.message
    });
  }
});

// Approve medicine order with quantity validation - FIXED VERSION
router.patch("/:orderId/approve", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { storeNotes } = req.body;

    const order = await CommunityMedicineOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check medicine availability with quantity validation
    const medicine = await CommunityMedicine.findById(order.medicineId);
    if (!medicine || medicine.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: "Medicine is no longer available"
      });
    }

    // Validate quantity again before approval
    if (medicine.quantity < order.quantityRequested) {
      return res.status(400).json({
        success: false,
        message: `Insufficient medicine quantity. Available: ${medicine.quantity}, Requested: ${order.quantityRequested}`
      });
    }

    // FIX: Use findByIdAndUpdate instead of direct save to avoid validation errors
    // Update medicine quantity without triggering full document validation
    const updatedMedicine = await CommunityMedicine.findByIdAndUpdate(
      order.medicineId,
      {
        $inc: { quantity: -order.quantityRequested },
        ...(medicine.quantity - order.quantityRequested === 0 && { status: "Distributed" })
      },
      { 
        new: true,
        runValidators: false // Skip validation for required fields during quantity update
      }
    );

    // Alternative approach: If you want to keep validation, ensure all required fields are present
    // medicine.quantity -= order.quantityRequested;
    // if (medicine.quantity === 0) {
    //   medicine.status = "Distributed";
    // }
    // await medicine.save({ validateModifiedOnly: true }); // Only validate modified fields

    // Update order status
    order.status = "approved";
    order.responseDate = new Date();
    if (storeNotes) order.storeNotes = storeNotes;

    const updatedOrder = await order.save();

    // 🔔 CREATE NOTIFICATION FOR FARMER (Order Approved)
    try {
      const storeProfile = await mongoose.model("Store_User").findOne({ userId: order.storeId });
      const storeName = storeProfile?.storeName || "Medical Store";

      const notification = new Notification({
        userIds: [order.farmerId],
        title: "Medicine Order Approved",
        message: `Your order for ${order.quantityRequested} unit(s) of ${order.medicineName} has been approved by ${storeName}. ${storeNotes ? `Store notes: ${storeNotes}` : 'Please contact the store for pickup.'}`,
        type: "important",
        metadata: {
          orderId: updatedOrder._id,
          type: "medicine_approved",
          farmerName: order.farmerName,
          medicineName: order.medicineName,
          quantity: order.quantityRequested,
          storeName: storeName
        }
      });

      await notification.save();
      console.log("🔔 Order approval notification sent to farmer:", order.farmerId);
    } catch (notificationError) {
      console.error("❌ Failed to create approval notification:", notificationError);
    }

    res.json({
      success: true,
      message: `Order for ${order.quantityRequested} unit(s) approved successfully`,
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

// Reject medicine order with notification to farmer
router.patch("/:orderId/reject", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { storeNotes } = req.body;

    const order = await CommunityMedicineOrder.findByIdAndUpdate(
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

    // 🔔 CREATE NOTIFICATION FOR FARMER (Order Rejected)
    try {
      const storeProfile = await mongoose.model("Store_User").findOne({ userId: order.storeId });
      const storeName = storeProfile?.storeName || "Medical Store";

      const notification = new Notification({
        userIds: [order.farmerId],
        title: "Medicine Order Rejected",
        message: `Your order for ${order.quantityRequested} unit(s) of ${order.medicineName} has been rejected by ${storeName}. ${storeNotes ? `Reason: ${storeNotes}` : 'Please contact the store for more information.'}`,
        type: "alert",
        metadata: {
          orderId: order._id,
          type: "medicine_rejected",
          farmerName: order.farmerName,
          medicineName: order.medicineName,
          quantity: order.quantityRequested,
          storeName: storeName
        }
      });

      await notification.save();
      console.log("🔔 Order rejection notification sent to farmer:", order.farmerId);
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

// Complete medicine order with notification to farmer
router.patch("/:orderId/complete", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { storeNotes } = req.body;

    const order = await CommunityMedicineOrder.findByIdAndUpdate(
      orderId,
      {
        status: "completed",
        completionDate: new Date(),
        storeNotes: storeNotes || order.storeNotes
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // 🔔 CREATE NOTIFICATION FOR FARMER (Order Completed)
    try {
      const storeProfile = await mongoose.model("Store_User").findOne({ userId: order.storeId });
      const storeName = storeProfile?.storeName || "Medical Store";

      const notification = new Notification({
        userIds: [order.farmerId],
        title: "Medicine Order Completed",
        message: `Your order for ${order.quantityRequested} unit(s) of ${order.medicineName} has been marked as completed by ${storeName}. Thank you for using our service!`,
        type: "info",
        metadata: {
          orderId: order._id,
          type: "medicine_completed",
          farmerName: order.farmerName,
          medicineName: order.medicineName,
          quantity: order.quantityRequested,
          storeName: storeName
        }
      });

      await notification.save();
      console.log("🔔 Order completion notification sent to farmer:", order.farmerId);
    } catch (notificationError) {
      console.error("❌ Failed to create completion notification:", notificationError);
    }

    res.json({
      success: true,
      message: "Order marked as completed",
      data: order
    });

  } catch (error) {
    console.error("❌ Error completing order:", error);
    res.status(500).json({
      success: false,
      message: "Error completing order",
      error: error.message
    });
  }
});

// Get store orders with enhanced filtering
router.get("/store/:storeId", async (req, res) => {
  try {
    const { storeId } = req.params;
    const { status } = req.query;

    console.log("🔍 Fetching orders for store:", storeId, "status:", status);

    const filter = { storeId };
    if (status) filter.status = status;

    const orders = await CommunityMedicineOrder.find(filter)
      .populate("medicineId", "medicineName manufacturer composition expiryDate quantity status distributionLimit")
      .populate("farmerId", "name email phone location")
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${orders.length} orders for store ${storeId}`);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
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

// Get farmer orders with enhanced filtering
router.get("/farmer/:farmerId", async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { status, medicineId } = req.query;

    const filter = { farmerId };
    if (status) filter.status = status;
    if (medicineId) filter.medicineId = medicineId;

    const orders = await CommunityMedicineOrder.find(filter)
      .populate("medicineId", "medicineName manufacturer composition expiryDate quantity distributionLimit")
      .populate("storeId", "email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });

  } catch (error) {
    console.error("❌ Error fetching farmer orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message
    });
  }
});

// Get single order by ID
router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await CommunityMedicineOrder.findById(orderId)
      .populate("medicineId", "medicineName manufacturer composition expiryDate quantity distributionLimit")
      .populate("farmerId", "name email phone location")
      .populate("storeId", "email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error("❌ Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message
    });
  }
});

// Get all orders (for admin purposes)
router.get("/", async (req, res) => {
  try {
    const { status, storeId, farmerId } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (storeId) filter.storeId = storeId;
    if (farmerId) filter.farmerId = farmerId;

    const orders = await CommunityMedicineOrder.find(filter)
      .populate("medicineId", "medicineName manufacturer composition quantity distributionLimit")
      .populate("farmerId", "name email phone")
      .populate("storeId", "email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });

  } catch (error) {
    console.error("❌ Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message
    });
  }
});

// Cancel medicine order (farmer can cancel pending orders)
router.patch("/:orderId/cancel", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { farmerNotes } = req.body;

    const order = await CommunityMedicineOrder.findByIdAndUpdate(
      orderId,
      {
        status: "cancelled",
        responseDate: new Date(),
        farmerNotes: farmerNotes || order.farmerNotes
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // 🔔 CREATE NOTIFICATION FOR STORE (Order Cancelled)
    try {
      const storeProfile = await mongoose.model("Store_User").findOne({ userId: order.storeId });
      const storeName = storeProfile?.storeName || "Medical Store";

      const notification = new Notification({
        userIds: [order.storeId],
        title: "Medicine Order Cancelled",
        message: `Farmer ${order.farmerName} has cancelled their order for ${order.quantityRequested} unit(s) of ${order.medicineName}.`,
        type: "info",
        metadata: {
          orderId: order._id,
          type: "medicine_cancelled",
          farmerName: order.farmerName,
          medicineName: order.medicineName,
          quantity: order.quantityRequested,
          storeName: storeName
        }
      });

      await notification.save();
      console.log("🔔 Order cancellation notification sent to store:", order.storeId);
    } catch (notificationError) {
      console.error("❌ Failed to create cancellation notification:", notificationError);
    }

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order
    });

  } catch (error) {
    console.error("❌ Error cancelling order:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message
    });
  }
});

// Get order statistics for dashboard
router.get("/stats/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.query;

    let stats = {};

    if (role === "Farmer") {
      // Farmer statistics
      const totalOrders = await CommunityMedicineOrder.countDocuments({ farmerId: userId });
      const pendingOrders = await CommunityMedicineOrder.countDocuments({ 
        farmerId: userId, 
        status: "pending" 
      });
      const approvedOrders = await CommunityMedicineOrder.countDocuments({ 
        farmerId: userId, 
        status: "approved" 
      });
      const completedOrders = await CommunityMedicineOrder.countDocuments({ 
        farmerId: userId, 
        status: "completed" 
      });

      stats = {
        totalOrders,
        pendingOrders,
        approvedOrders,
        completedOrders,
        successRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
      };
    } else if (role === "MedicalStore") {
      // Store statistics
      const totalOrders = await CommunityMedicineOrder.countDocuments({ storeId: userId });
      const pendingOrders = await CommunityMedicineOrder.countDocuments({ 
        storeId: userId, 
        status: "pending" 
      });
      const approvedOrders = await CommunityMedicineOrder.countDocuments({ 
        storeId: userId, 
        status: "approved" 
      });
      const completedOrders = await CommunityMedicineOrder.countDocuments({ 
        storeId: userId, 
        status: "completed" 
      });

      // Get total medicines distributed
      const distributedResult = await CommunityMedicineOrder.aggregate([
        { $match: { storeId: new mongoose.Types.ObjectId(userId), status: "completed" } },
        { $group: { _id: null, totalDistributed: { $sum: "$quantityRequested" } } }
      ]);

      stats = {
        totalOrders,
        pendingOrders,
        approvedOrders,
        completedOrders,
        totalMedicinesDistributed: distributedResult[0]?.totalDistributed || 0,
        completionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
      };
    }

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error("❌ Error fetching order statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: error.message
    });
  }
});

export default router;