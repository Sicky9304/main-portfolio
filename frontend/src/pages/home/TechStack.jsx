import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RevealOnScroll, SectionHeading } from '../../components/ui/Animations';

const CATEGORIES = [
  {
    id: 'frontend',
    label: 'Frontend',
    emoji: '🎨',
    color: 'from-primary/10 to-accent/10',
    borderColor: 'hover:border-primary/20',
    skills: [
      { name: 'React.js', level: 90 },
      { name: 'HTML5 / CSS3', level: 95 },
      { name: 'JavaScript (ES6+)', level: 88 },
      { name: 'Tailwind CSS', level: 85 },
      { name: 'Framer Motion', level: 75 },
      { name: 'Vite', level: 80 },
      { name: 'Axios', level: 80 },
      { name: 'TanStack Query', level: 70 },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    emoji: '⚙️',
    color: 'from-accent/10 to-primary/10',
    borderColor: 'hover:border-accent/20',
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'Express.js', level: 85 },
      { name: 'REST APIs', level: 90 },
      { name: 'Prisma ORM', level: 70 },
      { name: 'Authentication', level: 75 },
    ],
  },
  {
    id: 'database',
    label: 'Database',
    emoji: '🗄️',
    color: 'from-emerald-500/10 to-accent/10',
    borderColor: 'hover:border-emerald-500/20',
    skills: [
      { name: 'MongoDB', level: 82 },
      { name: 'PostgreSQL', level: 78 },
      { name: 'MySQL', level: 75 },
      { name: 'Oracle', level: 60 },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & DevOps',
    emoji: '🛠️',
    color: 'from-pink/10 to-primary/10',
    borderColor: 'hover:border-pink/20',
    skills: [
      { name: 'Git & GitHub', level: 90 },
      { name: 'Electron.js', level: 75 },
      { name: 'Postman', level: 85 },
      { name: 'VS Code', level: 95 },
      { name: 'Google Stitch', level: 80 },
      { name: 'Google Flow', level: 85 },
      { name: 'AWS', level: 55 },
      { name: 'Vercel', level: 85 },
      { name: 'Netlify', level: 80 },
      { name: 'Render', level: 70 },
    ],
  },
  {
    id: 'languages',
    label: 'Languages',
    emoji: '💻',
    color: 'from-secondary/10 to-pink/10',
    borderColor: 'hover:border-secondary/20',
    skills: [
      { name: 'JavaScript', level: 88 },
      { name: 'Java', level: 72 },
      { name: 'Python', level: 70 },
      { name: 'C', level: 65 },
    ],
  },
];

export const TechStack = () => {
  const [activeCategory, setActiveCategory] = useState('frontend');
  const activeCat = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <section id="skills" className="section-padding relative">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          label="Tech Stack"
          title="Technologies I Work With"
          description="A comprehensive toolkit built through real-world projects and continuous learning."
        />

        {/* Category Tabs */}
        <RevealOnScroll>
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20'
                    : 'glass text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light'
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </RevealOnScroll>

        {/* Skills Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {activeCat.skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`glass rounded-2xl p-6 border border-transparent ${activeCat.borderColor} transition-all duration-300 group cursor-default`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                    {skill.name}
                  </h4>
                  <span className="text-xs font-bold text-primary dark:text-primary-light opacity-0 group-hover:opacity-100 transition-opacity">
                    {skill.level}%
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
