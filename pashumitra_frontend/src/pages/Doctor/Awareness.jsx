"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, Plus, Upload, Target } from "lucide-react"

import DashboardTab from "../../components/Doctor/Awareness/Dashboard"
import CreatePostTab from "../../components/Doctor/Awareness/CreatePost"
import UploadDocsTab from "../../components/Doctor/Awareness/UploadDocs"
import CampaignsTab from "../../components/Doctor/Awareness/Campaign"

export default function AwarenessPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, component: <DashboardTab /> },
    { id: "create-post", label: "Create Post", icon: Plus, component: <CreatePostTab /> },
    { id: "upload-docs", label: "Upload Docs", icon: Upload, component: <UploadDocsTab /> },
    { id: "campaigns", label: "Campaigns", icon: Target, component: <CampaignsTab /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[80vw] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Veterinary Awarness Dashboard</h1>
          <p className="text-gray-600">Manage your livestock awareness content and campaigns</p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {tabs.find((t) => t.id === activeTab)?.component}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
