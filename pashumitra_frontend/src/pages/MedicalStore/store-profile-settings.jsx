"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Edit,
  Mail,
  Phone,
  MapPin,
  Clock,
  TrendingUp,
  Users,
  Package,
  Heart,
} from "lucide-react";

const businessHours = [
  { day: "Monday", hours: "8:00 AM - 10:00 PM" },
  { day: "Tuesday", hours: "8:00 AM - 10:00 PM" },
  { day: "Wednesday", hours: "8:00 AM - 10:00 PM" },
  { day: "Thursday", hours: "8:00 AM - 10:00 PM" },
  { day: "Friday", hours: "8:00 AM - 10:00 PM" },
  { day: "Saturday", hours: "9:00 AM - 8:00 PM" },
  { day: "Sunday", hours: "10:00 AM - 6:00 PM" },
];

const quickStats = [
  { label: "Total Medicines", value: "1,247", icon: Package },
  { label: "Active Farmers", value: "89", icon: Users },
  { label: "Monthly Revenue", value: "$24,500", icon: TrendingUp },
  { label: "Community Donations", value: "156", icon: Heart },
];

export default function StoreProfileSettings() {
  const [storeData, setStoreData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchStoreData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/${user._id}`
      );
      setStoreData(res.data?.storeProfile || null);
      setCurrentLocation(res.data?.storeProfile?.address || "");
    } catch (err) {
      console.error("Error fetching store data", err);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchStoreData();
    }
  }, []);

  const handleUpdateLocation = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        {
          ...storeData,
          address: currentLocation, // ✅ Update location
        }
      );
      setStoreData(res.data.user.storeProfile);
      setCurrentLocation(res.data.user.storeProfile.address);
    } catch (err) {
      console.error("Error updating location", err);
    }
  };

  if (!storeData) {
    return (
      <div className="flex justify-center items-center min-h-[300px] py-24">
        <p className="text-gray-500">Loading store profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0"
          >
            Store Profile & Settings
          </motion.h1>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit size={16} />
            Edit Profile
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Store Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Store Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Name
                    </label>
                    <p className="text-gray-900 font-medium">
                      {storeData.storeName}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Mail size={16} className="text-gray-500" />
                      <span>{user.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <div className="flex items-start gap-2 text-gray-900">
                      <MapPin size={16} className="text-gray-500 mt-0.5" />
                      <span>{storeData.address}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization
                    </label>
                    <p className="text-gray-900">{storeData.specialization}</p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner Name
                    </label>
                    <p className="text-gray-900 font-medium">
                      {storeData.ownerName}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Phone size={16} className="text-gray-500" />
                      <span>{user.phone}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Established
                    </label>
                    <p className="text-gray-900 font-medium">
                      {storeData.established
                        ? (() => {
                            const date = new Date(storeData.established);
                            const day = String(date.getDate()).padStart(2, "0");
                            const month = String(date.getMonth() + 1).padStart(
                              2,
                              "0"
                            );
                            const year = date.getFullYear();
                            return `${day}-${month}-${year}`;
                          })()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Business Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock size={20} className="text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Business Hours
                </h3>
              </div>

              <div className="space-y-3">
                {businessHours.map((schedule, index) => (
                  <motion.div
                    key={schedule.day}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-700 font-medium">
                      {schedule.day}:
                    </span>
                    <span className="text-gray-600">{schedule.hours}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Stats
              </h3>

              <div className="space-y-4">
                {quickStats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {stat.label}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {stat.value}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
