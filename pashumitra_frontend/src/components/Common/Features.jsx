import { motion } from "framer-motion";
import {
  Search,
  UserCheck,
  MapPin,
  Truck,
  Users,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Real-time Medicine Search",
    description:
      "Instantly find available veterinary medicines across all registered medical stores in your area",
  },
  {
    icon: UserCheck,
    title: "Verified Doctor Consultation",
    description:
      "Connect with certified veterinary professionals for expert advice and medical guidance",
  },
  {
    icon: MapPin,
    title: "Nearby Store Detection",
    description:
      "Locate the closest medical stores with GPS integration for convenient medicine access",
  },
  {
    icon: Truck,
    title: "Transport Requests",
    description:
      "Arrange reliable transportation for medicine delivery to remote farming locations",
  },
  {
    icon: Users,
    title: "Community Medicine Bank",
    description:
      "Share and access surplus medicines within the farming community to reduce waste",
  },
  {
    icon: TrendingUp,
    title: "Predictive Stock Planning",
    description:
      "AI-powered insights to help stores maintain optimal medicine inventory levels",
  },
];

export const FeaturesGrid = () => {
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Core Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive solutions designed to revolutionize veterinary
            healthcare access in rural areas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUpVariant}
              className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200"
            >
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
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
  );
};
export default FeaturesGrid;
