"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Truck, Clock, CheckCircle, AlertTriangle, MapPin } from "lucide-react"

const deliveriesData = [
  {
    id: "DEL-001",
    destination: "Green Valley Farm",
    status: "in-transit",
    priority: "high",
    medicine: "Antibiotics for Cattle",
    quantity: "50 units",
    driver: "Mike Johnson",
    vehicle: "VAN-001",
    distance: "15 miles",
    estimatedDelivery: "2:30 PM",
    deliveredAt: null,
  },
  {
    id: "DEL-002",
    destination: "Sunrise Agriculture",
    status: "pickup",
    priority: "medium",
    medicine: "Vitamins for Poultry",
    quantity: "100 units",
    driver: "Sarah Davis",
    vehicle: "TRUCK-002",
    distance: "8 miles",
    estimatedDelivery: "3:00 PM",
    deliveredAt: null,
  },
  {
    id: "DEL-003",
    destination: "Valley Ranch",
    status: "delivered",
    priority: "low",
    medicine: "Deworming Medicine",
    quantity: "25 units",
    driver: "Tom Wilson",
    vehicle: "VAN-003",
    distance: "22 miles",
    estimatedDelivery: null,
    deliveredAt: "12:45 PM",
  },
  {
    id: "DEL-004",
    destination: "Meadow Farm",
    status: "delayed",
    priority: "high",
    medicine: "Pain Relief for Horses",
    quantity: "10 units",
    driver: "Lisa Brown",
    vehicle: "VAN-004",
    distance: "12 miles",
    estimatedDelivery: "11:00 AM",
    deliveredAt: null,
  },
]

const filterTabs = ["All Deliveries", "Active", "Completed"]

export default function TransportManagement() {
  const [activeFilter, setActiveFilter] = useState("All Deliveries")
  const [deliveries, setDeliveries] = useState(deliveriesData)

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
      case "pickup":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "in-transit":
        return "text-purple-600 bg-purple-50 border-purple-200"
      case "delivered":
        return "text-green-600 bg-green-50 border-green-200"
      case "delayed":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pickup":
        return <Clock size={16} className="text-yellow-600" />
      case "in-transit":
        return <Truck size={16} className="text-purple-600" />
      case "delivered":
        return <CheckCircle size={16} className="text-green-600" />
      case "delayed":
        return <AlertTriangle size={16} className="text-red-600" />
      default:
        return <Clock size={16} className="text-gray-600" />
    }
  }

  const handleMarkDelivered = (id) => {
    setDeliveries(
      deliveries.map((delivery) =>
        delivery.id === id ? { ...delivery, status: "delivered", deliveredAt: "12:45 PM" } : delivery,
      ),
    )
  }

  const handleReportDelay = (id) => {
    setDeliveries(deliveries.map((delivery) => (delivery.id === id ? { ...delivery, status: "delayed" } : delivery)))
  }

  const handleMarkInTransit = (id) => {
    setDeliveries(deliveries.map((delivery) => (delivery.id === id ? { ...delivery, status: "in-transit" } : delivery)))
  }

  const filteredDeliveries = deliveries.filter((delivery) => {
    if (activeFilter === "All Deliveries") return true
    if (activeFilter === "Active") return ["pickup", "in-transit", "delayed"].includes(delivery.status)
    if (activeFilter === "Completed") return delivery.status === "delivered"
    return true
  })

  // Calculate summary stats
  const inTransitCount = deliveries.filter((d) => d.status === "in-transit").length
  const pendingPickupCount = deliveries.filter((d) => d.status === "pickup").length
  const deliveredTodayCount = deliveries.filter((d) => d.status === "delivered").length
  const delayedCount = deliveries.filter((d) => d.status === "delayed").length

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0"
          >
            Transport Management
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">In Transit</p>
                <p className="text-3xl font-bold text-gray-900">{inTransitCount}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Truck className="text-purple-600" size={24} />
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
                <p className="text-sm text-gray-600 mb-1">Pending Pickup</p>
                <p className="text-3xl font-bold text-gray-900">{pendingPickupCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
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
                <p className="text-sm text-gray-600 mb-1">Delivered Today</p>
                <p className="text-3xl font-bold text-gray-900">{deliveredTodayCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Delayed</p>
                <p className="text-3xl font-bold text-gray-900">{delayedCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Delivery Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDeliveries.map((delivery, index) => (
            <motion.div
              key={delivery.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(delivery.status)}
                    <span className="font-medium text-gray-900">{delivery.id}</span>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(delivery.status)}`}
                  >
                    {delivery.status === "pickup" ? "pickup" : delivery.status}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(delivery.priority)}`}
                >
                  {delivery.priority} priority
                </span>
              </div>

              {/* Destination */}
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={16} className="text-blue-600" />
                <span className="font-medium text-gray-900">{delivery.destination}</span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-600 mb-1">Medicine:</p>
                  <p className="font-medium text-gray-900">{delivery.medicine}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Quantity:</p>
                  <p className="font-medium text-gray-900">{delivery.quantity}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Driver:</p>
                  <p className="font-medium text-gray-900">{delivery.driver}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Vehicle:</p>
                  <p className="font-medium text-gray-900">{delivery.vehicle}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Distance:</p>
                  <p className="font-medium text-gray-900">{delivery.distance}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">
                    {delivery.status === "delivered" ? "Delivered at:" : "Est. Delivery:"}
                  </p>
                  <p className="font-medium text-gray-900">
                    {delivery.status === "delivered" ? delivery.deliveredAt : delivery.estimatedDelivery}
                  </p>
                </div>
              </div>

              {/* Status Messages and Actions */}
              {delivery.status === "delivered" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle size={16} />
                    <span className="font-medium">Successfully Delivered</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">Delivered at {delivery.deliveredAt}</p>
                </div>
              )}

              {delivery.status === "delayed" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle size={16} />
                    <span className="font-medium">Delivery Delayed</span>
                  </div>
                  <p className="text-sm text-red-600 mt-1">Contact driver for updates</p>
                </div>
              )}

              {delivery.status === "in-transit" && (
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMarkDelivered(delivery.id)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    Mark Delivered
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleReportDelay(delivery.id)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Report Delay
                  </motion.button>
                </div>
              )}

              {delivery.status === "pickup" && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMarkInTransit(delivery.id)}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  Mark as In Transit
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>

        {filteredDeliveries.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-gray-500">
            No deliveries found for the selected filter.
          </motion.div>
        )}
      </div>
    </div>
  )
}
