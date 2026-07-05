import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Sun, Moon, Check, Sliders } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeCustomizer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    theme,
    toggleTheme,
    gradientTheme,
    setGradientTheme,
    gradientThemes
  } = useTheme();

  return (
    <>
      {/* Click outside backdrop to close panel (only active when panel is open) */}
      <AnimatePresence>
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/10 dark:bg-black/30 backdrop-blur-[0.5px] z-40 cursor-default"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 left-4 z-50 text-slate-100 font-sans">
        {/* Floating Action Button (FAB) */}
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center shadow-lg hover:shadow-primary/30 active:scale-95 hover:scale-105 transition-all cursor-pointer relative group"
          title="Open Theme Settings"
        >
          <Settings className={`w-5 h-5 ${isOpen ? 'rotate-90' : 'animate-spin-slow'}`} />
          <span className="absolute left-14 scale-0 group-hover:scale-100 bg-slate-950/80 border border-slate-900 px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap shadow transition-all duration-300">
            Configure System UI
          </span>
        </button>

        {/* Settings Drawer Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute bottom-16 left-0 rounded-3xl glass border border-slate-200 dark:border-slate-850 p-4 shadow-2xl flex flex-col space-y-4 text-left overflow-hidden bg-white/80 dark:bg-slate-950/80 z-50"
              style={{ width: 'min(320px, calc(100vw - 2rem))' }}
            >
              {/* Decorative Glow */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

              {/* Panel Header */}
              <div className="flex justify-between items-start border-b border-slate-250 dark:border-slate-900 pb-3">
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5 font-heading">
                    <Sliders className="w-3.5 h-3.5 text-primary" />
                    SaaS Theme Console
                  </h4>
                  <p className="text-[9px] text-slate-500 font-mono">INTERFACE_ENGINE_2030</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Theme Selector (Light/Dark) */}
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold block">Base Appearance Mode</span>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-900 rounded-xl">
                  <button
                    onClick={() => theme === 'dark' && toggleTheme()}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${theme === 'light'
                        ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50'
                        : 'text-slate-500 hover:text-slate-350'
                      }`}
                  >
                    <Sun size={12} className="text-amber-500" />
                    <span>Day Mode</span>
                  </button>
                  <button
                    onClick={() => theme === 'light' && toggleTheme()}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${theme === 'dark'
                        ? 'bg-slate-900 text-white border border-slate-800 shadow-sm'
                        : 'text-slate-500 hover:text-slate-350'
                      }`}
                  >
                    <Moon size={12} className="text-indigo-400" />
                    <span>Night Mode</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Themes Grid Selection */}
              <div className="space-y-2.5">
                <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold block">
                  Select Accent &amp; Gradient Theme
                </span>

                <div className="flex flex-wrap gap-2.5">
                  {Object.entries(gradientThemes).map(([key, config]) => {
                    const isSelected = gradientTheme === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setGradientTheme(key)}
                        className={`w-9 h-9 rounded-full relative flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow ${isSelected
                            ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-950 scale-105'
                            : 'hover:opacity-90'
                          }`}
                        style={{
                          background: `linear-gradient(135deg, ${config.primary} 0%, ${config.secondary} 100%)`
                        }}
                        title={config.name}
                      >
                        {isSelected && (
                          <Check size={14} className="text-white drop-shadow" />
                        )}
                        {/* Hover tooltips */}
                        <span className="absolute bottom-11 scale-0 hover:scale-100 bg-slate-950 border border-slate-900 px-1.5 py-0.5 rounded text-[8px] font-mono whitespace-nowrap shadow pointer-events-none transition-all duration-300">
                          {config.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
