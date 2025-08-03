import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import resources from "../../../resource";

const slides = [
  {
    id: 1,
    title: "Sustainable Livestock Farming Solutions",
    subtitle: "Discover eco-friendly practices for better crop yields",
    image: resources.Farmer_Hero_1.src,
    buttons: [
      { text: "Explore Solutions", primary: true },
      { text: "Case Studies", primary: false },
    ],
  },
  {
    id: 2,
    title: "Expert Agricultural Guidance",
    subtitle: "Get professional advice from certified agricultural specialists",
    image: resources.Farmer_Hero_2.src,
    buttons: [
      { text: "Get Guidance", primary: true },
      { text: "Learn More", primary: false },
    ],
  },
  {
    id: 3,
    title: "Access Community Support",
    subtitle: "Join our community to get best practices and resources",
    image: resources.Farmer_Hero_3.src,
    buttons: [
      { text: "Join Community", primary: true },
      { text: "View Resources", primary: false },
    ],
  },
];

const Hero = () => {
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
    <div className="relative w-full h-screen overflow-hidden bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div
            className="w-full h-full bg-cover bg-center relative"
            style={{
              backgroundImage: `url(${slides[currentSlide].image})`,
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40" />

            {/* Content */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center text-white px-4 max-w-4xl">
                <motion.h1
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                >
                  {slides[currentSlide].title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-xl md:text-2xl mb-8 text-gray-200"
                >
                  {slides[currentSlide].subtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                  {slides[currentSlide].buttons.map((button, index) => (
                    <button
                      key={index}
                      className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                        button.primary
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                          : "bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900"
                      }`}
                    >
                      {button.text}
                    </button>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
          />
        ))}
      </div>

      {/* Auto-play Indicator */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
        <motion.div
          className="w-16 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: 64 }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
