"use client";

import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, Menu, X, LogOut } from "lucide-react";
import resources from "../../resource";
import axios from "axios";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // ✅ Fetch notifications & unread count
  const fetchNotifications = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser?._id) return;

      const [countRes, notesRes] = await Promise.all([
        axios.get(
          `http://localhost:5000/api/notifications/unreadCount/${storedUser._id}`
        ),
        axios.get(`http://localhost:5000/api/notifications/${storedUser._id}`),
      ]);

      setUnreadCount(countRes.data.count || 0);
      setNotifications(notesRes.data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      navigate("/");
    }, 600);
  };

  const navItems = [
    { name: "Home", href: "/farmer/home" },
    { name: "Search Medicine", href: "/farmer/medicine-search" },
    { name: "Nearby Stores", href: "/farmer/nearbystore" },
    { name: "Consult Doctor", href: "/farmer/doctor-consult" },
    { name: "My Consultations", href: "/farmer/my-consultations" },
    { name: "My Orders", href: "/farmer/my-orders" },
    { name: "Awareness", href: "/farmer/awareness" },
    { name: "Community Bank", href: "/farmer/community-bank" },
    { name: "Contact Us", href: "/farmer/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
            <h1
              className="font-bold text-blue-700 cursor-pointer flex items-center gap-2"
              onClick={() => navigate("/farmer/home")}
            >
              <img
                src={resources.Logo.src}
                alt="PashuMitra Logo"
                className="h-8 w-8"
              />
              <span className="hidden sm:inline">PashuMitra - Farmer Portal</span>
              <span className="sm:hidden">Farmer Portal</span>
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.href;
                return (
                  <motion.button
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                    }`}
                  >
                    {item.name}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right side icons */}
          <div className="hidden lg:flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.1, y: -1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/farmer/notifications")}
              className="relative cursor-pointer p-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <Bell className="h-6 w-6 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1, y: -1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/farmer/profile")}
              className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <User className="h-6 w-6 text-gray-600 cursor-pointer" />
            </motion.button>

            {/* Logout Button */}
            <AnimatePresence>
              {!isLoggingOut && (
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                  whileHover={{ scale: 1.05, y: -1 }}
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
          <div className="lg:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{ height: isMenuOpen ? "auto" : 0 }}
          className="lg:hidden overflow-hidden bg-white border-t border-gray-200 shadow-inner"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
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
                  className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  {item.name}
                </motion.button>
              );
            })}
            {/* Icons in mobile view */}
            <div className="flex items-center space-x-4 px-4 py-3 border-t border-gray-200 mt-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  navigate("/farmer/notifications");
                  setIsMenuOpen(false);
                }}
                className="relative p-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <Bell className="h-6 w-6 text-gray-600 cursor-pointer" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  navigate("/farmer/profile");
                  setIsMenuOpen(false);
                }}
                className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <User className="h-6 w-6 text-gray-600 cursor-pointer" />
              </motion.button>

              <motion.button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
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