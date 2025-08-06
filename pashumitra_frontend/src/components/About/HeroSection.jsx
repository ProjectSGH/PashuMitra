"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import resources from "../../resource";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      <div className="flex flex-col-reverse lg:flex-row items-center min-h-[80vh] w-full">
        
        {/* Left: Text Section */}
        <motion.div
          className="w-full lg:w-2/5 px-6 lg:px-16 py-12 z-10 bg-white text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Empowering <br /> The Farmers
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl mx-auto lg:mx-0">
            We're bridging the gap between technology and agriculture, helping farmers increase profits and access resources directly.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 py-4 text-lg flex items-center mx-auto lg:mx-0">
            Learn More
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </motion.div>

        {/* Right: Diagonally Clipped Image with 60% Width */}
        <div className="w-full lg:w-3/5 h-[60vh] lg:h-[80vh] relative">
          <div
            className="absolute inset-0 bg-blue-600 bg-cover bg-center"
            style={{
              backgroundImage: `url(${resources.About.src})`,
              clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
