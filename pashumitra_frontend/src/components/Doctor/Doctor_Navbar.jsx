"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  MessageCircle,
  History,
  AlertCircle,
  User,
  Home,
  LogOut,
  Menu,
  X,
  Contact,
} from "lucide-react";
import axios from "axios";
import resources from "../../resource";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const navItems = [
    { name: "Home", icon: Home, path: "/doctor/home" },
    {
      name: "Consultations",
      icon: MessageCircle,
      path: "/doctor/consultations",
    },
    { name: "Patient History", icon: History, path: "/doctor/Patient_History" },
    { name: "Awareness", icon: AlertCircle, path: "/doctor/Awareness" },
    { name: "Contact Us", icon: Contact, path: "/doctor/Contact" },
    { name: "Profile", icon: User, path: "/doctor/Profile" },
  ];

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      navigate("/");
    }, 600); // Wait for animation
  };

  // 🔹 Fetch unread notifications count
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const storedId = localStorage.getItem("userId"); // ✅ fetch from localStorage
        if (!storedId) return;

        const res = await axios.get(
          `http://localhost:5000/api/notifications/unreadCount/${storedId}`
        );

        setUnreadCount(res.data.count || 0);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.header
      className="bg-white shadow-sm border-b w-full z-50"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <h1
              className="text-xl font-bold text-blue-600 cursor-pointer flex items-center gap-2"
              onClick={() => navigate("/")}
            >
              <img
                src={resources.Logo.src}
                alt="FarmerCare Logo"
                className="h-8"
              />
              PashuMitra - Doctor Portal
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
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

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <motion.button
              className="relative p-2 text-gray-600 hover:text-gray-900"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/doctor/notifications")} // 🔹 Redirect to notifications page
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 text-xs font-bold flex items-center justify-center bg-red-500 text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            {/* Logout for Desktop */}
            <AnimatePresence>
              {!isLoggingOut && (
                <motion.button
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-900 hover:bg-gray-100"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.6 }}
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              )}
            </AnimatePresence>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t overflow-hidden"
            >
              <div className="flex flex-col p-4 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      window.location.pathname === item.path
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </button>
                ))}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-900 hover:bg-gray-100 mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
