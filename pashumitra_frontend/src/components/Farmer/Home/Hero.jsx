import { motion } from "framer-motion";
import resources from "../../../resource";

const Hero = () => {
  const slide = {
    title: "Sustainable Livestock Farming Solutions",
    subtitle: "Discover eco-friendly practices for better crop yields",
    image: resources.Farmer_Hero_1.src,
    buttons: [
      { text: "Explore Solutions", primary: true },
      { text: "Case Studies", primary: false },
    ],
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900">
      <div
        className="w-full h-full bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${slide.image})`,
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
              {slide.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl mb-8 text-gray-200"
            >
              {slide.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {slide.buttons.map((button, index) => (
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
    </div>
  );
};

export default Hero;
