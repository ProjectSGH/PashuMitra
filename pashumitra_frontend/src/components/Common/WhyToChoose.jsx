import { Shield, Clock, Users, Brain } from "lucide-react";
import { motion } from "framer-motion";

// Animation Variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const impactVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { delay: 0.4, duration: 0.6 } },
};

const benefits = [
  {
    icon: Shield,
    title: "Reduce Livestock Health Risks",
    description:
      "Proactive healthcare management prevents disease outbreaks and ensures healthier livestock through timely medical intervention and expert guidance.",
  },
  {
    icon: Clock,
    title: "Improve Rural Medicine Delivery",
    description:
      "Efficient logistics network ensures rapid delivery of essential medicines to remote farming locations, reducing travel time and costs.",
  },
  {
    icon: Users,
    title: "Access to Trusted Experts",
    description:
      "Connect with verified veterinary professionals who understand local farming conditions and provide culturally relevant medical solutions.",
  },
  {
    icon: Brain,
    title: "Smart Planning for Future Needs",
    description:
      "AI-powered analytics help predict medicine requirements, optimize inventory, and prepare for seasonal health challenges in livestock.",
  },
];

export const WhyToChoose = () => {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Why Choose <span className="text-blue-600">PashuMitra?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transforming rural veterinary healthcare with innovative technology
            and community-driven solutions
          </p>
        </motion.div>

        {/* Grid Section */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {/* Benefits List */}
          <div className="space-y-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-4 group"
                variants={itemVariants}
              >
                <div className="bg-blue-600/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/20 transition-colors duration-300">
                  <benefit.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-blue-600 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Impact Box */}
          <motion.div className="relative" variants={impactVariants}>
            <div className="bg-gradient-to-br from-blue-600/5 to-blue-600/10 p-8 rounded-3xl">
              <div className="p-8 rounded-2xl shadow bg-white">
                <h3 className="text-2xl font-semibold mb-6 text-card-foreground">
                  Platform Impact
                </h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">
                      Medicine Availability
                    </span>
                    <span className="text-2xl font-bold text-blue-600">95%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">
                      Delivery Time Reduction
                    </span>
                    <span className="text-2xl font-bold text-blue-600">60%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">
                      Expert Consultation Access
                    </span>
                    <span className="text-2xl font-bold text-blue-600">24/7</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Cost Savings</span>
                    <span className="text-2xl font-bold text-blue-600">40%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-20 h-20 bg-blue-600/10 rounded-full"
              animate={{ y: [0, -10, 0], x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            ></motion.div>
            <motion.div
              className="absolute -bottom-6 -left-6 w-16 h-16 bg-blue-600/20 rounded-full"
              animate={{ y: [0, 10, 0], x: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, delay: 1 }}
            ></motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyToChoose;