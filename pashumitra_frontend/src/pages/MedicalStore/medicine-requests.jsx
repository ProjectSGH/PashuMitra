"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, MapPin, Check, X, CheckCircle, XCircle } from "lucide-react"

const requestsData = [
  {
    id: 1,
    name: "John Smith",
    organization: "Green Valley Farm",
    priority: "high",
    status: "pending",
    medicine: "Antibiotics for Cattle",
    quantity: "50 units",
    date: "2024-01-15",
    distance: "15 miles away",
    rejectionReason: null,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    organization: "Sunrise Agriculture",
    priority: "medium",
    status: "pending",
    medicine: "Vitamins for Poultry",
    quantity: "100 units",
    date: "2024-01-15",
    distance: "8 miles away",
    rejectionReason: null,
  },
  {
    id: 3,
    name: "Mike Davis",
    organization: "Valley Ranch",
    priority: "low",
    status: "accepted",
    medicine: "Deworming Medicine",
    quantity: "25 units",
    date: "2024-01-14",
    distance: "22 miles away",
    rejectionReason: null,
  },
  {
    id: 4,
    name: "Lisa Wilson",
    organization: "Meadow Farm",
    priority: "high",
    status: "rejected",
    medicine: "Pain Relief for Horses",
    quantity: "10 units",
    date: "2024-01-14",
    distance: "12 miles away",
    rejectionReason: "Out of stock",
  },
]

const filterTabs = ["All", "Pending", "Accepted", "Rejected"]

export default function MedicineRequests() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [requests, setRequests] = useState(requestsData)

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
      case "accepted":
        return "text-green-600 bg-green-50 border-green-200"
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const handleAccept = (id) => {
    setRequests(requests.map((req) => (req.id === id ? { ...req, status: "accepted" } : req)))
  }

  const handleReject = (id) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: "rejected", rejectionReason: "Request declined" } : req,
      ),
    )
  }

  const filteredRequests = requests.filter((request) => {
    if (activeFilter === "All") return true
    return request.status.toLowerCase() === activeFilter.toLowerCase()
  })

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
            Medicine Requests
          </motion.h1>

          {/* Filter Tabs */}
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
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
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
                    <span className="font-medium">Date:</span>
                    <br />
                    {request.date}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                  <MapPin size={14} />
                  {request.distance}
                </div>
              </div>

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
                    onClick={() => handleAccept(request.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Check size={16} />
                    Accept
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleReject(request.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X size={16} />
                    Reject
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  {request.status === "accepted" ? (
                    <>
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-green-600 font-medium">Request Accepted</span>
                      <span className="text-gray-600 ml-2">Ready for transfer processing</span>
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

        {filteredRequests.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-gray-500">
            No requests found for the selected filter.
          </motion.div>
        )}
      </div>
    </div>
  )
}
