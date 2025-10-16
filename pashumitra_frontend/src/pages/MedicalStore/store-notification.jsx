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
  Settings,
  Pill,
  Truck,
} from "lucide-react";

export default function StoreNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const storedId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!storedId) return;
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/notifications/${storedId}`
        );
        setNotifications(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching notifications:", err);
      }
    };
    fetchNotifications();
  }, [storedId]);

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/${id}/read/${storedId}`
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id
            ? { ...n, isReadBy: [...(n.isReadBy || []), storedId] }
            : n
        )
      );
    } catch (err) {
      console.error("❌ Error marking as read:", err);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/user/${storedId}/readall`
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n.isReadBy?.includes(storedId)
            ? n
            : { ...n, isReadBy: [...(n.isReadBy || []), storedId] }
        )
      );
    } catch (err) {
      console.error("❌ Error marking all read:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("❌ Error deleting notification:", err);
    }
  };

  const getIconByType = (type, hasRead) => {
    const baseClass = `h-10 w-10 rounded-full flex items-center justify-center ${
      hasRead
        ? "bg-white text-blue-600 border border-gray-100"
        : "bg-blue-600 text-white"
    }`;

    switch (type) {
      case "system":
        return (
          <div className={baseClass}>
            <Settings className="w-5 h-5" />
          </div>
        );
      case "medicine_request":
        return (
          <div className={baseClass}>
            <Pill className="w-5 h-5" />
          </div>
        );
      case "transport_request":
        return (
          <div className={baseClass}>
            <Truck className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className={baseClass}>
            <Bell className="w-5 h-5" />
          </div>
        );
    }
  };

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white shadow">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-semibold text-gray-900">
                Store Notifications
              </h1>
              <p className="text-sm text-gray-500">
                Track all medicine and transport updates here.
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
              />
            </div>
            <button
              onClick={markAllRead}
              className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              Mark all read
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <Inbox className="inline w-4 h-4 mr-2" /> All
              </button>
              <button
                onClick={() => setFilter("system")}
                className={`text-left px-3 py-2 rounded-md w-full ${
                  filter === "system"
                    ? "bg-blue-50 border border-blue-200 text-blue-700"
                    : "text-gray-600"
                }`}
              >
                <Settings className="inline w-4 h-4 mr-2" /> System
              </button>
              <button
                onClick={() => setFilter("medicine_request")}
                className={`text-left px-3 py-2 rounded-md w-full ${
                  filter === "medicine_request"
                    ? "bg-blue-50 border border-blue-200 text-blue-700"
                    : "text-gray-600"
                }`}
              >
                <Pill className="inline w-4 h-4 mr-2" /> Medicine Requests
              </button>
              <button
                onClick={() => setFilter("transport_request")}
                className={`text-left px-3 py-2 rounded-md w-full ${
                  filter === "transport_request"
                    ? "bg-blue-50 border border-blue-200 text-blue-700"
                    : "text-gray-600"
                }`}
              >
                <Truck className="inline w-4 h-4 mr-2" /> Transport Requests
              </button>
            </div>
          </aside>

          <main className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <AnimatePresence>
                {filtered.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-gray-500"
                  >
                    No notifications yet
                  </motion.div>
                ) : (
                  filtered.map((n) => {
                    const hasRead = n.isReadBy?.includes(storedId);
                    return (
                      <motion.article
                        key={n._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`flex items-start gap-4 p-4 rounded-lg mb-3 border ${
                          hasRead
                            ? "border-gray-100 bg-white"
                            : "border-blue-100 bg-blue-50"
                        }`}
                      >
                        {getIconByType(n.type, hasRead)}
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {n.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {n.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          {!hasRead && (
                            <button
                              onClick={() => markAsRead(n._id)}
                              className="text-xs px-2 py-1 border bg-white text-blue-600 rounded"
                            >
                              Mark read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(n._id)}
                            className="text-xs px-2 py-1 border bg-white text-gray-600 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </motion.article>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
