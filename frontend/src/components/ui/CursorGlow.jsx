import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export const CursorGlow = () => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  // Motion values for tracking cursor position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out coordinate tracking with spring dynamics
  const springConfig = { damping: 50, stiffness: 220, mass: 0.6 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // 3D Tilt calculation relative to screen center
  const tiltX = useTransform(mouseY, (y) => (y - dimensions.height / 2) * -0.05);
  const tiltY = useTransform(mouseX, (x) => (x - dimensions.width / 2) * 0.05);

  const rotateX = useSpring(tiltX, { damping: 40, stiffness: 120 });
  const rotateY = useSpring(tiltY, { damping: 40, stiffness: 120 });

  const outerSize = 650;
  const innerSize = 340;

  // Offsets to center the glow parts on the mouse pointer
  const outerX = useTransform(cursorX, (val) => val - outerSize / 2);
  const outerY = useTransform(cursorY, (val) => val - outerSize / 2);

  const innerX = useTransform(cursorX, (val) => val - innerSize / 2);
  const innerY = useTransform(cursorY, (val) => val - innerSize / 2);

  useEffect(() => {
    // Detect if device supports hovering (non-touch)
    const mediaQuery = window.matchMedia('(hover: hover)');
    setIsMobile(!mediaQuery.matches);

    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMediaQueryChange = (e) => {
      setIsMobile(!e.matches);
    };

    // Track mouse movements across the screen
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    if (mediaQuery.matches) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.body.addEventListener('mouseleave', handleMouseLeave);
      document.body.addEventListener('mouseenter', handleMouseEnter);
    }

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, [mouseX, mouseY, isVisible]);

  // Don't render cursor glow on touch screens/mobile
  if (isMobile) return null;

  // Day/Night theme gradient colors with increased brightness and 3D lighting simulation
  // circle at 30% 30% creates a volumetric sphere shading effect
  const outerGradient = theme === 'dark'
    ? 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(6, 182, 212, 0.15) 45%, rgba(99, 102, 241, 0.04) 75%, transparent 100%)'
    : 'radial-gradient(circle, rgba(16, 185, 129, 0.16) 0%, rgba(6, 182, 212, 0.10) 45%, rgba(244, 63, 94, 0.05) 75%, transparent 100%)';

  const inner3DGradient = theme === 'dark'
    ? 'radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.45) 0%, rgba(6, 182, 212, 0.35) 40%, rgba(99, 102, 241, 0.15) 75%, rgba(99, 102, 241, 0.05) 100%)'
    : 'radial-gradient(circle at 30% 30%, rgba(52, 211, 153, 0.32) 0%, rgba(34, 211, 238, 0.22) 40%, rgba(244, 63, 94, 0.12) 75%, rgba(244, 63, 94, 0.02) 100%)';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" style={{ perspective: 1200 }}>
      {/* 1. Wide Background Ambient Glow */}
      <motion.div
        style={{
          position: 'absolute',
          width: outerSize,
          height: outerSize,
          left: 0,
          top: 0,
          x: outerX,
          y: outerY,
          background: outerGradient,
        }}
        className="rounded-full blur-[110px]"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: [1, 1.05, 0.95, 1.02, 1], // Slow breathing pulsing effect
        }}
        transition={{
          opacity: { duration: 0.5 },
          scale: {
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      />

      {/* 2. Inner 3D Volumetric Morphing Orb */}
      <motion.div
        style={{
          position: 'absolute',
          width: innerSize,
          height: innerSize,
          left: 0,
          top: 0,
          x: innerX,
          y: innerY,
          background: inner3DGradient,
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="blur-[45px] shadow-[inset_0_4px_24px_rgba(255,255,255,0.25)] dark:shadow-[inset_0_4px_24px_rgba(255,255,255,0.15)] border border-slate-300/30 dark:border-white/10"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isVisible ? 0.8 : 0,
          borderRadius: [
            "40% 60% 70% 30% / 40% 50% 60% 50%",
            "60% 40% 30% 70% / 50% 60% 40% 50%",
            "50% 60% 40% 60% / 60% 40% 60% 40%",
            "40% 60% 70% 30% / 40% 50% 60% 50%"
          ],
          rotate: [0, 90, 180, 270, 360]
        }}
        transition={{
          opacity: { duration: 0.5 },
          borderRadius: {
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          },
          rotate: {
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }
        }}
      />
    </div>
  );
};
