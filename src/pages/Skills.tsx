
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
            <SkillsComponent showAll={true} />
          </div>
        </section>
      </div>
    </ThemeProvider>
  );
};

export default SkillsPage;
