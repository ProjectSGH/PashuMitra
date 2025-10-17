"use client";

import { motion } from "framer-motion";
import { Search, Filter, Plus, MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import axios from "axios";

const MedicalStoresPage = () => {
  const [statsCards, setStatsCards] = useState([
    { title: "Total Stores", value: "0", color: "blue" },
    { title: "Active", value: "0", color: "green" },
    { title: "Pending", value: "0", color: "orange" },
  ]);
  const [stores, setStores] = useState([]);

  // ✅ Fetch medical stores from API
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/users/MedicalStore"
        );
        setStores(res.data);

        // Update stats
        const total = res.data.length;
        const active = res.data.filter((store) => store.isVerified).length;
        const pending = res.data.filter(
          (store) => store.verificationStatus === "pending"
        ).length;

        setStatsCards([
          { title: "Total Stores", value: total.toString(), color: "blue" },
          { title: "Active", value: active.toString(), color: "green" },
          { title: "Pending", value: pending.toString(), color: "orange" },
        ]);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch medical stores");
      }
    };

    fetchStores();
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

  const handleDeleteStore = async (storeId, storeName) => {
    if (confirm(`Are you sure you want to delete ${storeName}?`)) {
      try {
        await axios.delete(
          `http://localhost:5000/api/admin/user/${storeId}`
        );
        setStores((prev) => prev.filter((store) => store.id !== storeId));
        toast.success("Medical store deleted successfully");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete medical store");
      }
    }
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
            Medical Stores
          </h1>
          <p className="text-gray-600">
            Manage and monitor all registered medical stores
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
            onClick={() => toast.success("Add Store clicked")}
          >
            <Plus className="w-4 h-4" />
            Add Store
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
            placeholder="Search medical stores..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Medical Stores Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            All Medical Stores
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  ID
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Store Name
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Contact
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Owner
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Specialization
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Location
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Established
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
              {stores.map((store, index) => {
                const profile = store.storeProfile || {};
                return (
                  <motion.tr
                    key={store.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">
                        {store.id}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900">
                          {profile.storeName || store.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {store.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="text-gray-900">{store.phone}</div>
                        <div className="text-sm text-gray-500">
                          {profile.city}, {profile.state}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {profile.ownerName}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {profile.specialization}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {profile.address}, {profile.city}, {profile.state} - {profile.pincode}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {profile.established ? new Date(profile.established).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(store.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      {store.isVerified
                        ? getStatusBadge("Verified", "green")
                        : store.verificationStatus === "pending"
                        ? getStatusBadge("Pending", "orange")
                        : getStatusBadge("Not Verified", "gray")}
                    </td>
                    <td className="py-4 px-6 flex gap-2">
                      <button
                        onClick={() => handleDeleteStore(store.id, profile.storeName || store.email)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => toast.success(`Actions for ${profile.storeName || store.email}`)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4 text-gray-600" />
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

export default MedicalStoresPage;