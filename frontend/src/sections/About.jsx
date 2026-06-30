import { motion } from 'framer-motion';
import { GraduationCap, Code2, FolderGit2, Award, Coffee, Rocket, Target } from 'lucide-react';
import { RevealOnScroll, SectionHeading } from '../components/ui/Animations';
import { useApi } from '../hooks/useApi';
import { fetchProfile } from '../api/index.js';

const ICON_MAP = {
  FolderGit2, Code2, Target, Award, Coffee, Rocket, GraduationCap,
};

// Fallback data
const FALLBACK_STATS = [
  { icon: 'FolderGit2', value: '20+', label: 'Projects Built' },
  { icon: 'Code2', value: '500+', label: 'GitHub Contributions' },
  { icon: 'Target', value: '10+', label: 'Technologies' },
  { icon: 'Award', value: '8.69', label: 'CGPA' },
];

const FALLBACK_EDUCATION = [
  {
    period: '2024 – 2027',
    degree: 'B.Tech in Computer Science & Engineering',
    school: 'MCKV Institute of Engineering, West Bengal',
    grade: 'CGPA: 8.69 / 10 (till 5th Sem)',
    current: true,
  },
  {
    period: '2020 – 2023',
    degree: 'Diploma in Computer Science & Technology',
    school: 'Technique Polytechnic Institute, West Bengal',
    grade: 'CGPA: 9.0 / 10',
    current: false,
  },
  {
    period: '2018 – 2019',
    degree: 'Secondary Education (Class 10)',
    school: 'Bandel Mahatma Gandhi Hindi Vidyalaya, West Bengal',
    grade: 'Percentage: 51.57%',
    current: false,
  },
];

const FALLBACK_FUN_FACTS = [
  '🎯 Regular DSA practice on LeetCode',
  '☕ Fueled by coffee & curiosity',
  '🌍 Experience deploying on AWS, Vercel, Netlify',
  '📚 Lifelong learner & open-source contributor',
  '🔥 20+ GitHub repositories',
];

export const About = () => {
  const { data: profile } = useApi(fetchProfile, null);

  const stats = profile?.stats || FALLBACK_STATS;
  const education = profile?.education || FALLBACK_EDUCATION;
  const funFacts = profile?.funFacts || FALLBACK_FUN_FACTS;
  const aboutText =
    profile?.aboutText ||
    'I enjoy solving complex problems, writing clean code, and building applications that provide a seamless user experience. I focus on React frontends, Node.js/Express backends, and databases like MongoDB, PostgreSQL, and MySQL.';
  const aboutSubText =
    profile?.aboutSubText ||
    'Currently pursuing B.Tech in Computer Science with a strong foundation in software engineering, RESTful API design, and database architecture. Actively seeking opportunities to contribute technical expertise while growing as a professional engineer.';

  return (
    <section id="about" className="section-padding relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          label="About Me"
          title="Passionate Developer & Continuous Learner"
          description="I am a detail-oriented software developer building full-stack web applications with modern technologies."
        />

        {/* ===== BENTO GRID ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* === Large Introduction Card (spans 2 cols) === */}
          <RevealOnScroll className="md:col-span-2 lg:col-span-2">
            <div className="glass rounded-[28px] p-8 sm:p-10 h-full tilt-card group hover:glow-primary transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-center">
                  <Rocket size={22} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                    Who I Am
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Full-Stack Developer</p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base mb-6">
                {aboutText}
              </p>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                {aboutSubText}
              </p>
            </div>
          </RevealOnScroll>

          {/* === Quick Stats Card === */}
          <RevealOnScroll delay={0.1}>
            <div className="glass rounded-[28px] p-8 h-full tilt-card">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {stats.map(({ icon, value, label }) => {
                  const Icon = ICON_MAP[icon] || Target;
                  return (
                    <motion.div
                      key={label}
                      whileHover={{ scale: 1.05, y: -3 }}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/30 text-center transition-colors duration-300 hover:border-primary/20"
                    >
                      <Icon size={18} className="mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                        {value}
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </RevealOnScroll>

          {/* === Education Timeline Card === */}
          <RevealOnScroll delay={0.15} className="md:col-span-1 lg:col-span-2">
            <div className="glass rounded-[28px] p-8 sm:p-10 h-full tilt-card">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <GraduationCap size={20} className="text-accent" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                  Education
                </h3>
              </div>

              <div className="relative pl-6 border-l-2 border-primary/15 dark:border-primary/20 space-y-8">
                {education.map((edu, i) => (
                  <div key={i} className="relative group">
                    {/* Timeline Dot */}
                    <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 ${
                      edu.current
                        ? 'bg-primary animate-pulse-glow'
                        : 'bg-slate-300 dark:bg-slate-600 group-hover:bg-primary transition-colors'
                    }`} />

                    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-2 ${
                      edu.current
                        ? 'bg-primary/10 text-primary dark:text-primary-light'
                        : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400'
                    }`}>
                      {edu.period}
                    </span>
                    <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">{edu.degree}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{edu.school}</p>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">{edu.grade}</p>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          {/* === Fun Facts Card === */}
          <RevealOnScroll delay={0.2} className="md:col-span-2 lg:col-span-1">
            <div className="glass rounded-[28px] p-8 h-full tilt-card group">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-pink/10 flex items-center justify-center">
                  <Coffee size={20} className="text-pink" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                  Fun Facts
                </h3>
              </div>
              <ul className="space-y-3">
                {funFacts.map((fact, i) => (
                  <motion.li
                    key={i}
                    whileHover={{ x: 4 }}
                    className="text-sm text-slate-600 dark:text-slate-300 py-2 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-default"
                  >
                    {fact}
                  </motion.li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>

        </div>
      </div>
    </section>
  );
};
