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
