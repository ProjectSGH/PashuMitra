"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, MapPin, Check, X, CheckCircle, XCircle, Package, DollarSign, Clock } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

const regularMedicineRequests = [
  {
    id: 1,
    type: "regular",
    name: "John Smith",
    organization: "Green Valley Farm",
    priority: "high",
    status: "pending",
    medicine: "Antibiotics for Cattle",
    quantity: "50 units",
    price: "₹2,500",
    date: "2024-01-15",
    distance: "15 miles away",
    rejectionReason: null,
  },
  {
    id: 2,
    type: "regular",
    name: "Sarah Johnson",
    organization: "Sunrise Agriculture",
    priority: "medium",
    status: "pending",
    medicine: "Vitamins for Poultry",
    quantity: "100 units",
    price: "₹1,800",
    date: "2024-01-15",
    distance: "8 miles away",
    rejectionReason: null,
  },
  {
    id: 3,
    type: "regular",
    name: "Mike Davis",
    organization: "Valley Ranch",
    priority: "low",
    status: "accepted",
    medicine: "Deworming Medicine",
    quantity: "25 units",
    price: "₹750",
    date: "2024-01-14",
    distance: "22 miles away",
    rejectionReason: null,
  },
]

const filterTabs = ["All", "Pending", "Accepted", "Rejected"]
const requestTypes = ["All", "Community Bank", "Regular Medicine"]

export default function MedicineRequests() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [activeType, setActiveType] = useState("All")
  const [communityRequests, setCommunityRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [storeData, setStoreData] = useState(null)

  useEffect(() => {
    // Get store data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "MedicalStore") {
      setStoreData(user);
      fetchCommunityRequests(user._id);
    }
  }, [])

  const fetchCommunityRequests = async (storeId) => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:5000/api/community-medicine-orders/store/${storeId}?status=pending`)
      
      const formattedRequests = response.data.data.map(order => ({
        id: order._id,
        type: "community",
        name: order.farmerName,
        organization: order.organizationName || "Community Request",
        priority: "medium",
        status: order.status,
        medicine: order.medicineName,
        quantity: `${order.quantityRequested} units`,
        price: order.isFree ? "FREE" : "Paid",
        date: new Date(order.requestDate).toLocaleDateString(),
        distance: order.farmerLocation || "Location not specified",
        rejectionReason: order.storeNotes || null,
        originalData: order
      }))

      setCommunityRequests(formattedRequests)
    } catch (error) {
      console.error("Error fetching community requests:", error)
      toast.error("Failed to load community medicine requests")
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptCommunity = async (requestId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/community-medicine-orders/${requestId}/approve`, {
        storeNotes: "Order approved successfully"
      })

      if (response.data.success) {
        toast.success("Community medicine request approved!")
        // Refresh the list
        if (storeData) {
          fetchCommunityRequests(storeData._id)
        }
      }
    } catch (error) {
      console.error("Error approving community request:", error)
      toast.error("Failed to approve request")
    }
  }

  const handleRejectCommunity = async (requestId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/community-medicine-orders/${requestId}/reject`, {
        storeNotes: "Request rejected by store"
      })

      if (response.data.success) {
        toast.success("Community medicine request rejected!")
        // Refresh the list
        if (storeData) {
          fetchCommunityRequests(storeData._id)
        }
      }
    } catch (error) {
      console.error("Error rejecting community request:", error)
      toast.error("Failed to reject request")
    }
  }

  const handleAcceptRegular = (id) => {
    // Static handling for regular medicine requests
    toast.success("Regular medicine request accepted!")
    // In real implementation, you would make API call here
  }

  const handleRejectRegular = (id) => {
    // Static handling for regular medicine requests
    toast.success("Regular medicine request rejected!")
    // In real implementation, you would make API call here
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "approved":
      case "accepted":
        return "text-green-600 bg-green-50 border-green-200"
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "community":
        return "text-purple-600 bg-purple-50 border-purple-200"
      case "regular":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "community":
        return <Package size={14} className="text-purple-600" />
      case "regular":
        return <DollarSign size={14} className="text-blue-600" />
      default:
        return <Package size={14} className="text-gray-600" />
    }
  }

  // Combine both types of requests
  const allRequests = [...communityRequests, ...regularMedicineRequests]

  const filteredRequests = allRequests.filter((request) => {
    // Filter by status
    const statusMatch = activeFilter === "All" || 
      (activeFilter === "Pending" && request.status === "pending") ||
      (activeFilter === "Accepted" && (request.status === "accepted" || request.status === "approved")) ||
      (activeFilter === "Rejected" && request.status === "rejected")
    
    // Filter by type
    const typeMatch = activeType === "All" || 
      (activeType === "Community Bank" && request.type === "community") ||
      (activeType === "Regular Medicine" && request.type === "regular")
    
    return statusMatch && typeMatch
  })

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
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
                      <h3 className="font-medium text-gray-900">{request.name}</h3>
                      <p className="text-sm text-gray-600">{request.organization}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center gap-1 ${getTypeColor(request.type)}`}
                    >
                      {getTypeIcon(request.type)}
                      {request.type === "community" ? "Community Bank" : "Regular Medicine"}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(request.priority)}`}
                    >
                      {request.priority} priority
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(request.status)}`}
                    >
                      {request.status}
                    </span>
                  </div>
                </div>

                {/* Medicine Details */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Medicine Requested:</p>
                  <p className="font-medium text-gray-900 mb-3">{request.medicine}</p>

                  <div className="flex justify-between text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">Quantity:</span>
                      <br />
                      {request.quantity}
                    </div>
                    <div className="text-right">
                      <span className="font-medium">Price:</span>
                      <br />
                      <span className={request.price === "FREE" ? "text-green-600 font-bold" : "text-gray-900"}>
                        {request.price}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                    <MapPin size={14} />
                    {request.distance}
                  </div>
                </div>

                {/* Additional Info for Community Requests */}
                {request.type === "community" && request.originalData && (
                  <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium mb-1">Community Medicine Details:</p>
                    <p className="text-xs text-purple-700">
                      {request.originalData.isFree ? "🎁 Free Medicine" : "💰 Paid Service"} • 
                      Requested on: {new Date(request.originalData.requestDate).toLocaleDateString()}
                    </p>
                    {request.originalData.farmerNotes && (
                      <p className="text-xs text-purple-600 mt-1">
                        <strong>Farmer Notes:</strong> {request.originalData.farmerNotes}
                      </p>
                    )}
                  </div>
                )}

                {/* Rejection Reason */}
                {request.status === "rejected" && request.rejectionReason && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 font-medium mb-1">Rejection Reason:</p>
                    <p className="text-sm text-red-700">{request.rejectionReason}</p>
                  </div>
                )}

                {/* Action Buttons or Status */}
                {request.status === "pending" ? (
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => 
                        request.type === "community" 
                          ? handleAcceptCommunity(request.id)
                          : handleAcceptRegular(request.id)
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
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    {(request.status === "accepted" || request.status === "approved") ? (
                      <>
                        <CheckCircle size={16} className="text-green-600" />
                        <span className="text-green-600 font-medium">
                          Request {request.type === "community" ? "Approved" : "Accepted"}
                        </span>
                        <span className="text-gray-600 ml-2">
                          {request.type === "community" ? "Medicine allocated" : "Ready for payment processing"}
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle size={16} className="text-red-600" />
                        <span className="text-red-600 font-medium">Request Rejected</span>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredRequests.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-gray-500">
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
  )
}