// routes/MedicalStore/regularMedicineOrderRoutes.js
import express from "express";
import mongoose from "mongoose";
import RegularMedicineOrder from "../../models/MedicalStore/MedicineOrder.js";
import Medicine from "../../models/MedicalStore/Medicine.js";
import Notification from "../../models/Common/notificationModel.js";

const router = express.Router();

// Create regular medicine order
router.post("/", async (req, res) => {
  try {
    const {
      medicineId,
      storeId,
      farmerId,
      farmerName,
      farmerContact,
      farmerLocation,
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

    console.log("📦 Creating regular medicine order:", { medicineId, storeId, farmerId });

    // Validate required fields
    if (!medicineId || !storeId || !farmerId || !farmerName || !farmerContact || !animalType || !animalCount || !quantityRequested) {
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
      animalType,
      animalCount,
      animalWeight,
      animalAge,
      symptoms,
      medicineName: medicine.name,
      quantityRequested,
      totalPrice,
      deliveryOption,
      deliveryAddress,
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
      console.log("🔔 Notification created for store");
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

// Get orders for store
router.get("/store/:storeId", async (req, res) => {
  try {
    const { storeId } = req.params;
    const { status } = req.query;

    const filter = { storeId };
    if (status) filter.status = status;

    const orders = await RegularMedicineOrder.find(filter)
      .populate("medicineId", "name price manufacturer composition")
      .populate("farmerId", "name email phone location")
      .sort({ createdAt: -1 });

    res.json({
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

// Get orders for farmer
router.get("/farmer/:farmerId", async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { status } = req.query;

    const filter = { farmerId };
    if (status) filter.status = status;

    const orders = await RegularMedicineOrder.find(filter)
      .populate("medicineId", "name price manufacturer composition")
      .populate("storeId", "email")
      .populate("transferredToStore.storeId", "email")
      .sort({ createdAt: -1 });

    res.json({
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

export default router;