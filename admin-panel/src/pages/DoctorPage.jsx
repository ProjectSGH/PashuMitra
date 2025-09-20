"use client"

import { motion } from "framer-motion"
import { Search, Filter, UserPlus, MoreHorizontal } from "lucide-react"
import toast from "react-hot-toast"

const DoctorsPage = () => {
  const statsCards = [
    { title: "Total Doctors", value: "5", color: "blue" },
    { title: "Active", value: "3", color: "green" },
    { title: "Pending", value: "1", color: "orange" },
  ]

  const doctors = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      contact: "+91 9876543220",
      location: "Delhi",
      specialization: "Veterinary Medicine\nBVSc & AH",
      license: "VET123456",
      experience: "10 years",
      status: "Active",
      statusColor: "green",
      joined: "1/8/2024",
    },
    {
      id: 2,
      name: "Dr. Priya Sharma",
      email: "priya.sharma@email.com",
      contact: "+91 9876543221",
      location: "Mumbai",
      specialization: "Animal Surgery\nMVSc",
      license: "VET789012",
      experience: "7 years",
      status: "Pending",
      statusColor: "orange",
      joined: "1/12/2024",
    },
    {
      id: 3,
      name: "Dr. Amit Verma",
      email: "amit.verma@email.com",
      contact: "+91 9876543222",
      location: "Bangalore",
      specialization: "Livestock Medicine\nBVSc & AH, PhD",
      license: "VET345678",
      experience: "15 years",
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Veterinary Doctors</h1>
          <p className="text-gray-600">Manage and monitor all registered veterinary doctors</p>
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
            onClick={() => toast.success("Add Doctor clicked")}
          >
            <UserPlus className="w-4 h-4" />
            Add Doctor
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
            placeholder="Search doctors..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Doctors Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">All Doctors</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Name</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Contact</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Specialization</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">License</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Experience</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Joined</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor, index) => (
                <motion.tr
                  key={doctor.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{doctor.name}</div>
                      <div className="text-sm text-gray-500">{doctor.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-gray-900">{doctor.contact}</div>
                      <div className="text-sm text-gray-500">{doctor.location}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      {doctor.specialization.split("\n").map((line, i) => (
                        <div key={i} className={i === 0 ? "font-medium text-gray-900" : "text-gray-600"}>
                          {line}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{doctor.license}</td>
                  <td className="py-4 px-6 text-gray-600">{doctor.experience}</td>
                  <td className="py-4 px-6">{getStatusBadge(doctor.status, doctor.statusColor)}</td>
                  <td className="py-4 px-6 text-gray-600">{doctor.joined}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => toast.success(`Actions for ${doctor.name}`)}
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

export default DoctorsPage
