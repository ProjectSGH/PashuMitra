"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Clock, Package, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react"

const transfersData = [
  {
    id: 1,
    type: "incoming",
    from: "City Medical Store",
    to: null,
    status: "in-transit",
    medicine: "Paracetamol",
    quantity: "100 units",
    distance: "25 miles",
    requestDate: "2024-01-15",
    estimatedDelivery: "2024-01-16",
  },
  {
    id: 2,
    type: "outgoing",
    from: null,
    to: "Rural Health Pharmacy",
    status: "pending",
    medicine: "Antibiotics",
    quantity: "50 units",
    distance: "18 miles",
    requestDate: "2024-01-15",
    estimatedDelivery: "2024-01-17",
  },
  {
    id: 3,
    type: "incoming",
    from: "Metro Pharmacy",
    to: null,
    status: "completed",
    medicine: "Vitamins",
    quantity: "200 units",
    distance: "12 miles",
    requestDate: "2024-01-14",
    estimatedDelivery: null,
  },
  {
    id: 4,
    type: "outgoing",
    from: null,
    to: "Community Health Center",
    status: "in-transit",
    medicine: "Pain Relief",
    quantity: "75 units",
    distance: "30 miles",
    requestDate: "2024-01-14",
    estimatedDelivery: "2024-01-16",
  },
]

const filterTabs = ["All Transfers", "Incoming", "Outgoing"]

export default function TransferManagement() {
  const [activeFilter, setActiveFilter] = useState("All Transfers")
  const [transfers, setTransfers] = useState(transfersData)

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "in-transit":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "completed":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const handleApprove = (id) => {
    setTransfers(transfers.map((transfer) => (transfer.id === id ? { ...transfer, status: "in-transit" } : transfer)))
  }

  const handleReject = (id) => {
    setTransfers(transfers.map((transfer) => (transfer.id === id ? { ...transfer, status: "rejected" } : transfer)))
  }

  const filteredTransfers = transfers.filter((transfer) => {
    if (activeFilter === "All Transfers") return true
    return transfer.type.toLowerCase() === activeFilter.toLowerCase()
  })

  // Calculate summary stats
  const pendingCount = transfers.filter((t) => t.status === "pending").length
  const inTransitCount = transfers.filter((t) => t.status === "in-transit").length
  const completedTodayCount = transfers.filter((t) => t.status === "completed" && t.requestDate === "2024-01-14").length

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
            className="flex gap-1 bg-white rounded-lg p-1 shadow-sm border"
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Transfers</p>
                <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">In Transit</p>
                <p className="text-3xl font-bold text-gray-900">{inTransitCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="text-blue-600" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed Today</p>
                <p className="text-3xl font-bold text-gray-900">{completedTodayCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Transfer Requests */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Transfer Requests</h2>
        </div>

        <div className="space-y-4 max-w-7xl m-auto">
          {filteredTransfers.map((transfer, index) => (
            <motion.div
              key={transfer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center flex-wrap justify-between">
                <div className="flex items-center gap-4">
                  {/* Direction Arrow */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transfer.type === "incoming" ? "bg-green-100" : "bg-blue-100"
                    }`}
                  >
                    {transfer.type === "incoming" ? (
                      <ArrowLeft
                        className={transfer.type === "incoming" ? "text-green-600" : "text-blue-600"}
                        size={20}
                      />
                    ) : (
                      <ArrowRight className="text-blue-600" size={20} />
                    )}
                  </div>

                  {/* Transfer Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-900">
                        {transfer.type === "incoming" ? `From ${transfer.from}` : `To ${transfer.to}`}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(transfer.status)}`}
                      >
                        {transfer.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Medicine:</span> {transfer.medicine}
                      </div>
                      <div>
                        <span className="font-medium">Quantity:</span> {transfer.quantity}
                      </div>
                      <div>
                        <span className="font-medium">Distance:</span> {transfer.distance}
                      </div>
                      <div>
                        <span className="font-medium">Request Date:</span> {transfer.requestDate}
                      </div>
                    </div>

                    {transfer.estimatedDelivery && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Est. Delivery:</span> {transfer.estimatedDelivery}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions or Status Icons */}
                <div className="flex items-center gap-2">
                  {transfer.status === "pending" ? (
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApprove(transfer.id)}
                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReject(transfer.id)}
                        className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {transfer.status === "completed" ? (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="text-green-600" size={16} />
                        </div>
                      ) : transfer.status === "in-transit" ? (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Package className="text-blue-600" size={16} />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Clock className="text-yellow-600" size={16} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTransfers.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-gray-500">
            No transfers found for the selected filter.
          </motion.div>
        )}
      </div>
    </div>
  )
}
