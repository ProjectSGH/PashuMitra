"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, ChevronDown } from "lucide-react"

export default function MedicineSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchBy, setSearchBy] = useState("Medicine Name")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const medicines = [
    {
      id: 1,
      name: "Amoxicillin Injectable",
      type: "Antibiotic",
      dosage: "150mg/ml",
      price: "₹245",
      description: "Broad-spectrum antibiotic for bacterial infections in cattle",
      stock: "In Stock",
      stockColor: "bg-green-100 text-green-800",
      availableAt: ["VetCare Pharmacy", "Animal Health Store"],
    },
    {
      id: 2,
      name: "Ivermectin Pour-On",
      type: "Antiparasitic",
      dosage: "500ml",
      price: "₹380",
      description: "Effective treatment for internal and external parasites",
      stock: "Limited Stock",
      stockColor: "bg-yellow-100 text-yellow-800",
      availableAt: ["Rural Vet Supplies"],
    },
    {
      id: 3,
      name: "Calcium Gluconate",
      type: "Supplement",
      dosage: "100ml",
      price: "₹120",
      description: "Calcium supplement for milk fever prevention",
      stock: "In Stock",
      stockColor: "bg-green-100 text-green-800",
      availableAt: ["VetCare Pharmacy", "Farm Health Center"],
    },
  ]

  const searchOptions = ["Medicine Name", "Condition", "Type"]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
    hover: {
      y: -5,
      transition: { duration: 0.2 },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div className="max-w-7xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Search Medicine</h1>
        </motion.div>

        {/* Search Form */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Medicine</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter medicine name or condition..."
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
                    exit={{ opacity: 0, y: -10 }}
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

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full lg:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors duration-200"
            >
              <Search className="w-5 h-5" />
              Search
            </motion.button>
          </div>
        </motion.div>

        {/* Medicine Cards */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {medicines.map((medicine, index) => (
            <motion.div
              key={medicine.id}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              {/* Header with stock status */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex-1">{medicine.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${medicine.stockColor}`}>
                  {medicine.stock}
                </span>
              </div>

              {/* Medicine details */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Type:</span>
                  <span className="text-sm text-gray-900">{medicine.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Dosage:</span>
                  <span className="text-sm text-gray-900">{medicine.dosage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Price:</span>
                  <span className="text-sm font-semibold text-gray-900">{medicine.price}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{medicine.description}</p>

              {/* Available at */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-600 mb-2">Available at:</p>
                <div className="flex flex-wrap gap-2">
                  {medicine.availableAt.map((location, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
                    >
                      {location}
                    </span>
                  ))}
                </div>
              </div>

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
                >
                  Request
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
