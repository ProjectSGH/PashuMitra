"use client"

import { motion } from "framer-motion"
import { Search, User, Bell } from "lucide-react"

export default function FarmerCareHomepage() {
  const features = [
    {
      icon: Search,
      title: "Find Medicine",
      description:
        "Search for veterinary medicines by name, type, or condition. Find the right treatment for your animals.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: User,
      title: "Expert Consultation",
      description: "Connect with qualified veterinarians for professional advice and treatment plans.",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Bell,
      title: "Community Support",
      description: "Access community medicine bank and share resources with fellow farmers.",
      color: "bg-purple-50 text-purple-600",
    },
  ]

  const stats = [
    { number: "500+", label: "Registered Farmers" },
    { number: "200+", label: "Available Medicines" },
    { number: "50+", label: "Partner Stores" },
    { number: "24/7", label: "Support Available" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Welcome to <span className="text-blue-600">FarmerCare</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Your comprehensive platform for veterinary medicines, expert consultations, and community support. Take
              care of your livestock with confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
              >
                <Search className="h-5 w-5" />
                <span>Search Medicine</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-blue-50 transition-colors"
              >
                <User className="h-5 w-5" />
                <span>Consult Doctor</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center text-white"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl font-bold mb-2"
                >
                  {stat.number}
                </motion.div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
