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
          `http://localhost:5000/api/verification/status/${user._id}?role=Doctor`
        );
        verificationStatus =
          verificationRes.data.verificationStatus || "pending";
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
          scheduleData = null;
        } else {
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

  useEffect(() => {
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
      await axios.put(
        `http://localhost:5000/api/schedules/${user._id}`,
        schedule
      );

      toast.success("Schedule updated successfully");
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

      await axios.put(`http://localhost:5000/api/users/${user._id}`, payload);

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
        displayName: profile.fullName,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile", err);
      toast.error("Update failed. Try again later.");
    }
  };

  const handleVerificationUpload = async (e) => {
    e.preventDefault();
    if (!file || !license) return toast.error("Fill all fields");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("role", "Doctor");
      formData.append("licenseNumber", license);

      await axios.post(
        `http://localhost:5000/api/verification/upload/${user._id}`,
        formData
      );

      toast.success("Verification uploaded successfully!");
      setFile(null);
      setLicense("");

      // ✅ Immediately fetch updated verification status
      const verificationRes = await axios.get(
        `http://localhost:5000/api/verification/status/${user._id}?role=Doctor`
      );
      setProfile((prev) => ({
        ...prev,
        verificationStatus:
          verificationRes.data.verificationStatus || "pending",
      }));
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed. Try again later.");
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
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8 mt-8 max-w-lg mx-auto"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Doctor Verification
          </h3>

          {["not_submitted", "rejected", ""].includes(
            profile.verificationStatus
          ) ? (
            <form onSubmit={handleVerificationUpload} className="space-y-5">
              <div className="space-y-2">
                <label className="text-gray-800 text-sm font-medium block">
                  License Number
                </label>
                <input
                  type="text"
                  placeholder="Enter your medical license number"
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-800 text-sm font-medium block">
                  Upload License Document
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 bg-gray-50">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="w-full text-sm sm:text-base file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                  />
                  <p className="text-gray-500 text-xs mt-2">
                    Supported formats: JPG, PNG, PDF (Max 5MB)
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 font-semibold text-sm sm:text-base shadow-sm hover:shadow-md"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  "Submit for Verification"
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              {profile.verificationStatus === "pending" && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0">
                    📄
                  </div>
                  <div>
                    <p className="text-amber-800 font-medium">
                      Verification Under Review
                    </p>
                    <p className="text-amber-700 text-sm mt-1">
                      Your license document has been submitted and is currently
                      being reviewed by our team. You'll be notified once
                      verified.
                    </p>
                  </div>
                </div>
              )}
              {profile.verificationStatus === "approved" && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <p className="text-green-800 font-semibold">
                      Verification Successful
                    </p>
                    <p className="text-green-700 text-sm">
                      Your medical license has been verified.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
