
import { motion } from "framer-motion";
import ProjectCard from "../components/ProjectCard";
import Navbar from "../components/Navbar";
import { ThemeProvider } from "../components/ThemeProvider";

const projects = [
  {
    title: "Project 1",
    description: "A full-stack web application built with React and Node.js",
    technologies: ["React", "Node.js", "MongoDB"],
    githubUrl: "https://github.com/yourusername/project1",
    liveUrl: "https://project1.com",
    imageUrl: "https://source.unsplash.com/featured/600x400?coding",
  },
  {
    title: "Project 2",
    description: "An e-commerce platform with real-time updates",
    technologies: ["React", "Firebase", "Stripe"],
    githubUrl: "https://github.com/yourusername/project2",
    liveUrl: "https://project2.com",
    imageUrl: "https://source.unsplash.com/featured/600x400?website",
  },
  {
    title: "Project 3",
    description: "A mobile-first progressive web application",
    technologies: ["React Native", "GraphQL", "AWS"],
    githubUrl: "https://github.com/yourusername/project3",
    imageUrl: "https://source.unsplash.com/featured/600x400?computer",
  },
];

const Projects = () => {
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
              My Projects
            </motion.h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
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
