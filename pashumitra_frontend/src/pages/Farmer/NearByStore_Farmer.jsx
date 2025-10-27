"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Phone, Clock, Star, MapPin, ChevronDown, Bell, Navigation, RefreshCw } from "lucide-react"

export default function NearbyStores() {
  const [filters, setFilters] = useState({
    distance: "Within 5 km",
    specialty: "All Specialties",
    openOnly: false,
  })
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch stores from API
  const fetchStores = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Build query string from filters
      const queryParams = new URLSearchParams({
        distance: filters.distance,
        specialty: filters.specialty,
        openOnly: filters.openOnly.toString()
      }).toString()

      const response = await fetch(`/api/stores/filter/stores?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch stores')
      }

      const storesData = await response.json()
      setStores(storesData)
    } catch (err) {
      console.error('Error fetching stores:', err)
      setError('Failed to load stores. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch stores when component mounts
  useEffect(() => {
    fetchStores()
  }, [])

  // Handle filter changes
  const handleFilterChange = () => {
    fetchStores()
  }

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

  const handleCallStore = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, '_self')
  }

  const handleGetDirections = (address) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    window.open(mapsUrl, '_blank')
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stores...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchStores}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Nearby Stores {stores.length > 0 && `(${stores.length})`}
          </h1>

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
                    <option>All</option>
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
                    <option>General Veterinary Medicine</option>
                    <option>Small Animal Medicine</option>
                    <option>Large Animal Medicine</option>
                    <option>Veterinary Surgery</option>
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

              {/* Apply Filters Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFilterChange}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Apply Filters
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Store Cards */}
        {stores.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <MapPin className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No stores found</h3>
              <p className="text-gray-500 mb-4">
                {filters.openOnly || filters.specialty !== "All Specialties" || filters.distance !== "Within 5 km" 
                  ? "No stores match your current filters. Try adjusting your search criteria."
                  : "No medical stores are currently registered in the system."}
              </p>
              {(filters.openOnly || filters.specialty !== "All Specialties" || filters.distance !== "Within 5 km") && (
                <button 
                  onClick={() => {
                    setFilters({ distance: "Within 5 km", specialty: "All Specialties", openOnly: false })
                    setTimeout(() => fetchStores(), 100)
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible" 
            className="space-y-4"
          >
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
                      {store.established && (
                        <div className="text-sm text-gray-500 mt-2 sm:mt-0">
                          Est. {new Date(store.established).getFullYear()}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">
                          {store.address}, {store.city}, {store.state} - {store.pincode}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">{store.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">{store.hours}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-2">
                        {store.specialties.map((specialty, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
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
                          {store.medicineStock.available}/{store.medicineStock.total} medicines
                        </span>
                        <span className="text-xs text-gray-500">
                          {Math.round((store.medicineStock.available / store.medicineStock.total) * 100)}%
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
                        onClick={() => handleCallStore(store.phone)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Store
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleGetDirections(`${store.address}, ${store.city}, ${store.state}`)}
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
        )}
      </div>
    </div>
  )
}