"use client"

import { motion } from "framer-motion"
import { Tractor, Stethoscope, Store, Clock, TrendingUp, Eye, CheckCircle, XCircle } from "lucide-react"
import toast from "react-hot-toast"

const DashboardPage = () => {
  const statsCards = [
    {
      title: "Total Farmers",
      value: "2,847",
      subtitle: "Registered farmers",
      change: "+12% from last month",
      changeType: "positive",
      icon: Tractor,
      color: "blue",
    },
    {
      title: "Total Doctors",
      value: "1,256",
      subtitle: "Verified doctors",
      change: "+8% from last month",
      changeType: "positive",
      icon: Stethoscope,
      color: "blue",
    },
    {
      title: "Medical Stores",
      value: "743",
      subtitle: "Registered stores",
      change: "+15% from last month",
      changeType: "positive",
      icon: Store,
      color: "blue",
    },
    {
      title: "Pending Verifications",
      value: "127",
      subtitle: "Awaiting approval",
      change: "23 new today",
      changeType: "neutral",
      icon: Clock,
      color: "orange",
    },
  ]

  const verifications = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      role: "Doctor",
      email: "rajesh.kumar@email.com",
      submitted: "1/15/2024",
      status: "Pending",
      statusColor: "orange",
    },
    {
      id: 2,
      name: "Ram Singh",
      role: "Farmer",
      email: "ram.singh@email.com",
      submitted: "1/14/2024",
      status: "Approved",
      statusColor: "green",
    },
    {
      id: 3,
      name: "MediCare Pharmacy",
      role: "Medical Store",
      email: "info@medicare.com",
      submitted: "1/14/2024",
      status: "Rejected",
      statusColor: "red",
    },
  ]

  const handleAction = (action, name) => {
    toast.success(`${action} action performed for ${name}`)
  }

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
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">PashuMitra Dashboard</h1>
        <p className="text-gray-600">Welcome to PashuMitra Admin Panel. Monitor and manage all user verifications.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  card.color === "blue" ? "bg-blue-100" : "bg-orange-100"
                }`}
              >
                <card.icon className={`w-6 h-6 ${card.color === "blue" ? "text-blue-600" : "text-orange-600"}`} />
              </div>
            </div>

            <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
            <p className="text-sm text-gray-500 mb-2">{card.subtitle}</p>

            <div
              className={`flex items-center gap-1 text-sm ${
                card.changeType === "positive" ? "text-green-600" : "text-gray-600"
              }`}
            >
              {card.changeType === "positive" && <TrendingUp className="w-4 h-4" />}
              <span>{card.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Verifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Recent Verifications</h2>
            <p className="text-gray-600 mt-1">Latest verification requests requiring your attention</p>
          </div>
          <button
            className="text-blue-600 hover:text-blue-700 font-medium"
            onClick={() => toast.success("Navigated to all verifications")}
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Name</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Role</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Email</th>
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
                    <div className="flex items-center gap-3">
                      {getStatusIcon(verification.status)}
                      <span className="font-medium text-gray-900">{verification.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{verification.role}</td>
                  <td className="py-4 px-6 text-gray-600">{verification.email}</td>
                  <td className="py-4 px-6 text-gray-600">{verification.submitted}</td>
                  <td className="py-4 px-6">{getStatusBadge(verification.status, verification.statusColor)}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleAction("View", verification.name)}
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

export default DashboardPage
