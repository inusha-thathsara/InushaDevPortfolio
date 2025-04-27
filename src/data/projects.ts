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
    title: "SaaS Landing Page",
    description: "A responsive, modern landing page for a SaaS product built with React and TailwindCSS. Features a clean design, dark/light theme support, and smooth animations.",
    technologies: ["React", "TailwindCSS", "Framer Motion"],
    githubUrl: "https://github.com/inusha-thathsara/CloudFlow-SaaS-LandingPage",
    liveUrl: "https://8bmkeya5p1cr.trickle.host",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&h=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
