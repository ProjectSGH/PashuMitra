"use client"

import { motion } from "framer-motion"
import { Search, Filter, Plus, MoreHorizontal } from "lucide-react"
import toast from "react-hot-toast"

const MedicalStoresPage = () => {
  const statsCards = [
    { title: "Total Stores", value: "4", color: "blue" },
    { title: "Active", value: "3", color: "green" },
    { title: "Pending", value: "1", color: "orange" },
  ]

  const stores = [
    {
      id: 1,
      name: "VetCare Pharmacy",
      email: "info@vetcare.com",
      contact: "+91 9876543230",
      location: "Mumbai",
      license: "MED123456",
      owner: "Rajesh Patel",
      status: "Active",
      statusColor: "green",
      joined: "1/10/2024",
    },
    {
      id: 2,
      name: "Animal Health Store",
      email: "contact@animalhealth.com",
      contact: "+91 9876543231",
      location: "Delhi",
      license: "MED789012",
      owner: "Priya Singh",
      status: "Pending",
      statusColor: "orange",
      joined: "1/12/2024",
    },
    {
      id: 3,
      name: "Farm Medicine Hub",
      email: "info@farmmed.com",
      contact: "+91 9876543232",
      location: "Pune",
      license: "MED345678",
      owner: "Amit Kumar",
      status: "Active",
      statusColor: "green",
      joined: "1/8/2024",
    },
    {
      id: 4,
      name: "Rural Vet Supplies",
      email: "support@ruralvet.com",
      contact: "+91 9876543233",
      location: "Jaipur",
      license: "MED901234",
      owner: "Sunita Sharma",
      status: "Active",
      statusColor: "green",
      joined: "1/5/2024",
    },
  ]

  const getStatusBadge = (status, color) => {
    const colorClasses = {
      green: "bg-green-100 text-green-800 border-green-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
      gray: "bg-gray-100 text-gray-800 border-gray-200",
    }

    return (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${colorClasses[color]}`}>
        {status}
      </span>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Stores</h1>
          <p className="text-gray-600">Manage and monitor all registered medical stores</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => toast.success("Filter applied")}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => toast.success("Add Store clicked")}
          >
            <Plus className="w-4 h-4" />
            Add Store
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          >
            <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search medical stores..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Medical Stores Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">All Medical Stores</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Store Name</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Contact</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Owner</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">License</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Joined</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store, index) => (
                <motion.tr
                  key={store.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{store.name}</div>
                      <div className="text-sm text-gray-500">{store.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-gray-900">{store.contact}</div>
                      <div className="text-sm text-gray-500">{store.location}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{store.owner}</td>
                  <td className="py-4 px-6 text-gray-600">{store.license}</td>
                  <td className="py-4 px-6">{getStatusBadge(store.status, store.statusColor)}</td>
                  <td className="py-4 px-6 text-gray-600">{store.joined}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => toast.success(`Actions for ${store.name}`)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-600" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default MedicalStoresPage
