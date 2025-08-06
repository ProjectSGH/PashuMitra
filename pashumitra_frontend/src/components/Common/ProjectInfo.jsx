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
    <section className="py-16 bg-gradient-to-r from-blue-600/5 to-blue-600/10">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-5xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <motion.div
            className="bg-white p-8 md:p-12 rounded-3xl shadow "
            custom={1}
            variants={fadeUp}
          >
            <motion.div
              className="flex justify-center mb-6"
              custom={2}
              variants={fadeUp}
            >
              <div className="bg-blue-600/10 w-20 h-20 rounded-full flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6 text-card-foreground"
              custom={3}
              variants={fadeUp}
            >
              Academic Project Initiative
            </motion.h2>

            <motion.p
              className="text-xl text-wrap mb-8 font-sans leading-relaxed"
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
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              custom={5}
              variants={fadeUp}
            >
              <div className="flex items-center justify-center space-x-3">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-muted-foreground">
                  Student Team Project
                </span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-muted-foreground">7th Semester (2024-25)</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span className="text-muted-foreground">
                  Engineering Innovation
                </span>
              </div>
            </motion.div>

            <motion.div
              className="bg-blue-600/5 p-6 rounded-2xl"
              custom={6}
              variants={fadeUp}
            >
              <p className="text-muted-foreground text-xl italic">
                "Our vision is to bridge the digital divide in rural healthcare
                and create sustainable solutions that empower farming
                communities with better access to veterinary services and
                medicines."
              </p>
              <div className="flex justify-evenly items-center mt-4">
                <p className="mt-4 text-muted-foreground text-sm">
                  ~ <b>DHRUV SHERE</b> <p>sheredhruv@gmail.com</p><p>(Project Lead)</p>
                </p>
                <p className="mt-2 text-muted-foreground text-sm">
                  ~ <b>JEET JANI</b> <p>janijeet50@gmail.com</p><p>(Project Co-Lead)</p>
                </p>
                <p className="mt-2 text-muted-foreground text-sm">
                  ~ <b>HERIN PATEL</b> <p>herin7151@gmail.com</p> <p>(Project Co-Lead)</p>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectInfo;
