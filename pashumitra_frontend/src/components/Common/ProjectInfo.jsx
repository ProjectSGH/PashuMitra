import { motion } from "framer-motion";
import { GraduationCap, Users, Calendar } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export const ProjectInfo = () => {
  return (
    <section className="py-8 md:py-16 bg-gradient-to-r from-blue-600/5 to-blue-600/10">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-5xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <motion.div
            className="bg-white p-6 md:p-8 lg:p-12 rounded-2xl md:rounded-3xl shadow"
            custom={1}
            variants={fadeUp}
          >
            <motion.div
              className="flex justify-center mb-4 md:mb-6"
              custom={2}
              variants={fadeUp}
            >
              <div className="bg-blue-600/10 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              </div>
            </motion.div>

            <motion.h2
              className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-card-foreground"
              custom={3}
              variants={fadeUp}
            >
              Academic Project Initiative
            </motion.h2>

            <motion.p
              className="text-base md:text-xl text-wrap mb-6 md:mb-8 font-sans leading-relaxed"
              custom={4}
              variants={fadeUp}
            >
              <strong className="text-blue-600">PashuMitra</strong> is developed
              as part of our semester project at{" "}
              <strong>U.V. Patel College of Engineering</strong>. This platform
              represents our commitment to solving real-world problems in rural
              veterinary healthcare through innovative technology solutions.
            </motion.p>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8"
              custom={5}
              variants={fadeUp}
            >
              <div className="flex items-center justify-center space-x-2 md:space-x-3">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                <span className="text-muted-foreground text-sm md:text-base">
                  Student Team Project
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2 md:space-x-3">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                <span className="text-muted-foreground text-sm md:text-base">
                  7th Semester (2024-25)
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2 md:space-x-3">
                <GraduationCap className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                <span className="text-muted-foreground text-sm md:text-base">
                  Engineering Innovation
                </span>
              </div>
            </motion.div>

            <motion.div
              className="bg-blue-600/5 p-4 md:p-6 rounded-xl md:rounded-2xl"
              custom={6}
              variants={fadeUp}
            >
              <p className="text-muted-foreground text-base md:text-xl italic">
                "Our vision is to bridge the digital divide in rural healthcare
                and create sustainable solutions that empower farming
                communities with better access to veterinary services and
                medicines."
              </p>
              <div className="flex flex-col md:flex-row justify-between items-center md:items-start mt-4 md:mt-6 space-y-4 md:space-y-0 md:space-x-4">
                <div className="text-muted-foreground text-xs md:text-sm text-center md:text-left">
                  ~ <b>DHRUV SHERE</b> 
                  <div className="text-xs">sheredhruv@gmail.com</div>
                  <div className="text-xs">(Project Lead)</div>
                </div>
                <div className="text-muted-foreground text-xs md:text-sm text-center md:text-left">
                  ~ <b>JEET JANI</b> 
                  <div className="text-xs">janijeet50@gmail.com</div>
                  <div className="text-xs">(Project Co-Lead)</div>
                </div>
                <div className="text-muted-foreground text-xs md:text-sm text-center md:text-left">
                  ~ <b>HERIN PATEL</b> 
                  <div className="text-xs">herin7151@gmail.com</div>
                  <div className="text-xs">(Project Co-Lead)</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectInfo;