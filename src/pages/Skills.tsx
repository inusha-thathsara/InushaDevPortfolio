
import { motion } from "framer-motion";
import SkillsComponent from "../components/Skills";
import Navbar from "../components/Navbar";
import { ThemeProvider } from "../components/ThemeProvider";

const SkillsPage = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <Navbar />
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-center mb-12"
            >
              Skills & Expertise
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto prose dark:prose-invert mb-16 space-y-6"
            >
              <p className="text-lg leading-relaxed">
                I specialize in frontend development with a focus on creating responsive, high-performance web applications using React.js, JavaScript, HTML5, and CSS3. My work often involves designing clean UIs with Tailwind CSS and Bootstrap, while ensuring functionality through API integration, state management, and localStorage handling.
              </p>
              
              <p className="text-lg leading-relaxed">
                In addition to frontend technologies, I have hands-on experience with Python, Node.js, and web scraping, which help me automate tasks and handle backend logic when needed. I also explore AI development and open-source language models, building toward integrating intelligent features into web apps.
              </p>
              
              <p className="text-lg leading-relaxed">
                My cross-platform knowledge extends to Flutter and Dart, allowing me to experiment with mobile development. I'm proficient with Git & GitHub for version control and use tools like VS Code, NPM, and Figma to streamline my development workflow and design process.
              </p>
              
              <p className="text-lg leading-relaxed">
                Whether it's building an interactive quiz app, a smart productivity tool, or a full-featured web platform — I bring clean code, creative problem-solving, and a user-first mindset to every project I take on.
              </p>
            </motion.div>

            <SkillsComponent showAll={true} />
          </div>
        </section>
      </div>
    </ThemeProvider>
  );
};

export default SkillsPage;
