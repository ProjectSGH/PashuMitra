"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogIn,
  ShoppingCart,
  Truck,
  TrendingUp,
  Package,
  CheckCircle,
  FileText,
  AlertTriangle,
  Zap,
  Users,
  Heart,
  Brain,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Play,
} from "lucide-react";
import resources from "../../resource";

const VeterinaryPortal = () => {
  // 🧠 Animation presets
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: { staggerChildren: 0.1 },
    },
  };

  const scaleOnHover = {
    whileHover: { scale: 1.05 },
    transition: { type: "spring", stiffness: 300 },
  };

  // 🎞️ Hero carousel slides
  const slides = [
    {
      id: 1,
      image: resources.MedicalStore1?.src || "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
      title: "Empowering Veterinary Medicine Stores",
      subtitle:
        "Connect farmers with essential livestock medicines faster and manage your supply chain seamlessly.",
      button: "Get Started",
    },
    // {
    //   id: 2,
    //   image: resources.MedicalStore2?.src || "../../assets/store/1.jpg",
    //   title: "Streamlined Medicine Distribution",
    //   subtitle:
    //     "Track orders, manage inventory, and deliver medicines efficiently with our smart platform.",
    //   button: "Join Now",
    // },
    // {
    //   id: 3,
    //   image: resources.MedicalStore3?.src || "../../assets/store/1.jpg",
    //   title: "Collaborate with Veterinary Experts",
    //   subtitle:
    //     "Partner with nearby stores and veterinarians to ensure no farmer is left without care.",
    //   button: "Learn More",
    // },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* =========================
          HERO SECTION (Carousel)
      ========================== */}
      <div className="relative w-full h-[100vh] overflow-hidden rounded-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Background */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slides[currentSlide].image})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
            </div>

            {/* Overlay content */}
            <div className="relative z-10 flex items-center justify-center h-full px-6 text-center">
              <div className="max-w-3xl">
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-6xl font-bold text-white mb-6"
                >
                  {slides[currentSlide].title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg md:text-xl text-gray-200 mb-8"
                >
                  {slides[currentSlide].subtitle}
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-700 font-semibold px-8 py-4 rounded-lg flex items-center justify-center mx-auto gap-2"
                >
                  {slides[currentSlide].button}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-3 rounded-full transition"
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-3 rounded-full transition"
        >
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                index === currentSlide ? "bg-white w-6" : "bg-white/50"
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* =========================
          HOW IT WORKS
      ========================== */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow our streamlined 4-step process to efficiently serve farmers
              and manage veterinary medicine distribution.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                step: 1,
                icon: LogIn,
                title: "Login & Update Medicine Inventory",
                description:
                  "Access your store dashboard and update available medicine inventory, pricing, and availability status.",
              },
              {
                step: 2,
                icon: ShoppingCart,
                title: "Receive Medicine Orders from Farmers",
                description:
                  "Get medicine orders from local farmers and livestock owners in your area.",
              },
              {
                step: 3,
                icon: Truck,
                title: "Arrange Transport if Not Available Locally",
                description:
                  "Coordinate with nearby livestock medicine stores if required medicines are not available locally.",
              },
              {
                step: 4,
                icon: TrendingUp,
                title: "Manage and Track Supply Chain",
                description:
                  "Monitor all supply chain activities, track deliveries, and ensure timely fulfillment of urgent veterinary needs.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                variants={fadeInUp}
                {...scaleOnHover}
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-blue-600">
                    {item.step}
                  </span>
                </div>
                <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* =========================
          ROLE & FEATURES
      ========================== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your Role & Available Features
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              As a veterinary medicine store owner, access all the tools you
              need to serve farmers and ensure livestock health in your
              community.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Package,
                title: "Manage Stock",
                description:
                  "Update medicine availability, track inventory levels, and manage stock alerts.",
              },
              {
                icon: CheckCircle,
                title: "Approve / Process Orders",
                description:
                  "Review and approve farmer orders and ensure dosage guidance.",
              },
              {
                icon: FileText,
                title: "Create Transport Requests",
                description:
                  "Request other stores when medicines are unavailable locally.",
              },
              {
                icon: AlertTriangle,
                title: "Access Awareness Portal",
                description:
                  "Stay informed about seasonal disease alerts and preventive care.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 hover:bg-blue-50 transition-colors group"
                variants={fadeInUp}
                {...scaleOnHover}
              >
                <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-700 transition-colors">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* =========================
          BENEFITS SECTION
      ========================== */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Benefits for Your Medical Store
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Join our network and transform how you serve farmers while growing
              your business sustainably.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Zap,
                title: "Faster Medicine Distribution",
                percentage: "60% Faster",
                description:
                  "Real-time inventory sharing and logistics coordination between stores.",
              },
              {
                icon: Users,
                title: "Seamless Store Coordination",
                percentage: "100% Coverage",
                description:
                  "Collaborate with nearby veterinary stores to ensure supply continuity.",
              },
              {
                icon: Heart,
                title: "Reduced Livestock Mortality",
                percentage: "45% Reduction",
                description:
                  "Early medicine access helps prevent livestock deaths and boosts income.",
              },
              {
                icon: Brain,
                title:
                  "Predictive Planning for High-Demand Medicines",
                percentage: "Smart Planning",
                description:
                  "AI-powered forecasting helps stock up during seasonal demand.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                variants={fadeInUp}
                {...scaleOnHover}
              >
                <div className="flex items-start gap-6">
                  <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {item.title}
                      </h3>
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {item.percentage}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* =========================
          STATISTICS SECTION
      ========================== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { number: "500+", label: "Medical Stores" },
              { number: "10K+", label: "Farmers Served" },
              { number: "24/7", label: "Support Available" },
              { number: "99.9%", label: "Uptime Guarantee" },
            ].map((stat, index) => (
              <motion.div key={index} className="text-center" variants={fadeInUp}>
                <motion.div
                  className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-600 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* =========================
          CTA SECTION
      ========================== */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your Veterinary Store?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Join our network of veterinary medicine stores and start serving
              farmers more efficiently while growing your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" /> Watch Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================
          SUPPORT SECTION
      ========================== */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" {...fadeInUp}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              24/7 Support for Your Store
            </h2>
            <p className="text-lg text-gray-600">
              We're here to help you succeed every step of the way.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Mail,
                title: "Email Support",
                contact: "support@vetportal.com",
                description: "Get help via email",
              },
              {
                icon: Phone,
                title: "Phone Support",
                contact: "+1 555 VET HELP",
                description: "(+1 555 838 4357)",
              },
              {
                icon: MapPin,
                title: "Regional Offices",
                contact: "50+ locations nationwide",
                description: "Find local support",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow"
                variants={fadeInUp}
                {...scaleOnHover}
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-blue-600 font-semibold mb-1">
                  {item.contact}
                </p>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default VeterinaryPortal;
