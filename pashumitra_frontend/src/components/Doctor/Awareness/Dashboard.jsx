"use client"

import { motion } from "framer-motion"

export function DashboardTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Example dashboard stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Total Campaigns</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Posts Created</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">48</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Documents Uploaded</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">29</p>
        </div>
      </div>

      {/* Example recent activity section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <ul className="divide-y divide-gray-100">
          <li className="py-3 flex justify-between text-sm text-gray-700">
            <span>Created new campaign "Healthy Livestock Awareness"</span>
            <span className="text-gray-500">2h ago</span>
          </li>
          <li className="py-3 flex justify-between text-sm text-gray-700">
            <span>Uploaded document "Goat Nutrition Guide.pdf"</span>
            <span className="text-gray-500">5h ago</span>
          </li>
          <li className="py-3 flex justify-between text-sm text-gray-700">
            <span>Published post "Cattle Vaccination Schedule"</span>
            <span className="text-gray-500">1d ago</span>
          </li>
        </ul>
      </div>
    </motion.div>
  )
}

export default DashboardTab;