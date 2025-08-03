"use client";

import { motion } from "framer-motion";
import { Search, User, Bell } from "lucide-react";
import Hero from "../../components/Farmer/Home/Hero";
import NewsSection from "../../components/Farmer/Home/news-section";
import TestimonialsSection from "../../components/Farmer/Home/testomonial-section";
import StatsSection from "../../components/Farmer/Home/state-section";

export default function FarmerCareHomepage() {
  const features = [
    {
      icon: Search,
      title: "Find Medicine",
      description:
        "Search for veterinary medicines by name, type, or condition. Find the right treatment for your animals.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: User,
      title: "Expert Consultation",
      description:
        "Connect with qualified veterinarians for professional advice and treatment plans.",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Bell,
      title: "Community Support",
      description:
        "Access community medicine bank and share resources with fellow farmers.",
      color: "bg-purple-50 text-purple-600",
    },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero />
      <StatsSection />

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mb-6`}
                >
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <NewsSection />

      <TestimonialsSection />
    </div>
  );
}
