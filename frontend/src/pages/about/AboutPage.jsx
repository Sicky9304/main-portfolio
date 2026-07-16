import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Code2, Layout, FileJson, Layers, Zap, Flame, 
  Server, Cpu, Network, Lock, Database, Github, 
  Terminal, FileText, Cloud, Globe, Sparkles, 
  MessageSquare, Languages, GraduationCap, Award, 
  ArrowDown, ChevronRight, User, Sparkle, Target
} from 'lucide-react';
import { aboutData } from '../../data/aboutData';
import { RevealOnScroll, SectionHeading } from '../../components/ui/Animations';
import { MagneticButton, MagneticLink } from '../../components/ui/MagneticButton';
import { TiltCard } from '../../components/ui/TiltCard';
import { useTheme } from '../../context/ThemeContext';

// Map icon name strings to Lucide components
const ICON_MAP = {
  Code2, Layout, FileJson, Layers, Zap, Flame, 
  Server, Cpu, Network, Lock, Database, Github, 
  Terminal, FileText, Cloud, Globe, Sparkles, 
  MessageSquare, Languages, GraduationCap, Award,
  Target
};

// Animated count-up counter component
const AnimatedCounter = ({ value, duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end) || end === 0) {
      setCount(value);
      return;
    }
    const totalMiliseconds = duration * 1000;
    // Stagger increment steps
    const stepTime = Math.max(Math.floor(totalMiliseconds / end), 20);
    const stepCount = Math.max(1, Math.floor(end / (totalMiliseconds / 100)));

    const timer = setInterval(() => {
      start += stepCount;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration, isInView]);

  return <span ref={ref}>{count}</span>;
};

