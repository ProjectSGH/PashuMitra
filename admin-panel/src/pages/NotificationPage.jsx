"use client"

import { motion } from "framer-motion"
import { Bell, Send, Users, ChevronDown } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"

const NotificationsPage = () => {
  const [formData, setFormData] = useState({
    role: "",
    title: "",
    message: "",
    type: "",
  })
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false)
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false)

  const roleOptions = [
    { value: "all", label: "Send to all users" },
    { value: "farmers", label: "Veterinary Farmers" },
    { value: "doctors", label: "Veterinary Doctors" },
    { value: "stores", label: "Medical Stores" },
  ]

  const typeOptions = [
    { value: "consultation", label: "Consultation" },
    { value: "info", label: "Info" },
    { value: "alert", label: "Alert" },
    { value: "important", label: "Important" },
  ]

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.role || !formData.title || !formData.message || !formData.type) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      const res = await axios.post("http://localhost:5000/api/admin/notifications/send", formData)
      toast.success(res.data.message)
      setFormData({ role: "", title: "", message: "", type: "" })
    } catch (err) {
      console.error(err)
      toast.error("Failed to send notification")
    }
  }

  const getTypeColor = (type) => {
    const colors = {
      consultation: "bg-blue-100 text-blue-800 border-blue-200",
      info: "bg-gray-100 text-gray-800 border-gray-200",
      alert: "bg-yellow-100 text-yellow-800 border-yellow-200",
      important: "bg-red-100 text-red-800 border-red-200",
    }
    return colors[type] || colors.info
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">Send notifications to users based on their roles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Send Notification Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Send Notification</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Send to</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className={formData.role ? "text-gray-900" : "text-gray-500"}>
                    {formData.role ? roleOptions.find((r) => r.value === formData.role)?.label : "Select recipient"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {roleDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
                  >
                    {roleOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          handleInputChange("role", option.value)
                          setRoleDropdownOpen(false)
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          {option.label}
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter notification title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Enter your message here..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className={formData.type ? "text-gray-900" : "text-gray-500"}>
                    {formData.type
                      ? typeOptions.find((t) => t.value === formData.type)?.label
                      : "Select notification type"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {typeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
                  >
                    {typeOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          handleInputChange("type", option.value)
                          setTypeDropdownOpen(false)
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        <div className="flex items-center justify-between">
                          <span>{option.label}</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(option.value)}`}
                          >
                            {option.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Send className="w-4 h-4" />
              Send Notification
            </button>
          </form>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
          </div>

          {formData.title || formData.message || formData.type ? (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{formData.title || "Notification Title"}</h3>
                  {formData.type && (
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(formData.type)}`}
                    >
                      {typeOptions.find((t) => t.value === formData.type)?.label}
                    </span>
                  )}
                </div>
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {formData.message || "Your notification message will appear here..."}
              </p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Recipients:{" "}
                  {formData.role ? roleOptions.find((r) => r.value === formData.role)?.label : "Select recipients"}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Fill in the form to see a preview of your notification</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default NotificationsPage
