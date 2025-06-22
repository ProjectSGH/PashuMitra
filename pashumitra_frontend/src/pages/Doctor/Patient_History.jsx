"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Eye, UserCheck, Filter } from "lucide-react"

const patientData = [
  {
    id: 1,
    farmerName: "John Smith",
    animalType: "Cow",
    issue: "Mastitis treatment",
    treatmentDate: "15/1/2024",
    status: "Completed",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: 2,
    farmerName: "Maria Garcia",
    animalType: "Buffalo",
    issue: "Respiratory infection",
    treatmentDate: "14/1/2024",
    status: "Follow-up Required",
    statusColor: "bg-yellow-100 text-yellow-800",
  },
  {
    id: 3,
    farmerName: "Ahmed Hassan",
    animalType: "Goat",
    issue: "Digestive issues",
    treatmentDate: "13/1/2024",
    status: "In Progress",
    statusColor: "bg-blue-100 text-blue-800",
  },
  {
    id: 4,
    farmerName: "Sarah Johnson",
    animalType: "Sheep",
    issue: "Vaccination",
    treatmentDate: "12/1/2024",
    status: "Completed",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: 5,
    farmerName: "Robert Brown",
    animalType: "Cow",
    issue: "Lameness treatment",
    treatmentDate: "11/1/2024",
    status: "Follow-up Required",
    statusColor: "bg-yellow-100 text-yellow-800",
  },
]

export default function PatientHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")

  const filteredData = patientData.filter((patient) => {
    const matchesSearch =
      patient.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.animalType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All Status" || patient.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Patient History</h1>
          <p className="text-gray-600 text-sm md:text-base">Review past cases and treatment records</p>
        </div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by farmer or animal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white min-w-[150px]"
              >
                <option>All Status</option>
                <option>Completed</option>
                <option>Follow-up Required</option>
                <option>In Progress</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Farmer Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Animal Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Treatment Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((patient, index) => (
                  <motion.tr
                    key={patient.id}
                    variants={itemVariants}
                    whileHover={{ backgroundColor: "#f9fafb" }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{patient.farmerName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{patient.animalType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.issue}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{patient.treatmentDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${patient.statusColor}`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                      >
                        <UserCheck className="w-4 h-4" />
                        Follow up
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            {filteredData.map((patient, index) => (
              <motion.div
                key={patient.id}
                variants={itemVariants}
                className="p-4 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{patient.farmerName}</h3>
                    <p className="text-sm text-gray-500">{patient.animalType}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${patient.statusColor}`}>
                    {patient.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Issue:</span>
                    <p className="text-sm text-gray-900">{patient.issue}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Treatment Date:</span>
                    <p className="text-sm text-gray-900">{patient.treatmentDate}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-200 inline-flex items-center justify-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-200 inline-flex items-center justify-center gap-1"
                  >
                    <UserCheck className="w-4 h-4" />
                    Follow up
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredData.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-gray-500">No patient records found matching your criteria.</p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
