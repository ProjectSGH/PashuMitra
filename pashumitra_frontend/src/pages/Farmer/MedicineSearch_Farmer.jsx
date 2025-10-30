"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, ChevronDown } from "lucide-react"

export default function MedicineSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchBy, setSearchBy] = useState("Medicine Name")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [medicines, setMedicines] = useState([])

  // Fetch available medicines from all stores
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/medicines/available") // New endpoint for available medicines
        const data = await res.json()
        setMedicines(data)
      } catch (err) {
        console.error("Error fetching medicines:", err)
      }
    }
    fetchMedicines()
  }, [])

  const searchOptions = ["Medicine Name", "Category", "Manufacturer"]

  // Search filter
  const filteredMedicines = medicines.filter((medicine) => {
    if (!searchTerm) return true
    
    switch (searchBy) {
      case "Medicine Name":
        return medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
      case "Category":
        return medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
      case "Manufacturer":
        return medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
      default:
        return medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div className="max-w-7xl mx-auto" initial="hidden" animate="visible">
        {/* Header */}
        <motion.div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Search Medicine</h1>
          <p className="text-gray-600">Available medicines from all medical stores</p>
        </motion.div>

        {/* Search Form */}
        <motion.div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Medicine</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Enter ${searchBy.toLowerCase()}...`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>

            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search By</label>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                >
                  <span>{searchBy}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
                  >
                    {searchOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSearchBy(option)
                          setIsDropdownOpen(false)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors duration-150"
                      >
                        {option}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Medicine Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMedicines.map((medicine, index) => (
            <motion.div
              key={medicine._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              {/* Header with stock status */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex-1">{medicine.name}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                    medicine.status === "In Stock"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {medicine.status}
                </span>
              </div>

              {/* Medicine details */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Category:</span>
                  <span className="text-sm text-gray-900">{medicine.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Manufacturer:</span>
                  <span className="text-sm text-gray-900">{medicine.manufacturer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Type:</span>
                  <span className="text-sm text-gray-900">{medicine.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Price:</span>
                  <span className="text-sm font-semibold text-gray-900">₹{medicine.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Store:</span>
                  <span className="text-sm text-gray-900">{medicine.storeName}</span>
                </div>
              </div>

              {/* Composition */}
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                <strong>Composition:</strong> {medicine.composition}
              </p>

              {/* Action buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  View Details
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                  disabled={medicine.status !== "In Stock"}
                >
                  {medicine.status === "In Stock" ? "Order" : "Out of Stock"}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredMedicines.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No medicines found matching your criteria.
          </div>
        )}
      </motion.div>
    </div>
  )
}