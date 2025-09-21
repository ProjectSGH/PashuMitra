"use client";

import { motion } from "framer-motion";
import { Search, Filter, Eye, Clock, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import axios from "axios";
import VerificationDetailsModal from "./VerificationDetailModel";

const VerificationsPage = () => {
  const [statsCards, setStatsCards] = useState([
    { title: "Total Requests", value: "0", color: "blue" },
    { title: "Pending", value: "0", color: "orange" },
    { title: "Approved", value: "0", color: "green" },
  ]);

  const [verifications, setVerifications] = useState([]);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch verification requests
  const fetchVerifications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/verification"
      );
      console.log("API response:", res.data);

      setVerifications(res.data);

      // update stats
      const total = res.data.length;
      const pending = res.data.filter(
        (v) => v.verificationStatus === "pending"
      ).length;
      const approved = res.data.filter(
        (v) => v.verificationStatus === "approved"
      ).length;
      setStatsCards([
        { title: "Total Requests", value: total.toString(), color: "blue" },
        { title: "Pending", value: pending.toString(), color: "orange" },
        { title: "Approved", value: approved.toString(), color: "green" },
      ]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch verifications");
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status) => {
    const colorClasses = {
      pending: "bg-orange-100 text-orange-800 border-orange-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${colorClasses[status]}`}
      >
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleViewVerification = (verification) => {
    setSelectedVerification(verification);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedVerification(null);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Verifications
            </h1>
            <p className="text-gray-600">
              Review and approve user verification requests
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => toast.success("Filter applied")}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
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
              placeholder="Search verifications..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Verification Requests Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Verification Requests
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">
                    User Details
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">
                    Role
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">
                    Contact
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">
                    Documents
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">
                    Submitted
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {verifications.map((verification, index) => (
                  <motion.tr
                    key={verification._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900">
                          {verification.fullName ||
                            verification.user?.email ||
                            "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {verification.user?.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {verification.user?.role}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {verification.user?.phone || "N/A"}
                    </td>

                    <td className="py-4 px-6 text-gray-600">
                      {verification.verificationDocument ? "1 doc" : "No docs"}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(verification.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(verification.verificationStatus)}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleViewVerification(verification)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-blue-50 border border-transparent hover:border-blue-600 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      {/* Verification Details Modal */}
      <VerificationDetailsModal
        isOpen={showDetailsModal}
        onClose={closeDetailsModal}
        verification={selectedVerification}
        onStatusChange={(updatedVerification) => {
          // Update the verification in the table
          setVerifications((prev) =>
            prev.map((v) =>
              v._id === updatedVerification._id ? updatedVerification : v
            )
          );

          // Update stats
          setStatsCards((prevStats) => {
            const total = prevStats[0].value; // total requests stay the same
            const pending = verifications.filter(
              (v) =>
                (v._id === updatedVerification._id
                  ? updatedVerification
                  : v
                ).verificationStatus === "pending"
            ).length;
            const approved = verifications.filter(
              (v) =>
                (v._id === updatedVerification._id
                  ? updatedVerification
                  : v
                ).verificationStatus === "approved"
            ).length;

            return [
              { title: "Total Requests", value: total.toString(), color: "blue" },
              { title: "Pending", value: pending.toString(), color: "orange" },
              { title: "Approved", value: approved.toString(), color: "green" },
            ];
          });
        }}
      />
    </>
  );
};

export default VerificationsPage;
