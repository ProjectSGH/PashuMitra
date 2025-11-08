"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Check,
  X,
  CheckCircle,
  XCircle,
  Package,
  DollarSign,
  Clock,
  Truck,
  Phone,
  Search,
  Filter,
  Star,
  Calendar,
  Clock as ClockIcon,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const filterTabs = [
  "All",
  "Pending",
  "Approved",
  "Rejected",
  "Completed",
  "Transferred",
];
const requestTypes = ["All", "Community Bank", "Regular Medicine"];

export default function MedicineRequests() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [communityRequests, setCommunityRequests] = useState([]);
  const [regularRequests, setRegularRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [transferModal, setTransferModal] = useState({
    open: false,
    order: null,
  });
  const [availableStores, setAvailableStores] = useState([]);
  const [storesLoading, setStoresLoading] = useState(false);

  const abortControllerRef = useRef(null);
  const hasFetchedStoresRef = useRef(false);

  useEffect(() => {
    // Get store data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "MedicalStore") {
      setStoreData(user);
      fetchAllRequests(user._id);
    }

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchAllRequests = async (storeId) => {
    try {
      setLoading(true);
      await Promise.all([
        fetchCommunityRequests(storeId),
        fetchRegularRequests(storeId),
      ]);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load medicine requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunityRequests = async (storeId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/community-medicine-orders/store/${storeId}`
      );

      console.log("🔍 Community Orders API Response:", response.data);

      const formattedRequests = response.data.data.map((order) => {
        console.log("📦 Processing Community Order:", order);

        // Extract contact information - check multiple sources
        const farmerContact =
          order.farmerContact ||
          order.farmerDetails?.phone ||
          order.farmerId?.phone ||
          "Contact not available";

        // Extract location - use the completeAddress from farmerDetails or build it
        let farmerLocation = "Location not specified";
        if (order.farmerDetails?.completeAddress) {
          farmerLocation = order.farmerDetails.completeAddress;
        } else if (order.farmerDetails) {
          // Build address from individual components
          farmerLocation = `${order.farmerDetails.address}${
            order.farmerDetails.village
              ? `, ${order.farmerDetails.village}`
              : ""
          }, ${order.farmerDetails.city}, ${order.farmerDetails.state} - ${
            order.farmerDetails.pincode
          }`;
        } else if (order.farmerLocation) {
          farmerLocation = order.farmerLocation;
        }

        // Extract name
        const farmerName =
          order.farmerName ||
          order.farmerDetails?.name ||
          order.farmerId?.fullName ||
          "Farmer";

        return {
          id: order._id,
          type: "community",
          name: farmerName,
          organization: order.organizationName || "Community Request",
          priority: getPriorityLevel(order),
          status: order.status,
          medicine: order.medicineName,
          quantity: `${order.quantityRequested} units`,
          price: order.isFree ? "FREE" : "Paid",
          date: new Date(
            order.requestDate || order.createdAt
          ).toLocaleDateString(),
          distance: farmerLocation,
          rejectionReason: order.storeNotes || null,
          originalData: order,
          farmerContact: farmerContact,
          farmerDetails: order.farmerDetails || null,
        };
      });

      console.log("✅ Formatted Community Requests:", formattedRequests);
      setCommunityRequests(formattedRequests);
    } catch (error) {
      console.error("❌ Error fetching community requests:", error);
      toast.error("Failed to load community medicine requests");
    }
  };

  const fetchRegularRequests = async (storeId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/medicine-orders/store/${storeId}`
      );

      const formattedRequests = response.data.data.map((order) => {
        // Extract location from farmerDetails or use fallback
        const farmerLocation =
          order.farmerDetails?.completeAddress ||
          order.farmerLocation ||
          order.farmerDetails?.address ||
          "Location not specified";

        // Extract contact information
        const farmerContact =
          order.farmerContact ||
          order.farmerDetails?.phone ||
          "Contact not available";

        return {
          id: order._id,
          type: "regular",
          name: order.farmerName || order.farmerDetails?.name || "Farmer",
          organization: "Regular Order",
          priority: getPriorityLevel(order),
          status: order.status,
          medicine: order.medicineName,
          quantity: `${order.quantityRequested} units`,
          price: `₹${order.totalPrice}`,
          date: new Date(
            order.requestDate || order.createdAt
          ).toLocaleDateString(),
          distance: farmerLocation,
          rejectionReason: order.storeNotes || null,
          originalData: order,
          animalDetails: {
            type: order.animalType,
            count: order.animalCount,
            weight: order.animalWeight,
            age: order.animalAge,
            symptoms: order.symptoms,
          },
          deliveryOption: order.deliveryOption,
          deliveryAddress: order.deliveryAddress,
          farmerContact: farmerContact,
        };
      });

      setRegularRequests(formattedRequests);
    } catch (error) {
      console.error("Error fetching regular requests:", error);
      toast.error("Failed to load regular medicine requests");
    }
  };

  // Updated function to fetch stores for transfer
  const fetchAvailableStores = async () => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setStoresLoading(true);
      console.log("🔄 Starting to fetch available stores...");

      const response = await axios.get(
        "http://localhost:5000/api/store-transfer/available-stores",
        {
          params: {
            currentStoreId: storeData._id,
          },
          signal: abortControllerRef.current.signal,
          timeout: 10000,
        }
      );

      if (response.data.success) {
        console.log(
          "✅ Stores fetched successfully:",
          response.data.data.length
        );
        setAvailableStores(response.data.data || []);
        hasFetchedStoresRef.current = true;
      } else {
        throw new Error(response.data.message || "Failed to fetch stores");
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("🔄 Request canceled");
        return;
      }
      console.error("❌ Error fetching stores for transfer:", error);
      toast.error("Failed to load available stores for transfer");
      setAvailableStores([]);
    } finally {
      setStoresLoading(false);
      abortControllerRef.current = null;
    }
  };

  const getPriorityLevel = (order) => {
    // High priority for large quantities or urgent delivery
    if (order.quantityRequested > 50) return "high";
    if (order.deliveryOption === "delivery") return "medium";
    return "low";
  };

  const handleAcceptCommunity = async (requestId) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/community-medicine-orders/${requestId}/approve`,
        {
          storeNotes: "Order approved successfully",
        }
      );

      if (response.data.success) {
        toast.success("Community medicine request approved!");
        if (storeData) {
          fetchAllRequests(storeData._id);
        }
      }
    } catch (error) {
      console.error("Error approving community request:", error);
      toast.error(error.response?.data?.message || "Failed to approve request");
    }
  };

  const handleRejectCommunity = async (requestId) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/community-medicine-orders/${requestId}/reject`,
        {
          storeNotes: "Request rejected by store",
        }
      );

      if (response.data.success) {
        toast.success("Community medicine request rejected!");
        if (storeData) {
          fetchAllRequests(storeData._id);
        }
      }
    } catch (error) {
      console.error("Error rejecting community request:", error);
      toast.error("Failed to reject request");
    }
  };

  const handleAcceptRegular = async (requestId, expectedDeliveryDate) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/medicine-orders/${requestId}/approve`,
        {
          storeNotes: "Order approved successfully",
          expectedDeliveryDate,
        }
      );

      if (response.data.success) {
        toast.success("Regular medicine request approved!");
        if (storeData) {
          fetchAllRequests(storeData._id);
        }
      }
    } catch (error) {
      console.error("Error approving regular request:", error);
      toast.error(error.response?.data?.message || "Failed to approve request");
    }
  };

  const handleRejectRegular = async (requestId) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/medicine-orders/${requestId}/reject`,
        {
          storeNotes: "Request rejected by store",
        }
      );

      if (response.data.success) {
        toast.success("Regular medicine request rejected!");
        if (storeData) {
          fetchAllRequests(storeData._id);
        }
      }
    } catch (error) {
      console.error("Error rejecting regular request:", error);
      toast.error("Failed to reject request");
    }
  };

  const handleTransferOrder = async (
    requestId,
    targetStoreId,
    targetStoreName,
    transferReason
  ) => {
    try {
      console.log("🔄 Transferring order:", {
        requestId,
        targetStoreId,
        targetStoreName,
      });

      const endpoint =
        transferModal.order.type === "community"
          ? `http://localhost:5000/api/community-medicine-orders/${requestId}/transfer`
          : `http://localhost:5000/api/medicine-orders/${requestId}/transfer`;

      const response = await axios.patch(endpoint, {
        targetStoreId,
        targetStoreName,
        transferReason,
      });

      if (response.data.success) {
        toast.success(`Order transferred to ${targetStoreName} successfully!`);
        setTransferModal({ open: false, order: null });

        // Refresh the requests list
        if (storeData) {
          fetchAllRequests(storeData._id);
        }
      }
    } catch (error) {
      console.error("❌ Error transferring order:", error);
      toast.error(error.response?.data?.message || "Failed to transfer order");
      throw error;
    }
  };

  const handleCompleteOrder = async (requestId, orderType) => {
    try {
      const endpoint =
        orderType === "community"
          ? `http://localhost:5000/api/community-medicine-orders/${requestId}/complete`
          : `http://localhost:5000/api/medicine-orders/${requestId}/complete`;

      const response = await axios.patch(endpoint, {
        storeNotes: "Order completed successfully",
      });

      if (response.data.success) {
        toast.success("Order marked as completed!");
        if (storeData) {
          fetchAllRequests(storeData._id);
        }
      }
    } catch (error) {
      console.error("Error completing order:", error);
      toast.error("Failed to complete order");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "approved":
      case "accepted":
        return "text-green-600 bg-green-50 border-green-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      case "completed":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "transferred":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "community":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "regular":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "community":
        return <Package size={14} className="text-purple-600" />;
      case "regular":
        return <DollarSign size={14} className="text-blue-600" />;
      default:
        return <Package size={14} className="text-gray-600" />;
    }
  };

  // Combine both types of requests
  const allRequests = [...communityRequests, ...regularRequests];

  const filteredRequests = allRequests.filter((request) => {
    // Filter by status - UPDATED FOR TRANSFERS
    const statusMatch =
      activeFilter === "All" ||
      (activeFilter === "Pending" && request.status === "pending") ||
      (activeFilter === "Approved" &&
        (request.status === "approved" || request.status === "accepted")) ||
      (activeFilter === "Rejected" && request.status === "rejected") ||
      (activeFilter === "Completed" && request.status === "completed") ||
      (activeFilter === "Transferred" && request.status === "transferred");

    // Filter by type
    const typeMatch =
      activeType === "All" ||
      (activeType === "Community Bank" && request.type === "community") ||
      (activeType === "Regular Medicine" && request.type === "regular");

    return statusMatch && typeMatch;
  });

  const TransferModal = () => {
    const [selectedStore, setSelectedStore] = useState("");
    const [reason, setReason] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [transferring, setTransferring] = useState(false);
    const [distanceFilter, setDistanceFilter] = useState("50");
    const [specialtyFilter, setSpecialtyFilter] = useState("");

    // Fixed useEffect - using ref to track if we've already fetched
    useEffect(() => {
      if (
        transferModal.open &&
        storeData?._id &&
        !hasFetchedStoresRef.current
      ) {
        console.log("🔄 Fetching available stores...");
        fetchAvailableStores();
      }
    }, [transferModal.open, storeData?._id]);

    // Reset state when modal closes
    useEffect(() => {
      if (!transferModal.open) {
        setSelectedStore("");
        setReason("");
        setSearchTerm("");
        setDistanceFilter("50");
        setSpecialtyFilter("");
        // Don't reset the ref here - we want to keep track across modal openings
      }
    }, [transferModal.open]);

    const filteredStores = availableStores.filter(
      (store) =>
        store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.specialization
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        store.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async () => {
      if (!selectedStore || !reason.trim()) {
        toast.error("Please select a store and provide transfer reason");
        return;
      }

      setTransferring(true);
      try {
        const selectedStoreData = availableStores.find(
          (store) => store.id === selectedStore
        );

        if (!selectedStoreData) {
          toast.error("Selected store not found");
          return;
        }

        await handleTransferOrder(
          transferModal.order.id,
          selectedStoreData.id,
          selectedStoreData.storeName,
          reason.trim()
        );
      } catch (error) {
        console.error("Transfer error:", error);
      } finally {
        setTransferring(false);
      }
    };

    const handleStoreClick = (storeId) => {
      console.log("🟢 Store clicked, ID:", storeId);
      setSelectedStore(storeId);
    };

    const handleRefreshStores = () => {
      hasFetchedStoresRef.current = false;
      fetchAvailableStores();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Transfer Medicine Order
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Select a store to transfer this order to
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefreshStores}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={storesLoading}
                >
                  {storesLoading ? "Refreshing..." : "Refresh Stores"}
                </button>
                <button
                  onClick={() => setTransferModal({ open: false, order: null })}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          {transferModal.order && (
            <div className="bg-blue-50 border-b border-blue-200 p-4">
              <h4 className="font-medium text-blue-800 mb-2">Order Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-700">Medicine:</span>
                  <p className="text-blue-900">
                    {transferModal.order.medicine}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Quantity:</span>
                  <p className="text-blue-900">
                    {transferModal.order.quantity}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Farmer:</span>
                  <p className="text-blue-900">{transferModal.order.name}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Type:</span>
                  <p className="text-blue-900 capitalize">
                    {transferModal.order.type}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-hidden flex">
            {/* Store List */}
            <div className="w-1/2 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200 space-y-3">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search stores by name, specialty, or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={specialtyFilter}
                    onChange={(e) => setSpecialtyFilter(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Specialties</option>
                    <option value="General">General Veterinary Medicine</option>
                    <option value="Small Animal">Small Animal Medicine</option>
                    <option value="Large Animal">Large Animal Medicine</option>
                    <option value="Equine">Equine Medicine</option>
                  </select>

                  <select
                    value={distanceFilter}
                    onChange={(e) => setDistanceFilter(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="50">Any Distance</option>
                    <option value="10">Within 10 km</option>
                    <option value="20">Within 20 km</option>
                    <option value="30">Within 30 km</option>
                  </select>
                </div>

                <p className="text-sm text-gray-500">
                  {filteredStores.length} stores found
                  {specialtyFilter && ` • Specialty: ${specialtyFilter}`}
                  {distanceFilter !== "50" && ` • Within ${distanceFilter}km`}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {storesLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">
                      Loading available stores...
                    </span>
                  </div>
                ) : availableStores.length === 0 ? (
                  <div className="text-center p-8 text-gray-500">
                    <Package size={48} className="mx-auto mb-3 text-gray-400" />
                    <p>No stores available for transfer</p>
                    <p className="text-sm mt-2">Please try again later</p>
                    <button
                      onClick={handleRefreshStores}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : filteredStores.length === 0 ? (
                  <div className="text-center p-8 text-gray-500">
                    <Package size={48} className="mx-auto mb-3 text-gray-400" />
                    <p>No stores match your search</p>
                    <p className="text-sm">Try adjusting your search terms</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {filteredStores.map((store) => (
                      <div
                        key={store.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedStore === store.id
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => handleStoreClick(store.id)}
                        style={{ userSelect: "none", WebkitUserSelect: "none" }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-gray-900">
                                {store.storeName}
                              </h4>
                              {selectedStore === store.id && (
                                <CheckCircle
                                  size={16}
                                  className="text-blue-600"
                                />
                              )}
                            </div>

                            <p className="text-sm text-gray-600 mb-2">
                              {store.specialization}
                            </p>

                            <div className="space-y-1 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <MapPin size={12} />
                                <span>
                                  {store.city}, {store.state}
                                </span>
                                <span className="text-orange-600 font-medium ml-1">
                                  • {store.distance || "5-45 km"}
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                <Phone size={12} />
                                <span>{store.contact}</span>
                              </div>

                              {/* Store transfer statistics */}
                              <div className="flex items-center gap-2 mt-2 text-xs">
                                <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                                  ✅ {store.acceptanceRate}% acceptance
                                </span>
                                <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                  ⏱️ {store.avgResponseTime}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Transfer Details */}
            <div className="w-1/2 flex flex-col">
              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Transfer Details
                  </h4>

                  {/* Selected Store Preview */}
                  {selectedStore ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 text-green-800 mb-2">
                        <CheckCircle size={16} />
                        <span className="font-medium">Store Selected</span>
                      </div>
                      <p className="text-sm text-green-700">
                        This order will be transferred to{" "}
                        <strong>
                          {
                            availableStores.find((s) => s.id === selectedStore)
                              ?.storeName
                          }
                        </strong>
                        . They will receive all order details and can contact
                        the farmer directly.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <Clock size={16} />
                        <span className="font-medium">Select a Store</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        Please select a store from the list to proceed with the
                        transfer.
                      </p>
                    </div>
                  )}

                  {/* Transfer Reason */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Reason for Transfer *
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Explain why you are transferring this order (e.g., out of stock, specialized medicine required, location convenience, etc.)"
                      rows="6"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      This reason will be shared with the farmer and the
                      receiving store.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setTransferModal({ open: false, order: null })
                    }
                    disabled={transferring}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedStore || !reason.trim() || transferring}
                    className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    {transferring ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Transferring...
                      </>
                    ) : (
                      <>
                        <Truck size={18} />
                        Transfer Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {transferModal.open && <TransferModal />}

      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold text-gray-900"
          >
            Medicine Requests
          </motion.h1>

          {/* Filter Tabs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex gap-1 flex-wrap bg-white rounded-lg p-1 shadow-sm border"
            >
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeFilter === tab
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </motion.div>

            {/* Request Type Filter */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex gap-1 flex-wrap bg-white rounded-lg p-1 shadow-sm border"
            >
              {requestTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeType === type
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-gray-900">
              {allRequests.length}
            </div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {allRequests.filter((r) => r.status === "pending").length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-blue-600">
              {allRequests.filter((r) => r.type === "regular").length}
            </div>
            <div className="text-sm text-gray-600">Regular Orders</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-purple-600">
              {allRequests.filter((r) => r.type === "community").length}
            </div>
            <div className="text-sm text-gray-600">Community Orders</div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Requests Grid */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRequests.map((request, index) => (
              <motion.div
                key={`${request.type}-${request.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Header with user info and badges */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {request.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {request.organization}
                      </p>
                      <p className="text-xs text-gray-500">{request.date}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center gap-1 ${getTypeColor(
                        request.type
                      )}`}
                    >
                      {getTypeIcon(request.type)}
                      {request.type === "community" ? "Community" : "Regular"}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                        request.priority
                      )}`}
                    >
                      {request.priority} priority
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>
                </div>

                {/* Medicine Details */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Medicine Requested:
                  </p>
                  <p className="font-medium text-gray-900 mb-3">
                    {request.medicine}
                  </p>

                  <div className="flex justify-between text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">Quantity:</span>
                      <br />
                      {request.quantity}
                    </div>
                    <div className="text-right">
                      <span className="font-medium">Price:</span>
                      <br />
                      <span
                        className={
                          request.price === "FREE"
                            ? "text-green-600 font-bold"
                            : "text-gray-900"
                        }
                      >
                        {request.price}
                      </span>
                    </div>
                  </div>

                  {/* Animal Details for Regular Orders */}
                  {request.type === "regular" && request.animalDetails && (
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium mb-1">
                        Animal Details:
                      </p>
                      <div className="text-xs text-blue-700 space-y-1">
                        <div>
                          <strong>Type:</strong> {request.animalDetails.type}
                        </div>
                        <div>
                          <strong>Count:</strong> {request.animalDetails.count}{" "}
                          animals
                        </div>
                        {request.animalDetails.weight && (
                          <div>
                            <strong>Weight:</strong>{" "}
                            {request.animalDetails.weight} kg
                          </div>
                        )}
                        {request.animalDetails.age && (
                          <div>
                            <strong>Age:</strong> {request.animalDetails.age}
                          </div>
                        )}
                        {request.animalDetails.symptoms && (
                          <div>
                            <strong>Symptoms:</strong>{" "}
                            {request.animalDetails.symptoms}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Delivery Info for Regular Orders */}
                  {request.type === "regular" && request.deliveryOption && (
                    <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-green-700">
                        <strong>Delivery:</strong>{" "}
                        {request.deliveryOption === "delivery"
                          ? "Home Delivery"
                          : "Store Pickup"}
                        {request.deliveryAddress &&
                          ` - ${request.deliveryAddress}`}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                    <MapPin size={14} />
                    <div>
                      <span>{request.distance}</span>
                      {/* Show detailed address for both community and regular orders */}
                      {request.originalData?.farmerDetails && (
                        <div className="text-xs text-gray-500 mt-1">
                          {request.originalData.farmerDetails.village &&
                            `${request.originalData.farmerDetails.village}, `}
                          {request.originalData.farmerDetails.city}{" "}
                          {request.originalData.farmerDetails.state}{" "}
                          {request.originalData.farmerDetails.pincode}
                        </div>
                      )}
                      {/* Fallback for orders without farmerDetails */}
                      {!request.originalData?.farmerDetails &&
                        request.originalData?.farmerLocation && (
                          <div className="text-xs text-gray-500 mt-1">
                            {request.originalData.farmerLocation}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Additional Info for Community Requests */}
                {request.type === "community" && request.originalData && (
                  <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium mb-1">
                      Community Medicine Details:
                    </p>
                    <p className="text-xs text-purple-700">
                      {request.originalData.isFree
                        ? "🎁 Free Medicine"
                        : "💰 Paid Service"}{" "}
                      • Requested on:{" "}
                      {new Date(
                        request.originalData.requestDate
                      ).toLocaleDateString()}
                    </p>
                    {request.originalData.farmerNotes && (
                      <p className="text-xs text-purple-600 mt-1">
                        <strong>Farmer Notes:</strong>{" "}
                        {request.originalData.farmerNotes}
                      </p>
                    )}
                  </div>
                )}

                {/* Rejection Reason */}
                {request.status === "rejected" && request.rejectionReason && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 font-medium mb-1">
                      Rejection Reason:
                    </p>
                    <p className="text-sm text-red-700">
                      {request.rejectionReason}
                    </p>
                  </div>
                )}

                {/* Transfer Details */}
                {request.status === "transferred" &&
                  request.originalData?.transferredToStore && (
                    <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-600 font-medium mb-1">
                        Transferred to:
                      </p>
                      <p className="text-sm text-orange-700">
                        {request.originalData.transferredToStore.storeName}
                      </p>
                      {request.originalData.transferredToStore
                        .transferReason && (
                        <p className="text-xs text-orange-600 mt-1">
                          <strong>Reason:</strong>{" "}
                          {
                            request.originalData.transferredToStore
                              .transferReason
                          }
                        </p>
                      )}
                      {request.originalData.transferredToStore.transferDate && (
                        <p className="text-xs text-orange-500 mt-1">
                          <strong>Transferred on:</strong>{" "}
                          {new Date(
                            request.originalData.transferredToStore.transferDate
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                {/* Action Buttons or Status */}
                {request.status === "pending" ? (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={
                          () =>
                            request.type === "community"
                              ? handleAcceptCommunity(request.id)
                              : handleAcceptRegular(
                                  request.id,
                                  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                                ) // 7 days from now
                        }
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Check size={16} />
                        Accept
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          request.type === "community"
                            ? handleRejectCommunity(request.id)
                            : handleRejectRegular(request.id)
                        }
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <X size={16} />
                        Reject
                      </motion.button>
                    </div>
                    {request.type === "regular" && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setTransferModal({ open: true, order: request });
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        <Truck size={16} />
                        Transfer to Another Store
                      </motion.button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      {request.status === "approved" ||
                      request.status === "accepted" ? (
                        <>
                          <CheckCircle size={16} className="text-green-600" />
                          <span className="text-green-600 font-medium">
                            Request{" "}
                            {request.type === "community"
                              ? "Approved"
                              : "Accepted"}
                          </span>
                          <span className="text-gray-600 ml-2">
                            {request.type === "community"
                              ? "Medicine allocated"
                              : "Ready for processing"}
                          </span>
                        </>
                      ) : request.status === "completed" ? (
                        <>
                          <CheckCircle size={16} className="text-purple-600" />
                          <span className="text-purple-600 font-medium">
                            Order Completed
                          </span>
                        </>
                      ) : request.status === "transferred" ? (
                        <>
                          <Truck size={16} className="text-orange-600" />
                          <span className="text-orange-600 font-medium">
                            Transferred
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle size={16} className="text-red-600" />
                          <span className="text-red-600 font-medium">
                            Request Rejected
                          </span>
                        </>
                      )}
                    </div>

                    {(request.status === "approved" ||
                      request.status === "accepted") && (
                      <button
                        onClick={() =>
                          handleCompleteOrder(request.id, request.type)
                        }
                        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                      >
                        Mark as Completed
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (
                          request.farmerContact &&
                          request.farmerContact !== "Contact not available"
                        ) {
                          window.open(`tel:${request.farmerContact}`);
                        } else {
                          toast.error("Contact information not available");
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                    >
                      <Phone size={16} />
                      Contact Farmer
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredRequests.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-500"
          >
            <Package size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No requests found</p>
            <p className="text-gray-600">
              {activeFilter !== "All" || activeType !== "All"
                ? "Try changing your filters to see more requests"
                : "No medicine requests available at the moment"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
