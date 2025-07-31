"use client";

import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, Menu, X, LogOut } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      navigate("/login");
    }, 600); // Wait for animation
  };

  const notifications = [
    {
      title: "Medicine Available",
      message: "Antibiotics for cattle now available at nearby store",
      time: "2 hours ago",
      unread: true,
    },
    {
      title: "Consultation Reminder",
      message: "Dr. Sharma consultation scheduled for 3 PM today",
      time: "4 hours ago",
      unread: true,
    },
    {
      title: "Community Update",
      message: "New medicine donations added to community bank",
      time: "1 day ago",
      unread: true,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const navItems = [
    { name: "Home", href: "/medical/home" },
    { name: "inventory", href: "/medical/inventory" },
    { name: "Requests", href: "/medical/Requests" },
    { name: "Transfer", href: "/medical/Transfer" },
    { name: "Transport", href: "/medical/Transport" },
    { name: "Community Bank", href: "/medical/community-bank" },
    { name: "Profile", href: "/medical/Profile" },
  ];

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
            <h1
              className="text-2xl font-bold text-blue-600 cursor-pointer"
              onClick={() => navigate("/")}
            >
              MedicalCare
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
            <div className="relative" ref={dropdownRef}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="h-6 w-6 text-gray-600 cursor-pointer" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.filter((n) => n.unread).length}
                </span>
              </motion.div>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-md border border-gray-100 z-50"
                  >
                    <div className="p-4 border-b">
                      <h2 className="font-semibold text-lg">Notifications</h2>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((note, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 hover:bg-gray-50 transition flex items-start space-x-2 border-b"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm">{note.title}</p>
                            <p className="text-sm text-gray-600">
                              {note.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {note.time}
                            </p>
                          </div>
                          {note.unread && (
                            <span className="mt-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t text-center">
                      <button
                        onClick={() => navigate("/farmer/notifications")}
                        className="text-blue-600 text-sm font-medium hover:underline"
                      >
                        View All Notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/medical/Profile")}
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
              {/* Bell Icon with toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1"
              >
                <Bell className="h-6 w-6 text-gray-600 cursor-pointer" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.filter((n) => n.unread).length}
                </span>
              </motion.button>

              {/* User Icon with navigation */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/farmer/profile")}
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
