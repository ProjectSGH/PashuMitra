"use client"

import { motion } from "framer-motion"
import { Umbrella, Sun, Snowflake, AlertTriangle, CheckCircle } from "lucide-react"
import resources from "../../resource"
// import Jeet from './assets/Doctor/jeet.jpg'

const veterinarians = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Large Animal Medicine",
    experience: "15+ years",
    image: resources.Jeet.src,
  },
  {
    id: 2,
    name: "Dr. Maria Rodriguez",
    specialty: "Livestock Health",
    experience: "12+ years",
    image: resources.Herin.src,
  },
  {
    id: 3,
    name: "Dr. Ahmed Hassan",
    specialty: "Rural Veterinary Care",
    experience: "10+ years",
    image: resources.Dhruv.src,
  },
]

const seasonalGuides = [
  {
    id: 1,
    season: "Monsoon Season Animal Flu",
    icon: Umbrella,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconColor: "text-blue-600",
    symptoms: ["Respiratory distress", "High fever", "Loss of appetite", "Excessive drooling"],
    prevention: [
      "Keep animals in dry, well-ventilated shelters",
      "Provide clean, dry bedding",
      "Ensure proper drainage around animal areas",
      "Regular vaccination as per schedule",
      "Maintain hygiene and cleanliness",
    ],
  },
  {
    id: 2,
    season: "Summer Season Animal Health",
    icon: Sun,
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    iconColor: "text-orange-600",
    symptoms: ["Heat stress", "Dehydration", "Reduced milk production", "Panting", "Weakness"],
    prevention: [
      "Provide adequate shade and ventilation",
      "Ensure continuous access to fresh water",
      "Feed during cooler hours of the day",
      "Use fans or cooling systems",
      "Monitor animals for heat stress signs",
    ],
  },
  {
    id: 3,
    season: "Winter Season Animal Care",
    icon: Snowflake,
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    iconColor: "text-cyan-600",
    symptoms: ["Cold stress", "Pneumonia", "Joint stiffness", "Reduced immunity", "Hypothermia"],
    prevention: [
      "Provide warm, draft-free shelter",
      "Increase caloric intake for energy",
      "Use bedding for insulation",
      "Protect from cold winds",
      "Regular health monitoring",
    ],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

const cardHoverVariants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
}

export default function VeterinaryPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Meet Our Expert Veterinarians Section */}
        <motion.section initial="hidden" animate="visible" variants={containerVariants} className="mb-16">
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Meet Our Expert Veterinarians
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {veterinarians.map((vet) => (
              <motion.div
                key={vet.id}
                variants={itemVariants}
                whileHover="hover"
                className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200"
              >
                <motion.div variants={cardHoverVariants} className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-4 border-blue-100">
                    <img src={vet.image} alt={vet.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{vet.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{vet.specialty}</p>
                  <p className="text-gray-600 text-sm">{vet.experience}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Seasonal Animal Health Guide Section */}
        <motion.section initial="hidden" animate="visible" variants={containerVariants}>
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Seasonal Animal Health Guide
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {seasonalGuides.map((guide) => {
              const IconComponent = guide.icon
              return (
                <motion.div
                  key={guide.id}
                  variants={itemVariants}
                  whileHover="hover"
                  className={`${guide.bgColor} ${guide.borderColor} border rounded-xl p-6 shadow-lg`}
                >
                  <motion.div variants={cardHoverVariants}>
                    {/* Header */}
                    <div className="flex items-center mb-6">
                      <IconComponent className={`w-8 h-8 ${guide.iconColor} mr-3`} />
                      <h3 className="text-xl font-semibold text-gray-900">{guide.season}</h3>
                    </div>

                    {/* Common Symptoms */}
                    <div className="mb-6">
                      <div className="flex items-center mb-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                        <h4 className="font-semibold text-gray-900">Common Symptoms</h4>
                      </div>
                      <ul className="space-y-2">
                        {guide.symptoms.map((symptom, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-gray-700 text-sm flex items-start"
                          >
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {symptom}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Prevention Tips */}
                    <div>
                      <div className="flex items-center mb-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <h4 className="font-semibold text-gray-900">Prevention Tips</h4>
                      </div>
                      <ul className="space-y-2">
                        {guide.prevention.map((tip, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                            className="text-gray-700 text-sm flex items-start"
                          >
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {tip}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
