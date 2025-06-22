"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, User, Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: "Home", href: "#", active: true },
    { name: "Search Medicine", href :"/farmer/medicine-search" },
    { name: "Nearby Stores", href: "#" },
    { name: "Consult Doctor", href: "#" },
    { name: "Awareness", href: "#" },
    { name: "Community Bank", href: "#" },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-sm border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-blue-600">FarmerCare</h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.active ? "bg-blue-600 text-white" : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Right side icons */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
              <Bell className="h-6 w-6 text-gray-600 cursor-pointer" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                1
              </span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <User className="h-6 w-6 text-gray-600 cursor-pointer" />
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div initial={false} animate={{ height: isMenuOpen ? "auto" : 0 }} className="md:hidden overflow-hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-100">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : -20 }}
                transition={{ delay: index * 0.1 }}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  item.active ? "bg-blue-600 text-white" : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {item.name}
              </motion.a>
            ))}
            <div className="flex items-center space-x-4 px-3 py-2">
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-600" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  1
                </span>
              </div>
              <User className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
