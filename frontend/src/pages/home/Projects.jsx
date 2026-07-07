import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronRight, X, Layers, Zap, Eye } from 'lucide-react';
import { Github } from '../../components/ui/BrandIcons';
import { RevealOnScroll, SectionHeading } from '../../components/ui/Animations';
import { useApi } from '../../hooks/useApi';
import { fetchProjects, askAi } from '../../api/index.js';
import { MarkdownRenderer } from '../../components/ai/MarkdownRenderer';
import { Brain, RefreshCw } from 'lucide-react';
import { TiltCard } from '../../components/ui/TiltCard';

// Fallback data (used when API is unavailable)
const FALLBACK_PROJECTS = [
  {
    _id: 'portfolio-admin',
    slug: 'portfolio-admin',
    title: '3D AI Portfolio & Admin Portal',
    tagline: 'Passcode-secured MERN admin portal & 3D creative showcase',
    description: 'A premium developer portfolio featuring interactive 3D spring-tilt cards, conditional day/night video backdrops, dynamic binary PDF resume streaming, and a secure passcode-guarded administrative dashboard with drag-and-drop Cloudinary uploading.',
    problem: 'Standard portfolios are static and fail to demonstrate actual full-stack developer capabilities such as secured CRUD portals, dynamic streaming media, API integrations, and premium spring-tilt animations.',
    features: [
      'Interactive 3D Spring-Tilt cards with parallax button lift',
      'Passcode-guarded invisible admin panel (/sicky-admin)',
      'Drag-and-drop Cloudinary thumbnail upload zone',
      'Dynamic binary PDF resume database streaming',
      'Conditional day/night background video loops',
      'Neon dropshadow glowing Lucide accents',
    ],
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Cloudinary', 'Framer Motion'],
    github: 'https://github.com/Sicky9304/main-portfolio.git',
    demo: 'https://sickykumar.in',
    color: 'from-primary to-accent',
    emoji: '🔮',
    status: 'Completed',
    thumbnail: '/images/blogs/3d_portfolio.webp',
  },
  {
    _id: 'windows-music-player',
    slug: 'windows-music-player',
    title: 'Windows Music Player',
    tagline: 'Offline-first desktop music & video player for Windows',
    description: 'A premium offline-first desktop music and video player built with Electron + React. Features 3D artwork visualization, dynamic themes, mood-based playlists, equalizer bars, and a full media library with MPV-powered video playback.',
    problem: 'Most music players are either too bloated with online features or too plain. There was no offline-first desktop player with a premium glassmorphism UI, mood-based music discovery, and 3D dynamic artwork.',
    features: [
      '3D Dynamic Artwork with ThreeJS visualization',
      'Mood-based auto playlists (Chill, Hype, Focus, etc.)',
      'MPV-powered local video player',
      'Animated equalizer bars with real-time sync',
      'Glassmorphism theme studio with custom palettes',
      'Queue panel, mini-player, and drag-and-drop support',
    ],
    tech: ['Electron', 'React.js', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Node.js'],
    github: 'https://github.com/Sicky9304/windows-music-player.git',
    demo: 'https://github.com/Sicky9304/windows-music-player',
    color: 'from-violet-500 to-pink-500',
    emoji: '🎵',
    status: 'Completed',
    thumbnail: '/images/blogs/music_player.webp',
  },
  {
    _id: 'elearning',
    slug: 'elearning',
    title: 'AI E-Learning Platform',
    tagline: 'A full-stack online learning platform',
    description: 'Developing a full-stack e-learning platform for course browsing, active enrollment, and content management with real-time progress tracking.',
    problem: 'Traditional education platforms lack personalization and interactive learning paths.',
    features: ['Course browsing & enrollment', 'RESTful API backend', 'User authentication', 'Responsive UI', 'Progress tracking'],
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
    github: 'https://github.com/Sicky9304/e-learning-platform.git',
    demo: 'https://e-learning-platform-delta-nine.vercel.app/',
    color: 'from-primary to-secondary',
    emoji: '🎓',
    status: 'Completed',
    thumbnail: '/images/blogs/e_learning.webp',
  },
  {
    _id: 'agriconnect',
    slug: 'agriconnect',
    title: 'AgriConnect',
    tagline: 'Connecting farmers to markets',
    description: 'An agriculture platform connecting local farmers directly with markets, providing smart soil readings, and agricultural recommendations.',
    problem: 'Farmers face expensive broker fees and lack access to real-time market data.',
    features: ['Crop marketplace', 'IoT soil sensor readings', 'Agronomist advice feed', 'Direct buyer-seller connect', 'Mobile responsive'],
    tech: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL'],
    github: 'https://github.com/Sicky9304/agriconnect.git',
    demo: 'https://agriconnect-seven-sigma.vercel.app/',
    color: 'from-emerald-500 to-accent',
    emoji: '🌱',
    status: 'Completed',
    thumbnail: '/images/blogs/agri_connect.webp',
  },
  {
    _id: 'portfolio',
    slug: 'portfolio',
    title: 'Portfolio with AI',
    tagline: 'AI-integrated personal portfolio',
    description: 'A responsive personal portfolio website featuring glassmorphism design, smooth interactive transitions, and a dynamic theme switcher.',
    problem: 'Creating an engaging, modern portfolio that goes beyond static templates.',
    features: ['Glassmorphism layout', 'Responsive design', 'Theme switcher (Light/Dark)', 'Interactive transitions', 'Clean file structure'],
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    github: 'https://github.com/Sicky9304/Portfolio_With_AI.git',
    demo: 'https://portfolio-with-ai-seven.vercel.app/',
    color: 'from-pink to-secondary',
    emoji: '🤖',
    status: 'Completed',
    thumbnail: '/images/blogs/portfolio_ai.webp',
  },
  {
    _id: 'newsportal',
    slug: 'newsportal',
    title: 'News Portal App',
    tagline: 'Real-time news with multi-language filters',
    description: 'A responsive news portal displaying real-time news across multiple categories and regions using News API.',
    problem: 'Accessing categorized, localized news in a clean interface with language selection features.',
    features: ['Language Selection', 'Country & state filters', 'Custom loading screens', 'Interactive news cards', 'Node.js API proxy server'],
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'Express.js'],
    github: 'https://github.com/Sicky9304/News-Web-Application.git',
    demo: 'https://newswebapplication-ebon.vercel.app/',
    color: 'from-accent to-primary',
    emoji: '📰',
    status: 'Completed',
    thumbnail: '/images/blogs/news_portal.webp',
  },
  {
    _id: 'pokemon',
    slug: 'pokemon',
    title: 'Pokémon Explorer',
    tagline: 'Explore Pokémon statistics and attributes',
    description: 'A clean, fast Pokémon explorer app built with React that integrates with PokéAPI.',
    problem: 'Accessing detailed Pokémon statistics quickly in an interactive card interface.',
    features: ['Real-time PokéAPI integration', 'Interactive search', 'Detailed stats visualizer', 'Responsive grid layout', 'Vite-powered performance'],
    tech: ['React.js', 'CSS3', 'PokéAPI', 'Vercel'],
    github: 'https://github.com/Sicky9304/pokemon-search-app.git',
    demo: 'https://pokemon-search-app-psi-five.vercel.app/',
    color: 'from-amber-400 to-red-500',
    emoji: '⚡',
    status: 'Completed',
    thumbnail: '/images/blogs/pokemon_search.webp',
  },
];

