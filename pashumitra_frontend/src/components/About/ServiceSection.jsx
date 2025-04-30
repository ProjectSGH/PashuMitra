"use client"

import { motion } from "framer-motion"
import {
  PackageCheck,
  MessageCircleHeart,
  Truck,
  PhoneCall,
  CalendarClock,
  HandHeart,
} from "lucide-react"

export default function ServicesSection() {
  const services = [
    {
      icon: PackageCheck,
      title: "Medicine Inventory System",
      description: "Check availability of veterinary medicines across nearby stores.",
    },
    {
      icon: Truck,
      title: "Medicine Transport System",
      description: "Request transport of medicines from alternate nearby stores.",
    },
    {
      icon: MessageCircleHeart,
      title: "Expert Consultation Portal",
      description: "Chat with veterinary doctors for emergencies and guidance.",
    },
    {
      icon: PhoneCall,
      title: "Emergency Helpline",
      description: "Get immediate contact support for animal-related emergencies.",
    },
    {
      icon: CalendarClock,
      title: "Predictive Medicine Supply",
      description: "Forecast medicine demand based on seasonal diseases.",
    },
    {
      icon: HandHeart,
      title: "Community Medicine Bank",
      description: "Receive donated medicines from NGOs and government initiatives.",
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
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Our Veterinary Services</h2>

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
