"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Edit3, Trash2, ChevronDown, Filter, X } from "lucide-react"

const categories = ["All Categories", "Pain Relief", "Antibiotic", "Vitamin", "Supplement"]

export default function InventoryManagement() {
  const [medicines, setMedicines] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Add Medicine modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    category: "Pain Relief",
    quantity: 0,
    expiry: "",
    price: 0,
    supplier: "",
    status: "In Stock",
  })

  // Fetch medicines dynamically
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/medicines") // backend must be running
        const data = await res.json()
        setMedicines(data)
      } catch (err) {
        console.error("Error fetching medicines:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchMedicines()
  }, [])

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
      "Pain Relief": "text-blue-600 bg-blue-50",
      Antibiotic: "text-purple-600 bg-purple-50",
      Vitamin: "text-green-600 bg-green-50",
      Supplement: "text-orange-600 bg-orange-50",
    }
    return colors[category] || "text-gray-600 bg-gray-50"
  }

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || medicine.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target
    setNewMedicine((prev) => ({ ...prev, [name]: value }))
  }

  // Add medicine (POST)
  const handleAddMedicine = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:5000/api/medicines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMedicine),
      })
      const data = await res.json()
      if (res.ok) {
        setMedicines([...medicines, data]) // update list instantly
        setIsModalOpen(false)
        setNewMedicine({ name: "", category: "Pain Relief", quantity: 0, expiry: "", price: 0, supplier: "", status: "In Stock" })
      } else {
        console.error("Error adding medicine:", data.error)
      }
    } catch (err) {
      console.error("Error adding medicine:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto bg-white rounded-lg shadow-sm"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-b border-gray-200">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0"
          >
            Inventory Management
          </motion.h1>
          <motion.button
            onClick={() => setIsModalOpen(true)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Medicine
          </motion.button>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative flex-1"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative"
            >
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
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
                >
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
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading medicines...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicine
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMedicines.map((medicine, index) => (
                  <motion.tr
                    key={medicine._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{medicine.name}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(medicine.category)}`}
                      >
                        {medicine.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(medicine.status)}`}
                      >
                        {medicine.quantity} - {medicine.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-red-600">{medicine.expiry}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">${medicine.price}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{medicine.supplier}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit3 size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filteredMedicines.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-gray-500">
            No medicines found matching your criteria.
          </motion.div>
        )}
      </motion.div>

      {/* Add Medicine Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Medicine</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMedicine} className="space-y-4">
              <input
                type="text"
                name="name"
                value={newMedicine.name}
                onChange={handleChange}
                placeholder="Medicine Name"
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
              <select
                name="category"
                value={newMedicine.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="Pain Relief">Pain Relief</option>
                <option value="Antibiotic">Antibiotic</option>
                <option value="Vitamin">Vitamin</option>
                <option value="Supplement">Supplement</option>
              </select>
              <input
                type="number"
                name="quantity"
                value={newMedicine.quantity}
                onChange={handleChange}
                placeholder="Quantity"
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                name="expiry"
                value={newMedicine.expiry}
                onChange={handleChange}
                placeholder="Expiry Date (YYYY-MM-DD)"
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="number"
                step="0.01"
                name="price"
                value={newMedicine.price}
                onChange={handleChange}
                placeholder="Price"
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                name="supplier"
                value={newMedicine.supplier}
                onChange={handleChange}
                placeholder="Supplier"
                className="w-full px-3 py-2 border rounded-lg"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Save Medicine
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
