"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Tag, Type, MessageSquare } from "lucide-react"

export default function AwarenessContributions() {
  const [formData, setFormData] = useState({
    title: "",
    category: "Disease Prevention",
    mediaType: "Article",
    tags: "",
    content: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleClear = () => {
    setFormData({
      title: "",
      category: "Disease Prevention",
      mediaType: "Article",
      tags: "",
      content: "",
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission here
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div className="max-w-4xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
        {/* Header Section */}
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Awareness Contributions</h1>
          <p className="text-gray-600 text-lg">Share your knowledge to help farmers improve animal care</p>
        </motion.div>

        {/* Form Section */}
        <motion.div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8" variants={itemVariants}>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contribute to Farmer Awareness</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title and Category Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <label htmlFor="title" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Type className="w-4 h-4 mr-2" />
                  Title <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter content title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="category" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="Disease Prevention">Disease Prevention</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="Breeding">Breeding</option>
                  <option value="Housing">Housing</option>
                  <option value="General Care">General Care</option>
                </select>
              </motion.div>
            </div>

            {/* Media Type and Tags Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <label htmlFor="mediaType" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Media Type
                </label>
                <select
                  id="mediaType"
                  name="mediaType"
                  value={formData.mediaType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="Article">Article</option>
                  <option value="Video">Video</option>
                  <option value="Infographic">Infographic</option>
                  <option value="Guide">Guide</option>
                  <option value="Tips">Tips</option>
                </select>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="tags" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 mr-2" />
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="cow, health, prevention (comma separated)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </motion.div>
            </div>

            {/* Content Textarea */}
            <motion.div variants={itemVariants}>
              <label htmlFor="content" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="w-4 h-4 mr-2" />
                Content <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={8}
                placeholder="Write your article content, tips, or description here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                required
              />
            </motion.div>

            {/* Action Buttons */}
            <motion.div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4" variants={itemVariants}>
              <motion.button
                type="button"
                onClick={handleClear}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Clear
              </motion.button>
              <motion.button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Submit Content
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}
