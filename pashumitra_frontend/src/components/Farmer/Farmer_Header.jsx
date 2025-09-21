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

  const userId = localStorage.getItem("userId"); // assuming you store userId in localStorage

  // Fetch notifications & unread count
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
  }, [userId]);

  // ✅ Mark single notification as read
  // ✅ Mark single notification as read
  const markNotificationAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`);
      // Update UI immediately without refresh
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser?._id) return;
      await axios.put(
        `http://localhost:5000/api/notifications/user/${storedUser._id}/readall`
      );

      // Update UI immediately
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

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
    { name: "Awareness", href: "/farmer/awareness" },
    { name: "Community Bank", href: "/farmer/community-bank" },
    { name: "Contact Us", href: "/farmer/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-sm border-b border-gray-100"
    >
      <div className="max-w-auto mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
            <h1
              className="text-2xl font-bold text-blue-600 cursor-pointer flex items-center gap-2"
              onClick={() => navigate("/")}
            >
              <img
                src={resources.Logo.src}
                alt="FarmerCare Logo"
                className="h-8"
              />
              FarmerCare
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
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
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
            <div className="relative" ref={dropdownRef}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/farmer/notifications")}
                className="relative"
              >
                <Bell className="h-6 w-6 text-gray-600 cursor-pointer" />
                {unreadCount > 0 && (
                  <span className="header-bell-badge absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/farmer/profile")}
              className="p-1"
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
            {/* Icons in mobile view */}
            <div className="flex items-center space-x-4 px-3 py-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  navigate("/farmer/notifications");
                  setIsMenuOpen(false);
                }}
                className="relative p-1"
              >
                <Bell className="h-6 w-6 text-gray-600 cursor-pointer" />
                {unreadCount > 0 && (
                  <span className="header-bell-badge absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
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
                className="p-1"
              >
                <User className="h-6 w-6 text-gray-600 cursor-pointer" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
