"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Clock, Store, Calendar } from "lucide-react";
import resources from "../../resource";

export default function StoreProfileSchedule() {
  const [profile, setProfile] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [license, setLicense] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchProfileAndSchedule = async () => {
    try {
      const userRes = await axios.get(
        `http://localhost:5000/api/users/${user._id}`
      );
      const userData = userRes.data;

      // ✅ Fetch store verification status
      let verificationStatus = "not_submitted";
      try {
        const verificationRes = await axios.get(
          `http://localhost:5000/api/verification/status/${user._id}?role=Store`
        );
        verificationStatus =
          verificationRes.data.verificationStatus || "pending";
      } catch {
        console.warn("Verification status not found, defaulting to not_submitted");
      }

      setProfile({
        storeName: userData.storeProfile?.storeName || "",
        ownerName: userData.storeProfile?.ownerName || "",
        address: userData.storeProfile?.address || "",
        city: userData.storeProfile?.city || "",
        state: userData.storeProfile?.state || "",
        phone: userData.phone || "",
        email: userData.email || "",
        licenseNumber: userData.storeProfile?.licenseNumber || "",
        verificationStatus,
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
        }
      }

      const fallbackSchedule = {
        Monday: { available: true, startTime: "09:00", endTime: "21:00" },
        Tuesday: { available: true, startTime: "09:00", endTime: "21:00" },
        Wednesday: { available: true, startTime: "09:00", endTime: "21:00" },
        Thursday: { available: true, startTime: "09:00", endTime: "21:00" },
        Friday: { available: true, startTime: "09:00", endTime: "21:00" },
        Saturday: { available: true, startTime: "10:00", endTime: "19:00" },
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
    } catch {
      toast.error("Schedule update failed. Try again.");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const payload = {
        storeProfile: {
          storeName: profile.storeName,
          ownerName: profile.ownerName,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          licenseNumber: profile.licenseNumber,
        },
      };

      await axios.put(`http://localhost:5000/api/users/${user._id}`, payload);

      const updatedUser = {
        ...user,
        storeProfile: payload.storeProfile,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Store profile updated successfully");
    } catch {
      toast.error("Update failed. Try again later.");
    }
  };

  const handleLicenseUpload = async (e) => {
    e.preventDefault();
    if (!file || !license) return toast.error("Please fill all fields");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("role", "Store");
      formData.append("licenseNumber", license);

      await axios.post(
        `http://localhost:5000/api/verification/upload/${user._id}`,
        formData
      );

      toast.success("Store license uploaded successfully!");

      // Refresh verification status
      const verificationRes = await axios.get(
        `http://localhost:5000/api/verification/status/${user._id}?role=Store`
      );
      setProfile((prev) => ({
        ...prev,
        verificationStatus:
          verificationRes.data.verificationStatus || "pending",
      }));

      setFile(null);
      setLicense("");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed. Try again later.");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading || !profile || !schedule) {
    return <div className="p-10 text-center">Loading store profile...</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
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
            Store Profile & Schedule
          </h1>
          <p className="text-gray-600">
            Manage your store information and business hours
          </p>
        </motion.div>

        {/* License Upload Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Store License Upload
          </h3>

          {profile.verificationStatus === "approved" ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <div>
                <p className="text-green-800 font-semibold">
                  Verification Successful
                </p>
                <p className="text-green-700 text-sm">
                  Your store license has been verified by the admin.
                </p>
              </div>
            </div>
          ) : profile.verificationStatus === "pending" ? (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="text-amber-600 mt-1">⏳</div>
              <div>
                <p className="text-amber-800 font-medium">
                  Verification In Process
                </p>
                <p className="text-amber-700 text-sm mt-1">
                  Your store license has been submitted. Please wait for admin
                  approval.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLicenseUpload} className="space-y-5">
              <div className="space-y-2">
                <label className="text-gray-800 text-sm font-medium block">
                  License Number
                </label>
                <input
                  type="text"
                  placeholder="Enter your store license number"
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
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
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
                disabled={isUploading}
                className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 font-semibold text-sm sm:text-base shadow-sm hover:shadow-md"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  "Upload for Verification"
                )}
              </button>
            </form>
          )}
        </motion.div>

        {/* Store Info + Schedule Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Store Info */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Store className="text-gray-700" />
                Store Information
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
              {["storeName", "ownerName", "email", "phone"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    value={profile[field]}
                    onChange={(e) => handleProfileChange(field, e.target.value)}
                    readOnly={["email", "phone"].includes(field)}
                    className={`w-full px-3 py-2 border rounded-md text-sm sm:text-base ${
                      ["email", "phone"].includes(field)
                        ? "bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed"
                        : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    }`}
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Address
                </label>
                <textarea
                  rows={3}
                  value={profile.address}
                  onChange={(e) => handleProfileChange("address", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => handleProfileChange("city", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={profile.state}
                    onChange={(e) => handleProfileChange("state", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpdateProfile}
              className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
            >
              Update Store Info
            </motion.button>
          </motion.div>

          {/* Weekly Schedule */}
<motion.div
  variants={itemVariants}
  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
>
  <div className="flex items-center gap-2 mb-6">
    <Calendar className="w-5 h-5 text-gray-700" />
    <h2 className="text-xl font-semibold text-gray-900">Weekly Schedule</h2>
  </div>

  <div className="space-y-3">
    {Object.entries(schedule)
      // ✅ filter out unwanted fields
      .filter(
        ([day]) =>
          !["_id", "userId", "__v"].includes(day) &&
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
      .map(([day, data]) => (
        <motion.div
          key={day}
          variants={itemVariants}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border border-gray-200 rounded-md"
        >
          <div className="flex items-center gap-3 flex-1">
            <span className="font-medium text-gray-900 w-24">{day}</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.available}
                onChange={(e) =>
                  handleScheduleChange(day, "available", e.target.checked)
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-blue-600 font-medium">Open</span>
            </label>
          </div>

          {data.available && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gray-500" />
              <input
                type="time"
                value={data.startTime}
                onChange={(e) =>
                  handleScheduleChange(day, "startTime", e.target.value)
                }
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">to</span>
              <Clock className="w-4 h-4 text-gray-500" />
              <input
                type="time"
                value={data.endTime}
                onChange={(e) =>
                  handleScheduleChange(day, "endTime", e.target.value)
                }
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
              />
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
    Update Business Hours
  </motion.button>
</motion.div>

        </div>
      </motion.div>
    </div>
  );
}
