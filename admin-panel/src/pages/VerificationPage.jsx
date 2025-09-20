"use client"

import { motion } from "framer-motion"
import { Search, Filter, Eye, Clock, CheckCircle, XCircle } from "lucide-react"
import toast from "react-hot-toast"

const VerificationsPage = () => {
  const statsCards = [
    { title: "Total Requests", value: "3", color: "blue" },
    { title: "Pending", value: "1", color: "orange" },
    { title: "Approved", value: "1", color: "green" },
  ]

  const verifications = [
    {
      id: 1,
      userDetails: {
        name: "Dr. Rajesh Kumar",
        email: "rajesh.kumar@email.com",
      },
      role: "Doctor",
      contact: "+91 9876543210",
      documents: "3 docs",
      submitted: "1/15/2024",
      status: "Pending",
      statusColor: "orange",
    },
    {
      id: 2,
      userDetails: {
        name: "Ram Singh",
        email: "ram.singh@email.com",
      },
      role: "Farmer",
      contact: "+91 9876543211",
      documents: "2 docs",
      submitted: "1/14/2024",
      status: "Approved",
      statusColor: "green",
    },
    {
      id: 3,
      userDetails: {
        name: "MediCare Pharmacy",
        email: "info@medicare.com",
      },
      role: "Medical Store",
      contact: "+91 9876543212",
      documents: "3 docs",
      submitted: "1/13/2024",
      status: "Rejected",
      statusColor: "red",
    },
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4" />
      case "Approved":
        return <CheckCircle className="w-4 h-4" />
      case "Rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status, color) => {
    const colorClasses = {
      orange: "bg-orange-100 text-orange-800 border-orange-200",
      green: "bg-green-100 text-green-800 border-green-200",
      red: "bg-red-100 text-red-800 border-red-200",
    }

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${colorClasses[color]}`}
      >
        {getStatusIcon(status)}
        {status}
      </span>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verifications</h1>
          <p className="text-gray-600">Review and approve user verification requests</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => toast.success("Filter applied")}
        >
          <Filter className="w-4 h-4" />
          Filter
        </button>
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
            placeholder="Search verifications..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Verification Requests Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Verification Requests</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-600">User Details</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Role</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Contact</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Documents</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Submitted</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {verifications.map((verification, index) => (
                <motion.tr
                  key={verification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{verification.userDetails.name}</div>
                      <div className="text-sm text-gray-500">{verification.userDetails.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{verification.role}</td>
                  <td className="py-4 px-6 text-gray-600">{verification.contact}</td>
                  <td className="py-4 px-6 text-gray-600">{verification.documents}</td>
                  <td className="py-4 px-6 text-gray-600">{verification.submitted}</td>
                  <td className="py-4 px-6">{getStatusBadge(verification.status, verification.statusColor)}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => toast.success(`Viewing ${verification.userDetails.name}`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
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

export default VerificationsPage
