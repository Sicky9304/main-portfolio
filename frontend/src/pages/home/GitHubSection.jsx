import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { GitBranch, Star, GitFork, Activity } from 'lucide-react';
import { RevealOnScroll, SectionHeading } from '../../components/ui/Animations';
import { useApi } from '../../hooks/useApi';
import { fetchProfile } from '../../api/index.js';

const AnimatedCounter = ({ target, suffix = '', duration = 2 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = parseInt(target);
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const FALLBACK_GITHUB_STATS = {
  repos: '20', reposSuffix: '+',
  contributions: '500', contributionsSuffix: '+',
  stars: '15', starsSuffix: '+',
  forks: '10', forksSuffix: '+',
};

const FALLBACK_LANGUAGES = [
  { name: 'JavaScript', percentage: 45, color: '#F7DF1E' },
  { name: 'Java', percentage: 20, color: '#ED8B00' },
  { name: 'Python', percentage: 15, color: '#3776AB' },
  { name: 'HTML/CSS', percentage: 12, color: '#E34F26' },
  { name: 'C', percentage: 8, color: '#555555' },
];

const FALLBACK_REPOS = [
  { name: 'e-learning-platform', desc: 'Full-stack e-learning platform', lang: 'JavaScript', stars: 3, forks: 1 },
  { name: 'agriconnect', desc: 'Farmer-to-market platform', lang: 'JavaScript', stars: 2, forks: 1 },
  { name: 'world-art-gallery', desc: 'Art collection browser', lang: 'JavaScript', stars: 4, forks: 2 },
];

export const GitHubSection = () => {
  const { data: profile } = useApi(fetchProfile, null);

  const ghStats = profile?.githubStats || FALLBACK_GITHUB_STATS;
  const languages = profile?.languages || FALLBACK_LANGUAGES;
  const featuredRepos = (profile?.featuredRepos || FALLBACK_REPOS).filter(r => r.name !== 'news-portal');

  const GITHUB_STATS = [
    { icon: GitBranch, label: 'Repositories', value: ghStats.repos, suffix: ghStats.reposSuffix, color: 'text-primary' },
    { icon: Activity, label: 'Contributions', value: ghStats.contributions, suffix: ghStats.contributionsSuffix, color: 'text-emerald-500' },
    { icon: Star, label: 'Stars Earned', value: ghStats.stars, suffix: ghStats.starsSuffix, color: 'text-amber-500' },
    { icon: GitFork, label: 'Forks', value: ghStats.forks, suffix: ghStats.forksSuffix, color: 'text-accent' },
  ];

  return (
    <section id="github" className="section-padding relative">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          label="Open Source"
          title="GitHub Activity"
          description="Building in public and contributing to the developer community."
        />

        {/* Stats Grid */}
        <RevealOnScroll>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {GITHUB_STATS.map(({ icon: Icon, label, value, suffix, color }) => (
              <motion.div
                key={label}
                whileHover={{ y: -4 }}
                className="glass rounded-[24px] p-6 text-center group cursor-default"
              >
                <Icon size={24} className={`mx-auto mb-3 ${color} group-hover:scale-110 transition-transform`} />
                <p className="text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                  <AnimatedCounter target={value} suffix={suffix} />
                </p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</p>
              </motion.div>
            ))}
          </div>
        </RevealOnScroll>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Most Used Languages */}
          <RevealOnScroll delay={0.1} className="h-full">
            <div className="glass rounded-[28px] p-8 h-full flex flex-col">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                Most Used Languages
              </h3>
              <div className="space-y-4 flex-1 flex flex-col justify-center">
                {languages.map((lang) => (
                  <div key={lang.name}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{lang.name}</span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{lang.percentage}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${lang.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: lang.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          {/* Featured Repositories */}
          <RevealOnScroll delay={0.15} className="h-full">
            <div className="glass rounded-[28px] p-8 h-full flex flex-col">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                Featured Repositories
              </h3>
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                {featuredRepos.map((repo) => (
                  <motion.a
                    key={repo.name}
                    href={`https://github.com/Sicky9304/${repo.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 4 }}
                    className="block p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-transparent hover:border-primary/10 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                          {repo.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{repo.desc}</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Star size={12} />{repo.stars}</span>
                        <span className="flex items-center gap-1"><GitFork size={12} />{repo.forks}</span>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
};
