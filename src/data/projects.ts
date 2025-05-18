
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
    title: "Timer and Stopwatch",
    description: "A clean and intuitive timer and stopwatch application with multiple features. Users can set custom times, track elapsed time, and use pause/resume functionality with a minimal, responsive interface.",
    technologies: ["HTML", "CSS", "JavaScript"],
    githubUrl: "https://github.com/inusha-thathsara/timer-and-stopwatch",
    liveUrl: "https://inusha-thathsara.github.io/timer-and-stopwatch/",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=600&h=400&auto=format&fit=crop",
    featured: true
  },
  {
    title: "Smart Multi-Unit Converter",
    description: "A comprehensive unit conversion tool that handles length, weight, temperature, volume, and time. Features a clean interface with instant conversions and support for a wide range of measurement units.",
    technologies: ["HTML", "CSS", "JavaScript"],
    githubUrl: "https://github.com/inusha-thathsara/smart-unit-converter",
    liveUrl: "https://inusha-thathsara.github.io/smart-unit-converter/",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&h=400&auto=format&fit=crop",
    featured: true
  },
  {
    title: "Visual Unit Converter",
    description: "An interactive unit conversion tool with visual representations to help users understand the scale of different units. Supports various unit categories with intuitive, animated visualizations.",
    technologies: ["HTML", "CSS", "JavaScript", "SVG"],
    githubUrl: "https://github.com/inusha-thathsara/visual-unit-converter",
    liveUrl: "https://inusha-thathsara.github.io/visual-unit-converter/",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&h=400&auto=format&fit=crop",
    featured: true
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
    featured: false
  },
  {
    title: "Workout Log Synergy",
    description: "A comprehensive workout tracking application that allows users to log exercises, track progress, and visualize fitness improvements over time. Features a user-friendly interface and responsive design.",
    technologies: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
    githubUrl: "https://github.com/inusha-thathsara/workout-log-synergy",
    liveUrl: "https://inusha-thathsara.github.io/workout-log-synergy/",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&h=400&auto=format&fit=crop",
    featured: false
  },
  {
    title: "Pixel Art Creator",
    description: "A web-based pixel art creation tool that allows users to create, edit, and download pixel art. Features include color picker, custom canvas size, and various drawing tools.",
    technologies: ["React", "JavaScript", "HTML Canvas", "CSS"],
    githubUrl: "https://github.com/inusha-thathsara/pixel-art-creator",
    liveUrl: "https://8iizfevcl0yj.trickle.host",
    imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=600&h=400&auto=format&fit=crop",
    featured: true
  }
];
