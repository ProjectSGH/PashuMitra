"use client"

import { motion } from "framer-motion"

export default function AboutSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Who We Are</h2>

          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
            <h3 className="text-2xl font-semibold mb-4 text-blue-600">About Us</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We are a passionate team of engineering students committed to uplifting India's agricultural community
              through digital innovation. Our platform was born out of a shared vision to eliminate middlemen, increase
              farmer profits, and provide direct access to expert advice, medicine, and modern tools.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Backed by real-world research, local insights, and cutting-edge tech, this project empowers farmers with
              transparency, speed, and control. Whether it's selling crops, accessing veterinary medicine, or getting
              expert help, our solution is built to support those who feed the nation.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
