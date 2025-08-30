"use client"

import { motion } from "framer-motion"
import { Package, Users, TrendingUp, AlertTriangle, Eye, ArrowUpDown, AlertCircle } from "lucide-react"

export default function Dashboard() {
  const metrics = [
    {
      icon: Package,
      value: "1,247",
      label: "Total Medicines",
      change: "+12%",
      changeColor: "text-green-600",
      bgColor: "bg-blue-500",
    },
    {
      icon: Users,
      value: "89",
      label: "Active Farmers",
      change: "+8%",
      changeColor: "text-green-600",
      bgColor: "bg-green-500",
    },
    {
      icon: TrendingUp,
      value: "$24,500",
      label: "Monthly Revenue",
      change: "+15%",
      changeColor: "text-green-600",
      bgColor: "bg-purple-500",
    },
    {
      icon: AlertTriangle,
      value: "23",
      label: "Low Stock Items",
      change: "5%",
      changeColor: "text-red-600",
      bgColor: "bg-red-500",
    },
  ]

  const recentActivities = [
    {
      text: "New request from Green Valley Farm",
      time: "5 minutes ago",
      color: "bg-blue-500",
    },
    {
      text: "Medicine delivered to Sunrise Farm",
      time: "12 minutes ago",
      color: "bg-green-500",
    },
    {
      text: "Stock updated for Paracetamol",
      time: "25 minutes ago",
      color: "bg-yellow-500",
    },
    {
      text: "New farmer registration",
      time: "1 hour ago",
      color: "bg-purple-500",
    },
    {
      text: "Community bank donation received",
      time: "2 hours ago",
      color: "bg-pink-500",
    },
  ]

  const quickActions = [
    {
      icon: Package,
      title: "Add Medicine",
      subtitle: "Update inventory",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: Eye,
      title: "View Requests",
      subtitle: "Check farmer requests",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: ArrowUpDown,
      title: "Transfer",
      subtitle: "Manage transfers",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: AlertCircle,
      title: "Low Stock",
      subtitle: "Review alerts",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
  ]

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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className=" mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="bg-blue-600 text-white p-6 rounded-2xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Store Owner!</h1>
          <p className="text-blue-100 text-sm md:text-base">
            {"Here's what's happening with your medical store today."}
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium ${metric.changeColor}`}>{metric.change}</span>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className={`w-2 h-2 rounded-full ${activity.color} mt-2 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 cursor-pointer transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center mb-3`}>
                    <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{action.title}</h3>
                  <p className="text-xs text-gray-600">{action.subtitle}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
