"use client"

import { motion } from "framer-motion"
import { HelpingHand, Leaf, PackageCheck, MessageSquare, FileText, GraduationCap } from "lucide-react"

export default function ServicesSection() {
  const services = [
    {
      icon: PackageCheck,
      title: "Medicine Transport",
      description: "Fast delivery of veterinary medicines from alternate stores to remote areas",
    },
    {
      icon: Leaf,
      title: "Direct Crop Trading",
      description: "Sell and buy crops directly without middlemen for better profits",
    },
    {
      icon: MessageSquare,
      title: "Expert Consultation",
      description: "Chat with agricultural and veterinary experts for timely advice",
    },
    {
      icon: FileText,
      title: "Government Schemes",
      description: "Access information about government schemes and subsidies",
    },
    {
      icon: GraduationCap,
      title: "Educational Portal",
      description: "Learn modern farming techniques and best practices",
    },
    {
      icon: HelpingHand,
      title: "Community Support",
      description: "Connect with other farmers and share knowledge",
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
      transition: { duration: 0.5 },
    },
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">What We Do</h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
              variants={itemVariants}
            >
              <div className="bg-blue-100 rounded-2xl w-14 h-14 flex items-center justify-center mb-4">
                <service.icon className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
