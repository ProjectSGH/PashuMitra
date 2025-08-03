"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    quote:
      "FarmerCare helped me find the right medicine for my cattle when they were sick. The consultation with Dr. Sharma was excellent!",
    author: "Rajesh Kumar",
    role: "Dairy Cattle Farmer",
    rating: 5,
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 2,
    quote:
      "The platform made it so easy to connect with veterinary experts. My livestock health has improved significantly.",
    author: "Priya Patel",
    role: "Poultry Farmer",
    rating: 5,
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 3,
    quote: "Quick delivery of medicines and excellent customer support. Highly recommend to all farmers.",
    author: "Suresh Singh",
    role: "Mixed Farming",
    rating: 5,
    avatar: "/placeholder.svg?height=50&width=50",
  },
]

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Farmers Say</h2>
          <p className="text-gray-600">Real stories from farmers who have benefited from our platform</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-8 text-center"
            >
              <Quote className="w-12 h-12 text-blue-500 mx-auto mb-6" />

              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-lg text-gray-700 mb-6 italic">"{testimonials[currentTestimonial].quote}"</p>

              <div className="flex items-center justify-center">
                <img
                  src={testimonials[currentTestimonial].avatar || "/placeholder.svg"}
                  alt={testimonials[currentTestimonial].author}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonials[currentTestimonial].author}</h4>
                  <p className="text-sm text-gray-600">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
