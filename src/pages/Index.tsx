
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import Skills from "../components/Skills";
import { Github, Linkedin, Mail } from "lucide-react";
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

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <Navbar />
        
        {/* Hero Section */}
        <section id="home" className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-bold mb-6"
              >
                Hi, I'm <span className="text-purple-500">Your Name</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-gray-600 dark:text-gray-300 mb-8"
              >
                A Full Stack Developer passionate about creating innovative web solutions
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center gap-4"
              >
                <SocialLink href="https://github.com/yourusername" icon={<Github size={24} />} />
                <SocialLink href="https://linkedin.com/in/yourusername" icon={<Linkedin size={24} />} />
                <SocialLink href="mailto:your.email@example.com" icon={<Mail size={24} />} />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-12"
            >
              Featured Projects
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.title} {...project} />
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <Skills />

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                I'm currently available for freelance work and full-time positions.
                If you have a project that you want to get started or think you need my help with something, get in touch.
              </p>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:your.email@example.com"
                className="inline-block bg-purple-500 text-white px-8 py-3 rounded-full font-medium hover:bg-purple-600 transition-colors"
              >
                Send Message
              </motion.a>
            </motion.div>
          </div>
        </section>
      </div>
    </ThemeProvider>
  );
};

const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <motion.a
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
  >
    {icon}
  </motion.a>
);

export default Index;
