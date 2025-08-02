"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast"; // Make sure it's installed
import { motion } from "framer-motion";
import { Clock, User, Calendar } from "lucide-react";

export default function ProfileSchedule() {
  const [profile, setProfile] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

 useEffect(() => {
  if (user && user._id) {
    axios
      .get(`http://localhost:5000/api/users/${user._id}`)
      .then((res) => {
        const userData = res.data;

        setProfile({
          fullName: userData.doctorProfile?.fullName || "",
          specialization: userData.doctorProfile?.specialization || "",
          hospitalname: userData.doctorProfile?.hospitalname || "",
          experience: userData.doctorProfile?.experience || "",
          state: userData.doctorProfile?.state || "",
          city: userData.doctorProfile?.city || "",
          phone: userData.phone || "",
          email: userData.email || "",
        });

        setSchedule(userData.doctorProfile?.schedule || {
          Monday: { available: true, startTime: "09:00", endTime: "17:00" },
          Tuesday: { available: true, startTime: "09:00", endTime: "17:00" },
          Wednesday: { available: true, startTime: "09:00", endTime: "17:00" },
          Thursday: { available: true, startTime: "09:00", endTime: "17:00" },
          Friday: { available: true, startTime: "09:00", endTime: "17:00" },
          Saturday: { available: true, startTime: "10:00", endTime: "14:00" },
          Sunday: { available: false, startTime: "", endTime: "" },
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user data", err);
        setLoading(false);
      });
  }
}, []);

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleScheduleChange = (day, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

const handleUpdateProfile = async () => {
  try {
    const payload = {
      phone: profile.phone,
      email: profile.email,
      fullName: profile.fullName,
      specialization: profile.specialization,
      hospitalname: profile.hospitalname,
      experience: profile.experience,
      state: profile.state,
      city: profile.city,
      schedule, // include schedule here if you want to store it in backend
    };

    const response = await axios.put(`http://localhost:5000/api/users/${user._id}`, payload);

    toast.success("Profile updated successfully", {
      duration: 4000,
      position: "bottom-right",
      style: {
        backgroundColor: "#4CAF50",
        color: "#fff",
        fontWeight: "bold",
        borderRadius: "8px",
      },
    });

    // Optional: Refresh state if needed
    // setProfile(updatedProfileFromResponse);

  } catch (err) {
    console.error("Error updating profile", err);
    toast.error("Update failed. Try again later.");
  }
};

  if (loading || !profile || !schedule) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Profile & Schedule
          </h1>
          <p className="text-gray-600">
            Manage your personal information and availability
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Personal Info */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">
                Personal Information
              </h2>
            </div>

            <div className="space-y-4">
              {["fullName", "email", "phone", "specialization", "experience", "licenseNumber"].map(
                (field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type="text"
                      value={profile[field]}
                      onChange={(e) =>
                        handleProfileChange(field, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpdateProfile}
              className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Update Profile
            </motion.button>
          </motion.div>

          {/* Weekly Schedule */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">
                Weekly Schedule
              </h2>
            </div>

            <div className="space-y-4">
              {Object.entries(schedule).map(([day, daySchedule]) => (
                <motion.div
                  key={day}
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-gray-200 rounded-md"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="font-medium text-gray-900 w-20 flex-shrink-0">
                      {day}
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={daySchedule.available}
                        onChange={(e) =>
                          handleScheduleChange(day, "available", e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-blue-600 font-medium">
                        Available
                      </span>
                    </label>
                  </div>

                  {daySchedule.available && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <input
                          type="time"
                          value={daySchedule.startTime}
                          onChange={(e) =>
                            handleScheduleChange(day, "startTime", e.target.value)
                          }
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <span className="text-gray-500">to</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <input
                          type="time"
                          value={daySchedule.endTime}
                          onChange={(e) =>
                            handleScheduleChange(day, "endTime", e.target.value)
                          }
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpdateProfile}
              className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 transition-colors duration-200"
            >
              Update Schedule
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