export const Projects = () => {
  const { data: projectsData, error } = useApi(fetchProjects, FALLBACK_PROJECTS);
  const projects = Array.isArray(projectsData) && projectsData.length > 0 ? projectsData : FALLBACK_PROJECTS;
  const [selectedProject, setSelectedProject] = useState(null);

  // AI Project Recommendation states & query handler
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const getAiRecommendation = async (promptText) => {
    if (isAiLoading || !promptText.trim()) return;
    setIsAiLoading(true);
    setAiRecommendation('');
    try {
      const projectsContext = projects.map(p => ({
        title: p.title,
        tagline: p.tagline,
        description: p.description,
        tech: p.tech,
        github: p.github,
        demo: p.demo,
        slug: p.slug
      }));

      const res = await askAi(
        `The visitor is looking for a project matching: "${promptText}". Look at Sicky's projects and recommend the most suitable one(s). Explain why they fit the user's needs. Reference the project names, and keep it very brief (max 3 sentences).`,
        { type: 'portfolio', projects: projectsContext }
      );
      setAiRecommendation(res?.text || "No recommendations found.");
    } catch (err) {
      console.error(err);
      setAiRecommendation("Sorry, couldn't get a recommendation right now. Please check if the Gemini API key is configured.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    if (selectedProject) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  return (
    <section id="projects" className="section-padding relative">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          label="Featured Projects"
          title="Work That Speaks"
          description="Each project is a unique piece of development, crafted to solve real-world problems."
        />

        {error && (
          <p className="text-center text-sm text-yellow-600 dark:text-yellow-400 mb-8">
            Backend data unavailable. Showing fallback projects.
          </p>
        )}

        {/* ─── AI PROJECT RECOMMENDATION WIDGET ─── */}
        <RevealOnScroll delay={0.1}>
          <div className="mb-16 p-4 sm:p-6 rounded-3xl glass border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 max-w-3xl mx-auto">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-3">
              <Brain size={18} className="text-secondary animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary dark:text-primary-light font-heading">
                AI Project Matchmaker
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 mb-4 text-left leading-relaxed">
              Describe what kind of project, stack, or feature you are interested in (e.g., "MERN stack blog" or "something with 3D tilts"), and Sicky's AI will match you with the best work.
            </p>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                getAiRecommendation(aiPrompt);
              }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input 
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="E.g., MERN stack database app..."
                className="flex-1 w-full px-4 py-2.5 rounded-2xl bg-white/40 dark:bg-slate-950/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-500 outline-none focus:border-primary/50 transition-colors"
                disabled={isAiLoading}
              />
              <button
                type="submit"
                disabled={isAiLoading || !aiPrompt.trim()}
                className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-xs transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md cursor-pointer whitespace-nowrap flex items-center gap-1.5"
              >
                {isAiLoading ? 'Analyzing...' : 'Match Me'}
              </button>
            </form>

            {/* Quick preset suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {['Full-stack MERN', '3D Creative Showcase', 'AgriConnect Marketplace'].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setAiPrompt(suggestion);
                    getAiRecommendation(suggestion);
                  }}
                  disabled={isAiLoading}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 hover:border-primary/30 text-[9px] text-slate-650 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer disabled:opacity-40"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* AI Result Area */}
            <AnimatePresence>
              {(aiRecommendation || isAiLoading) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 text-left text-xs text-slate-600 dark:text-slate-300 leading-relaxed overflow-hidden"
                >
                  {isAiLoading ? (
                    <div className="flex items-center gap-2 text-slate-400 font-mono">
                      <RefreshCw className="animate-spin text-secondary" size={12} />
                      <span>Consulting the matchmaker...</span>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 shadow-inner">
                      <MarkdownRenderer content={aiRecommendation} />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </RevealOnScroll>

        {/* Project Showcase */}
        <div className="space-y-20">
          {projects.map((project, index) => {
            const isEven = index % 2 === 0;
            const projectId = project._id || project.slug;
            return (
              <RevealOnScroll key={projectId} delay={0.1}>
                <div className={`grid lg:grid-cols-2 gap-8 items-center`}>
                  {/* Preview Card with 3D Spring Tilt */}
                  <TiltCard className={`aspect-[16/10] ${isEven ? '' : 'lg:order-2'}`}>
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-10 dark:opacity-20`} />

                    {/* Thumbnail — click opens demo directly */}
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 block"
                      aria-label={`Open ${project.title} demo`}
                    >
                      {project.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          loading="lazy"
                          className="w-full h-full object-cover object-top border border-slate-200 dark:border-slate-800 transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        /* Mock Dashboard Fallback */
                        <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <div className="w-full h-full p-6 flex flex-col">
                            {/* Mock Browser Chrome */}
                            <div className="flex items-center gap-2 mb-4">
                              <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                              </div>
                              <div className="flex-1 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 ml-3 flex items-center px-3">
                                <span className="text-[10px] text-slate-400 font-mono">localhost:3000/{project.slug}</span>
                              </div>
                            </div>
                            {/* Mock Content */}
                            <div className="flex-1 grid grid-cols-4 gap-3">
                              <div className="col-span-1 rounded-xl bg-slate-100 dark:bg-slate-800/50 p-3 space-y-2">
                                <div className="text-2xl text-center mb-3">{project.emoji}</div>
                                {[1, 2, 3, 4].map((i) => (
                                  <div key={i} className={`h-2.5 rounded-full ${i === 1 ? `bg-gradient-to-r ${project.color}` : 'bg-slate-200 dark:bg-slate-700'}`} style={{ width: `${70 + i * 8}%` }} />
                                ))}
                              </div>
                              <div className="col-span-3 space-y-3">
                                <div className="flex gap-3">
                                  <div className={`h-20 flex-1 rounded-xl bg-gradient-to-r ${project.color} opacity-20`} />
                                  <div className={`h-20 flex-1 rounded-xl bg-gradient-to-r ${project.color} opacity-10`} />
                                </div>
                                <div className="h-24 rounded-xl bg-slate-100 dark:bg-slate-800/50 p-3">
                                  <div className="flex gap-2">
                                    {[40, 65, 30, 55, 80, 45, 70].map((h, i) => (
                                      <div key={i} className="flex-1 flex items-end">
                                        <div className={`w-full rounded-t bg-gradient-to-t ${project.color} opacity-40`} style={{ height: `${h}%` }} />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </a>

                    {/* Hover Overlay with 3D Depth Lift */}
                    <div 
                      style={{ transformStyle: 'preserve-3d', transform: 'translateZ(50px)' }}
                      className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5 sm:p-8 pointer-events-none"
                    >
                      <div className="flex gap-3 pointer-events-auto">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white/90 text-slate-900 text-xs font-semibold hover:bg-white transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github size={14} /> Source Code
                        </a>
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedProject(project); }}
                          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors cursor-pointer"
                        >
                          <Eye size={14} /> Case Study
                        </button>
                      </div>
                    </div>
                  </TiltCard>

                  {/* Details */}
                  <div className={`space-y-5 ${isEven ? '' : 'lg:order-1'}`}>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${project.status === 'In Progress'
                        ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'
                        : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                        }`}>
                        {project.status}
                      </span>
                    </div>

                    <h3
                      className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white"
                      style={{ fontFamily: 'Satoshi, sans-serif' }}
                    >
                      {project.title}
                    </h3>
                    <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-2">
                      {(project.tech || []).map((t) => (
                        <span key={t} className="px-3 py-1.5 rounded-xl text-xs font-semibold glass text-slate-600 dark:text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-2">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light transition-colors"
                      >
                        <Github size={16} /> View Code
                      </a>
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="flex items-center gap-2 text-sm font-semibold text-primary dark:text-primary-light hover:gap-3 transition-all cursor-pointer"
                      >
                        Learn More <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>

      {/* ===== Case Study Modal ===== */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-start justify-center sm:pt-20 sm:px-4 sm:pb-4 bg-black/60 backdrop-blur-sm"
            style={{ touchAction: 'none' }}
            onClick={() => setSelectedProject(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedProject.title} case study`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full sm:max-w-lg bg-white dark:bg-slate-900 sm:rounded-2xl rounded-t-[28px] shadow-2xl overflow-hidden flex flex-col"
              style={{ maxHeight: '90dvh' }}
              onClick={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {/* Drag handle (mobile) */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
                <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto flex-1 overscroll-contain">
                {/* Header */}
                <div className={`px-5 py-6 sm:p-8 bg-gradient-to-r ${selectedProject.color} text-white relative`}>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
                    aria-label="Close case study"
                  >
                    <X size={16} />
                  </button>
                  <span className="text-3xl sm:text-4xl mb-3 block">{selectedProject.emoji}</span>
                  <h3 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                    {selectedProject.title}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm mt-2">{selectedProject.tagline}</p>
                </div>

                {/* Body */}
                <div className="px-5 py-5 sm:p-8 space-y-5">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white mb-2">
                      <Zap size={14} className="text-primary" /> Problem
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {selectedProject.problem}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white mb-3">
                      <Layers size={14} className="text-primary" /> Key Features
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(selectedProject.features || []).map((f) => (
                        <div key={f} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(selectedProject.tech || []).map((t) => (
                      <span key={t} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary/5 dark:bg-primary/10 text-primary dark:text-primary-light">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary/30 transition-colors"
                    >
                      <Github size={16} /> Source Code
                    </a>
                    <a
                      href={selectedProject.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/20 transition-all"
                    >
                      <ExternalLink size={16} /> Explore Now
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
