"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Video, Phone, MessageCircle, User, Star, Clock, Globe, AlertTriangle, PhoneCall } from "lucide-react"

export default function ConsultDoctor() {
  const [selectedConsultationType, setSelectedConsultationType] = useState("text")

  const consultationTypes = [
    {
      id: "video",
      title: "Video Call",
      subtitle: "Face-to-face consultation",
      icon: Video,
      color: "bg-blue-50 border-blue-200",
    },
    {
      id: "audio",
      title: "Audio Call",
      subtitle: "Voice consultation",
      icon: Phone,
      color: "bg-green-50 border-green-200",
    },
    {
      id: "text",
      title: "Text Chat",
      subtitle: "Written consultation",
      icon: MessageCircle,
      color: "bg-purple-50 border-purple-200",
    },
  ]

  const veterinarians = [
    {
      id: 1,
      name: "Dr. Rajesh Sharma",
      specialization: "Large Animal Medicine",
      experience: 15,
      rating: 4.9,
      fee: 300,
      languages: ["Hindi", "English"],
      availability: "Available Now",
      availabilityColor: "text-green-600",
    },
    {
      id: 2,
      name: "Dr. Priya Patel",
      specialization: "Dairy Animal Health",
      experience: 12,
      rating: 4.8,
      fee: 450,
      languages: ["Hindi", "Gujarati", "English"],
      availability: "Available in 30 mins",
      availabilityColor: "text-orange-600",
    },
    {
      id: 3,
      name: "Dr. Suresh Kumar",
      specialization: "Poultry & Small Animals",
      experience: 10,
      rating: 4.7,
      fee: 400,
      languages: ["Hindi", "Tamil", "English"],
      availability: "Available Tomorrow",
      availabilityColor: "text-gray-600",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <motion.div className="max-w-7xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8" variants={itemVariants}>
          Consult Doctor
        </motion.h1>

        {/* Consultation Type Selection */}
        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Choose Consultation Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {consultationTypes.map((type) => {
              const IconComponent = type.icon
              const isSelected = selectedConsultationType === type.id

              return (
                <motion.div
                  key={type.id}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    isSelected ? "border-blue-500 bg-blue-50 shadow-md" : `${type.color} hover:shadow-md`
                  }`}
                  onClick={() => setSelectedConsultationType(type.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <IconComponent className={`w-8 h-8 mb-3 ${isSelected ? "text-blue-600" : "text-gray-600"}`} />
                    <h3 className="font-semibold text-gray-900 mb-1">{type.title}</h3>
                    <p className="text-sm text-gray-600">{type.subtitle}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Available Veterinarians */}
        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Available Veterinarians</h2>
          <div className="space-y-4">
            {veterinarians.map((vet, index) => (
              <motion.div
                key={vet.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                variants={itemVariants}
                whileHover={{ shadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Doctor Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{vet.name}</h3>
                      <p className="text-blue-600 font-medium mb-2">{vet.specialization}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Experience: {vet.experience} years</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{vet.rating}</span>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${vet.availabilityColor} mb-2`}>{vet.availability}</div>
                    </div>
                  </div>

                  {/* Consultation Details & Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 lg:items-end">
                    <div className="text-sm">
                      <div className="mb-2">
                        <span className="text-gray-600">Consultation Fee</span>
                        <div className="font-bold text-lg text-gray-900">₹{vet.fee}</div>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Globe className="w-4 h-4" />
                        <span>Languages</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {vet.languages.map((lang, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[140px]">
                      <motion.button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Book Consultation
                      </motion.button>
                      <motion.button
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        View Profile
                      </motion.button>
                      <button className="text-blue-600 text-sm font-medium hover:underline">Read Reviews</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Emergency Consultation */}
        <motion.div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6" variants={itemVariants}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-2">Emergency Consultation</h3>
              <p className="text-red-800 mb-4">For immediate veterinary emergencies, call our 24/7 helpline</p>
              <motion.button
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <PhoneCall className="w-5 h-5" />
                Call Emergency Helpline: 1800-VET-HELP
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
