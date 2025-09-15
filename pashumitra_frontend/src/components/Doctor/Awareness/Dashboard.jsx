"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"

export default function DashboardTab() {
  const [doctorId, setDoctorId] = useState(null)
  const [stats, setStats] = useState({ campaigns: 0, posts: 0, documents: 0 })
  const [activities, setActivities] = useState([])

  useEffect(() => {
    // ✅ Get doctor id from localStorage
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const parsed = JSON.parse(storedUser)
        setDoctorId(parsed._id) // doctor id
      } else {
        const storedUserId = localStorage.getItem("userId")
        if (storedUserId) setDoctorId(storedUserId)
      }
    } catch (err) {
      console.error("❌ Error parsing localStorage user:", err)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (!doctorId) return
      try {
        console.log("📌 Fetching dashboard for doctorId:", doctorId)

        const [campaignRes, postRes, docRes, recentCampaigns, recentPosts, recentDocs] =
          await Promise.all([
            axios.get(`http://localhost:5000/api/dashboard/campaigns/count/${doctorId}`),
            axios.get(`http://localhost:5000/api/dashboard/posts/count/${doctorId}`),
            axios.get(`http://localhost:5000/api/dashboard/docs/count/${doctorId}`),
            axios.get(`http://localhost:5000/api/dashboard/campaigns/recent/${doctorId}`),
            axios.get(`http://localhost:5000/api/dashboard/posts/recent/${doctorId}`),
            axios.get(`http://localhost:5000/api/dashboard/docs/recent/${doctorId}`)
          ])

        setStats({
          campaigns: campaignRes.data.total,
          posts: postRes.data.total,
          documents: docRes.data.total
        })

        // merge & sort recent activity
        const merged = [
          ...recentCampaigns.data.map(c => ({
            type: "Campaign",
            title: c.title || "Untitled Campaign",
            action: "Created campaign",
            createdAt: c.createdAt
          })),
          ...recentPosts.data.map(p => ({
            type: "Post",
            title: p.title,
            action: "Published post",
            createdAt: p.createdAt
          })),
          ...recentDocs.data.map(d => ({
            type: "Document",
            title: d.title,
            action: "Uploaded document",
            createdAt: d.createdAt
          }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        setActivities(merged)
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err)
      }
    }

    fetchData()
  }, [doctorId])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Total Campaigns</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.campaigns}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Posts Created</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.posts}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Documents Uploaded</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.documents}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <ul className="divide-y divide-gray-100">
          {activities.length > 0 ? (
            activities.map((act, idx) => (
              <li key={idx} className="py-3 flex justify-between text-sm text-gray-700">
                <span>{act.action} "{act.title}"</span>
                <span className="text-gray-500">
                  {new Date(act.createdAt).toLocaleString()}
                </span>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No recent activity yet.</p>
          )}
        </ul>
      </div>
    </motion.div>
  )
}
