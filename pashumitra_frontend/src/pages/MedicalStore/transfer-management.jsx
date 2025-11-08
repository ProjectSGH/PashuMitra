"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Package,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
  User,
  Truck,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const filterTabs = [
  "All Transfers",
  "Incoming",
  "Outgoing",
  "Pending",
  "In Transit",
  "Completed",
];

export default function TransferManagement() {
  const [activeFilter, setActiveFilter] = useState("All Transfers");
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState(null);

  useEffect(() => {
    // Get store data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "MedicalStore") {
      setStoreData(user);
      fetchTransfers(user._id);
    }
  }, []);

  const fetchTransfers = async (storeId) => {
    try {
      setLoading(true);
      console.log("🔄 Fetching transfer requests...");

      // Fetch both incoming and outgoing transfers
      const [incomingResponse, outgoingResponse] = await Promise.all([
        axios.get(
          `http://localhost:5000/api/medicine-orders/transfers/incoming/${storeId}`
        ),
        axios.get(
          `http://localhost:5000/api/medicine-orders/transfers/outgoing/${storeId}`
        ),
      ]);

      console.log("📦 Incoming transfers:", incomingResponse.data);
      console.log("📤 Outgoing transfers:", outgoingResponse.data);

      // Combine and format transfers
      const incomingTransfers =
        incomingResponse.data.data?.map((transfer) => ({
          id: transfer._id,
          type: "incoming",
          from: transfer.originalStore?.storeName || "Unknown Store",
          fromStoreId: transfer.originalStore?._id,
          to: null,
          status: getTransferStatus(transfer),
          medicine: transfer.medicineName,
          quantity: `${transfer.quantityRequested} units`,
          distance: "Calculating...",
          requestDate: new Date(
            transfer.transferDate || transfer.createdAt
          ).toLocaleDateString(),
          estimatedDelivery: transfer.expectedDeliveryDate
            ? new Date(transfer.expectedDeliveryDate).toLocaleDateString()
            : null,
          farmerDetails: transfer.farmerDetails,
          farmerContact: transfer.farmerContact,
          transferReason: transfer.transferReason,
          originalData: transfer,
          orderType: transfer.orderType || "regular", // regular or community
        })) || [];

      const outgoingTransfers =
        outgoingResponse.data.data?.map((transfer) => ({
          id: transfer._id,
          type: "outgoing",
          from: null,
          to: transfer.transferredToStore?.storeName || "Unknown Store",
          toStoreId: transfer.transferredToStore?._id,
          status: getTransferStatus(transfer),
          medicine: transfer.medicineName,
          quantity: `${transfer.quantityRequested} units`,
          distance: "Calculating...",
          requestDate: new Date(
            transfer.transferDate || transfer.createdAt
          ).toLocaleDateString(),
          estimatedDelivery: transfer.expectedDeliveryDate
            ? new Date(transfer.expectedDeliveryDate).toLocaleDateString()
            : null,
          farmerDetails: transfer.farmerDetails,
          farmerContact: transfer.farmerContact,
          transferReason: transfer.transferReason,
          originalData: transfer,
          orderType: transfer.orderType || "regular",
        })) || [];

      const allTransfers = [...incomingTransfers, ...outgoingTransfers];
      console.log("✅ All transfers:", allTransfers);
      setTransfers(allTransfers);
    } catch (error) {
      console.error("❌ Error fetching transfers:", error);
      toast.error("Failed to load transfer requests");
      // Fallback to mock data if API fails
      setTransfers(getMockTransfers());
    } finally {
      setLoading(false);
    }
  };

  const getTransferStatus = (transfer) => {
    if (transfer.status === "transferred") return "pending";
    if (transfer.status === "approved" || transfer.status === "accepted")
      return "in-transit";
    if (transfer.status === "completed") return "completed";
    if (transfer.status === "rejected") return "rejected";
    return "pending";
  };

  const getMockTransfers = () => [
    {
      id: 1,
      type: "incoming",
      from: "City Medical Store",
      fromStoreId: "store1",
      to: null,
      status: "pending",
      medicine: "Paracetamol",
      quantity: "100 units",
      distance: "25 km",
      requestDate: new Date().toLocaleDateString(),
      estimatedDelivery: new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toLocaleDateString(),
      farmerDetails: {
        name: "John Farmer",
        phone: "+1234567890",
        address: "123 Farm Road, Agricultural Zone",
      },
      transferReason: "Out of stock at original store",
      orderType: "regular",
    },
    {
      id: 2,
      type: "outgoing",
      from: null,
      to: "Rural Health Pharmacy",
      toStoreId: "store2",
      status: "in-transit",
      medicine: "Antibiotics",
      quantity: "50 units",
      distance: "18 km",
      requestDate: new Date().toLocaleDateString(),
      estimatedDelivery: new Date(
        Date.now() + 48 * 60 * 60 * 1000
      ).toLocaleDateString(),
      farmerDetails: {
        name: "Jane Farmer",
        phone: "+0987654321",
        address: "456 Rural Lane, Countryside",
      },
      transferReason: "Specialized medicine required",
      orderType: "community",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "in-transit":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const handleApprove = async (transferId) => {
    try {
      console.log("✅ Approving transfer:", transferId);

      // Find the transfer to get its type
      const transfer = transfers.find((t) => t.id === transferId);
      if (!transfer) return;

      const endpoint =
        transfer.orderType === "community"
          ? `http://localhost:5000/api/community-medicine-orders/${transferId}/accept-transfer`
          : `http://localhost:5000/api/medicine-orders/${transferId}/accept-transfer`;

      // Get current store data
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || user.role !== "MedicalStore") {
        toast.error("Store authentication required");
        return;
      }

      const response = await axios.patch(
        endpoint,
        {
          storeNotes: "Transfer accepted successfully",
        },
        {
          headers: {
            "store-id": user._id, // Send store ID in headers
          },
        }
      );

      if (response.data.success) {
        toast.success("Transfer accepted!");
        // Refresh transfers
        if (storeData) {
          fetchTransfers(storeData._id);
        }
      }
    } catch (error) {
      console.error("❌ Error approving transfer:", error);
      toast.error(error.response?.data?.message || "Failed to accept transfer");
    }
  };

  const handleReject = async (transferId) => {
    try {
      console.log("❌ Rejecting transfer:", transferId);

      const transfer = transfers.find((t) => t.id === transferId);
      if (!transfer) return;

      const endpoint =
        transfer.orderType === "community"
          ? `http://localhost:5000/api/community-medicine-orders/${transferId}/reject-transfer`
          : `http://localhost:5000/api/medicine-orders/${transferId}/reject-transfer`;

      const response = await axios.patch(endpoint, {
        storeNotes: "Transfer rejected by store",
      });

      if (response.data.success) {
        toast.success("Transfer rejected!");
        if (storeData) {
          fetchTransfers(storeData._id);
        }
      }
    } catch (error) {
      console.error("❌ Error rejecting transfer:", error);
      toast.error(error.response?.data?.message || "Failed to reject transfer");
    }
  };

  const handleComplete = async (transferId) => {
    try {
      console.log("🏁 Completing transfer:", transferId);

      const transfer = transfers.find((t) => t.id === transferId);
      if (!transfer) return;

      const endpoint =
        transfer.orderType === "community"
          ? `http://localhost:5000/api/community-medicine-orders/${transferId}/complete`
          : `http://localhost:5000/api/medicine-orders/${transferId}/complete`;

      const response = await axios.patch(endpoint, {
        storeNotes: "Transfer completed successfully",
      });

      if (response.data.success) {
        toast.success("Transfer completed!");
        if (storeData) {
          fetchTransfers(storeData._id);
        }
      }
    } catch (error) {
      console.error("❌ Error completing transfer:", error);
      toast.error(
        error.response?.data?.message || "Failed to complete transfer"
      );
    }
  };

  const filteredTransfers = transfers.filter((transfer) => {
    if (activeFilter === "All Transfers") return true;
    if (activeFilter === "Incoming") return transfer.type === "incoming";
    if (activeFilter === "Outgoing") return transfer.type === "outgoing";
    if (activeFilter === "Pending") return transfer.status === "pending";
    if (activeFilter === "In Transit") return transfer.status === "in-transit";
    if (activeFilter === "Completed") return transfer.status === "completed";
    return true;
  });

  // Calculate summary stats
  const pendingCount = transfers.filter((t) => t.status === "pending").length;
  const inTransitCount = transfers.filter(
    (t) => t.status === "in-transit"
  ).length;
  const completedCount = transfers.filter(
    (t) => t.status === "completed"
  ).length;
  const incomingCount = transfers.filter((t) => t.type === "incoming").length;
  const outgoingCount = transfers.filter((t) => t.type === "outgoing").length;

  const handleContactFarmer = (farmerContact, farmerName) => {
    if (farmerContact && farmerContact !== "Contact not available") {
      window.open(`tel:${farmerContact}`);
    } else {
      toast.error(`Contact information not available for ${farmerName}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0"
          >
            Transfer Management
          </motion.h1>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex gap-1 bg-white rounded-lg p-1 shadow-sm border flex-wrap"
          >
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  activeFilter === tab
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Transfers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {transfers.length}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Truck className="text-blue-600" size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Incoming</p>
                <p className="text-2xl font-bold text-gray-900">
                  {incomingCount}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <ArrowLeft className="text-green-600" size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Outgoing</p>
                <p className="text-2xl font-bold text-gray-900">
                  {outgoingCount}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <ArrowRight className="text-blue-600" size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pendingCount}
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="text-yellow-600" size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {completedCount}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600" size={20} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Transfer Requests */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Transfer Requests ({filteredTransfers.length})
          </h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading transfers...</span>
          </div>
        )}

        {/* Transfers List */}
        {!loading && (
          <div className="space-y-4">
            {filteredTransfers.map((transfer, index) => (
              <motion.div
                key={transfer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Direction Arrow */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transfer.type === "incoming"
                          ? "bg-green-100"
                          : "bg-blue-100"
                      }`}
                    >
                      {transfer.type === "incoming" ? (
                        <ArrowLeft className="text-green-600" size={24} />
                      ) : (
                        <ArrowRight className="text-blue-600" size={24} />
                      )}
                    </div>

                    {/* Transfer Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h3 className="font-medium text-gray-900">
                          {transfer.type === "incoming"
                            ? `From ${transfer.from}`
                            : `To ${transfer.to}`}
                        </h3>
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                            transfer.status
                          )}`}
                        >
                          {transfer.status.charAt(0).toUpperCase() +
                            transfer.status.slice(1)}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            transfer.orderType === "community"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {transfer.orderType === "community"
                            ? "Community"
                            : "Regular"}
                        </span>
                      </div>

                      {/* Medicine and Quantity */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <Package size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">
                            <strong>Medicine:</strong> {transfer.medicine}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Quantity:</strong> {transfer.quantity}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Request Date:</strong> {transfer.requestDate}
                        </div>
                        {transfer.estimatedDelivery && (
                          <div className="text-sm text-gray-600">
                            <strong>Est. Delivery:</strong>{" "}
                            {transfer.estimatedDelivery}
                          </div>
                        )}
                      </div>

                      {/* Farmer Details */}
                      {transfer.farmerDetails && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <User size={16} className="text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                              Farmer Details
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div>
                              <strong>Name:</strong>{" "}
                              {transfer.farmerDetails.name || "Not specified"}
                            </div>
                            <div>
                              <strong>Contact:</strong>{" "}
                              {transfer.farmerContact || "Not available"}
                            </div>
                            {transfer.farmerDetails.address && (
                              <div className="md:col-span-2 flex items-start gap-2">
                                <MapPin
                                  size={16}
                                  className="text-gray-400 mt-0.5"
                                />
                                <span>{transfer.farmerDetails.address}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Transfer Reason */}
                      {transfer.transferReason && (
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-sm text-blue-700">
                            <strong>Transfer Reason:</strong>{" "}
                            {transfer.transferReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:items-end">
                    {transfer.status === "pending" &&
                    transfer.type === "incoming" ? (
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleApprove(transfer.id)}
                          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle size={16} />
                          Accept
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReject(transfer.id)}
                          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </motion.button>
                      </div>
                    ) : transfer.status === "in-transit" &&
                      transfer.type === "incoming" ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleComplete(transfer.id)}
                        className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                      >
                        <CheckCircle size={16} />
                        Mark Complete
                      </motion.button>
                    ) : (
                      <div className="flex items-center gap-2">
                        {transfer.status === "completed" ? (
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="text-green-600" size={20} />
                          </div>
                        ) : transfer.status === "in-transit" ? (
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Package className="text-blue-600" size={20} />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Clock className="text-yellow-600" size={20} />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Contact Farmer Button */}
                    {transfer.farmerContact && (
                      <button
                        onClick={() =>
                          handleContactFarmer(
                            transfer.farmerContact,
                            transfer.farmerDetails?.name
                          )
                        }
                        className="flex items-center gap-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors"
                      >
                        <Phone size={16} />
                        Contact Farmer
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredTransfers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-500"
          >
            <Truck size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No transfers found</p>
            <p className="text-gray-600">
              {activeFilter !== "All Transfers"
                ? "Try changing your filters to see more transfers"
                : "No transfer requests available at the moment"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
