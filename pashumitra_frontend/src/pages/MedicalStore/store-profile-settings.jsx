"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Edit, Mail, Phone, MapPin, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function StoreProfileSettings() {
  const [storeData, setStoreData] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Fetch store profile
        const res = await axios.get(
          `http://localhost:5000/api/users/${user._id}`
        );
        setStoreData(res.data?.storeProfile || null);

        // ✅ Fetch schedule
        let scheduleData;
        try {
          const scheduleRes = await axios.get(
            `http://localhost:5000/api/schedules/${user._id}`
          );
          scheduleData = scheduleRes.data;
        } catch (err) {
          if (err.response?.status === 404) {
            console.warn("No existing schedule found, using fallback.");
            scheduleData = null;
          } else {
            console.error("Error fetching schedule:", err);
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

    if (user && user._id) {
      fetchData();
    }
  }, [user._id]);

  const handleScheduleChange = (day, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleUpdateSchedule = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/schedules/${user._id}`,
        schedule
      );
      toast.success("Business hours updated!", {
        style: { background: "#059669", color: "#fff" },
      });
    } catch (err) {
      console.error("Error updating schedule", err);
      toast.error("Failed to update schedule.");
    }
  };

  if (loading || !storeData || !schedule) {
    return (
      <div className="flex justify-center items-center min-h-[300px] py-24">
        <p className="text-gray-500">Loading store profile...</p>
      </div>
    );
  }

  // ✅ Only allow weekdays (ignore _id, userId, __v, etc.)
  const validDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Store Info */}
          <div className="lg:col-span-3 space-y-8">
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
                    Owner Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {storeData.ownerName}
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
                    Phone
                  </label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Phone size={16} className="text-gray-500" />
                    <span>{user.phone}</span>
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
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Business Hours */}
          <div className="lg:col-span-1">
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
                {validDays.map((day) => {
                  const data = schedule[day];
                  return (
                    <div
                      key={day}
                      className="flex flex-col border p-2 rounded-md mb-2"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{day}</span>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={data?.available || false}
                            onChange={(e) =>
                              handleScheduleChange(
                                day,
                                "available",
                                e.target.checked
                              )
                            }
                          />
                          Available
                        </label>
                      </div>
                      {data?.available && (
                        <div className="flex items-center gap-2 text-sm">
                          <input
                            type="time"
                            value={data.startTime}
                            onChange={(e) =>
                              handleScheduleChange(
                                day,
                                "startTime",
                                e.target.value
                              )
                            }
                            className="border px-2 py-1 rounded"
                          />
                          to
                          <input
                            type="time"
                            value={data.endTime}
                            onChange={(e) =>
                              handleScheduleChange(
                                day,
                                "endTime",
                                e.target.value
                              )
                            }
                            className="border px-2 py-1 rounded"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleUpdateSchedule}
                className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Update Business Hours
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
