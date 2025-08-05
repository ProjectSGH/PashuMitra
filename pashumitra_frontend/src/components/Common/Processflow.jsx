import { Users, Stethoscope, Store, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const processSteps = [
  {
    icon: Users,
    title: "Farmers",
    description: "Register and search for medicines or request consultations",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: Store,
    title: "Medical Stores",
    description: "Manage inventory and fulfill medicine orders efficiently",
    color: "bg-green-100 text-green-600"
  },
  {
    icon: Stethoscope,
    title: "Veterinary Doctors",
    description: "Provide expert consultation and medical advice remotely",
    color: "bg-purple-100 text-purple-600"
  },
  {
    icon: Shield,
    title: "Platform Admin",
    description: "Oversee operations, verify users, and maintain quality standards",
    color: "bg-orange-100 text-orange-600"
  }
];

// Animation Variants
const cardVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      type: 'spring'
    }
  })
};

const pointVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.4
    }
  })
};

export const ProcessFlow = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Platform <span className="text-blue-600">Ecosystem</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Understanding how <span className="text-blue-600 font-medium">farmers</span>, <span className="text-blue-600 font-medium">medical stores</span>, <span className="text-blue-600 font-medium">doctors</span>, and <span className="text-blue-600 font-medium">administrators</span> collaborate within the PashuMitra platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
            >
              <div className="bg-card p-6 rounded-2xl shadow-md text-center hover:shadow-lg transition-all duration-300">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${step.color}`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-card-foreground">
                  <span className="text-blue-600">{step.title}</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>

              {index < processSteps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-4 items-center justify-center w-8 h-8">
                  <ArrowRight className="w-5 h-5 text-blue-600/40" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-card p-8 rounded-2xl shadow-md shadow-blue-400 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold mb-6 text-center text-card-foreground">
            Seamless <span className="text-blue-600">Integration</span> Process
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[[
              "Real-time communication between all stakeholders",
              "Automated order processing and inventory management",
              "Quality assurance through verified doctor network"
            ], [
              "Secure payment gateway integration",
              "GPS-enabled delivery tracking system",
              "24/7 customer support and emergency assistance"
            ]].map((group, groupIdx) => (
              <div className="space-y-4" key={groupIdx}>
                {group.map((point, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start space-x-3"
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={pointVariants}
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">{point}</p>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessFlow;
