"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Tractor,
  Stethoscope,
  Store,
  Clock,
  TrendingUp,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [verifications, setVerifications] = useState([]);

  // ✅ Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsRes = await axios.get("http://localhost:5000/api/admin/stats");
        setStats(statsRes.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  // ✅ Fetch verifications from backend
  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/verification");
        setVerifications(res.data.slice(0, 5)); // latest 5 requests
      } catch (err) {
        console.error("Error fetching verifications:", err);
      }
    };
    fetchVerifications();
  }, []);

  const handleAction = (action, name) => {
    toast.success(`${action} action performed for ${name}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "approved":
      case "Approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
      case "Rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status) => {
    const colorClasses = {
      Pending: "bg-orange-100 text-orange-800 border-orange-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      Approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      Rejected: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
          colorClasses[status] || "bg-gray-100 text-gray-800 border-gray-200"
        }`}
      >
        {getStatusIcon(status)}
        {status}
      </span>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">PashuMitra Dashboard</h1>
        <p className="text-gray-600">Welcome to PashuMitra Admin Panel. Monitor and manage all user verifications.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats &&
          [
            {
              title: "Total Farmers",
              value: stats.totalFarmers,
              subtitle: "Registered farmers",
              change: "+12% from last month",
              changeType: "positive",
              icon: Tractor,
              color: "blue",
            },
            {
              title: "Total Doctors",
              value: stats.totalDoctors,
              subtitle: "Verified doctors",
              change: "+8% from last month",
              changeType: "positive",
              icon: Stethoscope,
              color: "blue",
            },
            {
              title: "Medical Stores",
              value: stats.totalStores,
              subtitle: "Registered stores",
              change: "+15% from last month",
              changeType: "positive",
              icon: Store,
              color: "blue",
            },
            {
              title: "Pending Verifications",
              value: stats.pendingVerifications,
              subtitle: "Awaiting approval",
              change: "Today’s updates",
              changeType: "neutral",
              icon: Clock,
              color: "orange",
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    card.color === "blue" ? "bg-blue-100" : "bg-orange-100"
                  }`}
                >
                  <card.icon
                    className={`w-6 h-6 ${
                      card.color === "blue" ? "text-blue-600" : "text-orange-600"
                    }`}
                  />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
              <p className="text-sm text-gray-500 mb-2">{card.subtitle}</p>
              <div
                className={`flex items-center gap-1 text-sm ${
                  card.changeType === "positive" ? "text-green-600" : "text-gray-600"
                }`}
              >
                {card.changeType === "positive" && <TrendingUp className="w-4 h-4" />}
                <span>{card.change}</span>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Recent Verifications Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Recent Verifications</h2>
            <p className="text-gray-600 mt-1">Latest verification requests requiring your attention</p>
          </div>
          <button
            className="text-blue-600 hover:text-blue-700 font-medium"
            onClick={() => toast.success("Navigated to all verifications")}
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Name</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Role</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Email</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {verifications.map((v, index) => (
                <motion.tr
                  key={v._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6 font-medium text-gray-900">{v.fullName || v.storeName || "N/A"}</td>
                  <td className="py-4 px-6 text-gray-600">{v.user.role}</td>
                  <td className="py-4 px-6 text-gray-600">{v.user.email}</td>
                  <td className="py-4 px-6">{getStatusBadge(v.verificationStatus)}</td>
                  
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
