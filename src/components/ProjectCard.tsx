
import { motion } from "framer-motion";
import { Github, Link } from "lucide-react";
import { Project } from "../data/projects";

const ProjectCard = ({ title, description, technologies, githubUrl, liveUrl, imageUrl }: Project) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="h-48 overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-4">
          {githubUrl && (
            <motion.a
              whileHover={{ scale: 1.1 }}
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <Github size={20} />
            </motion.a>
          )}
          {liveUrl && (
            <motion.a
              whileHover={{ scale: 1.1 }}
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <Link size={20} />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
