
export interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    title: "Project 1",
    description: "A full-stack web application built with React and Node.js",
    technologies: ["React", "Node.js", "MongoDB"],
    githubUrl: "https://github.com/yourusername/project1",
    liveUrl: "https://project1.com",
    imageUrl: "https://source.unsplash.com/featured/600x400?coding",
    featured: true
  },
  {
    title: "Project 2",
    description: "An e-commerce platform with real-time updates",
    technologies: ["React", "Firebase", "Stripe"],
    githubUrl: "https://github.com/yourusername/project2",
    liveUrl: "https://project2.com",
    imageUrl: "https://source.unsplash.com/featured/600x400?website",
    featured: true
  },
  {
    title: "Project 3",
    description: "A mobile-first progressive web application",
    technologies: ["React Native", "GraphQL", "AWS"],
    githubUrl: "https://github.com/yourusername/project3",
    imageUrl: "https://source.unsplash.com/featured/600x400?computer",
    featured: true
  },
  {
    title: "Project 4",
    description: "A real-time chat application",
    technologies: ["Socket.io", "Express", "MongoDB"],
    githubUrl: "https://github.com/yourusername/project4",
    imageUrl: "https://source.unsplash.com/featured/600x400?chat",
  },
  {
    title: "Project 5",
    description: "Weather forecast application",
    technologies: ["React", "OpenWeather API", "Tailwind"],
    githubUrl: "https://github.com/yourusername/project5",
    imageUrl: "https://source.unsplash.com/featured/600x400?weather",
  }
];

