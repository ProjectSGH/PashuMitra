"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronDown, Plus, Minus, X, Clock } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

export default function MedicineSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchBy, setSearchBy] = useState("Medicine Name")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [medicines, setMedicines] = useState([])
  const [farmerData, setFarmerData] = useState(null)
  const [selectedMedicine, setSelectedMedicine] = useState(null)
  const [orderModal, setOrderModal] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)
  
  // Order form state
  const [orderForm, setOrderForm] = useState({
    quantity: 1,
    animalType: "",
    animalCount: 1,
    animalWeight: "",
    animalAge: "",
    symptoms: "",
    deliveryOption: "pickup",
    deliveryAddress: "",
    farmerNotes: ""
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user && user.role === "Farmer") {
      setFarmerData(user)
    }
    fetchMedicines()
  }, [])

  const fetchMedicines = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/medicines/available")
      const data = await res.json()
      setMedicines(data)
    } catch (err) {
      console.error("Error fetching medicines:", err)
      toast.error("Failed to load medicines")
    }
  }

  const openOrderModal = (medicine) => {
    if (!farmerData) {
      toast.error("Please login as a farmer to order medicines")
      return
    }
    setSelectedMedicine(medicine)
    setOrderForm({
      quantity: 1,
      animalType: "",
      animalCount: 1,
      animalWeight: "",
      animalAge: "",
      symptoms: "",
      deliveryOption: "pickup",
      deliveryAddress: "",
      farmerNotes: ""
    })
    setOrderModal(true)
  }

  const closeOrderModal = () => {
    setOrderModal(false)
    setSelectedMedicine(null)
  }

  const handleOrderSubmit = async () => {
    if (!farmerData || !selectedMedicine) return

    // Validate form
    if (!orderForm.animalType || !orderForm.animalCount) {
      toast.error("Please fill in animal type and count")
      return
    }

    if (orderForm.quantity > selectedMedicine.quantity) {
      toast.error(`Cannot order more than available quantity (${selectedMedicine.quantity})`)
      return
    }

    try {
      setOrderLoading(true)

      const orderData = {
        medicineId: selectedMedicine._id,
        storeId: selectedMedicine.storeId,
        farmerId: farmerData._id,
        farmerName: farmerData.name || farmerData.email,
        farmerContact: farmerData.phone || "Not provided",
        farmerLocation: farmerData.location || "Not specified",
        animalType: orderForm.animalType,
        animalCount: orderForm.animalCount,
        animalWeight: orderForm.animalWeight,
        animalAge: orderForm.animalAge,
        symptoms: orderForm.symptoms,
        quantityRequested: orderForm.quantity,
        deliveryOption: orderForm.deliveryOption,
        deliveryAddress: orderForm.deliveryAddress,
        farmerNotes: orderForm.farmerNotes
      }

      const response = await axios.post(
        "http://localhost:5000/api/medicine-orders",
        orderData
      )

      if (response.data.success) {
        toast.success("Medicine order placed successfully! The store will contact you soon.")
        closeOrderModal()
        fetchMedicines() // Refresh medicine list
      }
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error(error.response?.data?.message || "Failed to place order")
    } finally {
      setOrderLoading(false)
    }
  }

  const searchOptions = ["Medicine Name", "Category", "Manufacturer"]

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
      {/* Order Modal */}
      <AnimatePresence>
        {orderModal && selectedMedicine && (
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
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Order Medicine</h3>
                  <button onClick={closeOrderModal} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Medicine Info */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">{selectedMedicine.name}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Price: ₹{selectedMedicine.price}</div>
                    <div>Available: {selectedMedicine.quantity} units</div>
                    <div>Manufacturer: {selectedMedicine.manufacturer}</div>
                    <div>Store: {selectedMedicine.storeName}</div>
                  </div>
                </div>

                {/* Order Form */}
                <div className="space-y-4">
                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity Required
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setOrderForm(prev => ({ 
                          ...prev, 
                          quantity: Math.max(1, prev.quantity - 1) 
                        }))}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-semibold min-w-8 text-center">
                        {orderForm.quantity}
                      </span>
                      <button
                        onClick={() => setOrderForm(prev => ({ 
                          ...prev, 
                          quantity: Math.min(selectedMedicine.quantity, prev.quantity + 1) 
                        }))}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <div className="ml-4 text-sm text-gray-600">
                        Total: ₹{selectedMedicine.price * orderForm.quantity}
                      </div>
                    </div>
                  </div>

                  {/* Animal Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Animal Type *
                      </label>
                      <select
                        value={orderForm.animalType}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, animalType: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Animal Type</option>
                        <option value="Cattle">Cattle</option>
                        <option value="Poultry">Poultry</option>
                        <option value="Sheep">Sheep</option>
                        <option value="Goat">Goat</option>
                        <option value="Pig">Pig</option>
                        <option value="Horse">Horse</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Animals *
                      </label>
                      <input
                        type="number"
                        value={orderForm.animalCount}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, animalCount: parseInt(e.target.value) || 1 }))}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Average Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={orderForm.animalWeight}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, animalWeight: e.target.value }))}
                        placeholder="Optional"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Animal Age
                      </label>
                      <input
                        type="text"
                        value={orderForm.animalAge}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, animalAge: e.target.value }))}
                        placeholder="e.g., 2 years, 6 months"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Symptoms or Condition
                    </label>
                    <textarea
                      value={orderForm.symptoms}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, symptoms: e.target.value }))}
                      placeholder="Describe the symptoms or condition of your animals..."
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Delivery Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Option
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="pickup"
                          checked={orderForm.deliveryOption === "pickup"}
                          onChange={(e) => setOrderForm(prev => ({ ...prev, deliveryOption: e.target.value }))}
                          className="mr-2"
                        />
                        Store Pickup
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="delivery"
                          checked={orderForm.deliveryOption === "delivery"}
                          onChange={(e) => setOrderForm(prev => ({ ...prev, deliveryOption: e.target.value }))}
                          className="mr-2"
                        />
                        Home Delivery
                      </label>
                    </div>
                  </div>

                  {orderForm.deliveryOption === "delivery" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Address
                      </label>
                      <textarea
                        value={orderForm.deliveryAddress}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                        placeholder="Enter your complete delivery address..."
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={orderForm.farmerNotes}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, farmerNotes: e.target.value }))}
                      placeholder="Any additional information for the store..."
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex gap-3">
                  <button
                    onClick={closeOrderModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleOrderSubmit}
                    disabled={orderLoading || !orderForm.animalType || !orderForm.animalCount}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {orderLoading ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      `Place Order - ₹${selectedMedicine.price * orderForm.quantity}`
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rest of the component remains the same */}
      <motion.div className="max-w-7xl mx-auto" initial="hidden" animate="visible">
        {/* Header */}
        <motion.div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Search Medicine</h1>
          <p className="text-gray-600">Available medicines from all medical stores</p>
        </motion.div>

        {/* Search Form - Same as before */}
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
                  <span className="text-sm font-medium text-gray-600">Available:</span>
                  <span className="text-sm text-gray-900">{medicine.quantity} units</span>
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
                  onClick={() => openOrderModal(medicine)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={medicine.status !== "In Stock" || medicine.quantity === 0}
                >
                  {medicine.status === "In Stock" && medicine.quantity > 0 ? "Order" : "Out of Stock"}
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