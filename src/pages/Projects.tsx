
import { motion } from "framer-motion";
import ProjectCard from "../components/ProjectCard";
import Navbar from "../components/Navbar";
import { ThemeProvider } from "../components/ThemeProvider";
import { projects } from "../data/projects";

const Projects = () => {
  // Import all projects directly without any filtering
  const allProjects = [...projects];
  
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
              All Projects
            </motion.h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allProjects.map((project) => (
                <ProjectCard key={project.title} {...project} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </ThemeProvider>
  );
};

export default Projects;
