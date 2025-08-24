"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Users,
  Heart,
  MessageCircle,
  FileText,
  MapPin,
  Shield,
  UserCheck,
  Syringe,
  Eye,
  Smartphone,
  TrendingDown,
  Clock,
  Target,
  Headphones,
} from "lucide-react";
import resources from "../../resource";

// Carousel data
const slides = [
  {
    id: 1,
    image: resources.DoctorWithCow.src,
    title: "Connecting Veterinarians to Farmers for Better Animal Healthcare",
    subtitle:
      "Bridge medicine supply and expert guidance, helping farmers provide the best care for their animals through professional veterinary support.",
    primaryButton: "Join as a Verified Doctor",
    secondaryButton: "Learn More",
  },
];

// Platform features data
const functionalityFeatures = [
  {
    icon: MessageCircle,
    title: "Consultation Portal",
    description: "Provide real-time consultations to farmers anywhere",
  },
  {
    icon: FileText,
    title: "Awareness Posts",
    description: "Share knowledge on seasonal diseases and prevention",
  },
  {
    icon: MapPin,
    title: "Medicine Availability Insights",
    description: "Guide farmers on where and how to get medicines quickly",
  },
  {
    icon: Shield,
    title: "Verification & Recognition",
    description: "Get verified and recognized as a trusted veterinary expert",
  },
];

const workflowSteps = [
  {
    number: "01",
    icon: UserCheck,
    title: "Register & Verify",
    description: "Submit credentials and get verified by our team",
  },
  {
    number: "02",
    icon: MessageCircle,
    title: "Start Consulting",
    description: "Connect with farmers and start your consultation services",
  },
  {
    number: "03",
    icon: FileText,
    title: "Share Awareness",
    description: "Create posts about vaccination reminders",
  },
  {
    number: "04",
    icon: Heart,
    title: "Save Lives",
    description: "Help farmers treat animals quickly and effectively",
  },
];

// Awareness & Community Impact data
const awarenessFeatures = [
  {
    image: resources.SeasonalVaccination.src,
    icon: Syringe,
    title: "Seasonal Vaccination Reminder",
    description: "Essential vaccines for monsoon season livestock protection",
  },
  {
    image: resources.EarlyMastitisDetection.src,
    icon: Eye,
    title: "Early Mastitis Detection",
    description: "Key symptoms to watch for in dairy cattle",
  },
  {
    image: resources.DigitalHealthMonitoring.src,
    icon: Smartphone,
    title: "Digital Health Monitoring",
    description: "Using technology for better animal health tracking",
  },
];

