"use client"

import { motion } from "framer-motion"
import { Users, Pill, MapPin, Heart } from "lucide-react"

const stats = [
  {
    icon: Users,
    number: "500+",
    label: "Registered Farmers",
  },
  {
    icon: Pill,
    number: "200+",
    label: "Available Medicines",
  },
  {
    icon: MapPin,
    number: "50+",
    label: "Partner Stores",
  },
  {
    icon: Heart,
    number: "1000+",
    label: "Animals Helped",
  },
]

export default function StatsSection() {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-teal-400 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center text-white hover:bg-white/20 transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-center mb-4"
                >
                  <IconComponent className="w-8 h-8" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-3xl font-bold mb-2"
                >
                  {stat.number}
                </motion.div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
