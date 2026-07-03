import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MapPin, Sparkles, ArrowDown, Code2 } from 'lucide-react';
import { Github, Linkedin } from '../components/ui/BrandIcons';
import { useTheme } from '../context/ThemeContext';
import { MagneticButton } from '../components/ui/MagneticButton';
import { useApi } from '../hooks/useApi';
import { fetchProfile } from '../api/index.js';

// Fallback data (used when API is unavailable)
const FALLBACK_ROLES = [
  'Full-Stack MERN Developer',
  'React.js Specialist',
  'Backend Engineer',
  'Problem Solver',
];

const SOCIAL_ICON_MAP = {
  GitHub: Github,
  LinkedIn: Linkedin,
  LeetCode: Code2,
};

export const Hero = () => {
  const { theme } = useTheme();
  const { data: profile } = useApi(fetchProfile, null);

  const roles = profile?.roles || FALLBACK_ROLES;
  const name = profile?.name || 'Sicky Kumar';
  const description =
    profile?.description ||
    'Building scalable SaaS products and modern web experiences with React, Node.js, and cutting-edge technologies.';
  const location = profile?.location || 'West Bengal, India';
  const available = profile?.available ?? true;
  const socialLinks = profile?.socialLinks || [
    { platform: 'GitHub', url: 'https://github.com/Sicky9304', handle: '@Sicky9304' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/sickykumar', handle: '/in/sickykumar' },
    { platform: 'LeetCode', url: 'https://leetcode.com/u/Sicky9304', handle: '@Sicky9304' },
  ];

  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  // Responsive design helper
  useEffect(() => {
    const checkSize = () => {
      setIsMobileScreen(window.innerWidth < 640);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Motion values for tracking cursor position on the 3D card
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring tilt, skew, and pull controls for natural plastic stretching
  // Low stiffness + optimized damping creates a slow, organic, high-fidelity liquid lag
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { damping: 22, stiffness: 45, mass: 1.0 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { damping: 22, stiffness: 45, mass: 1.0 });

  const skewX = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { damping: 20, stiffness: 35, mass: 1.2 });
  const skewY = useSpring(useTransform(y, [-0.5, 0.5], [-10, 10]), { damping: 20, stiffness: 35, mass: 1.2 });

  const imageX = useSpring(useTransform(x, [-0.5, 0.5], [-25, 25]), { damping: 24, stiffness: 40, mass: 1.0 });
  const imageY = useSpring(useTransform(y, [-0.5, 0.5], [-25, 25]), { damping: 24, stiffness: 40, mass: 1.0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsImageHovered(false);
  };

  const handleMouseEnter = () => {
    setIsImageHovered(true);
  };

  const infoChips = [
    { text: '⚛️ React Specialist', xOffset: -185, yOffset: -80 },
    { text: '⚡ MERN Stack', xOffset: 185, yOffset: -80 },
    { text: '💻 15+ Projects', xOffset: -185, yOffset: 80 },
    { text: '🎯 Open to Work', xOffset: 185, yOffset: 80 },
  ];

  // Typing effect
  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout;

    if (!isDeleting) {
      if (displayText.length < currentRole.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        }, 80);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(currentRole.slice(0, displayText.length - 1));
        }, 40);
      } else {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex, roles]);

  const scrollToProjects = (e) => {
    e.preventDefault();
    const el = document.getElementById('projects');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const scrollToContact = (e) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // Split name for gradient on last name
  const nameParts = name.split(' ');
  const firstName = nameParts[0] || 'Sicky';
  const lastName = nameParts.slice(1).join(' ') || 'Kumar';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 2.0 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  {/* Background Looping Holographic Particle Video (Only in Dark Mode, high visibility) */}
  const videoSrc =
    theme === 'dark'
      ? "/hologram_night.mp4"
      : "/hologram_day.mp4";

  const videoClass =
    theme === "dark"
      ? "absolute inset-0 w-full h-full object-cover pointer-events-none z-0 mix-blend-screen opacity-55 transition-opacity duration-500"
      : "absolute inset-0 w-full h-full object-cover pointer-events-none z-0 mix-blend-multiply opacity-30 invert hue-rotate-180 saturate-200 blur-[2px] transition-opacity duration-500";

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden aurora grid-bg"
    >
      {/* Background Looping Holographic Particle Video (Only in Dark Mode, high visibility) */}
      <video
        key={theme}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        className={videoClass}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>


      {/* Floating Blobs */}
      <div className="blob blob-primary w-[500px] h-[500px] -top-20 -left-40 opacity-60" />
      <div className="blob blob-accent w-[400px] h-[400px] bottom-20 right-0 opacity-50" />
      <div className="blob blob-pink w-[300px] h-[300px] top-1/2 left-1/2 opacity-30" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-20 sm:pt-40 sm:pb-24 grid lg:grid-cols-2 gap-12 items-center">
        {/* ===== LEFT SIDE: Text Content ===== */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Greeting */}
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <span className="text-3xl">👋</span>
            <span className="text-lg font-medium text-slate-600 dark:text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
              Hello, I am
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
          >
            <span className="text-slate-900 dark:text-white">{firstName}</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent inline-block">{lastName}</span>
          </motion.h1>

          {/* Typing Role */}
          <motion.div variants={itemVariants} className="h-9 flex items-center">
            <span className="text-xl sm:text-2xl font-semibold text-primary dark:text-primary-light" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              {displayText}
            </span>
            <span className="inline-block w-0.5 h-7 bg-primary dark:bg-primary-light ml-1 animate-pulse" />
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="max-w-lg text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed"
          >
            {description}
          </motion.p>

          {/* Badges Row */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
            {/* Availability Badge */}
            {available && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Available for work
              </span>
            )}

            {/* Location */}
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/40">
              <MapPin size={12} className="text-cyan-700 dark:text-cyan-400 drop-shadow-[0_0_8px_rgba(8,145,178,0.35)] dark:drop-shadow-[0_0_8px_rgba(34,211,238,0.55)]" />
              {location}
            </span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-4">
            <MagneticButton
              onClick={scrollToProjects}
              className="flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 cursor-pointer"
            >
              <Sparkles size={16} className="text-emerald-100 dark:text-emerald-200 animate-pulse drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              View Projects
            </MagneticButton>

            <MagneticButton
              onClick={scrollToContact}
              className="flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 glass rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              Hire Me
            </MagneticButton>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 pt-4">
            {socialLinks
              .filter((s) => s.platform !== 'Email')
              .map(({ platform, url }) => {
                const Icon = SOCIAL_ICON_MAP[platform] || Code2;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-cyan-700 dark:text-cyan-400 hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-primary/5 dark:hover:bg-primary/10 hover:shadow-[0_0_10px_rgba(6,182,212,0.25)] transition-all duration-300 border border-transparent hover:border-primary/10"
                    title={platform}
                    aria-label={`Visit ${platform} profile`}
                  >
                    <Icon size={18} className="drop-shadow-[0_0_6px_rgba(14,116,144,0.3)] dark:drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]" />
                  </a>
                );
              })}
          </motion.div>
        </motion.div>

        {/* ===== RIGHT SIDE: Profile Image ===== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center items-center relative"
        >
          {/* Outer Glow */}
          <div className="absolute w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-pink/10 blur-3xl animate-pulse-glow" />

          {/* 3D Interactive Container */}
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
            className="relative w-[240px] h-[240px] sm:w-[360px] sm:h-[360px] cursor-pointer flex items-center justify-center select-none z-10"
          >
            {/* Rotating Gradient Ring */}
            <motion.div
              style={{ transformStyle: 'preserve-3d', translateZ: 20 }}
              animate={{ rotate: isImageHovered ? 360 : 0 }}
              transition={isImageHovered ? { duration: 15, repeat: Infinity, ease: 'linear' } : { duration: 0.5 }}
              className="absolute w-[220px] h-[220px] sm:w-[340px] sm:h-[340px] rounded-full"
            >
              <div className="w-full h-full rounded-full border-2 border-transparent"
                style={{ background: 'conic-gradient(from 0deg, #10B981, #06B6D4, #6366F1, #F43F5E, #10B981) border-box', WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', padding: '2px', borderRadius: '50%' }}
              />
            </motion.div>

            {/* Profile Image Frame with 3D Skew Stretch */}
            <motion.div
              style={{
                transformStyle: 'preserve-3d',
                translateZ: 40,
                skewX,
                skewY,
              }}
              className="relative w-[200px] h-[200px] sm:w-[320px] sm:h-[320px] rounded-full overflow-hidden border-4 border-white dark:border-slate-900 shadow-2xl z-10 flex items-center justify-center"
            >
              {/* Profile Image with Zoom and 3D Cursor Pull */}
              <motion.img
                src={theme === 'dark' ? '/profile_night.webp' : '/profile_day.webp'}
                alt={name}
                className="w-full h-full object-cover object-center"
                style={{
                  x: imageX,
                  y: imageY,
                }}
                animate={{
                  scale: isImageHovered ? 1.25 : 1.0,
                }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
              />
            </motion.div>

            {/* Interactive Data Chips Satellites */}
            {infoChips.map((chip, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.7, x: 0, y: 0 }}
                animate={isImageHovered
                  ? {
                    opacity: 1,
                    scale: 1,
                    x: isMobileScreen ? chip.xOffset * 0.6 : chip.xOffset,
                    y: isMobileScreen ? chip.yOffset * 0.6 : chip.yOffset,
                    z: 60
                  }
                  : { opacity: 0, scale: 0.7, x: 0, y: 0, z: 0 }
                }
                transition={{ type: 'spring', stiffness: 140, damping: 15, delay: idx * 0.05 }}
                className="absolute glass px-4 py-2.5 rounded-2xl shadow-xl border border-primary/20 dark:border-primary/10 text-xs font-semibold text-slate-800 dark:text-slate-200 z-30 pointer-events-none flex items-center gap-1.5 whitespace-nowrap"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {chip.text}
              </motion.div>
            ))}
          </motion.div>

          {/* Floating Tech Icons */}
          {[
            { emoji: '⚛️', top: '5%', left: '0%', delay: 0 },
            { emoji: '🟢', top: '70%', left: '-5%', delay: 1 },
            { emoji: '🗄️', top: '85%', right: '10%', delay: 2 },
            { emoji: '🚀', top: '10%', right: '0%', delay: 0.5 },
          ].map((item, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: item.delay }}
              className="absolute glass p-3 rounded-2xl shadow-lg text-xl z-20"
              style={{ top: item.top, left: item.left, right: item.right }}
            >
              {item.emoji}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500"
        >
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <ArrowDown size={16} className="text-emerald-600 dark:text-emerald-400 drop-shadow-[0_0_8px_rgba(4,120,87,0.35)] dark:drop-shadow-[0_0_8px_rgba(52,211,153,0.55)]" />
        </motion.div>
      </motion.div>
    </section>
  );
};
