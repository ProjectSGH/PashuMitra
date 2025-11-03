// services/notificationService.js
import Notification from "../models/Common/notificationModel.js";

export class NotificationService {
  // Create notification for store when farmer places order
  static async createMedicineOrderNotification(orderData) {
    try {
      const { storeId, farmerName, medicineName, quantityRequested, _id: orderId } = orderData;

      const notification = new Notification({
        userIds: [storeId], // Notify the store
        title: "New Medicine Order Request",
        message: `Farmer ${farmerName} has requested ${quantityRequested} unit(s) of ${medicineName}. Please review the order.`,
        type: "important",
        metadata: {
          orderId: orderId,
          type: "medicine_order",
          farmerName: farmerName,
          medicineName: medicineName,
          quantity: quantityRequested
        }
      });

      await notification.save();
      console.log("✅ Medicine order notification created for store:", storeId);
      return notification;
    } catch (error) {
      console.error("❌ Error creating medicine order notification:", error);
      throw error;
    }
  }

  // Create notification for farmer when store approves order
  static async createOrderApprovedNotification(orderData) {
    try {
      const { farmerId, storeId, medicineName, storeNotes } = orderData;

      const storeProfile = await mongoose.model("Store_User").findOne({ userId: storeId });
      const storeName = storeProfile ? storeProfile.storeName : "Medical Store";

      const notification = new Notification({
        userIds: [farmerId],
        title: "Medicine Order Approved",
        message: `Your order for ${medicineName} has been approved by ${storeName}. ${storeNotes ? `Store notes: ${storeNotes}` : 'Please contact the store for pickup.'}`,
        type: "info",
        metadata: {
          orderId: orderData._id,
          type: "medicine_approved",
          storeName: storeName,
          medicineName: medicineName
        }
      });

      await notification.save();
      console.log("✅ Order approved notification created for farmer:", farmerId);
      return notification;
    } catch (error) {
      console.error("❌ Error creating order approved notification:", error);
      throw error;
    }
  }

  // Create notification for farmer when store rejects order
  static async createOrderRejectedNotification(orderData) {
    try {
      const { farmerId, storeId, medicineName, storeNotes } = orderData;

      const storeProfile = await mongoose.model("Store_User").findOne({ userId: storeId });
      const storeName = storeProfile ? storeProfile.storeName : "Medical Store";

      const notification = new Notification({
        userIds: [farmerId],
        title: "Medicine Order Rejected",
        message: `Your order for ${medicineName} has been rejected by ${storeName}. ${storeNotes ? `Reason: ${storeNotes}` : 'Please contact the store for more information.'}`,
        type: "alert",
        metadata: {
          orderId: orderData._id,
          type: "medicine_rejected", 
          storeName: storeName,
          medicineName: medicineName
        }
      });

      await notification.save();
      console.log("✅ Order rejected notification created for farmer:", farmerId);
      return notification;
    } catch (error) {
      console.error("❌ Error creating order rejected notification:", error);
      throw error;
    }
  }

  // Create notification for farmer when order is completed
  static async createOrderCompletedNotification(orderData) {
    try {
      const { farmerId, storeId, medicineName } = orderData;

      const storeProfile = await mongoose.model("Store_User").findOne({ userId: storeId });
      const storeName = storeProfile ? storeProfile.storeName : "Medical Store";

      const notification = new Notification({
        userIds: [farmerId],
        title: "Medicine Order Completed",
        message: `Your order for ${medicineName} has been marked as completed by ${storeName}. Thank you for using our service!`,
        type: "info",
        metadata: {
          orderId: orderData._id,
          type: "medicine_completed",
          storeName: storeName,
          medicineName: medicineName
        }
      });

      await notification.save();
      console.log("✅ Order completed notification created for farmer:", farmerId);
      return notification;
    } catch (error) {
      console.error("❌ Error creating order completed notification:", error);
      throw error;
    }
  }
}