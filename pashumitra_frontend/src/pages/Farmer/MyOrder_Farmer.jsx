"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Calendar,
  MapPin,
  User,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  Phone,
  Mail,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const statusConfig = {
  pending: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
    label: "Pending",
    description: "Waiting for store approval",
  },
  approved: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle,
    label: "Approved",
    description: "Order approved by store",
  },
  rejected: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
    label: "Rejected",
    description: "Order rejected by store",
  },
  completed: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
    label: "Completed",
    description: "Order completed successfully",
  },
  cancelled: {
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: XCircle,
    label: "Cancelled",
    description: "Order cancelled",
  },
};

// Define filterTabs BEFORE the component
const filterTabs = ["All", "Community", "Regular", "Pending", "Approved", "Completed"];

export default function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [farmerData, setFarmerData] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "Farmer") {
      setFarmerData(user);
      fetchOrders(user._id);
    }
  }, []);

  const fetchOrders = async (farmerId) => {
    try {
      setLoading(true);

      // Fetch community medicine orders
      const communityResponse = await axios.get(
        `http://localhost:5000/api/community-medicine-orders/farmer/${farmerId}`
      );
      
      // Fetch regular medicine orders - CORRECTED ENDPOINT
      const regularResponse = await axios.get(
        `http://localhost:5000/api/regular-medicine-orders/farmer/${farmerId}`
      );

      const communityOrders = (communityResponse.data.data || []).map(
        (order) => ({
          ...order,
          orderType: "community",
          id: order._id,
        })
      );

      const regularOrders = (regularResponse.data.data || []).map((order) => ({
        ...order,
        orderType: "regular",
        id: order._id,
      }));

      setOrders([...communityOrders, ...regularOrders]);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    return statusConfig[status] || statusConfig.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleContactStore = (order) => {
    // In a real app, you might have store contact info
    toast.success(`Contact store for order #${order._id.slice(-6)}`);
  };

  const handleCancelOrder = async (orderId, orderType) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      const endpoint = orderType === "community" 
        ? `http://localhost:5000/api/community-medicine-orders/${orderId}/cancel`
        : `http://localhost:5000/api/regular-medicine-orders/${orderId}/cancel`;

      const response = await axios.patch(
        endpoint,
        { farmerNotes: "Cancelled by farmer" }
      );

      if (response.data.success) {
        toast.success("Order cancelled successfully");
        if (farmerData) {
          fetchOrders(farmerData._id);
        }
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    }
  };

  // CORRECTED FILTERING LOGIC
  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "All") return true;
    
    switch (activeFilter) {
      case "Community":
        return order.orderType === "community";
      case "Regular":
        return order.orderType === "regular";
      case "Pending":
        return order.status === "pending";
      case "Approved":
        return order.status === "approved";
      case "Completed":
        return order.status === "completed";
      default:
        return true;
    }
  });

  if (!farmerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            Please login as a farmer to view your orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                My Medicine Orders
              </h1>
              <p className="text-gray-600">
                Track and manage your medicine requests
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>Welcome, {farmerData.name || farmerData.email}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2"
        >
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === tab
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Orders List */}
        {!loading && (
          <div className="space-y-6">
            {filteredOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white rounded-lg shadow-sm"
              >
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No Orders Found
                </h3>
                <p className="text-gray-500 mb-4">
                  {activeFilter === "All"
                    ? "You haven't placed any orders yet."
                    : `No ${activeFilter.toLowerCase()} orders found.`}
                </p>
                {activeFilter !== "All" && (
                  <button
                    onClick={() => setActiveFilter("All")}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all orders
                  </button>
                )}
              </motion.div>
            ) : (
              filteredOrders.map((order, index) => {
                const statusInfo = getStatusConfig(order.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {order.medicineName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Order # {order._id.slice(-8).toUpperCase()}
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                order.orderType === "community" 
                                  ? "bg-purple-100 text-purple-800" 
                                  : "bg-blue-100 text-blue-800"
                              }`}>
                                {order.orderType === "community" ? "Community" : "Regular"}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2 ${statusInfo.color}`}
                          >
                            <StatusIcon className="w-4 h-4" />
                            {statusInfo.label}
                          </span>
                          {order.isFree && (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200">
                              🎁 Free Medicine
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {/* Medicine Details */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Medicine Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Quantity:</span>
                              <span className="font-medium">
                                {order.quantityRequested} units
                              </span>
                            </div>
                            {order.medicineId?.manufacturer && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Manufacturer:
                                </span>
                                <span className="font-medium">
                                  {order.medicineId.manufacturer}
                                </span>
                              </div>
                            )}
                            {order.medicineId?.composition && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Composition:
                                </span>
                                <span className="font-medium">
                                  {order.medicineId.composition}
                                </span>
                              </div>
                            )}
                            {order.medicineId?.expiryDate && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Expiry Date:
                                </span>
                                <span className="font-medium">
                                  {new Date(
                                    order.medicineId.expiryDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            {/* Show price for regular orders */}
                            {order.orderType === "regular" && order.totalPrice && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Total Price:</span>
                                <span className="font-medium text-green-600">
                                  ₹{order.totalPrice}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Store & Timing */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            Store Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Store:</span>
                              <span className="font-medium">
                                {order.storeId?.email || "Medical Store"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Organization:
                              </span>
                              <span className="font-medium">
                                {order.organizationName || "Community Bank"}
                              </span>
                            </div>
                            {order.farmerLocation && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Your Location:
                                </span>
                                <span className="font-medium">
                                  {order.farmerLocation}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Order Timeline
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Order Date:</span>
                              <span className="font-medium">
                                {formatDate(order.requestDate)}
                              </span>
                            </div>
                            {order.responseDate && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Response Date:
                                </span>
                                <span className="font-medium">
                                  {formatDate(order.responseDate)}
                                </span>
                              </div>
                            )}
                            {order.completionDate && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Completed Date:
                                </span>
                                <span className="font-medium">
                                  {formatDate(order.completionDate)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Animal Details for Regular Orders */}
                      {order.orderType === "regular" && order.animalType && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            Animal Details
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Animal Type:</span>
                              <p className="font-medium">{order.animalType}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Count:</span>
                              <p className="font-medium">{order.animalCount} animals</p>
                            </div>
                            {order.animalWeight && (
                              <div>
                                <span className="text-gray-600">Weight:</span>
                                <p className="font-medium">{order.animalWeight} kg</p>
                              </div>
                            )}
                            {order.animalAge && (
                              <div>
                                <span className="text-gray-600">Age:</span>
                                <p className="font-medium">{order.animalAge}</p>
                              </div>
                            )}
                          </div>
                          {order.symptoms && (
                            <div className="mt-3">
                              <span className="text-gray-600">Symptoms:</span>
                              <p className="font-medium mt-1">{order.symptoms}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Notes Section */}
                      {(order.farmerNotes || order.storeNotes) && (
                        <div className="border-t pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {order.farmerNotes && (
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">
                                  Your Notes:
                                </h5>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                  {order.farmerNotes}
                                </p>
                              </div>
                            )}
                            {order.storeNotes && (
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">
                                  Store Response:
                                </h5>
                                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                                  {order.storeNotes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
                        {order.status === "pending" && (
                          <button
                            onClick={() => handleCancelOrder(order._id, order.orderType)}
                            className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                          >
                            Cancel Order
                          </button>
                        )}

                        <button
                          onClick={() => handleContactStore(order)}
                          className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium flex items-center gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          Contact Store
                        </button>

                        {order.status === "approved" && (
                          <button
                            onClick={() => handleContactStore(order)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                          >
                            <Truck className="w-4 h-4" />
                            Arrange Pickup
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* Statistics */}
        {!loading && orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {orders.length}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter((o) => o.status === "pending").length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {orders.filter((o) => o.status === "approved").length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter((o) => o.status === "completed").length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}