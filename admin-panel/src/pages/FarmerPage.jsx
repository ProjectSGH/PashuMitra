"use client";

import { motion } from "framer-motion";
import { Search, Filter, UserPlus, MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import axios from "axios";

const FarmersPage = () => {
  const [statsCards, setStatsCards] = useState([
    { title: "Total Farmers", value: "0", color: "blue" },
    { title: "Active", value: "0", color: "green" },
    { title: "Pending", value: "0", color: "orange" },
  ]);
  const [farmers, setFarmers] = useState([]);

  // ✅ Fetch farmers from API
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/users/Farmer"
        );
        setFarmers(res.data);

        // Update stats
        // Update stats
        const total = res.data.length;
        const active = res.data.filter((f) => f.isVerified).length;
        const pending = res.data.filter(
          (f) => f.verificationStatus === "pending"
        ).length;

        setStatsCards([
          { title: "Total Farmers", value: total.toString(), color: "blue" },
          { title: "Active", value: active.toString(), color: "green" },
          { title: "Pending", value: pending.toString(), color: "orange" },
        ]);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch farmers");
      }
    };

    fetchFarmers();
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Veterinary Farmers
          </h1>
          <p className="text-gray-600">
            Manage and monitor all registered farmers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => toast.success("Filter applied")}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => toast.success("Add Farmer clicked")}
          >
            <UserPlus className="w-4 h-4" />
            Add Farmer
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
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              {card.title}
            </h3>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search farmers..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Farmers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">All Farmers</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  ID
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Name
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Contact
                </th>

                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Address
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Village
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  City
                </th>

                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  State
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Pin Code
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Joined
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Verification
                </th>

                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {farmers.map((farmer, index) => {
                const profile = farmer.farmerProfile || {};
                return (
                  <motion.tr
                    key={farmer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">
                        {farmer.id}{" "}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">
                        {profile.fullName || farmer.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {farmer.email}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{farmer.phone}</td>
                    <td className="py-4 px-6 text-gray-600">
                      {profile.address}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {profile.village}
                    </td>
                    <td className="py-4 px-6 text-gray-600">{profile.city}</td>
                    <td className="py-4 px-6 text-gray-600">{profile.state}</td>
                    <td className="py-4 px-6 text-gray-600">
                      {profile.pincode}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(farmer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      {farmer.isVerified
                        ? getStatusBadge("Verified", "green")
                        : farmer.verificationStatus === "pending"
                        ? getStatusBadge("Pending", "orange")
                        : getStatusBadge("Not Verified", "gray")}
                    </td>
                    <td className="py-4 px-6 flex gap-2">
                      <button
                        onClick={async () => {
                          if (
                            confirm(
                              `Are you sure you want to delete ${
                                profile.fullName || farmer.email
                              }?`
                            )
                          ) {
                            try {
                              await axios.delete(
                                `http://localhost:5000/api/admin/user/${farmer.id}`
                              );
                              setFarmers((prev) =>
                                prev.filter((f) => f.id !== farmer.id)
                              );
                              toast.success("User deleted successfully");
                            } catch (err) {
                              console.error(err);
                              toast.error("Failed to delete user");
                            }
                          }
                        }}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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

export default FarmersPage;
