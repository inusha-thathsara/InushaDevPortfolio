
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
    title: "Project 4",
    description: "A real-time chat application",
    technologies: ["Socket.io", "Express", "MongoDB"],
    githubUrl: "https://github.com/yourusername/project4",
    imageUrl: "https://source.unsplash.com/featured/600x400?chat",
  },
  {
    title: "CinemaSync",
    description: "A movie search application that allows users to search, filter, and explore detailed information about movies. Features include real-time search, advanced filtering options, and comprehensive movie details display.",
    technologies: ["React", "Python", "TMDB API", "Tailwind CSS"],
    liveUrl: "https://gunasekara.databutton.app/cinema-sync",
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=600&h=400&auto=format&fit=crop",
    featured: true
  },
  {
    title: "TicTacToe Game",
    description: "An interactive TicTacToe game with two play modes: Player vs Player and Player vs AI. The AI mode offers four difficulty levels: Easy, Normal, Hard, and Impossible. Features a clean, responsive design with animations and sound effects.",
    technologies: ["React", "Typescript", "Framer Motion", "Tailwind CSS"],
    githubUrl: "https://github.com/inusha-thathsara/tictactoe",
    liveUrl: "https://inusha-thathsara.github.io/tictactoe/",
    imageUrl: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?q=80&w=600&h=400&auto=format&fit=crop",
    featured: true
  },
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
    title: "Project 5",
    description: "Weather forecast application",
    technologies: ["React", "OpenWeather API", "Tailwind"],
    githubUrl: "https://github.com/yourusername/project5",
    imageUrl: "https://source.unsplash.com/featured/600x400?weather",
  }
];
