import { motion } from "framer-motion";
import { UserCheck, Search, ShoppingCart, Truck } from "lucide-react";

const steps = [
  {
    icon: UserCheck,
    title: "Choose Your Role",
    description:
      "Register as a Farmer, Doctor, or Medical Store to access role-specific features",
  },
  {
    icon: Search,
    title: "Search & Consult",
    description:
      "Find medicines in real-time or consult with verified veterinary experts",
  },
  {
    icon: ShoppingCart,
    title: "Place Order",
    description:
      "Order medicines from nearby stores or request consultation appointments",
  },
  {
    icon: Truck,
    title: "Delivery & Pickup",
    description:
      "Get medicines delivered to your location or arrange convenient pickup",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple steps to connect with veterinary healthcare services and
            access medicines for your livestock
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white p-8 rounded-2xl shadow-md text-center hover:shadow-lg transition-all duration-300">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Arrow for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-8 text-blue-300 transform -translate-y-1/2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-full h-full"
                  >
                    <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
