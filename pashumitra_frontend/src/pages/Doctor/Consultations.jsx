"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, Video, FileText, ChevronDown, Clock } from "lucide-react"

const consultationsData = [
  {
    id: 1,
    patientName: "John Smith",
    animalType: "Cow",
    priority: "High",
    status: "Pending",
    issue: "Mastitis symptoms - swollen udder, reduced milk production",
    timeAgo: "10 min ago",
    actions: ["Start Chat", "Video Call"],
  },
  {
    id: 2,
    patientName: "Maria Garcia",
    animalType: "Buffalo",
    priority: "Medium",
    status: "Pending",
    issue: "Loss of appetite, lethargic behavior for 2 days",
    timeAgo: "25 min ago",
    actions: ["Start Chat", "Video Call"],
  },
  {
    id: 3,
    patientName: "Ahmed Hassan",
    animalType: "Goat",
    priority: "Low",
    status: "In Progress",
    issue: "Skin condition with patches and itching",
    timeAgo: "1 hour ago",
    actions: ["Continue Chat"],
  },
  {
    id: 4,
    patientName: "Sarah Johnson",
    animalType: "Sheep",
    priority: "Low",
    status: "Completed",
    issue: "Vaccination schedule consultation",
    timeAgo: "2 hours ago",
    actions: ["View Summary"],
  },

  {
    id: 4,
    patientName: "Johnson",
    animalType: "Sheep",
    priority: "Low",
    status: "Completed",
    issue: "Vaccination schedule consultation",
    timeAgo: "2 hours ago",
    actions: ["View Summary"],
  },
]

const priorityColors = {
  High: "bg-red-100 text-red-800 border-red-200",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Low: "bg-green-100 text-green-800 border-green-200",
}

const statusColors = {
  Pending: "bg-blue-100 text-blue-800 border-blue-200",
  "In Progress": "bg-orange-100 text-orange-800 border-orange-200",
  Completed: "bg-gray-100 text-gray-800 border-gray-200",
}

const buttonStyles = {
  "Start Chat": "bg-blue-600 hover:bg-blue-700 text-white",
  "Video Call": "bg-green-600 hover:bg-green-700 text-white",
  "Continue Chat": "bg-orange-600 hover:bg-orange-700 text-white",
  "View Summary": "bg-gray-600 hover:bg-gray-700 text-white",
}

export default function Consultations() {
  const [statusFilter, setStatusFilter] = useState("All Status")

  const filteredConsultations =
    statusFilter === "All Status"
      ? consultationsData
      : consultationsData.filter((item) => item.status === statusFilter)

  const getButtonIcon = (action) => {
    switch (action) {
      case "Start Chat":
      case "Continue Chat":
        return <MessageCircle className="w-4 h-4" />
      case "Video Call":
        return <Video className="w-4 h-4" />
      case "View Summary":
        return <FileText className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Consultations</h1>
            <p className="text-gray-600 text-sm md:text-base">Manage your consultation requests and ongoing sessions</p>
          </div>

          <motion.div
            className="relative"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option>All Status</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </motion.div>
        </motion.div>

        {/* Consultations Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <AnimatePresence>
            {filteredConsultations.map((consultation, index) => (
              <motion.div
                key={consultation.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.5,
                      delay: index * 0.1,
                    },
                  },
                  exit: {
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.3 },
                  },
                }}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ y: -4, scale: 1.02 }}
              >
                {/* Patient Info */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{consultation.patientName}</h3>
                  <p className="text-gray-600 text-sm">{consultation.animalType}</p>
                </div>

                {/* Priority and Status Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <motion.span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[consultation.priority]}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {consultation.priority} Priority
                  </motion.span>
                  <motion.span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[consultation.status]}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {consultation.status}
                  </motion.span>
                </div>

                {/* Issue Description */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Issue:</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{consultation.issue}</p>
                </div>

                {/* Time and Actions */}
                <div className="space-y-3">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {consultation.timeAgo}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {consultation.actions.map((action, index) => (
                      <motion.button
                        key={index}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 ${buttonStyles[action]}`}
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {getButtonIcon(action)}
                        {action}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
