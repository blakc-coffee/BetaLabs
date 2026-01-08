// Master database of all available skills organized by category
export const SKILL_CATEGORIES = {
  Frontend: [
    "React", "Vue.js", "Next.js", "TypeScript", "Tailwind CSS"
  ],
  Backend: [
    "Node.js", "Python", "Java", "Go", "Ruby"
  ],
  Database: [
    "PostgreSQL", "MongoDB", "Firebase", "MySQL", "Redis"
  ],
  "AI/ML": [
    "TensorFlow", "PyTorch", "Scikit-learn", "OpenAI API", "NLP"
  ],
  Design: [
    "Figma", "UI/UX Design", "Prototyping", "Wireframing", "Animation Design"
  ]
};

export const ALL_SKILLS = Object.values(SKILL_CATEGORIES).flat();

// Sample Solo Profiles
export const SAMPLE_SOLO_PROFILES = {
  "solo-1": {
    id: "solo-1",
    name: "Arjun Sharma",
    bio: "Full-stack developer passionate about building scalable web apps. Love working with React and Node.js. Open to learning new tech stacks.",
    skills: ["React", "Node.js", "MongoDB", "TypeScript", "Tailwind CSS"],
    interest: "Full-Stack",
    discord: "arjun#2341",
    linkedin: "arjun-sharma",
    type: "solo",
    createdAt: "1/8/2026"
  },
  "solo-2": {
    id: "solo-2",
    name: "Priya Patel",
    bio: "AI/ML enthusiast with 2 years of experience in computer vision. Looking for teammates interested in building AI-powered applications.",
    skills: ["Python", "TensorFlow", "PyTorch", "NLP", "Scikit-learn"],
    interest: "AI/ML",
    discord: "priya#5678",
    linkedin: "priya-patel",
    type: "solo",
    createdAt: "1/8/2026"
  },
  "solo-3": {
    id: "solo-3",
    name: "Rahul Kumar",
    bio: "Backend specialist with expertise in cloud services and microservices. Love optimizing database performance and building APIs.",
    skills: ["Java", "Go", "PostgreSQL", "Redis", "AWS"],
    interest: "Backend",
    discord: "rahul#9012",
    linkedin: "rahul-kumar",
    type: "solo",
    createdAt: "1/8/2026"
  },
  "solo-4": {
    id: "solo-4",
    name: "Ananya Singh",
    bio: "UI/UX designer with 3 years of experience. Specialized in creating user-friendly interfaces. Also know basic React for prototyping.",
    skills: ["Figma", "UI/UX Design", "Wireframing", "Prototyping", "React"],
    interest: "Design",
    discord: "ananya#3456",
    linkedin: "ananya-singh",
    type: "solo",
    createdAt: "1/8/2026"
  },
  "solo-5": {
    id: "solo-5",
    name: "Vikram Desai",
    bio: "Frontend developer excited about modern web technologies. Proficient in React and Vue. Always learning new design patterns.",
    skills: ["React", "Vue.js", "Next.js", "Tailwind CSS", "TypeScript"],
    interest: "Frontend",
    discord: "vikram#7890",
    linkedin: "vikram-desai",
    type: "solo",
    createdAt: "1/8/2026"
  }
};

// Sample Team Profiles
export const SAMPLE_TEAM_PROFILES = {
  "team-1": {
    id: "team-1",
    teamName: "Code Warriors",
    description: "Building an AI-powered e-commerce platform. Looking for backend developer and database specialist to complete our stack.",
    teamLead: "Rohan Gupta",
    skillsNeeded: ["Node.js", "PostgreSQL", "Redis"],
    teamSize: "4-5",
    type: "team",
    createdAt: "1/8/2026"
  },
  "team-2": {
    id: "team-2",
    teamName: "PixelForge",
    description: "Design-first team creating a collaborative design tool. Need experienced React developer and backend specialist.",
    teamLead: "Neha Verma",
    skillsNeeded: ["React", "TypeScript", "Node.js"],
    teamSize: "3-4",
    type: "team",
    createdAt: "1/8/2026"
  },
  "team-3": {
    id: "team-3",
    teamName: "DataMiners",
    description: "Data science team working on ML models for healthcare predictions. Need Python expert and database specialist.",
    teamLead: "Dr. Amit Patel",
    skillsNeeded: ["Python", "TensorFlow", "PostgreSQL"],
    teamSize: "3-4",
    type: "team",
    createdAt: "1/8/2026"
  },
  "team-4": {
    id: "team-4",
    teamName: "CloudScale",
    description: "Building scalable cloud infrastructure tools. Looking for Go developer and DevOps/Cloud expert.",
    teamLead: "Sanjay Nair",
    skillsNeeded: ["Go", "Java", "Redis"],
    teamSize: "4-5",
    type: "team",
    createdAt: "1/8/2026"
  }
};

// Initialize localStorage with sample data if empty
export function initializeSampleData() {
  const soloProfiles = JSON.parse(localStorage.getItem("soloProfiles") || "{}");
  const teamProfiles = JSON.parse(localStorage.getItem("teamProfiles") || "{}");
  
  if (Object.keys(soloProfiles).length === 0) {
    localStorage.setItem("soloProfiles", JSON.stringify(SAMPLE_SOLO_PROFILES));
  }
  
  if (Object.keys(teamProfiles).length === 0) {
    localStorage.setItem("teamProfiles", JSON.stringify(SAMPLE_TEAM_PROFILES));
  }
}
