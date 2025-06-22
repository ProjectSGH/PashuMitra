import React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Bell, MessageCircle, History, AlertCircle, User, Home } from "lucide-react"

export default function Navbar() {
  const navigate = useNavigate()

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Consultations", icon: MessageCircle, path: "/doctor/consultations" },
    { name: "Patient History", icon: History, path: "/doctor/history" },
    { name: "Awareness", icon: AlertCircle, path: "/doctor/awareness" },
    { name: "Profile", icon: User, path: "/doctor/profile" },
  ]

  return (
    <motion.header
      className="bg-white shadow-sm border-b"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
            <h1
              className="text-2xl font-bold text-blue-600 cursor-pointer"
              onClick={() => navigate("/")}
            >
              VetPortal
            </h1>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  window.location.pathname === item.path
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </motion.button>
            ))}
          </nav>

          {/* Notification */}
          <div className="flex items-center space-x-4">
            <motion.button
              className="relative p-2 text-gray-600 hover:text-gray-900"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
