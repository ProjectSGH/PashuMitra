"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, Menu, X, LogOut } from "lucide-react";
import resources from "../../resource";
import axios from "axios";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      navigate("/");
    }, 600);
  };

  // ✅ FIXED: Correct notification endpoint
  const fetchUnreadCount = async () => {
    try {
      if (!userId) return;
      const response = await axios.get(
        `http://localhost:5000/api/notifications/unreadCount/${userId}` // Fixed URL
      );
      setUnreadCount(response.data.count);
    } catch (err) {
      console.error("Error fetching unread notifications:", err);
      // Set to 0 if there's an error to avoid breaking the UI
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    // Optional: Poll every 30 seconds for new notifications
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const navItems = [
    { name: "Home", href: "/medicalstore/home" },
    { name: "Inventory", href: "/medicalstore/inventory" },
    { name: "Requests", href: "/medicalstore/requests" },
    { name: "Transfer", href: "/medicalstore/transfer" },
    { name: "Transport", href: "/medicalstore/transport" },
    { name: "Community Bank", href: "/medicalstore/communityBank" },
    { name: "Contact Us", href: "/medicalstore/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-sm border-b border-gray-100"
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div className="flex-shrink-0">
            <h1
              className="text-2xl font-bold text-blue-600 cursor-pointer flex items-center gap-2"
              onClick={() => navigate("/medicalstore/home")}
            >
              <img src={resources.Logo.src} alt="PashuMitra Logo" className="h-8" />
              PashuMitra - Medical Store Portal
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.href;
                return (
                  <motion.button
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-600 rounded-full"
                        : "text-gray-700 border-gray-300 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-600"
                    }`}
                  >
                    {item.name}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right side icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Bell with dynamic unread count */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/medicalstore/notifications")}
              className="relative cursor-pointer p-2"
            >
              <Bell className="h-6 w-6 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </motion.div>

            {/* User Icon */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/medicalstore/profile")}
              className="p-2"
            >
              <User className="h-6 w-6 text-gray-600 cursor-pointer" />
            </motion.button>

            {/* Logout Button */}
            <AnimatePresence>
              {!isLoggingOut && (
                <motion.button
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-900 hover:bg-gray-100"
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
        <motion.div
          initial={false}
          animate={{ height: isMenuOpen ? "auto" : 0 }}
          className="md:hidden overflow-hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-100">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <motion.button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    setIsMenuOpen(false);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: isMenuOpen ? 1 : 0,
                    x: isMenuOpen ? 0 : -20,
                  }}
                  transition={{ delay: index * 0.1 }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {item.name}
                </motion.button>
              );
            })}

            {/* Mobile Icons */}
            <div className="flex items-center space-x-4 px-3 py-2 border-t border-gray-200 mt-2 pt-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/medicalstore/notifications")}
                className="relative p-2"
              >
                <Bell className="h-6 w-6 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/medicalstore/profile")}
                className="p-2"
              >
                <User className="h-6 w-6 text-gray-600 cursor-pointer" />
              </motion.button>

              <motion.button
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-900 hover:bg-gray-100"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}