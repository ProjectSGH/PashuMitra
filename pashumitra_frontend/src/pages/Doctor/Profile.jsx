"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast"; // Make sure it's installed
import { motion } from "framer-motion";
import { Clock, User, Calendar } from "lucide-react";
import resources from "../../resource";

export default function ProfileSchedule() {
  const [profile, setProfile] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [license, setLicense] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const vetSpecializations = [
    "General Veterinary Medicine",
    "Small Animal Medicine",
    "Large Animal Medicine",
    "Equine Medicine",
    "Canine and Feline Practice",
    "Food Animal Medicine",
    "Poultry Medicine",
    "Wildlife and Zoo Medicine",
    "Exotic Animal Medicine",
    "Veterinary Surgery",
    "Veterinary Internal Medicine",
    "Veterinary Dermatology",
    "Veterinary Ophthalmology",
    "Veterinary Dentistry",
    "Veterinary Anesthesiology",
    "Veterinary Radiology & Imaging",
    "Veterinary Pathology",
    "Veterinary Microbiology",
    "Veterinary Pharmacology",
    "Veterinary Parasitology",
    "Veterinary Public Health",
    "Veterinary Toxicology",
    "Veterinary Epidemiology",
    "Veterinary Oncology",
    "Veterinary Neurology",
    "Veterinary Nutrition",
    "Aquatic Animal Health",
    "Dairy Science",
    "Animal Reproduction & Gynecology",
    "Veterinary Emergency & Critical Care",
    "Veterinary Preventive Medicine",
    "Veterinary Biotechnology",
    "other",
  ];

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProfileAndSchedule = async () => {
      try {
        const userRes = await axios.get(
          `http://localhost:5000/api/users/${user._id}`
        );
        const userData = userRes.data;

        // ✅ Fetch live verification status
        let verificationStatus = "not_submitted";
        try {
          const verificationRes = await axios.get(
            `http://localhost:5000/api/doctor/varify/status/${user._id}`
          );
          verificationStatus = verificationRes.data.status || "pending";
        } catch (err) {
          console.warn(
            "Verification status not found, defaulting to not_submitted"
          );
        }

        setProfile({
          fullName: userData.doctorProfile?.fullName || "",
          specialization: userData.doctorProfile?.specialization || "",
          hospitalname: userData.doctorProfile?.hospitalname || "",
          experience: userData.doctorProfile?.experience || "",
          state: userData.doctorProfile?.state || "",
          city: userData.doctorProfile?.city || "",
          phone: userData.phone || "",
          email: userData.email || "",
          fee: userData.doctorProfile?.fee || 0,
          verificationStatus, // ✅ this now uses real-time value
        });

        let scheduleData;
        try {
          const scheduleRes = await axios.get(
            `http://localhost:5000/api/schedules/${user._id}`
          );
          scheduleData = scheduleRes.data;
        } catch (err) {
          if (err.response && err.response.status === 404) {
            // This is expected for new users, don't log it as an error
            console.warn("No existing schedule found, using fallback.");
            scheduleData = null;
          } else {
            // Only log unexpected errors
            console.error("Error fetching schedule:", err);
          }
        }

        const fallbackSchedule = {
          Monday: { available: true, startTime: "09:00", endTime: "17:00" },
          Tuesday: { available: true, startTime: "09:00", endTime: "17:00" },
          Wednesday: { available: true, startTime: "09:00", endTime: "17:00" },
          Thursday: { available: true, startTime: "09:00", endTime: "17:00" },
          Friday: { available: true, startTime: "09:00", endTime: "17:00" },
          Saturday: { available: true, startTime: "10:00", endTime: "14:00" },
          Sunday: { available: false, startTime: "", endTime: "" },
        };

        setSchedule({ ...fallbackSchedule, ...scheduleData });
      } catch (err) {
        console.error("Error fetching data", err);
        setSchedule(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndSchedule();
  }, [user._id]);

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleScheduleChange = (day, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleUpdateSchedule = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/schedules/${user._id}`,
        schedule
      );

      toast.success("Schedule updated successfully", {
        duration: 4000,
        position: "bottom-right",
        style: {
          backgroundColor: "#059669",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "8px",
        },
      });
    } catch (err) {
      console.error("Error updating schedule", err);
      toast.error("Schedule update failed. Try again.");
    }
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
        fee: profile.fee,
        schedule,
      };

      const response = await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        payload
      );

      // ✅ Update localStorage so Consultations.jsx sees new name instantly
      const updatedUser = {
        ...user,
        doctorProfile: {
          ...(user.doctorProfile || {}),
          fullName: profile.fullName,
          specialization: profile.specialization,
          hospitalname: profile.hospitalname,
          experience: profile.experience,
          state: profile.state,
          city: profile.city,
          fee: profile.fee,
        },
        displayName: profile.fullName, // for fallback
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

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
    } catch (err) {
      console.error("Error updating profile", err);
      toast.error("Update failed. Try again later.");
    }
  };

  const handleVerificationUpload = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData();
    formData.append("document", file);
    formData.append("licenseNumber", license);

    try {
      const userRes = await axios.get(
        `http://localhost:5000/api/users/${user._id}`
      );
      const userData = userRes.data;
      const doctorId = userData.doctorProfile?._id;
      if (!doctorId) return toast.error("Doctor profile not found");

      const response = await fetch(
        `http://localhost:5000/api/doctor/varify/upload/${user._id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const verificationRes = await axios.get(
        `http://localhost:5000/api/doctor/varify/status/${user._id}`
      );
      setProfile((prev) => ({
        ...prev,
        verificationStatus: verificationRes.data.verificationStatus,
      }));
      const data = await response.json();
      if (response.ok) {
        toast.success("Verification uploaded successfully!", {
          duration: 4000,
          position: "top-right",
          style: {
            backgroundColor: "#2563eb",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "8px",
          },
        });

        // 👇 Instantly update UI without reload
        setProfile((prev) => ({
          ...prev,
          verificationStatus: "pending",
        }));
      } else {
        toast.error(data.message || "Upload failed", {
          position: "top-right",
        });
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Server error during upload");
    } finally {
      setIsUploading(false);
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="mb-8 text-center sm:text-left"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
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
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <User className="text-gray-700" />
                Personal Information
              </h2>
              {profile.verificationStatus === "approved" && (
                <div className="flex items-center gap-1 mt-2 sm:mt-0">
                  <img
                    src={resources.customVerificationMark.src}
                    alt="Verified"
                    className="w-8 h-8"
                  />
                  <span className="text-green-600 font-medium">Verified</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {["fullName", "email", "phone", "experience"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    value={profile[field]}
                    onChange={(e) => handleProfileChange(field, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Specialization
              </label>
              <select
                value={profile.specialization}
                onChange={(e) =>
                  handleProfileChange("specialization", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="">Select Specialization</option>
                {vetSpecializations.map((specialization) => (
                  <option key={specialization} value={specialization}>
                    {specialization}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Consultation Fee (₹)
              </label>
              <input
                type="number"
                value={profile.fee}
                onChange={(e) => handleProfileChange("fee", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                min="0"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpdateProfile}
              className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
            >
              Update Profile
            </motion.button>
          </motion.div>

          {/* Weekly Schedule */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">
                Weekly Schedule
              </h2>
            </div>

            <div className="space-y-3">
              {Object.entries(schedule)
                .filter(([day]) =>
                  [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].includes(day)
                )
                .map(([day, daySchedule]) => (
                  <motion.div
                    key={day}
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border border-gray-200 rounded-md"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 flex-1">
                      <span className="font-medium text-gray-900 w-full sm:w-28">
                        {day}
                      </span>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={daySchedule.available}
                          onChange={(e) =>
                            handleScheduleChange(
                              day,
                              "available",
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-blue-600 font-medium">
                          Available
                        </span>
                      </label>
                    </div>

                    {daySchedule.available && (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm sm:gap-4 mt-2 sm:mt-0">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <input
                            type="time"
                            value={daySchedule.startTime}
                            onChange={(e) =>
                              handleScheduleChange(
                                day,
                                "startTime",
                                e.target.value
                              )
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
                              handleScheduleChange(
                                day,
                                "endTime",
                                e.target.value
                              )
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
              onClick={handleUpdateSchedule}
              className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 transition-colors duration-200 text-sm sm:text-base"
            >
              Update Schedule
            </motion.button>
          </motion.div>
        </div>

        {/* Doctor Verification */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mt-8 max-w-lg mx-auto"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            Doctor Verification
          </h3>

          {["not_submitted", "rejected", ""].includes(
            profile.verificationStatus
          ) ? (
            <form onSubmit={handleVerificationUpload} className="space-y-4">
              <input
                type="text"
                placeholder="Enter License Number"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                className="w-full p-2 border rounded text-sm sm:text-base"
                required
              />
              <input
                type="file"
                accept="image/*,.pdf"
                className="w-full p-2 border rounded text-sm sm:text-base"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm sm:text-base"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Submit for Verification"}
              </button>
            </form>
          ) : (
            <p className="text-gray-700 text-sm sm:text-base">
              {profile.verificationStatus === "pending" &&
                "📄 Document uploaded. Awaiting admin review."}
              {profile.verificationStatus === "approved" &&
                "✅ You are verified."}
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
