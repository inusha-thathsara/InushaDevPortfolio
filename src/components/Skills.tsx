
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Code,
  FileCode,
  Terminal,
  FileJson,
  File,
  Server,
  Atom,
  Paintbrush,
  PanelLeft,
  GitBranch,
  Github,
  CodeXml,
  PackageOpen,
  Database,
  Webhook,
  Figma,
  Globe,
  Brain,
  Smartphone,
} from "lucide-react";

interface Skill {
  name: string;
  level: number;
  icon?: React.ReactNode;
}

interface SkillCategory {
  name: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    name: "Programming Languages",
    skills: [
      { name: "JavaScript", level: 85, icon: <FileCode className="w-5 h-5" /> },
      { name: "Python", level: 70, icon: <Terminal className="w-5 h-5" /> },
      { name: "Dart", level: 50, icon: <Code className="w-5 h-5" /> },
      { name: "HTML5", level: 90, icon: <CodeXml className="w-5 h-5" /> },
      { name: "CSS3", level: 85, icon: <File className="w-5 h-5" /> },
    ],
  },
  {
    name: "Frameworks & Libraries",
    skills: [
      { name: "React.js", level: 80, icon: <Atom className="w-5 h-5" /> },
      { name: "Node.js", level: 60, icon: <Server className="w-5 h-5" /> },
      { name: "Tailwind CSS", level: 75, icon: <Paintbrush className="w-5 h-5" /> },
      { name: "Bootstrap", level: 70, icon: <PanelLeft className="w-5 h-5" /> },
      { name: "Flutter", level: 45, icon: <Smartphone className="w-5 h-5" /> },
    ],
  },
  {
    name: "Tools & Technologies",
    skills: [
      { name: "Git & GitHub", level: 80, icon: <Github className="w-5 h-5" /> },
      { name: "VS Code", level: 90, icon: <Code className="w-5 h-5" /> },
      { name: "NPM", level: 85, icon: <PackageOpen className="w-5 h-5" /> },
      { name: "API Integration", level: 75, icon: <Webhook className="w-5 h-5" /> },
      { name: "Figma", level: 50, icon: <Figma className="w-5 h-5" /> },
    ],
  },
  {
    name: "Other Skills",
    skills: [
      { name: "Web Scraping", level: 65, icon: <Globe className="w-5 h-5" /> },
      { name: "AI/LLM Concepts", level: 40, icon: <Brain className="w-5 h-5" /> },
      { name: "Cross-platform Development", level: 80, icon: <Smartphone className="w-5 h-5" /> },
      { name: "localStorage", level: 80, icon: <Database className="w-5 h-5" /> },
      { name: "Version Control", level: 85, icon: <GitBranch className="w-5 h-5" /> },
    ],
  },
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
        
        <Tabs defaultValue={skillCategories[0].name} className="max-w-4xl mx-auto">
          <TabsList className="flex flex-wrap justify-center mb-8">
            {skillCategories.map((category) => (
              <TabsTrigger
                key={category.name}
                value={category.name}
                className="px-4 py-2 m-1"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {skillCategories.map((category) => (
            <TabsContent
              key={category.name}
              value={category.name}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {skill.icon}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {skill.name}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Proficiency</span>
                        <span className="text-gray-600 dark:text-gray-300">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-purple-500 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default Skills;
