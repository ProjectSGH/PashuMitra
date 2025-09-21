"use client";

import { motion } from "framer-motion";
import { Search, Filter, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import axios from "axios";

const DoctorsPage = () => {
  const [statsCards, setStatsCards] = useState([
    { title: "Total Doctors", value: "0", color: "blue" },
    { title: "Active", value: "0", color: "green" },
    { title: "Pending", value: "0", color: "orange" },
  ]);
  const [doctors, setDoctors] = useState([]);

  // Fetch doctors with profile and verification status
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users/Doctor");
        setDoctors(res.data);

        const total = res.data.length;
        const active = res.data.filter(d => d.verificationStatus === "approved").length;
        const pending = res.data.filter(d => d.verificationStatus === "pending").length;

        setStatsCards([
          { title: "Total Doctors", value: total.toString(), color: "blue" },
          { title: "Active", value: active.toString(), color: "green" },
          { title: "Pending", value: pending.toString(), color: "orange" },
        ]);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch doctors");
      }
    };

    fetchDoctors();
  }, []);

  const getStatusBadge = (status, color) => {
    const colorClasses = {
      green: "bg-green-100 text-green-800 border-green-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
      gray: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return (
      <span
        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${colorClasses[color]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Veterinary Doctors</h1>
          <p className="text-gray-600">Manage and monitor all registered doctors</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <UserPlus className="w-4 h-4" /> Add Doctor
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          >
            <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search doctors..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Doctors Table */}
      <motion.div className="bg-white rounded-xl border border-gray-200 shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">All Doctors</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left font-medium text-gray-600">ID</th>
                <th className="py-3 px-6 text-left font-medium text-gray-600">Name</th>
                <th className="py-3 px-6 text-left font-medium text-gray-600">Contact</th>
                <th className="py-3 px-6 text-left font-medium text-gray-600">Specialization</th>
                <th className="py-3 px-6 text-left font-medium text-gray-600">Hospital</th>
                <th className="py-3 px-6 text-left font-medium text-gray-600">Experience</th>
                <th className="py-3 px-6 text-left font-medium text-gray-600">Verification</th>
                <th className="py-3 px-6 text-left font-medium text-gray-600">Joined</th>
                <th className="py-3 px-6 text-left font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor, index) => {
                const profile = doctor.doctorProfile || {};
                const verificationStatus = doctor.verificationStatus || "not_submitted";
                const badgeColor = verificationStatus === "approved" ? "green" : verificationStatus === "pending" ? "orange" : "gray";

                return (
                  <motion.tr
                    key={doctor.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6 text-gray-900">{doctor.id}</td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{profile.fullName || doctor.email}</div>
                      <div className="text-sm text-gray-500">{doctor.email}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{doctor.phone}</td>
                    <td className="py-4 px-6 text-gray-600">{profile.specialization}</td>
                    <td className="py-4 px-6 text-gray-600">{profile.hospitalname}</td>
                    <td className="py-4 px-6 text-gray-600">{profile.experience} yrs</td>
                    <td className="py-4 px-6">{getStatusBadge(verificationStatus, badgeColor)}</td>
                    <td className="py-4 px-6 text-gray-600">{new Date(doctor.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-6 flex gap-2">
                      <button className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        onClick={async () => {
                          if (confirm(`Are you sure you want to delete ${profile.fullName || doctor.email}?`)) {
                            try {
                              await axios.delete(`http://localhost:5000/api/admin/user/${doctor.id}`);
                              setDoctors(prev => prev.filter(d => d.id !== doctor.id));
                              toast.success("Doctor deleted successfully");
                            } catch (err) {
                              console.error(err);
                              toast.error("Failed to delete doctor");
                            }
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DoctorsPage;
