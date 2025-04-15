
import { motion } from "framer-motion";

interface Skill {
  name: string;
  level: number;
}

const skillsList: Skill[] = [
  { name: "React", level: 90 },
  { name: "TypeScript", level: 85 },
  { name: "Node.js", level: 80 },
  { name: "Python", level: 75 },
  { name: "CSS/Tailwind", level: 85 },
];

const Skills = () => {
  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white"
        >
          Skills & Technologies
        </motion.h2>
        <div className="max-w-2xl mx-auto space-y-6">
          {skillsList.map((skill, index) => (
            <div key={skill.name} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                <span className="text-gray-700 dark:text-gray-300">{skill.level}%</span>
              </div>
              <motion.div
                className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className="h-full bg-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 1, ease: "easeOut" }}
                />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
