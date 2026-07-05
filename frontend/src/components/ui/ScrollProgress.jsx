import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export const ScrollProgress = () => {
  const [showButton, setShowButton] = useState(false);
  const { scrollYProgress } = useScroll();

  // Smooth top progress bar scaling
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Top Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent z-[9999] origin-left shadow-sm"
        style={{ scaleX }}
      />

      {/* Floating Scroll-to-Top Indicator */}
      <AnimatePresence>
        {showButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 30 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleScrollToTop}
            className="fixed bottom-6 right-20 z-40 w-11 h-11 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200/50 dark:border-slate-800/50 shadow-xl backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary-light transition-colors group cursor-pointer focus:outline-none"
            aria-label="Scroll to top"
          >
            {/* SVG Radial Completion Circle */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 p-0.5" viewBox="0 0 44 44">
              {/* Static Background Track */}
              <circle
                cx="22"
                cy="22"
                r="19"
                className="stroke-slate-100 dark:stroke-slate-800/60"
                strokeWidth="2.5"
                fill="transparent"
              />
              {/* Dynamic Progress Indicator */}
              <motion.circle
                cx="22"
                cy="22"
                r="19"
                className="stroke-primary dark:stroke-primary-light"
                strokeWidth="2.5"
                fill="transparent"
                strokeLinecap="round"
                style={{ pathLength: scrollYProgress }}
              />
            </svg>
            <ArrowUp
              size={18}
              className="relative z-10 group-hover:-translate-y-0.5 transition-transform duration-300"
            />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
