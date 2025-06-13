"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import resources from "../../resource"

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col-reverse lg:flex-row min-h-[60vh] items-center">
          {/* Content Side */}
          <motion.div
            className="w-full lg:w-1/2 py-12 px-4 lg:px-8 z-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Empowering India's Farmers
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
              We're bridging the gap between technology and agriculture, helping farmers increase profits and access
              resources directly.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 py-6 text-lg flex items-center">
              Learn More
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </motion.div>

          {/* Image Side with Diagonal Cut */}
          <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-[60vh]">
            {/* <div className="absolute inset-0 bg-blue-600 transform -skew-x-0 origin-top-right scale-110"></div> */}
            <div
              className="absolute inset-0 bg-cover bg-center transform -skew-x-12 origin-top-right scale-110"
              style={{
                backgroundImage: `url(${resources.About.src})`,
                clipPath: "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
