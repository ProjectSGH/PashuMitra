"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCircle,
  X,
  Clock,
  Trash,
  Inbox,
  Search,
  Package,
  Truck,
} from "lucide-react";

export default function FarmerNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [userId, setUserId] = useState(null);

  // ✅ Load userId from localStorage and fetch notifications
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?._id) return;

    const fetchFarmerNotifications = async () => {
      try {
        // 1️⃣ Get farmer details by main User _id
        const farmerRes = await axios.get(
          `http://localhost:5000/api/notifications/farmer/${storedUser._id}`
        );
        const farmerDetailId = farmerRes.data._id;

        // 2️⃣ Fetch notifications using farmer detail ID
        const notesRes = await axios.get(
          `http://localhost:5000/api/notifications/${farmerDetailId}`
        );
        setNotifications(notesRes.data || []);
        setUserId(farmerDetailId); // save for mark read etc
      } catch (err) {
        console.error("❌ Error fetching farmer notifications:", err);
      }
    };

    fetchFarmerNotifications();
  }, []);

  // ✅ Mark one as read
  // ✅ Mark one as read
const markAsRead = async (id) => {
  try {
    await axios.put(`http://localhost:5000/api/notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    
    // Update Header badge instantly
    const headerBadge = document.querySelector(
      '.header-bell-badge'
    );
    if (headerBadge) {
      headerBadge.innerText = Math.max(0, Number(headerBadge.innerText) - 1);
      if (Number(headerBadge.innerText) === 0) headerBadge.style.display = "none";
    }
  } catch (err) {
    console.error(err);
  }
};

// ✅ Mark all as read
const markAllRead = async () => {
  if (!userId) return;
  try {
    await axios.put(`http://localhost:5000/api/notifications/user/${userId}/readall`);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    
    // Hide Header badge
    const headerBadge = document.querySelector('.header-bell-badge');
    if (headerBadge) {
      headerBadge.style.display = "none";
    }
  } catch (err) {
    console.error(err);
  }
};

  // ✅ Delete one
  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("❌ Error deleting notification:", err);
    }
  };

  // 🔍 Search + Filter
  const filtered = notifications
    .filter((n) => (filter === "all" ? true : n.type === filter))
    .filter(
      (n) =>
        n.title?.toLowerCase().includes(query.toLowerCase()) ||
        n.message?.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white shadow">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-semibold text-gray-900">
                Notifications
              </h1>
              <p className="text-sm text-gray-500">
                All your updates on consultations, orders and transports.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Search notifications..."
                aria-label="Search notifications"
              />
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={markAllRead}
                className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                Mark all read
              </button>
            </div>

            <div className="sm:hidden">
              <button
                onClick={markAllRead}
                className="p-2 rounded-full bg-blue-600 text-white"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters */}
          <aside className="md:col-span-1 bg-white p-4 rounded-lg shadow-sm h-fit">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filters</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`text-left px-3 py-2 rounded-md w-full ${
                  filter === "all"
                    ? "bg-blue-50 border border-blue-200 text-blue-700"
                    : "text-gray-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Inbox className="w-4 h-4" />
                  <span>All</span>
                </div>
              </button>

              <button
                onClick={() => setFilter("consultation")}
                className={`text-left px-3 py-2 rounded-md w-full ${
                  filter === "consultation"
                    ? "bg-blue-50 border border-blue-200 text-blue-700"
                    : "text-gray-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Consultations</span>
                </div>
              </button>

              <button
                onClick={() => setFilter("order")}
                className={`text-left px-3 py-2 rounded-md w-full ${
                  filter === "order"
                    ? "bg-blue-50 border border-blue-200 text-blue-700"
                    : "text-gray-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>Orders</span>
                </div>
              </button>

              <button
                onClick={() => setFilter("transport")}
                className={`text-left px-3 py-2 rounded-md w-full ${
                  filter === "transport"
                    ? "bg-blue-50 border border-blue-200 text-blue-700"
                    : "text-gray-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>Transport</span>
                </div>
              </button>

              <button
                onClick={() => setFilter("system")}
                className={`text-left px-3 py-2 rounded-md w-full ${
                  filter === "system"
                    ? "bg-blue-50 border border-blue-200 text-blue-700"
                    : "text-gray-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  <span>System</span>
                </div>
              </button>

              <div className="mt-4 border-t pt-4">
                <h4 className="text-xs text-gray-500 mb-2">Quick actions</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNotifications([])}
                    className="flex-1 px-3 py-2 rounded-md bg-red-50 text-red-700 text-sm border border-red-100"
                  >
                    <Trash className="w-4 h-4 mr-2 inline" /> Clear all
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Notifications list */}
          <main className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <AnimatePresence>
                {filtered.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="text-center py-12 text-gray-500"
                  >
                    <p className="mb-2">No notifications</p>
                    <p className="text-xs">You are all caught up 🎉</p>
                  </motion.div>
                ) : (
                  filtered.map((n) => (
                    <motion.article
                      key={n._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      layout
                      className={`flex items-start gap-4 p-4 rounded-lg mb-3 border ${
                        n.isRead
                          ? "border-gray-100 bg-white"
                          : "border-blue-100 bg-blue-50"
                      }`}
                    >
                      <div className="shrink-0 mt-1">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            n.isRead
                              ? "bg-white text-blue-600 border border-gray-100"
                              : "bg-blue-600 text-white"
                          }`}
                        >
                          <Bell className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900">
                              {n.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              {n.message}
                            </p>
                          </div>
                          <div className="text-xs text-gray-400 text-right">
                            <div>
                              {new Date(n.createdAt).toLocaleString()}
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              {!n.isRead && (
                                <button
                                  onClick={() => markAsRead(n._id)}
                                  className="text-xs px-2 py-1 rounded bg-white border border-blue-200 text-blue-700"
                                >
                                  Mark read
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(n._id)}
                                className="text-xs px-2 py-1 rounded bg-white border border-gray-200 text-gray-600"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
