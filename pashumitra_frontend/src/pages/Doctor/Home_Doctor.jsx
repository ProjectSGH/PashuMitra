// components/HomePage.jsx
import React from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  MessageCircle,
  Users,
  FileText,
  Lightbulb,
} from "lucide-react"

export default function HomePage() {
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
      },
    },
  }

  const consultationRequests = [
    { name: "John Smith", animal: "Cow", condition: "Mastitis symptoms", time: "10 min ago" },
    { name: "Maria Garcia", animal: "Buffalo", condition: "Loss of appetite", time: "25 min ago" },
    { name: "Ahmed Hassan", animal: "Goat", condition: "Skin condition", time: "1 hour ago" },
  ]

  const quickActions = [
    {
      title: "Start New Consultation",
      description: "Begin chat or video consultation with farmers",
      icon: MessageCircle,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "View Patient History",
      description: "Access past cases and treatment records",
      icon: FileText,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Create Awareness Content",
      description: "Share knowledge and tips with farmers",
      icon: Lightbulb,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
  ]

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Welcome */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Dr. Johnson!</h2>
          <p className="text-gray-600">Here's what's happening with your practice today.</p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { title: "Pending Consultations", value: "8", icon: MessageCircle, color: "blue" },
            { title: "Today's Appointments", value: "12", icon: Calendar, color: "green" },
            { title: "Follow-ups Due", value: "5", icon: Users, color: "yellow" },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-lg p-6 shadow-sm border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Consultation Requests */}
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Recent Consultation Requests</h3>
                <motion.button
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  View All
                </motion.button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {consultationRequests.map((request, index) => (
                <motion.div
                  key={request.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{request.name}</h4>
                    <p className="text-sm text-gray-600">
                      {request.animal} - {request.condition}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{request.time}</p>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start Chat
                    </motion.button>
                    <motion.button
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Video Call
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${action.bgColor} hover:shadow-md`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg bg-white ${action.iconColor}`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{action.title}</h4>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  )
}
