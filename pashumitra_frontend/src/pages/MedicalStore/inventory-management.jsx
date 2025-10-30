"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Edit3, Trash2, ChevronDown, Filter, X, GripVertical, RefreshCw, Package, ArrowRight } from "lucide-react"

const categories = ["All Categories", "Antibiotic", "Analgesic", "Antipyretic", "Vitamin Supplement", "Antacid", "Antihistamine", "Antifungal", "Antiseptic", "Antiviral"]

export default function InventoryManagement() {
  const [medicines, setMedicines] = useState([])
  const [medicineList, setMedicineList] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [debugInfo, setDebugInfo] = useState({})
  
  const [storeId, setStoreId] = useState("")

  // Initialize store ID
  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (userId) {
      setStoreId(userId)
    } else {
      const demoStoreId = "68c841acd6f25e4e002618c0"
      console.log("🆔 Using demo store ID:", demoStoreId)
      setStoreId(demoStoreId)
    }
  }, [])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState(null)
  const [draggedMedicine, setDraggedMedicine] = useState(null)

  const fetchData = async () => {
    if (!storeId) {
      console.log("❌ No store ID available")
      setLoading(false)
      return
    }

    try {
      setError("")
      setLoading(true)
      
      const medicinesUrl = `http://localhost:5000/api/medicines/store/${storeId}`
      const medicineListUrl = `http://localhost:5000/api/medicine-list`
      
      const [medicinesRes, medicineListRes] = await Promise.all([
        fetch(medicinesUrl),
        fetch(medicineListUrl)
      ])
      

      if (!medicinesRes.ok) throw new Error('Failed to fetch store medicines')
      if (!medicineListRes.ok) throw new Error('Failed to fetch medicine list')
      
      const medicinesData = await medicinesRes.json()
      const medicineListData = await medicineListRes.json()
      
      setMedicines(medicinesData)
      setMedicineList(medicineListData)
      
      setDebugInfo({
        storeId,
        medicinesCount: medicinesData.length,
        medicineListCount: medicineListData.length,
        lastUpdated: new Date().toLocaleTimeString()
      })
      
    } catch (err) {
      console.error("❌ Error fetching data:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (storeId) {
      fetchData()
    }
  }, [storeId])

  // Drag and drop handlers
  const handleDragStart = (medicine) => {
    setDraggedMedicine(medicine)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = () => {
    if (draggedMedicine) {
      setSelectedMedicine(draggedMedicine)
      setIsModalOpen(true)
      setDraggedMedicine(null)
    }
  }

  // Add medicine to store inventory
  const handleAddMedicine = async (formData) => {
    try {
      const medicineData = {
        medicineId: selectedMedicine._id,
        storeId: storeId,
        name: selectedMedicine.name,
        category: selectedMedicine.category,
        type: selectedMedicine.type,
        composition: selectedMedicine.composition,
        manufacturer: selectedMedicine.manufacturer,
        description: selectedMedicine.description,
        expiryRange: selectedMedicine.expiryRange,
        ...formData
      }

      console.log("➕ Adding medicine:", medicineData)

      const res = await fetch("http://localhost:5000/api/medicines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medicineData),
      })
      
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to add medicine")
      }
      
      const data = await res.json()
      setMedicines([...medicines, data])
      setIsModalOpen(false)
      setSelectedMedicine(null)
      setError("")
      
      fetchData()
    } catch (err) {
      console.error("Error adding medicine:", err)
      setError(err.message || "Failed to add medicine. Please try again.")
    }
  }

  // Update medicine
  const handleUpdateMedicine = async (medicineId, updatedData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/medicines/${medicineId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
      
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to update medicine")
      }
      
      const data = await res.json()
      setMedicines(medicines.map(med => 
        med._id === medicineId ? data : med
      ))
      setError("")
    } catch (err) {
      console.error("Error updating medicine:", err)
      setError(err.message || "Failed to update medicine. Please try again.")
    }
  }

  // Delete medicine
  const handleDeleteMedicine = async (medicineId) => {
    if (!confirm("Are you sure you want to delete this medicine?")) return
    
    try {
      const res = await fetch(`http://localhost:5000/api/medicines/${medicineId}`, {
        method: "DELETE",
      })
      
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to delete medicine")
      }
      
      setMedicines(medicines.filter(med => med._id !== medicineId))
      setError("")
    } catch (err) {
      console.error("Error deleting medicine:", err)
      setError(err.message || "Failed to delete medicine. Please try again.")
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "text-green-600 bg-green-50"
      case "Low Stock":
        return "text-yellow-600 bg-yellow-50"
      case "Out of Stock":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      "Antibiotic": "text-blue-600 bg-blue-50",
      "Analgesic": "text-purple-600 bg-purple-50",
      "Antipyretic": "text-red-600 bg-red-50",
      "Vitamin Supplement": "text-green-600 bg-green-50",
      "Antacid": "text-orange-600 bg-orange-50",
      "Antihistamine": "text-indigo-600 bg-indigo-50",
      "Antifungal": "text-pink-600 bg-pink-50",
      "Antiseptic": "text-teal-600 bg-teal-50",
      "Antiviral": "text-cyan-600 bg-cyan-50"
    }
    return colors[category] || "text-gray-600 bg-gray-50"
  }

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || medicine.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Debug Info */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-blue-800">Debug Info</h3>
              <p className="text-sm text-blue-600">
                Store: {debugInfo.storeId} | 
                Inventory: {debugInfo.medicinesCount} | 
                Catalog: {debugInfo.medicineListCount} |
                Updated: {debugInfo.lastUpdated}
              </p>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center"
          >
            <span>{error}</span>
            <button onClick={() => setError("")} className="text-red-700 hover:text-red-900">
              <X size={16} />
            </button>
          </motion.div>
        )}

        {!storeId ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded"
          >
            Loading store information...
          </motion.div>
        ) : (
          <>
            {/* Main Grid Layout - Side by Side */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              
              {/* Medicine Catalog Section - Left Side */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-sm"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Medicine Catalog</h2>
                      <p className="text-gray-600 mt-1">Drag medicines to your inventory</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Package size={16} />
                      {medicineList.length} available
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div 
                    className="min-h-[400px] max-h-[600px] overflow-y-auto border-2 border-dashed border-gray-300 rounded-lg p-4"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {loading ? (
                      <div className="text-center text-gray-500 py-8">
                        <RefreshCw className="animate-spin mx-auto mb-2" />
                        Loading medicine catalog...
                      </div>
                    ) : medicineList.length === 0 ? (
                      <div className="text-center text-gray-500 py-12">
                        <Package className="mx-auto mb-4 text-gray-400" size={48} />
                        <h3 className="text-lg font-semibold mb-2">No Medicines in Catalog</h3>
                        <p className="text-sm mb-4">The medicine catalog is empty.</p>
                        <button 
                          onClick={() => window.open('http://localhost:5000/api/medicine-list', '_blank')}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Check API
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {medicineList.map((medicine) => (
                          <motion.div
                            key={medicine._id}
                            draggable
                            onDragStart={() => handleDragStart(medicine)}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-move flex items-center gap-3 hover:bg-gray-100 transition-colors group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <GripVertical className="text-gray-400 flex-shrink-0 group-hover:text-gray-600" size={16} />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 truncate">{medicine.name}</h3>
                              <p className="text-sm text-gray-600 truncate">{medicine.manufacturer}</p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                  {medicine.type}
                                </span>
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                  {medicine.category}
                                </span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-sm font-semibold text-green-600">₹{medicine.defaultPrice}</p>
                              <ArrowRight size={14} className="text-gray-400 ml-auto mt-1" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Drop Instruction */}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                      <GripVertical size={16} />
                      Drag medicines to the inventory section
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Inventory Section - Right Side */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-b border-gray-200">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                      My Inventory
                    </h1>
                    <div className="text-sm text-gray-600">
                      {medicines.length} medicines in inventory
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <div className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                      <Package size={14} />
                      Drop zone for medicines
                    </div>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search medicines..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[180px] justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Filter size={16} />
                          {selectedCategory}
                        </div>
                        <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                          {categories.map((category) => (
                            <button
                              key={category}
                              onClick={() => {
                                setSelectedCategory(category)
                                setIsDropdownOpen(false)
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Inventory Content */}
                <div className="p-6">
                  {loading ? (
                    <div className="text-center py-12 text-gray-500">
                      <RefreshCw className="animate-spin mx-auto mb-2" />
                      Loading inventory...
                    </div>
                  ) : medicines.length === 0 ? (
                    <div 
                      className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <Package className="mx-auto mb-4 text-gray-400" size={64} />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Your inventory is empty</h3>
                      <p className="text-gray-600 mb-6">Drag medicines from the catalog to add them here.</p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                        <p className="text-sm text-blue-800">
                          💡 <strong>How to add medicines:</strong> Drag any medicine from the catalog on the left and drop it here to add to your inventory.
                        </p>
                      </div>
                    </div>
                  ) : filteredMedicines.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      No medicines found matching your search criteria.
                    </div>
                  ) : (
                    <div 
                      className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      {filteredMedicines.map((medicine, index) => (
                        <motion.div
                          key={medicine._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold text-gray-900">{medicine.name}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              medicine.status === "In Stock" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {medicine.status}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Category:</span>
                              <span className="font-medium">{medicine.category}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Quantity:</span>
                              <span className="font-medium">{medicine.quantity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Price:</span>
                              <span className="font-semibold text-green-600">₹{medicine.price}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Expiry:</span>
                              <span className="text-red-600">{medicine.expiry}</span>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 mt-4">
                            <button
                              onClick={() => {
                                setSelectedMedicine(medicine)
                                setIsModalOpen(true)
                              }}
                              className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMedicine(medicine._id)}
                              className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Add Medicine Modal */}
            {isModalOpen && selectedMedicine && (
              <AddMedicineModal
                medicine={selectedMedicine}
                onClose={() => {
                  setIsModalOpen(false)
                  setSelectedMedicine(null)
                }}
                onSubmit={handleAddMedicine}
                isEdit={medicines.some(med => med.medicineId === selectedMedicine._id)}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Modal Component (keep the same as before)
function AddMedicineModal({ medicine, onClose, onSubmit, isEdit = false }) {
  const [formData, setFormData] = useState({
    quantity: 0,
    expiry: "",
    price: medicine.defaultPrice || 0,
    supplier: "",
    status: "In Stock"
  })

  const [loading, setLoading] = useState(false)

  // Initialize form data when medicine changes
  useEffect(() => {
    if (medicine) {
      setFormData({
        quantity: medicine.quantity || 0,
        expiry: medicine.expiry || "",
        price: medicine.price || medicine.defaultPrice || 0,
        supplier: medicine.supplier || "",
        status: medicine.status || "In Stock"
      })
    }
  }, [medicine])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value 
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  // Calculate suggested expiry date based on expiryRange
  const getSuggestedExpiryDate = () => {
    const today = new Date()
    const range = medicine.expiryRange
    
    if (range.includes('year')) {
      const years = parseInt(range)
      today.setFullYear(today.getFullYear() + years)
    } else if (range.includes('month')) {
      const months = parseInt(range)
      today.setMonth(today.getMonth() + months)
    }
    
    return today.toISOString().split('T')[0]
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isEdit ? 'Edit Medicine' : 'Add to Inventory'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Medicine Info */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900">{medicine.name}</h3>
          <p className="text-sm text-gray-600">{medicine.manufacturer}</p>
          <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-600">
            <div><strong>Category:</strong> {medicine.category}</div>
            <div><strong>Type:</strong> {medicine.type}</div>
            <div className="col-span-2"><strong>Composition:</strong> {medicine.composition}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date *
            </label>
            <input
              type="date"
              name="expiry"
              value={formData.expiry}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Suggested: {getSuggestedExpiryDate()} (based on {medicine.expiryRange})
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="1"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Default price: ₹{medicine.defaultPrice}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier
            </label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              placeholder="Enter supplier name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {isEdit ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                isEdit ? 'Update Medicine' : 'Add to Inventory'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}