// Statistics data
const statistics = [
  {
    number: "40%",
    description: "Reduction in mortality with timely advice",
    icon: TrendingDown,
  },
  {
    number: "200+",
    description: "Farmers helped per month by our doctors",
    icon: Users,
  },
  {
    number: "95%",
    description: "Success rate in remote consultations",
    icon: Target,
  },
  {
    number: "24/7",
    description: "Availability for emergency cases",
    icon: Clock,
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const cardHoverVariants = {
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const statisticVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function VeterinaryPlatform() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel Section */}
      <div className="relative w-full max-w-9xl mx-auto overflow-hidden rounded-none sm:rounded-xl shadow-sm">
        <div className="relative md:h-[100vh] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {" "}
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${slides[currentSlide].image})`,
                }}
              >
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
              </div>
              {/* Content overlay */}
              <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 md:px-8">
                <div className="text-center max-w-4xl">
                  <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight"
                  >
                    {slides[currentSlide].title}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto"
                  >
                    {slides[currentSlide].subtitle}
                  </motion.p>

                  {/* Call-to-action buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                  >
                    <button className="bg-blue-700 text-white hover:bg-blue-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base">
                      {slides[currentSlide].primaryButton}
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide indicators with icons */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3 sm:space-x-4">
          {slides.map((_, index) => {
            const icons = [Stethoscope, Users, Heart];
            const Icon = icons[index];
          })}
        </div>

        {/* Progress indicators */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <motion.div
            key={currentSlide}
            // initial={{ width: "0%" }}
            // animate={{ width: "100%" }}
            // transition={{ duration: 15, ease: "linear" }}
            className="h-full bg-white/80"
            onAnimationComplete={nextSlide}
          />
        </div>
      </div>

      {/* Platform Content Sections */}
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Functionality Overview Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="mb-20 sm:mb-24 lg:mb-32"
          >
            {/* Header */}
            <motion.div
              variants={itemVariants}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600 mb-4 sm:mb-6">
                Functionality Overview for Doctors
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Empower your veterinary practice with comprehensive tools to
                help farmers and their animals
              </p>
            </motion.div>

            {/* Feature Cards Grid */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            >
              {functionalityFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover="hover"
                  >
                    <motion.div
                      variants={cardHoverVariants}
                      className="bg-white shadow-blue-200 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-gray-100 rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6">
                          <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                          {feature.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.section>

          {/* How It Works Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="mb-20 sm:mb-24 lg:mb-32"
          >
            {/* Header */}
            <motion.div
              variants={itemVariants}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600 mb-4 sm:mb-6">
                How It Works
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Simple steps to start making a difference in animal healthcare
              </p>
            </motion.div>

            {/* Workflow Steps */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8"
            >
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover="hover"
                    className="relative"
                  >
                    <motion.div
                      variants={cardHoverVariants}
                      className="flex flex-col items-center text-center"
                    >
                      {/* Step Number Badge */}
                      <div className="relative mb-6">
                        <div className="bg-gray-900 text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center font-bold text-lg sm:text-xl mb-4">
                          {step.number}
                        </div>

                        {/* Icon Container */}
                        <div className="bg-gray-100 rounded-2xl p-4 sm:p-5 inline-flex">
                          <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700" />
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                        {step.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xs">
                        {step.description}
                      </p>
                    </motion.div>

                    {/* Connecting Line (hidden on mobile) */}
                    {index < workflowSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.section>

          {/* Awareness & Community Impact Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="mb-20 sm:mb-24 lg:mb-32"
          >
            {/* Header */}
            <motion.div
              variants={itemVariants}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600 mb-4 sm:mb-6">
                Awareness & Community Impact
              </h2>
              <p className="text-lg sm:text-xl text-blue-600 max-w-3xl mx-auto leading-relaxed">
                See how veterinary expertise transforms farming communities
              </p>
            </motion.div>

            {/* Awareness Cards Grid */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {awarenessFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover="hover"
                  >
                    <motion.div
                      variants={cardHoverVariants}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full"
                    >
                      {/* Image */}
                      <div className="h-48 sm:h-56 overflow-hidden">
                        <img
                          src={feature.image || "/placeholder.svg"}
                          alt={feature.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6 sm:p-8">
                        <div className="flex items-center mb-4">
                          <div className="bg-blue-100 rounded-lg p-2 mr-3">
                            <Icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.section>

          {/* Statistics Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="mb-20 sm:mb-24 lg:mb-32"
          >
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8"
            >
              {statistics.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    variants={statisticVariants}
                    className="text-center"
                  >
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
                      <div className="flex justify-center mb-4">
                        <div className="bg-blue-100 rounded-full p-3">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600 mb-2">
                        {stat.number}
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {stat.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.section>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="bg-white py-16 sm:py-20 lg:py-24"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-8"
          >
            Be the Change in Animal Healthcare – Start Helping Farmers Today
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-gray-500 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto"
          >
            Join our network of verified veterinarians and make a real
            difference in the lives of farmers and their animals.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button className="bg-blue-600 border-2 border-white text-white hover:bg-white hover:border-blue-600 hover:text-blue-600 px-8 sm:px-10 py-4 sm:py-5 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
              Learn More
            </button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
