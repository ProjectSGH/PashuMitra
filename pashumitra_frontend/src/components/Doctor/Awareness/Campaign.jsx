"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Target, Calendar, Users, ArrowRight, Plus } from "lucide-react"

const CampaignsTab = () => {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      title: "Vaccination Awareness Drive",
      description: "Educating farmers about the importance of livestock vaccination to prevent diseases.",
      location: "Village Community Hall",
      startDate: "2025-08-15",
      endDate: "2025-08-16",
      organizer: "Dr. A. Sharma",
      benefits: "Free goat vaccination, disease awareness pamphlets",
      contact: "9876543210",
      participants: 134,
      progress: 75,
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    organizer: "",
    benefits: "",
    contact: "",
  })

  const handleCreateCampaign = () => {
    if (!newCampaign.title || !newCampaign.description || !newCampaign.startDate) {
      alert("Please fill in at least Title, Description, and Start Date.")
      return
    }
    setCampaigns([
      ...campaigns,
      {
        id: campaigns.length + 1,
        participants: 0,
        progress: 0,
        ...newCampaign,
      },
    ])
    setNewCampaign({
      title: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
      organizer: "",
      benefits: "",
      contact: "",
    })
    setShowForm(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Target className="w-6 h-6 text-blue-600 mr-2" /> Ongoing Campaigns
        </h2>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Create Campaign
        </motion.button>
      </div>

      {/* Create Campaign Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Campaign Title"
                value={newCampaign.title}
                onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                placeholder="Organizer Name"
                value={newCampaign.organizer}
                onChange={(e) => setNewCampaign({ ...newCampaign, organizer: e.target.value })}
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                placeholder="Location"
                value={newCampaign.location}
                onChange={(e) => setNewCampaign({ ...newCampaign, location: e.target.value })}
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                placeholder="Benefits (e.g., free vaccination)"
                value={newCampaign.benefits}
                onChange={(e) => setNewCampaign({ ...newCampaign, benefits: e.target.value })}
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="date"
                value={newCampaign.startDate}
                onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="date"
                value={newCampaign.endDate}
                onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                placeholder="Contact Number"
                value={newCampaign.contact}
                onChange={(e) => setNewCampaign({ ...newCampaign, contact: e.target.value })}
                className="border rounded-lg px-4 py-2"
              />
              <textarea
                placeholder="Campaign Details"
                value={newCampaign.description}
                onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                className="border rounded-lg px-4 py-2 md:col-span-2"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCreateCampaign}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg"
            >
              Save Campaign
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Campaign List */}
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <motion.div
            key={campaign.id}
            whileHover={{ scale: 1.01 }}
            className="p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md bg-white transition-all"
          >
            <h3 className="text-lg font-medium text-gray-900">{campaign.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{campaign.description}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-3">
              <span><Calendar className="w-4 h-4 inline mr-1" /> {campaign.startDate} → {campaign.endDate}</span>
              <span><Users className="w-4 h-4 inline mr-1" /> {campaign.participants} Participants</span>
              <span>📍 {campaign.location}</span>
              {campaign.organizer && <span>👨‍⚕️ {campaign.organizer}</span>}
              {campaign.contact && <span>📞 {campaign.contact}</span>}
              {campaign.benefits && <span>🎁 {campaign.benefits}</span>}
            </div>

            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${campaign.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{campaign.progress}% Completed</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-4 flex items-center text-blue-600 hover:underline"
            >
              View Details <ArrowRight className="w-4 h-4 ml-1" />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default CampaignsTab
