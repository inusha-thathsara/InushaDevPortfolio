
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Skills from "../components/Skills";
import { Github, Linkedin, Mail } from "lucide-react";
import { ThemeProvider } from "../components/ThemeProvider";
import ProjectCard from "../components/ProjectCard";
import { projects } from "../data/projects";

const Index = () => {
  const featuredProjects = projects.filter(project => project.featured);

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
                <SocialLink href="https://github.com/inusha-thathsara" icon={<Github size={24} />} />
                <SocialLink href="https://www.linkedin.com/in/inusha-gunasekara-9996632a5" icon={<Linkedin size={24} />} />
                <SocialLink href="mailto:inusha.thathsara@gmail.com" icon={<Mail size={24} />} />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-center mb-12"
            >
              Featured Projects
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
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
                href="mailto:inusha.thathsara@gmail.com"
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
