"use client";

import { motion } from "framer-motion";
import { Truck, Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import resources from "../../resource";

export default function TransportAcknowledgement() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-blue-600 px-4">
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -45, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-6"
      >
        <Truck className="w-20 h-20 text-blue-600" />
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold mb-3 text-center"
      >
        Transportation Feature Coming Soon!
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center text-gray-600 max-w-xl mb-6"
      >
        We’re working on enabling real-time medical supply transportation services.
        This will allow verified medical stores to schedule and track deliveries
        seamlessly. Stay tuned — this feature will be available in future updates.
      </motion.p>

      {/* Construction Icon + Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="flex items-center gap-2 text-blue-600 font-semibold mb-8"
      >
        <Construction className="w-6 h-6" />
        <span>Currently under development</span>
      </motion.div>

      {/* Optional Image Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="rounded-2xl shadow-lg overflow-hidden border border-blue-100 bg-blue-50 p-4"
      >
        {/* Replace the src with your own image path */}
        <img
          src={resources.Trasportation.src}
          alt="Feature Preview"
          className="w-72 md:w-96 rounded-xl object-cover"
        />
      </motion.div>
    </div>
  );
}
