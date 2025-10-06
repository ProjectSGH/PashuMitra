"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Mail, Phone, MapPin, Clock, Store } from "lucide-react";
import toast from "react-hot-toast";

export default function StoreProfileSettings() {
  const [storeData, setStoreData] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${user._id}`);
        setStoreData(res.data?.storeProfile || null);

        let scheduleData;
        try {
          const scheduleRes = await axios.get(`http://localhost:5000/api/schedules/${user._id}`);
          scheduleData = scheduleRes.data;
        } catch (err) {
          if (err.response?.status === 404) {
            scheduleData = null;
          }
        }

        const fallbackSchedule = {
          Monday: { available: true, startTime: "08:00", endTime: "22:00" },
          Tuesday: { available: true, startTime: "08:00", endTime: "22:00" },
          Wednesday: { available: true, startTime: "08:00", endTime: "22:00" },
          Thursday: { available: true, startTime: "08:00", endTime: "22:00" },
          Friday: { available: true, startTime: "08:00", endTime: "22:00" },
          Saturday: { available: true, startTime: "09:00", endTime: "20:00" },
          Sunday: { available: true, startTime: "10:00", endTime: "18:00" },
        };

        setSchedule({ ...fallbackSchedule, ...scheduleData });
      } catch (err) {
        console.error("Error fetching store data", err);
        setSchedule(null);
      } finally {
        setLoading(false);
      }
    };

    if (user && user._id) fetchData();
  }, [user._id]);

  const handleScheduleChange = (day, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleUpdateSchedule = async () => {
    try {
      await axios.put(`http://localhost:5000/api/schedules/${user._id}`, schedule);
      toast.success("Business hours updated!");
    } catch (err) {
      toast.error("Failed to update schedule.");
    }
  };

  if (loading || !storeData || !schedule) {
    return <div className="p-10 text-center text-gray-600">Loading store profile...</div>;
  }

  const validDays = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
  };

  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Store Profile & Settings
          </h1>
          <p className="text-gray-600">Manage store details and operating hours</p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Store Info */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Store className="text-gray-700 w-5 h-5" />
              <h2 className="text-xl font-semibold text-gray-900">Store Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Store Name</label>
                <p className="font-medium text-gray-900">{storeData.storeName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Owner Name</label>
                <p className="font-medium text-gray-900">{storeData.ownerName}</p>
              </div>
              <div className="flex items-center gap-2 text-gray-900">
                <Mail className="text-gray-500 w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-900">
                <Phone className="text-gray-500 w-4 h-4" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-900">
                <MapPin className="text-gray-500 w-4 h-4 mt-0.5" />
                <span>{storeData.address}</span>
              </div>
            </div>
          </motion.div>

          {/* Business Hours */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Clock className="text-gray-700 w-5 h-5" />
              <h2 className="text-xl font-semibold text-gray-900">Business Hours</h2>
            </div>

            <div className="space-y-3">
              {validDays.map((day) => {
                const data = schedule[day];
                return (
                  <motion.div
                    key={day}
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border border-gray-200 rounded-md"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
                      <span className="font-medium text-gray-900 w-24">{day}</span>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data?.available || false}
                          onChange={(e) => handleScheduleChange(day, "available", e.target.checked)}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-green-600 font-medium">Available</span>
                      </label>
                    </div>
                    {data?.available && (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm">
                        <input
                          type="time"
                          value={data.startTime}
                          onChange={(e) => handleScheduleChange(day, "startTime", e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          value={data.endTime}
                          onChange={(e) => handleScheduleChange(day, "endTime", e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpdateSchedule}
              className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 transition-colors duration-200"
            >
              Update Business Hours
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
