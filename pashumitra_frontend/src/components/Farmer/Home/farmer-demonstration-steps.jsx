import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import resources from "../../../resource";

const steps = [
  {
    title: "Search Medicines",
    desc: "Easily search for veterinary medicines in the portal.",
  },
  {
    title: "Check Availability",
    desc: "View stock status from nearby medical stores instantly.",
  },
  {
    title: "Book Consultation",
    desc: "Schedule an online session with veterinary experts.",
  },
  {
    title: "Order Medicines",
    desc: "Place orders directly with verified medical stores.",
  },
  {
    title: "Track & Receive",
    desc: "Get live updates and delivery notifications.",
  },
];

export default function FarmerStepsTimeline() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-white px-4 md:px-10 py-10 md:h-[120vh]">
      {/* Timeline Section */}
      <div className="relative w-full md:w-1/2 flex justify-center mb-10 md:mb-0">
        {/* Vertical Line */}
        <div className="absolute w-1 bg-blue-200 h-full top-0 left-1/2 transform -translate-x-1/2"></div>

        {/* Steps */}
        <div className="w-full relative">
          {steps.map((step, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={index}
                className="relative flex items-center mb-10 md:mb-14"
              >
                {/* Left Side */}
                <div
                  className={`w-1/2 pr-2 md:pr-4 ${isLeft ? "text-right" : ""}`}
                >
                  {isLeft && (
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`inline-block p-4 md:p-5 text-left text-white shadow-lg transition-all
                        ${index <= activeStep ? "bg-blue-600" : "bg-gray-400"}
                      `}
                      style={{
                        borderRadius: "0px 25px 25px 25px", // asymmetric card
                        maxWidth: "280px",
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm md:text-base">
                          Step {index + 1}
                        </span>
                      </div>
                      <h3 className="text-base md:text-lg font-semibold mb-1">
                        {step.title}
                      </h3>
                      <p className="text-xs md:text-sm opacity-90">
                        {step.desc}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Node */}
                <motion.div
                  className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-4 bg-white z-10 
                    ${index <= activeStep ? "border-blue-600" : "border-gray-400"}`}
                  animate={{
                    backgroundColor: index === activeStep ? "#2563EB" : "white",
                    scale: index === activeStep ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Right Side */}
                <div
                  className={`w-1/2 pl-2 md:pl-4 ${!isLeft ? "text-left" : ""}`}
                >
                  {!isLeft && (
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`inline-block p-4 md:p-5 text-left text-white shadow-lg transition-all
                        ${index <= activeStep ? "bg-blue-600" : "bg-gray-400"}
                      `}
                      style={{
                        borderRadius: "25px 0px 25px 25px", // mirrored asymmetric
                        maxWidth: "280px",
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm md:text-base">
                          Step {index + 1}
                        </span>
                      </div>
                      <h3 className="text-base md:text-lg font-semibold mb-1">
                        {step.title}
                      </h3>
                      <p className="text-xs md:text-sm opacity-90">
                        {step.desc}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Image Section */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="w-[220px] h-[220px] md:w-[65vh] md:h-[65vh] rounded-full overflow-hidden shadow-xl">
          <img
            src={resources.Farmer_Hero_1.src}
            alt="Farmer Workflow"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