export const AboutPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { hero, aboutMe, educationSummary, achievements, techStack, cta } = aboutData;

  // SEO Integration
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Sicky Kumar | About & Biography";
    
    // Meta updates helper
    const setMeta = (nameOrProperty, value, isProperty = false) => {
      if (!value) return null;
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${nameOrProperty}"]`);
      let created = false;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, nameOrProperty);
        document.head.appendChild(element);
        created = true;
      }
      const prevVal = element.getAttribute('content');
      element.setAttribute('content', value);
      return { element, created, prevVal };
    };

    // Set Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    const prevCanonical = canonical ? canonical.getAttribute('href') : '';
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);

    const descText = "Learn more about Sicky Kumar, a Full Stack MERN Developer passionate about building scalable web applications, AI-powered solutions, and modern digital experiences.";
    
    const dMeta = setMeta('description', descText);
    const ogTitle = setMeta('og:title', "Sicky Kumar | About & Biography", true);
    const ogDesc = setMeta('og:description', descText, true);
    const ogUrl = setMeta('og:url', window.location.href, true);
    const twitterTitle = setMeta('twitter:title', "Sicky Kumar | About & Biography");
    const twitterDesc = setMeta('twitter:description', descText);

    return () => {
      document.title = prevTitle;
      if (canonical) {
        canonical.setAttribute('href', prevCanonical || 'https://www.sickykumar.in/');
      }
      if (dMeta?.element) dMeta.element.setAttribute('content', dMeta.prevVal || '');
      if (ogTitle?.element) ogTitle.element.setAttribute('content', ogTitle.prevVal || '');
      if (ogDesc?.element) ogDesc.element.setAttribute('content', ogDesc.prevVal || '');
      if (ogUrl?.element) ogUrl.element.setAttribute('content', ogUrl.prevVal || '');
      if (twitterTitle?.element) twitterTitle.element.setAttribute('content', twitterTitle.prevVal || '');
      if (twitterDesc?.element) twitterDesc.element.setAttribute('content', twitterDesc.prevVal || '');
    };
  }, []);

  // 3D Card Hover variables for Hero image (matching homepage logic)
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  
  useEffect(() => {
    const checkSize = () => {
      setIsMobileScreen(window.innerWidth < 640);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { damping: 22, stiffness: 45, mass: 1.0 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { damping: 22, stiffness: 45, mass: 1.0 });
  const skewX = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { damping: 20, stiffness: 35, mass: 1.2 });
  const skewY = useSpring(useTransform(y, [-0.5, 0.5], [-8, 8]), { damping: 20, stiffness: 35, mass: 1.2 });
  const imageX = useSpring(useTransform(x, [-0.5, 0.5], [-20, 20]), { damping: 24, stiffness: 40, mass: 1.0 });
  const imageY = useSpring(useTransform(y, [-0.5, 0.5], [-20, 20]), { damping: 24, stiffness: 40, mass: 1.0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseEnter = () => setIsImageHovered(true);
  const handleMouseLeave = () => {
    setIsImageHovered(false);
    x.set(0);
    y.set(0);
  };

  // Satellite chips for detailed profile summary
  const infoChips = [
    { text: "💻 MERN Developer", xOffset: -120, yOffset: -80 },
    { text: "🤖 AI Integrator", xOffset: 120, yOffset: -50 },
    { text: "📈 8.69 CGPA", xOffset: -100, yOffset: 90 },
    { text: "🇮🇳 West Bengal", xOffset: 100, yOffset: 80 }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (href.startsWith('/#')) {
      const sectionId = href.replace('/#', '');
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 150);
    } else {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full relative overflow-hidden pb-12">
      {/* Background Blobs */}
      <div className="blob blob-primary w-[450px] h-[450px] -top-20 -left-40 opacity-40" />
      <div className="blob blob-accent w-[350px] h-[350px] top-1/3 right-0 opacity-30" />
      <div className="blob blob-pink w-[280px] h-[280px] bottom-10 left-1/4 opacity-25" />

      {/* ========================================== */}
      {/* SECTION 1: HERO CONTAINER */}
      {/* ========================================== */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-32 pb-16 sm:pt-36 sm:pb-24 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-bounce">⚡</span>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary dark:text-primary-light border border-primary/15 dark:border-primary/10">
              Developer Profile
            </span>
          </div>

          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-slate-900 dark:text-white"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
          >
            {hero.greeting}{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent inline-block">
              {hero.name}
            </span>
          </h1>

          <p className="max-w-lg text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            {hero.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <MagneticButton
              onClick={(e) => handleNavClick(e, hero.ctaProjectsHref)}
              className="flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all duration-300 cursor-pointer"
            >
              <Sparkles size={15} className="text-emerald-100 dark:text-emerald-200" />
              {hero.ctaProjects}
            </MagneticButton>

            <MagneticButton
              onClick={(e) => handleNavClick(e, hero.ctaContactHref)}
              className="flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 glass rounded-2xl hover:shadow-lg transition-all duration-300 border border-emerald-500/10 cursor-pointer"
            >
              {hero.ctaContact}
            </MagneticButton>
          </div>
        </motion.div>

        {/* Right: Interactive 3D Avatar Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center items-center relative"
        >
          {/* Circular soft backing glow */}
          <div className="absolute w-[240px] h-[240px] sm:w-[350px] sm:h-[350px] rounded-full bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 blur-3xl animate-pulse-glow" />

          {/* Interactive Tilt Body */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
              perspective: 1000,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] cursor-pointer flex items-center justify-center select-none z-10"
          >
            {/* Spinning Customizer Ring */}
            <motion.div
              style={{ transformStyle: 'preserve-3d', translateZ: 15 }}
              animate={{ rotate: isImageHovered ? 360 : 0 }}
              transition={isImageHovered ? { duration: 12, repeat: Infinity, ease: 'linear' } : { duration: 0.5 }}
              className="absolute w-[210px] h-[210px] sm:w-[300px] sm:h-[300px] rounded-full"
            >
              <div 
                className="w-full h-full rounded-full border border-transparent"
                style={{ 
                  background: 'conic-gradient(from 0deg, var(--color-primary), var(--color-secondary), var(--color-accent), var(--color-primary)) border-box', 
                  WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', 
                  WebkitMaskComposite: 'xor', 
                  maskComposite: 'exclude', 
                  padding: '2px', 
                  borderRadius: '50%' 
                }}
              />
            </motion.div>

            {/* Profile Frame with Zoom */}
            <motion.div
              style={{
                transformStyle: 'preserve-3d',
                translateZ: 30,
                skewX,
                skewY,
              }}
              className="relative w-[190px] h-[190px] sm:w-[280px] sm:h-[280px] rounded-full overflow-hidden border-4 border-white dark:border-slate-900 shadow-2xl z-10 flex items-center justify-center"
            >
              <motion.img
                src={theme === 'dark' ? '/profile_night.webp' : '/profile.webp'}
                alt={hero.name}
                className="w-full h-full object-cover object-center"
                style={{
                  x: imageX,
                  y: imageY,
                }}
                animate={{
                  scale: isImageHovered ? 1.2 : 1.0,
                }}
                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              />
            </motion.div>

            {/* Data Chip satellites */}
            {infoChips.map((chip, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8, x: 0, y: 0 }}
                animate={isImageHovered
                  ? {
                      opacity: 1,
                      scale: 1,
                      x: isMobileScreen ? chip.xOffset * 0.6 : chip.xOffset,
                      y: isMobileScreen ? chip.yOffset * 0.6 : chip.yOffset,
                      z: 50
                    }
                  : { opacity: 0, scale: 0.8, x: 0, y: 0, z: 0 }
                }
                transition={{ type: 'spring', stiffness: 150, damping: 14, delay: idx * 0.05 }}
                className="absolute glass px-3.5 py-2 rounded-2xl shadow-xl border border-primary/20 dark:border-primary/10 text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 z-30 pointer-events-none flex items-center gap-1.5 whitespace-nowrap"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {chip.text}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ========================================== */}
      {/* SECTION 2: ABOUT ME DETAILED PARAGRAPHS */}
      {/* ========================================== */}
      <section className="w-full max-w-6xl mx-auto px-6 py-16 relative z-10 border-t border-slate-100 dark:border-slate-900/60">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-1">
            <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-primary-light">My Philosophy</span>
            <h2 
              className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2"
              style={{ fontFamily: 'Satoshi, sans-serif' }}
            >
              {aboutMe.title}
            </h2>
            <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full mt-4" />
          </div>
          
          <div className="lg:col-span-2 space-y-6 text-slate-655 dark:text-slate-350 text-sm sm:text-base leading-relaxed">
            {aboutMe.paragraphs.map((p, i) => (
              <RevealOnScroll key={i} delay={i * 0.15}>
                <p className="hover:text-slate-900 dark:hover:text-white transition-colors duration-300">
                  {p}
                </p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECTION 3: EDUCATION SUMMARY */}
      {/* ========================================== */}
      <section className="w-full max-w-6xl mx-auto px-6 py-16 relative z-10">
        <SectionHeading 
          label={educationSummary.title}
          title="Educational Background"
          description={educationSummary.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {educationSummary.cards.map((card, i) => (
            <RevealOnScroll key={card.id} delay={i * 0.15}>
              <TiltCard className="h-full">
                <div className={`glass p-6 sm:p-8 h-full flex flex-col justify-between border-slate-200/50 dark:border-slate-800/50 group hover:glow-primary transition-all duration-500 bg-gradient-to-b ${card.color} to-transparent`}>
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center border border-primary/20">
                      <GraduationCap size={22} className="text-primary" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {card.period}
                      </span>
                      <h3 
                        className="text-lg font-bold text-slate-900 dark:text-white mt-3 group-hover:text-primary dark:group-hover:text-primary-light transition-colors"
                        style={{ fontFamily: 'Satoshi, sans-serif' }}
                      >
                        {card.level}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {card.institution}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-200/30 dark:border-slate-800/30 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {card.performance}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary dark:text-primary-light border border-primary/10">
                      {card.status}
                    </span>
                  </div>
                </div>
              </TiltCard>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* SECTION 4: ACHIEVEMENTS */}
      {/* ========================================== */}
      <section className="w-full max-w-6xl mx-auto px-6 py-16 relative z-10">
        <SectionHeading 
          label="Milestones"
          title="Track Record of Progress"
          description={achievements.subtitle}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 mt-10">
          {achievements.cards.map((card, i) => (
            <RevealOnScroll key={card.id} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className={`p-5 rounded-[24px] glass border border-slate-200/40 dark:border-slate-800/40 bg-gradient-to-br ${card.color} to-transparent text-center h-full flex flex-col justify-center items-center transition-all duration-300`}
              >
                <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                  <AnimatedCounter value={card.value} />
                  <span>{card.suffix}</span>
                </div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-2 leading-tight uppercase tracking-wider">
                  {card.label}
                </p>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* SECTION 5: TECH STACK (Only Icons / Badges) */}
      {/* ========================================== */}
      <section className="w-full max-w-6xl mx-auto px-6 py-16 relative z-10">
        <SectionHeading 
          label="Toolkit"
          title="Tech Stack Expertise"
          description={techStack.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {techStack.categories.map((cat, i) => (
            <RevealOnScroll key={cat.id} delay={i * 0.1}>
              <div className="glass p-6 sm:p-8 rounded-[28px] border-slate-200/50 dark:border-slate-800/50 h-full flex flex-col hover:border-primary/20 dark:hover:border-primary/10 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-center">
                    <Sparkle size={18} className="text-secondary animate-pulse" />
                  </div>
                  <h3 
                    className="text-lg font-bold text-slate-900 dark:text-white" 
                    style={{ fontFamily: 'Satoshi, sans-serif' }}
                  >
                    {cat.label}
                  </h3>
                </div>

                {/* Grid of badges (only icons + text, no progress bars) */}
                <div className="flex flex-wrap gap-2.5 mt-auto">
                  {cat.skills.map((skill) => {
                    const Icon = ICON_MAP[skill.icon] || Code2;
                    return (
                      <motion.div
                        key={skill.name}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 text-xs font-semibold text-slate-655 dark:text-slate-350 hover:text-primary dark:hover:text-primary-light hover:border-primary/25 transition-all duration-300"
                      >
                        <Icon size={14} className="text-primary group-hover:animate-bounce" />
                        <span>{skill.name}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* SECTION 6: FINAL CTA */}
      {/* ========================================== */}
      <section className="w-full max-w-6xl mx-auto px-6 py-16 relative z-10">
        <RevealOnScroll>
          <div className="p-8 sm:p-12 md:p-16 rounded-[32px] glass text-center border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 max-w-4xl mx-auto shadow-2xl hover:glow-primary transition-all duration-500">
            {/* inner glow mesh */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <h2 
              className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight"
              style={{ fontFamily: 'Satoshi, sans-serif' }}
            >
              {cta.title}
            </h2>
            <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
              {cta.subtitle}
            </p>

            <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
              <MagneticButton
                onClick={(e) => handleNavClick(e, cta.btnContactHref)}
                className="flex items-center gap-2 px-8 py-4 text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {cta.btnContact}
                <ChevronRight size={14} />
              </MagneticButton>

              <a
                href={cta.btnResumeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200 glass rounded-2xl hover:shadow-lg transition-all duration-300 border border-slate-200/50 dark:border-slate-800/50 cursor-pointer"
                aria-label="Download resume"
              >
                <FileText size={15} className="text-secondary" />
                {cta.btnResume}
              </a>
            </div>
          </div>
        </RevealOnScroll>
      </section>
    </div>
  );
};
