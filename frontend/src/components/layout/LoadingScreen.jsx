import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Cpu } from 'lucide-react';

export const LoadingScreen = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);
  const [showOverlay, setShowOverlay] = useState(isLoading);

  // Smart simulated progress bar that speeds up, decays, and snaps to 100%
  useEffect(() => {
    let timer;
    if (isLoading) {
      setShowOverlay(true);
      setProgress(0);
      
      const updateProgress = () => {
        setProgress((prev) => {
          if (prev < 40) {
            // Speed through first 40%
            return prev + Math.floor(Math.random() * 8) + 4;
          } else if (prev < 75) {
            // Steady crawl to 75%
            return prev + Math.floor(Math.random() * 4) + 1;
          } else if (prev < 95) {
            // Slow decay towards 95%
            return prev + (Math.random() > 0.6 ? 1 : 0);
          }
          return prev;
        });
        
        // Dynamic interval timing for realistic decay feel
        timer = setTimeout(updateProgress, Math.random() * 120 + 80);
      };
      
      timer = setTimeout(updateProgress, 50);
    } else {
      // Data loaded: Snap to 100% instantly
      setProgress(100);
      // Wait for progress transition to complete, then fade out overlay
      timer = setTimeout(() => {
        setShowOverlay(false);
      }, 400);
    }

    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 text-white select-none overflow-hidden"
        >
          {/* Futuristic Cyber Grid Backdrop */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

          {/* Glowing Aura Spheres */}
          <div className="absolute w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -translate-x-12 -translate-y-12" />
          <div className="absolute w-[350px] h-[350px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none translate-x-12 translate-y-12" />

          {/* 3D Telemetry Orbital Loader */}
          <div className="relative flex items-center justify-center w-48 h-48 mb-8">
            {/* Outer Rotating Dotted Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-dashed border-primary/20"
            />
            {/* Mid Rotating Scanning Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-2 rounded-full border border-secondary/30 border-t-transparent border-b-transparent"
            />
            {/* Inner Glow Core */}
            <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-primary/10 to-secondary/10 blur-xl animate-pulse" />

            {/* Central Holographic Icon */}
            <motion.div
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="z-10 flex flex-col items-center justify-center"
            >
              <Cpu className="w-8 h-8 text-secondary drop-shadow-[0_0_15px_rgba(6,182,212,0.6)] animate-pulse mb-1" />
              <span className="text-[22px] font-black font-mono tracking-tighter bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {progress}%
              </span>
            </motion.div>
          </div>

          {/* Status logs text */}
          <div className="h-12 flex flex-col items-center justify-center font-mono text-[9px] uppercase tracking-[0.25em] text-slate-500 z-10 space-y-1.5">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-primary-light font-bold"
            >
              {progress < 30 ? 'Establishing telemetry link...' : 
               progress < 70 ? 'Synching MongoDB collections...' : 
               progress < 100 ? 'Rendering client environment...' : 
               'Link active! Enjoy.'}
            </motion.p>
            <p className="opacity-50 text-[8px]">SICKY KUMAR PORTFOLIO v2.0</p>
          </div>

          {/* Top Edge Scanning bar indicator */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-900 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
