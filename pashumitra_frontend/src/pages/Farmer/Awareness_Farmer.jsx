"use client";

import { motion } from "framer-motion";
import {
  Umbrella,
  Sun,
  Snowflake,
  Play,
  Syringe,
  Search,
  Heart,
  ArrowRight,
} from "lucide-react";

export default function HealthAwareness() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const seasonalTips = [
    {
      title: "Monsoon Care for Cattle",
      subtitle: "Monsoon",
      description: "Essential tips to protect your cattle during the rainy season",
      points: ["Provide proper drainage", "Prevent water stagnation", "Monitor for hoof infections"],
      icon: Umbrella,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      title: "Summer Heat Stress Prevention",
      subtitle: "Summer",
      description: "Keep animals cool and healthy during hot weather",
      points: ["Provide adequate shade", "Ensure fresh water supply", "Adjust feeding times"],
      icon: Sun,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
    },
    {
      title: "Winter Health Management",
      subtitle: "Winter",
      description: "Protect livestock from cold weather challenges",
      points: ["Provide warm shelter", "Increase energy feed", "Monitor respiratory health"],
      icon: Snowflake,
      color: "bg-cyan-500",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-700",
    },
  ];

  const healthArticles = [
    {
      title: "Understanding Foot and Mouth Disease",
      tag: "Disease Prevention",
      description: "Learn about symptoms, prevention, and treatment of FMD in livestock",
      readTime: "5 min read",
    },
    {
      title: "Vaccination Schedule for Dairy Animals",
      tag: "Veterinary Care",
      description: "Complete guide to vaccination timing and importance for dairy cattle",
      readTime: "7 min read",
    },
    {
      title: "Nutrition Requirements for Growing Calves",
      tag: "Nutrition",
      description: "Essential nutritional needs for healthy calf development",
      readTime: "6 min read",
    },
  ];

  const educationalVideos = [
    {
      title: "Proper Injection Techniques",
      duration: "2.5k views",
      icon: Syringe,
    },
    {
      title: "Identifying Common Cattle Diseases",
      duration: "4.1k views",
      icon: Search,
    },
    {
      title: "First Aid for Farm Animals",
      duration: "3.2k views",
      icon: Heart,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        className="bg-white shadow-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Awareness</h1>
          <p className="text-gray-600">Seasonal Care Tips</p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Seasonal Tips */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {seasonalTips.map((tip, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div className={`${tip.bgColor} border rounded-lg h-full p-6 hover:shadow-lg transition-shadow duration-300`}>
                <div className="text-center pb-4">
                  <div className={`w-12 h-12 ${tip.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <tip.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-lg font-semibold ${tip.textColor} mb-1`}>{tip.title}</h3>
                  <p className={`text-sm ${tip.textColor} opacity-80`}>{tip.subtitle}</p>
                </div>
                <div>
                  <p className={`text-sm ${tip.textColor} mb-4`}>{tip.description}</p>
                  <ul className={`text-sm ${tip.textColor} space-y-2 mb-6`}>
                    {tip.points.map((point, i) => (
                      <li key={i} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-current rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full px-4 py-2 rounded-md ${tip.color} hover:opacity-90 text-white text-sm`}>
                    Read More
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Health Articles */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Health Articles</h2>
          <div className="space-y-4">
            {healthArticles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{article.tag}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{article.description}</p>
                      <p className="text-gray-500 text-xs">{article.readTime}</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mt-4 sm:mt-0 sm:ml-4 text-sm">
                      Read Article
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Educational Videos */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Educational Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {educationalVideos.map((video, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <video.icon className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{video.title}</h3>
                    <p className="text-gray-500 text-sm mb-4">{video.duration}</p>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center justify-center text-sm w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Watch Video
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          className="bg-blue-50 rounded-lg p-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Stay Updated</h2>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter for the latest health tips and veterinary updates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center justify-center text-sm">
              Subscribe
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
