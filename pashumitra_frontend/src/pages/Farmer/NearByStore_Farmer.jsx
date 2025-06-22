"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Phone, Clock, Star, MapPin, ChevronDown, Bell, Navigation } from "lucide-react"

export default function NearbyStores() {
  const [filters, setFilters] = useState({
    distance: "Within 5 km",
    specialty: "All Specialties",
    openOnly: false,
  })

  const stores = [
    {
      id: 1,
      name: "VetCare Pharmacy",
      rating: 4.8,
      distance: "2.5 km",
      address: "123 Main Street, Rural District",
      phone: "+91 98765 43210",
      hours: "8:00 AM - 8:00 PM",
      specialties: ["Antibiotics", "Vaccines", "Supplements"],
      medicineStock: { available: 45, total: 50 },
    },
    {
      id: 2,
      name: "Animal Health Store",
      rating: 4.6,
      distance: "4.2 km",
      address: "456 Village Road, Agricultural Zone",
      phone: "+91 87654 32109",
      hours: "9:00 AM - 7:00 PM",
      specialties: ["Dewormers", "Wound Care", "Nutrition"],
      medicineStock: { available: 38, total: 42 },
    },
    {
      id: 3,
      name: "Rural Vet Supplies",
      rating: 4.4,
      distance: "6.8 km",
      address: "789 Farm Junction, Country Side",
      phone: "+91 76543 21098",
      hours: "7:00 AM - 9:00 PM",
      specialties: ["Emergency Care", "Large Animal", "Dairy Health"],
      medicineStock: { available: 52, total: 60 },
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const getStockColor = (available, total) => {
    const percentage = (available / total) * 100
    if (percentage >= 80) return "bg-green-500"
    if (percentage >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Nearby Stores</h1>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Distance Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
                <div className="relative">
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.distance}
                    onChange={(e) => setFilters({ ...filters, distance: e.target.value })}
                  >
                    <option>Within 5 km</option>
                    <option>Within 10 km</option>
                    <option>Within 20 km</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Specialty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                <div className="relative">
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.specialty}
                    onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
                  >
                    <option>All Specialties</option>
                    <option>Antibiotics</option>
                    <option>Vaccines</option>
                    <option>Emergency Care</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Open Now Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Open Now</label>
                <div className="flex items-center p-3">
                  <input
                    type="checkbox"
                    id="openOnly"
                    checked={filters.openOnly}
                    onChange={(e) => setFilters({ ...filters, openOnly: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="openOnly" className="ml-2 text-sm text-gray-700">
                    Show only open stores
                  </label>
                </div>
              </div>

              {/* Apply Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Store Cards */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
          {stores.map((store) => (
            <motion.div
              key={store.id}
              variants={cardVariants}
              whileHover={{ y: -2 }}
              className="bg-white rounded-lg shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Store Info */}
                <div className="lg:col-span-2">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{store.name}</h3>
                      <div className="flex items-center mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium text-gray-700">{store.rating}</span>
                        <span className="ml-2 text-sm text-gray-500">({store.distance})</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{store.address}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span className="text-sm">{store.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{store.hours}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-2">
                      {store.specialties.map((specialty, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions & Stock */}
                <div className="space-y-4">
                  {/* Medicine Stock */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Medicine Stock</span>
                      <span className="text-sm text-gray-600">Available</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">
                        {store.medicineStock.available}/{store.medicineStock.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(store.medicineStock.available / store.medicineStock.total) * 100}%`,
                        }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-2 rounded-full ${getStockColor(store.medicineStock.available, store.medicineStock.total)}`}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Store
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Set Alert
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
