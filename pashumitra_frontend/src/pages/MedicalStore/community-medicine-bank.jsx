"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Package, TrendingUp, Users, Heart } from "lucide-react"

const donationsData = [
  {
    id: 1,
    donor: "City Medical Store",
    medicine: "Paracetamol",
    quantity: "50 units",
    expiryDate: "2024-12-31",
    donationDate: "2024-01-15",
    status: "available",
  },
  {
    id: 2,
    donor: "Rural Health Pharmacy",
    medicine: "Antibiotics",
    quantity: "25 units",
    expiryDate: "2024-08-15",
    donationDate: "2024-01-14",
    status: "available",
  },
  {
    id: 3,
    donor: "Community Health Center",
    medicine: "Vitamins",
    quantity: "100 units",
    expiryDate: "2025-03-20",
    donationDate: "2024-01-13",
    status: "claimed",
  },
  {
    id: 4,
    donor: "Metro Pharmacy",
    medicine: "Pain Relief",
    quantity: "15 units",
    expiryDate: "2024-06-10",
    donationDate: "2024-01-12",
    status: "expired",
  },
]

export default function CommunityMedicineBank() {
  const [donations, setDonations] = useState(donationsData)

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "text-green-600 bg-green-50 border-green-200"
      case "claimed":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "expired":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const isExpiringSoon = (expiryDate) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const diffTime = expiry - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 180 // Consider expiring soon if within 6 months
  }

  const handleRequest = (id) => {
    setDonations(donations.map((donation) => (donation.id === id ? { ...donation, status: "claimed" } : donation)))
  }

  // Calculate summary stats
  const availableMedicines = donations.filter((d) => d.status === "available").length
  const totalDonated = donations.reduce((sum, d) => sum + Number.parseInt(d.quantity), 0)
  const helpedFarmers = donations.filter((d) => d.status === "claimed").length

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 sm:mb-0"
          >
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Community Medicine Bank</h1>
            <p className="text-gray-600">Share medicines with the community and help those in need</p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Donate Medicine
          </motion.button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Available Medicines</p>
                <p className="text-3xl font-bold text-gray-900">{availableMedicines}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="text-green-600" size={24} />
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
                <p className="text-sm text-gray-600 mb-1">Total Donated</p>
                <p className="text-3xl font-bold text-gray-900">{totalDonated}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="text-blue-600" size={24} />
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
                <p className="text-sm text-gray-600 mb-1">Helped Farmers</p>
                <p className="text-3xl font-bold text-gray-900">{helpedFarmers}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="text-purple-600" size={24} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Current Donations Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Current Donations</h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicine
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donation Date
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donations.map((donation, index) => (
                  <motion.tr
                    key={donation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Heart className="text-red-500" size={16} />
                        <span className="text-sm font-medium text-gray-900">{donation.donor}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">{donation.medicine}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{donation.quantity}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-sm ${isExpiringSoon(donation.expiryDate) ? "text-red-600" : "text-gray-900"}`}
                      >
                        {donation.expiryDate}
                        {isExpiringSoon(donation.expiryDate) && (
                          <span className="text-red-500 text-xs ml-1">(Soon)</span>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">{donation.donationDate}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(donation.status)}`}
                      >
                        {donation.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {donation.status === "available" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRequest(donation.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                        >
                          Request
                        </motion.button>
                      )}
                      {donation.status === "claimed" && (
                        <span className="text-blue-600 text-sm font-medium">Claimed</span>
                      )}
                      {donation.status === "expired" && (
                        <span className="text-red-600 text-sm font-medium">Expired</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {donations.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-gray-500">
            No donations available at the moment.
          </motion.div>
        )}
      </div>
    </div>
  )
}
