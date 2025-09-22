"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, User, Shield, Bell, Database, Palette, Trash2, X } from "lucide-react"
import toast from "react-hot-toast"

const SettingsPage = () => {
  const [newAdminEmail, setNewAdminEmail] = useState("")
  const [newAdminPassword, setNewAdminPassword] = useState("")
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [admins, setAdmins] = useState([])
  const [activeTab, setActiveTab] = useState("list")

  const settingsSections = [
    {
      icon: User,
      title: "Manage Admins",
      description: "View and manage admin users",
      action: "Open",
    },
    {
      icon: Shield,
      title: "Security",
      description: "Password, two-factor authentication, and security logs",
      action: "Manage Security",
    },
    {
      icon: Bell,
      title: "Notification Preferences",
      description: "Configure how and when you receive notifications",
      action: "Configure",
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Backup, export, and data retention settings",
      action: "Manage Data",
    },
    {
      icon: Palette,
      title: "Appearance",
      description: "Theme, layout, and display preferences",
      action: "Customize",
    },
  ]

  const handleSettingAction = (title) => {
    if (title === "Manage Admins") {
      fetchAdmins()
      setActiveTab("list")
      setShowAdminModal(true)
    } else {
      toast.success(`${title} settings opened`)
    }
  }

  const handleCreateAdmin = async () => {
    if (!newAdminEmail || !newAdminPassword) {
      return toast.error("Email and password are required")
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/auth/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newAdminEmail, password: newAdminPassword }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.message)
        setNewAdminEmail("")
        setNewAdminPassword("")
        fetchAdmins()
        setActiveTab("list")
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.error(err)
      toast.error("Server error")
    }
  }

  const fetchAdmins = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/auth/list")
      const data = await res.json()
      if (data.success) {
        setAdmins(data.admins)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleRemoveAdmin = async (email) => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/auth/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.message)
        fetchAdmins()
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.error(err)
      toast.error("Server error")
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your admin panel preferences and configurations</p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <section.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{section.description}</p>
                <button
                  onClick={() => handleSettingAction(section.title)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                >
                  {section.action} →
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => toast.success("System backup initiated")}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Database className="w-5 h-5 text-gray-600 mb-2" />
            <div className="font-medium text-gray-900">Backup System</div>
            <div className="text-sm text-gray-600">Create system backup</div>
          </button>
          <button
            onClick={() => toast.success("Cache cleared successfully")}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Settings className="w-5 h-5 text-gray-600 mb-2" />
            <div className="font-medium text-gray-900">Clear Cache</div>
            <div className="text-sm text-gray-600">Clear system cache</div>
          </button>
          <button
            onClick={() => toast.success("System logs exported")}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Shield className="w-5 h-5 text-gray-600 mb-2" />
            <div className="font-medium text-gray-900">Export Logs</div>
            <div className="text-sm text-gray-600">Download system logs</div>
          </button>
        </div>
      </motion.div>

      {/* Admin Management Modal */}
      {showAdminModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        onClick={() => setShowAdminModal(false)}
      >
        <X className="w-5 h-5" />
      </button>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "list" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("list")}
        >
          Admins
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "create" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("create")}
        >
          Add New
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "list" ? (
        admins.length === 0 ? (
          <p className="text-gray-600 text-sm">No admins found</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {admins.map((admin, index) => (
              <li key={index} className="flex items-center justify-between py-2">
                <span className="text-gray-800">{admin.email}</span>
                <button
                  onClick={() => handleRemoveAdmin(admin.email)}
                  className="text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Remove
                </button>
              </li>
            ))}
          </ul>
        )
      ) : (
        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Admin email"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={newAdminPassword}
            onChange={(e) => setNewAdminPassword(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleCreateAdmin}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create Admin
          </button>
        </div>
      )}
    </div>
  </div>
)}

    </motion.div>
  )
}

export default SettingsPage
