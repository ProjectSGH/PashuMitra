"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Edit3, Trash2, ChevronDown, Filter, X, GripVertical, RefreshCw, Package, ArrowRight, List, BarChart3, AlertTriangle, Upload } from "lucide-react"
import resources from "../../resource"

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

  // New states for manual add functionality
  const [manualSearchTerm, setManualSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

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
  const [isDragOver, setIsDragOver] = useState(false)

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

  // Search suggestions for manual add
  useEffect(() => {
    if (manualSearchTerm.length > 1) {
      const filtered = medicineList.filter(medicine =>
        medicine.name.toLowerCase().includes(manualSearchTerm.toLowerCase()) ||
        medicine.manufacturer.toLowerCase().includes(manualSearchTerm.toLowerCase()) ||
        medicine.composition.toLowerCase().includes(manualSearchTerm.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [manualSearchTerm, medicineList])

  // Drag and drop handlers
  const handleDragStart = (medicine) => {
    setDraggedMedicine(medicine)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (draggedMedicine) {
      // Auto-fill supplier with manufacturer when dragging
      const formData = {
        quantity: 0,
        expiry: "",
        price: draggedMedicine.defaultPrice || 0,
        supplier: draggedMedicine.manufacturer, // Auto-fill supplier with manufacturer
        status: "In Stock"
      }
      
      setSelectedMedicine({
        ...draggedMedicine,
        ...formData
      })
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

  // Update medicine - FIXED: Now properly updates existing medicine
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
      setIsModalOpen(false)
      setSelectedMedicine(null)
      setError("")
    } catch (err) {
      console.error("Error updating medicine:", err)
      setError(err.message || "Failed to update medicine. Please try again.")
    }
  }

  // Delete medicine
  const handleDeleteMedicine = async (medicineId) => {
    if (!confirm("Are you sure you want to delete this medicine from your inventory?")) return
    
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

  // Handle manual add from suggestions
  const handleManualAdd = (medicine) => {
    setShowSuggestions(false)
    setManualSearchTerm("")
    
    // Auto-fill supplier with manufacturer
    const formData = {
      quantity: 0,
      expiry: "",
      price: medicine.defaultPrice || 0,
      supplier: medicine.manufacturer, // Auto-fill supplier with manufacturer
      status: "In Stock"
    }
    
    setSelectedMedicine({
      ...medicine,
      ...formData
    })
    setIsModalOpen(true)
  }

  // Handle new medicine creation (not in catalog)
  const handleCreateNewMedicine = () => {
    if (manualSearchTerm.trim()) {
      const newMedicine = {
        _id: `new-${Date.now()}`,
        name: manualSearchTerm,
        category: "Other",
        manufacturer: "Unknown",
        composition: "To be specified",
        description: "New medicine entry",
        defaultPrice: 0,
        type: "Tablet",
        expiryRange: "1 year"
      }
      
      handleManualAdd(newMedicine)
    }
  }

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || medicine.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get low stock medicines
  const lowStockMedicines = medicines.filter(med => med.quantity < 10 && med.quantity > 0)
  const outOfStockMedicines = medicines.filter(med => med.quantity === 0)

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Manage your medicine stock and inventory</p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Medicines</p>
                <p className="text-2xl font-bold text-gray-900">{medicines.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-green-600">
                  {medicines.filter(m => m.quantity > 0).length}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{lowStockMedicines.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockMedicines.length}</p>
              </div>
              <X className="w-8 h-8 text-red-600" />
            </div>
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
            {/* Quick Add Medicine Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Quick Add Medicine</h2>
                  <p className="text-gray-600">Search and add medicines to your inventory</p>
                </div>
                
                <div className="relative flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={manualSearchTerm}
                      onChange={(e) => setManualSearchTerm(e.target.value)}
                      placeholder="Search medicine name, manufacturer, or composition..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                    
                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                        {suggestions.map((medicine) => (
                          <button
                            key={medicine._id}
                            onClick={() => handleManualAdd(medicine)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">{medicine.name}</h4>
                                <p className="text-sm text-gray-600">{medicine.manufacturer}</p>
                                <p className="text-xs text-gray-500 mt-1">{medicine.composition}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-green-600">₹{medicine.defaultPrice}</p>
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                  {medicine.type}
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                        
                        {/* Add new medicine option */}
                        <button
                          onClick={handleCreateNewMedicine}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-t border-gray-200 bg-blue-25"
                        >
                          <div className="flex items-center gap-2 text-blue-600">
                            <Plus size={16} />
                            <span>Add "{manualSearchTerm}" as new medicine</span>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {manualSearchTerm && !showSuggestions && (
                    <div className="mt-2">
                      <button
                        onClick={handleCreateNewMedicine}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus size={16} />
                        Add "{manualSearchTerm}" as new medicine
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
              
              {/* Medicine Catalog - Left Side */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="xl:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Medicine Catalog</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Package size={16} />
                      {medicineList.length}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Drag medicines to add to inventory</p>
                </div>
                
                <div className="p-4">
                  <div className="min-h-[400px] max-h-[500px] overflow-y-auto">
                    {loading ? (
                      <div className="flex justify-center items-center py-8">
                        <img src={resources.CustomLoader.src} alt="Loading..." className="w-12 h-12" />
                      </div>
                    ) : medicineList.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <Package className="mx-auto mb-3 text-gray-400" size={40} />
                        <h3 className="text-sm font-semibold mb-1">No Medicines</h3>
                        <p className="text-xs">Medicine catalog is empty</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {medicineList.map((medicine) => (
                          <motion.div
                            key={medicine._id}
                            draggable
                            onDragStart={() => handleDragStart(medicine)}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-3 cursor-move hover:bg-gray-100 transition-colors group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-3">
                              <GripVertical className="text-gray-400 flex-shrink-0 group-hover:text-gray-600" size={14} />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 text-sm truncate">{medicine.name}</h3>
                                <p className="text-xs text-gray-600 truncate">{medicine.manufacturer}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                                    {medicine.type}
                                  </span>
                                  <span className="text-xs text-green-600 font-medium">₹{medicine.defaultPrice}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Right Side - Drop Zone and Inventory */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="xl:col-span-2 space-y-6"
              >
                {/* Drop Zone Section */}
                <div 
                  className={`bg-white rounded-lg shadow-sm border-2 border-dashed p-8 text-center transition-all duration-200 ${
                    isDragOver 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-25'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className={`w-12 h-12 mx-auto mb-4 ${
                    isDragOver ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {isDragOver ? 'Drop to Add Medicine' : 'Drop Zone'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop medicines from the catalog here to add them to your inventory
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <GripVertical size={16} />
                    <span>Drag medicines from the left panel</span>
                  </div>
                </div>

                {/* Inventory Management Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">My Inventory</h2>
                        <p className="text-sm text-gray-600">Manage your medicine stock</p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <div className="flex items-center gap-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                          <Package size={12} />
                          {medicines.length} items
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Search and Filter */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search inventory..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>

                      <div className="relative">
                        <button
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[140px] justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Filter size={14} />
                            {selectedCategory}
                          </div>
                          <ChevronDown size={14} className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
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
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
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
                  <div className="p-4">
                    {loading ? (
                      <div className="flex justify-center items-center py-8">
                        <img src={resources.CustomLoader.src} alt="Loading..." className="w-12 h-12" />
                      </div>
                    ) : medicines.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="mx-auto mb-4 text-gray-400" size={48} />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Your inventory is empty</h3>
                        <p className="text-gray-600 mb-4">Add medicines using the search above or drag from catalog</p>
                      </div>
                    ) : filteredMedicines.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No medicines found matching your search criteria.
                      </div>
                    ) : (
                      <div className="overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Medicine</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Category</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Stock</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Price</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Expiry</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredMedicines.map((medicine, index) => (
                              <motion.tr
                                key={medicine._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                              >
                                <td className="py-3 px-4">
                                  <div>
                                    <div className="font-medium text-gray-900 text-sm">{medicine.name}</div>
                                    <div className="text-xs text-gray-500">{medicine.manufacturer}</div>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                    {medicine.category}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-sm font-medium ${
                                      medicine.quantity === 0 ? 'text-red-600' : 
                                      medicine.quantity < 10 ? 'text-yellow-600' : 'text-green-600'
                                    }`}>
                                      {medicine.quantity}
                                    </span>
                                    {medicine.quantity < 10 && medicine.quantity > 0 && (
                                      <AlertTriangle className="w-3 h-3 text-yellow-500" />
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="text-sm font-semibold text-green-600">₹{medicine.price}</span>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="text-sm text-red-600">{medicine.expiry}</span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => {
                                        setSelectedMedicine(medicine)
                                        setIsModalOpen(true)
                                      }}
                                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                      title="Edit"
                                    >
                                      <Edit3 size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteMedicine(medicine._id)}
                                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Add/Edit Medicine Modal */}
            {isModalOpen && selectedMedicine && (
              <AddEditMedicineModal
                medicine={selectedMedicine}
                onClose={() => {
                  setIsModalOpen(false)
                  setSelectedMedicine(null)
                }}
                onSubmit={medicines.some(med => med._id === selectedMedicine._id) ? handleUpdateMedicine : handleAddMedicine}
                isEdit={medicines.some(med => med._id === selectedMedicine._id)}
                isNewMedicine={selectedMedicine._id?.startsWith('new-')}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Updated Modal Component with auto-filled supplier
function AddEditMedicineModal({ medicine, onClose, onSubmit, isEdit = false, isNewMedicine = false }) {
  const [formData, setFormData] = useState({
    quantity: 0,
    expiry: "",
    price: medicine.defaultPrice || 0,
    supplier: medicine.manufacturer || "", // Auto-fill with manufacturer
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
        supplier: medicine.supplier || medicine.manufacturer || "", // Prefer existing supplier, fallback to manufacturer
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
      if (isEdit) {
        await onSubmit(medicine._id, formData) // Pass medicine ID for updates
      } else {
        await onSubmit(formData) // Just form data for new entries
      }
    } finally {
      setLoading(false)
    }
  }

  // Calculate suggested expiry date based on expiryRange
  const getSuggestedExpiryDate = () => {
    const today = new Date()
    const range = medicine.expiryRange
    
    if (range?.includes('year')) {
      const years = parseInt(range)
      today.setFullYear(today.getFullYear() + years)
    } else if (range?.includes('month')) {
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
            {isEdit ? 'Edit Medicine' : isNewMedicine ? 'Add New Medicine' : 'Add to Inventory'}
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
          {isNewMedicine && (
            <div className="mb-2 p-2 bg-yellow-100 text-yellow-800 rounded text-sm">
              ⚠️ This is a new medicine entry. Please verify details below.
            </div>
          )}
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
            {medicine.expiryRange && (
              <p className="text-xs text-gray-500 mt-1">
                Suggested: {getSuggestedExpiryDate()} (based on {medicine.expiryRange})
              </p>
            )}
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
            <p className="text-xs text-gray-500 mt-1">
              Auto-filled from manufacturer
            </p>
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
                isEdit ? 'Update Medicine' : isNewMedicine ? 'Add New Medicine' : 'Add to Inventory'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}