"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  User,
  Package,
  Building,
  Mail,
  Shield,
  Search,
  Plus,
  X,
  Clock,
  ShoppingCart,
  Phone,
  AlertCircle,
  Minus,
} from "lucide-react";
import toast from "react-hot-toast";

export default function CommunityMedicineBank() {
  const [activeTab, setActiveTab] = useState("available");
  const [storeData, setStoreData] = useState(null);
  const [farmerData, setFarmerData] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [quantityModal, setQuantityModal] = useState(false);
  const [requestQuantity, setRequestQuantity] = useState(1);
  const [farmerNotes, setFarmerNotes] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      if (user.role === "MedicalStore") {
        setStoreData(user);
        console.log("🏪 Store user data loaded:", user);
      } else if (user.role === "Farmer") {
        setFarmerData(user);
        console.log("👨‍🌾 Farmer user data loaded:", user);
      }
    }

    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/community-medicines?status=Available&verified=true"
      );
      setMedicines(res.data.data || []);
    } catch (err) {
      console.error("Error fetching medicines:", err);
      toast.error("Failed to load medicines");
    } finally {
      setLoading(false);
    }
  };

  const openQuantityModal = (medicine) => {
    if (!farmerData) {
      toast.error("Please login as a farmer to request medicines");
      return;
    }

    setSelectedMedicine(medicine);
    setRequestQuantity(1);
    setFarmerNotes("");
    setQuantityModal(true);
  };

  const closeQuantityModal = () => {
    setQuantityModal(false);
    setSelectedMedicine(null);
    setRequestQuantity(1);
    setFarmerNotes("");
  };

  const handleQuantityChange = (change) => {
    if (!selectedMedicine) return;

    const newQuantity = requestQuantity + change;
    
    // Validate against available quantity
    if (newQuantity < 1) return;
    if (newQuantity > selectedMedicine.quantity) {
      toast.error(`Cannot request more than available quantity (${selectedMedicine.quantity})`);
      return;
    }
    
    // Validate against distribution limit
    const distributionLimit = selectedMedicine.distributionLimit || 5;
    if (newQuantity > distributionLimit) {
      toast.error(`Maximum ${distributionLimit} units allowed per request`);
      return;
    }

    setRequestQuantity(newQuantity);
  };

  const handleRequestMedicine = async () => {
    if (!farmerData || !selectedMedicine) {
      toast.error("Please login as a farmer to request medicines");
      return;
    }

    try {
      setOrderLoading(selectedMedicine._id);

      console.log("🟡 Starting medicine request for:", selectedMedicine._id);

      // Extract store ID properly
      let storeId;
      if (selectedMedicine.storeId && selectedMedicine.storeId._id) {
        storeId = selectedMedicine.storeId._id;
      } else if (selectedMedicine.storeId && typeof selectedMedicine.storeId === "string") {
        storeId = selectedMedicine.storeId;
      } else {
        // If storeId is not properly populated, fetch fresh data
        const medicineResponse = await axios.get(
          `http://localhost:5000/api/community-medicines/${selectedMedicine._id}`
        );
        const freshMedicine = medicineResponse.data.data;
        storeId = freshMedicine.storeId;
      }

      if (!storeId) {
        toast.error("Cannot place order: Store information is missing.");
        return;
      }

      const orderData = {
        medicineId: selectedMedicine._id,
        medicineName: selectedMedicine.medicineName,
        farmerId: farmerData._id,
        farmerName: farmerData.name || farmerData.email,
        farmerContact: farmerData.phone || "Not provided",
        farmerLocation: farmerData.location || "Not specified",
        storeId: storeId,
        quantityRequested: requestQuantity,
        farmerNotes: farmerNotes || `Requesting ${requestQuantity} unit(s) of ${selectedMedicine.medicineName} from community bank`,
        organizationName: selectedMedicine.organizationName,
      };

      console.log("📤 Sending order data:", orderData);

      const response = await axios.post(
        "http://localhost:5000/api/community-medicine-orders",
        orderData
      );

      if (response.data.success) {
        toast.success(
          `Medicine request for ${requestQuantity} unit(s) sent successfully! The store will contact you soon.`
        );
        fetchMedicines(); // Refresh the list
        closeQuantityModal();
      } else {
        toast.error(response.data.message || "Failed to request medicine");
      }
    } catch (err) {
      console.error("❌ Error requesting medicine:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to request medicine";
      toast.error(errorMessage);
    } finally {
      setOrderLoading(null);
    }
  };

  const handleContactDonor = (medicine) => {
    if (medicine.contactNumber || medicine.contactPerson) {
      const phoneNumber = medicine.contactNumber || medicine.contactPerson;
      window.open(`tel:${phoneNumber}`, "_self");
    } else {
      toast.error("Contact information not available");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Available: { color: "bg-green-100 text-green-800", label: "Available" },
      Distributed: { color: "bg-gray-100 text-gray-800", label: "Distributed" },
      Expired: { color: "bg-red-100 text-red-800", label: "Expired" },
      "New/Unopened": {
        color: "bg-green-100 text-green-800",
        label: "New/Unopened",
      },
      Good: { color: "bg-blue-100 text-blue-800", label: "Good" },
      Fair: { color: "bg-yellow-100 text-yellow-800", label: "Fair" },
    };
    return statusConfig[status] || statusConfig["Available"];
  };

  const getDistributionLimitText = (medicine) => {
    const limit = medicine.distributionLimit || 5;
    return `Max ${limit} units per request`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quantity Modal */}
      <AnimatePresence>
        {quantityModal && selectedMedicine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Request Medicine
                </h3>
                <button
                  onClick={closeQuantityModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Medicine:</p>
                <p className="font-medium text-gray-900">
                  {selectedMedicine.medicineName}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Available: {selectedMedicine.quantity} units
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {getDistributionLimitText(selectedMedicine)}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity Requested
                </label>
                <div className="flex items-center justify-between max-w-xs">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={requestQuantity <= 1}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-semibold mx-4 min-w-8 text-center">
                    {requestQuantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={requestQuantity >= Math.min(selectedMedicine.quantity, selectedMedicine.distributionLimit || 5)}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={farmerNotes}
                  onChange={(e) => setFarmerNotes(e.target.value)}
                  placeholder="Any special requirements or notes for the store..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeQuantityModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestMedicine}
                  disabled={orderLoading === selectedMedicine._id}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {orderLoading === selectedMedicine._id ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      Requesting...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Request {requestQuantity} Unit{requestQuantity > 1 ? 's' : ''}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-sm"
      >
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Community Medicine Bank
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Access donated medicines from verified medical stores. Request
            medicines you need for free.
          </p>

          {/* Farmer Welcome Message */}
          {farmerData ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto mb-4">
              <p className="text-green-800 text-sm">
                ✅{" "}
                <strong>Welcome, {farmerData.name || farmerData.email}!</strong>{" "}
                You can request available medicines below.
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto mb-4">
              <p className="text-yellow-800 text-sm">
                ⚠️ <strong>Please login as a farmer</strong> to request
                medicines from the community bank.
              </p>
            </div>
          )}

          {/* Navigation Tabs - Only Available Medicines for Farmers */}
          <div className="flex justify-center">
            <div className="bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("available")}
                className={`px-6 py-2 rounded-md transition-all duration-300 ${
                  activeTab === "available"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Available Medicines
              </button>
              <button
                onClick={() => {
                  toast.error("Only medical stores can donate medicines");
                }}
                className="px-6 py-2 rounded-md transition-all duration-300 text-gray-400 cursor-not-allowed"
                disabled
              >
                Donate Medicine
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "available" ? (
            <motion.div
              key="available"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : medicines.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Medicines Available
                  </h3>
                  <p className="text-gray-500">
                    Check back later for available community medicines.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {medicines.map((medicine, index) => {
                    const statusBadge = getStatusBadge(
                      medicine.status || medicine.condition
                    );

                    return (
                      <motion.div
                        key={medicine._id || medicine.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {medicine.medicineName || medicine.name}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}
                          >
                            {statusBadge.label}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Package className="w-4 h-4 mr-2" />
                            <span>
                              Type: {medicine.medicineType || medicine.type}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="font-medium">
                              Quantity: {medicine.quantity} units
                            </span>
                          </div>
                          {medicine.expiryDate && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>
                                Expires:{" "}
                                {new Date(
                                  medicine.expiryDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="w-4 h-4 mr-2" />
                            <span>
                              Organization:{" "}
                              {medicine.organizationName || medicine.donor}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>Location: {medicine.location}</span>
                          </div>
                          {medicine.storeId ? (
                            <div className="flex items-center text-sm text-gray-600">
                              <Building className="w-4 h-4 mr-2 text-purple-500" />
                              <span>
                                Store: {medicine.storeId.email}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center text-sm text-yellow-600">
                              <span>🔄 Store information loading...</span>
                            </div>
                          )}
                          {medicine.distributionLimit && (
                            <div className="flex items-center text-sm text-blue-600">
                              <span>📦 {getDistributionLimitText(medicine)}</span>
                            </div>
                          )}
                        </div>

                        {medicine.description && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-600">
                              {medicine.description}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => openQuantityModal(medicine)}
                            disabled={
                              orderLoading === (medicine._id || medicine.id) ||
                              (medicine.status &&
                                medicine.status !== "Available") ||
                              !farmerData
                            }
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {orderLoading === (medicine._id || medicine.id) ? (
                              <>
                                <Clock className="w-4 h-4 animate-spin" />
                                Requesting...
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-4 h-4" />
                                {!farmerData
                                  ? "Login to Request"
                                  : "Request Medicine"}
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleContactDonor(medicine)}
                            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200 text-sm font-medium flex items-center gap-2"
                          >
                            <Phone className="w-4 h-4" />
                            Contact
                          </button>
                        </div>

                        {medicine.isFree && (
                          <div className="mt-3 text-center">
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              🎁 Free Medicine
                            </span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Information Section */}
              <div className="mt-12 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  How It Works
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Browse Medicines
                    </h4>
                    <p className="text-sm text-gray-600">
                      View available community-donated medicines from verified
                      stores
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShoppingCart className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Request Medicine
                    </h4>
                    <p className="text-sm text-gray-600">
                      Choose quantity and send request for the medicine you need
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Phone className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Get Medicine
                    </h4>
                    <p className="text-sm text-gray-600">
                      The store will contact you to arrange pickup
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="donate"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-6">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Medicine Donation
                  </h2>
                  <p className="text-gray-600">
                    Only verified medical stores can donate medicines to the
                    community bank.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800 text-sm text-center">
                    🏥 <strong>Medical Store Owners:</strong> Please login with
                    your store account to donate medicines.
                  </p>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setActiveTab("available")}
                    className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Back to Available Medicines
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}