import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import resources from "../resource";

const roles = [
  {
    title: "પશુપાલક",
    tagline: "સહેલાઇથી પશુ સંભાળની સુવિધા",
    description:
      "પશુધન માલિકો માટે જેઓ તેમના ઘરેથી જ પશુ આરોગ્ય, દવાના ઓર્ડર અને પરામર્શનું સંચાલન કરે છે.",
    image: resources.FarmerLogo.src,
    color: "from-green-500 to-lime-500",
    path: "/signup/farmer",
  },
  {
    title: "Doctor",
    tagline: "Serve Animal Health Professionally",
    description:
      "For certified veterinarians to offer expert consultations, monitor patient records, and contribute to animal wellness.",
    image: resources.VaternityLogo.src,
    color: "from-sky-500 to-blue-700",
    path: "/signup/doctor",
  },
  {
    title: "Medical Store",
    tagline: "Bridge Medicine to Animal Needs",
    description:
      "For pharmacy owners managing veterinary medicine inventory and fulfilling nearby orders and transport requests.",
    image: resources.MedicalStoreLogo.src,
    color: "from-purple-600 to-indigo-600",
    path: "/signup/store",
  },
];

const RoleSelector = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [mobileViewIndex, setMobileViewIndex] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-white to-purple-400 flex flex-col items-center justify-center px-4 py-16">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-12">
        Select how you want to join our team
      </h2>

      {/* Desktop View */}
      <div className="hidden md:flex justify-center px-6 space-x-6 overflow-x-auto scroll-snap-x mandatory py-10">
        {roles.map((role, i) => {
          const isActive = activeIndex === i;
          const isDimmed = activeIndex !== null && activeIndex !== i;

          return (
            <motion.div
              key={i}
              className={`h-[500px] rounded-3xl shadow-lg flex-shrink-0 relative overflow-hidden scroll-snap-start cursor-pointer transition-all duration-500 ${
                isActive ? "w-[750px]" : isDimmed ? "w-[300px]" : "w-[350px]"
              }`}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <img
                src={role.image}
                alt={role.title}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  isActive ? "opacity-20" : "opacity-100"
                }`}
              />

              <div
                className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-80`}
              />

              <div className="relative z-10 w-full h-full flex flex-col items-center justify-start p-6 text-white">
                <h2
                  className={`font-bold text-white text-center transition-all duration-300 ${
                    isDimmed ? "text-xl rotate-180" : "text-3xl mb-4"
                  }`}
                  style={{
                    writingMode: isDimmed ? "vertical-rl" : "horizontal-tb",
                  }}
                >
                  {role.title}
                </h2>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      key="expanded"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.4 }}
                      className="mt-4 w-full flex flex-row gap-6"
                    >
                      <div className="flex flex-col gap-3 flex-1">
                        <h2 className="text-2xl font-semibold">
                          {role.tagline}
                        </h2>
                        <p className="text-lg leading-relaxed">
                          {role.description}
                        </p>
                        <button
                          onClick={() => navigate(role.path)}
                          className="mt-4 px-6 py-2 rounded-full bg-white text-gray-800 font-semibold hover:bg-gray-200 transition"
                        >
                          Sign Up
                        </button>
                      </div>

                      <div className="hidden md:block flex-1">
                        <img
                          src={role.image}
                          alt={role.title}
                          className="rounded-xl shadow-lg h-[300px] w-full object-cover"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col w-full items-center gap-4">
        {roles.map((role, i) => (
          <div
            key={i}
            className={`rounded-2xl shadow-md relative w-[90vw] h-[30vh] overflow-hidden cursor-pointer`}
            onClick={() => setMobileViewIndex(i)}
          >
            <img
              src={role.image}
              alt={role.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black to-black opacity-30" />
            <div className="relative z-10 flex items-center justify-center w-full h-full">
              <h5 className="text-white text-xl font-bold text-center">
                {role.title}
              </h5>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Modal */}
      <AnimatePresence>
        {mobileViewIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center px-4 z-50"
          >
            <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <button
                className="absolute top-3 right-3 text-white bg-red-500 w-8 h-8 flex items-center justify-center rounded-full shadow-md"
                onClick={() => setMobileViewIndex(null)}
              >
                ✕
              </button>
              <h5 className="text-lg font-semibold mb-2 mt-6">
                {roles[mobileViewIndex].tagline}
              </h5>
              <p className="text-sm text-gray-700 mb-4">
                {roles[mobileViewIndex].description}
              </p>
              <img
                src={roles[mobileViewIndex].image}
                alt={roles[mobileViewIndex].title}
                className="rounded-lg w-full h-[200px] object-cover mb-4"
              />
              <button
                onClick={() => navigate(roles[mobileViewIndex].path)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-full font-semibold"
              >
                Sign Up
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleSelector;
