import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, Terminal, Sun, Moon, Sparkles, 
  User, Cpu, Briefcase, Settings, MessageSquare, 
  ArrowUp, Compass, ArrowRight, Layers, FileText,
  GraduationCap
} from 'lucide-react';
import { useTheme, gradientThemes } from '../../context/ThemeContext';

export const CommandPalette = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const { 
    theme, toggleTheme, 
    gradientTheme, setGradientTheme,
    bgStyle, setBgStyle
  } = useTheme();

  // Listen to keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle palette on Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      // Close on Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Handle popstate or location change to auto-close palette
  useEffect(() => {
    const handleClose = () => setIsOpen(false);
    window.addEventListener('popstate', handleClose);
    window.addEventListener('locationchange', handleClose);
    return () => {
      window.removeEventListener('popstate', handleClose);
      window.removeEventListener('locationchange', handleClose);
    };
  }, []);

  // Listen for custom trigger event (e.g. from navbar click)
  useEffect(() => {
    const handleOpenTrigger = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-command-palette', handleOpenTrigger);
    return () => window.removeEventListener('open-command-palette', handleOpenTrigger);
  }, []);

  // Focus input when palette opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
      // Lock scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Define commands
  const navigationCommands = [
    { id: 'nav-home', label: 'Go to Hero / Home', category: 'Navigation', icon: Compass, action: () => navigateTo('#hero'), keywords: 'home hero start landing' },
    { id: 'nav-blog', label: 'View Blog Catalog', category: 'Navigation', icon: FileText, action: () => navigateTo('/blog'), keywords: 'blog articles tech software writing dev stories devanagari hindi translation' },
    { id: 'nav-about-page', label: 'View Detailed About Page', category: 'Navigation', icon: User, action: () => navigateTo('/about'), keywords: 'about details page bio profile history stats cgpa achievements' },
    { id: 'nav-education-page', label: 'View Academic Records & Documents', category: 'Navigation', icon: GraduationCap, action: () => navigateTo('/education'), keywords: 'education marksheet certificate results semester cgpa diploma btech class 10 verified academic journey' },
    { id: 'nav-about', label: 'Go to About Section', category: 'Navigation', icon: User, action: () => navigateTo('#about'), keywords: 'about biography history education statistics cgpa' },
    { id: 'nav-skills', label: 'Go to Skills / TechStack', category: 'Navigation', icon: Cpu, action: () => navigateTo('#skills'), keywords: 'skills tech stack languages node react javascript database mongo' },
    { id: 'nav-projects', label: 'Go to Projects Section', category: 'Navigation', icon: Briefcase, action: () => navigateTo('#projects'), keywords: 'projects portfolio cases showcase live source github code' },
    { id: 'nav-services', label: 'Go to Services Offered', category: 'Navigation', icon: Layers, action: () => navigateTo('#services'), keywords: 'services hiring capabilities backend frontend development API' },
    { id: 'nav-contact', label: 'Go to Contact / Hire Me', category: 'Navigation', icon: Settings, action: () => navigateTo('#contact'), keywords: 'contact hire message email submit mail' },
    { id: 'nav-architecture', label: 'View Project Architecture System Design', category: 'Navigation', icon: Terminal, action: () => navigateTo('/architecture'), keywords: 'architecture guide design rulebook agents layout vercel express database schemas' },
  ];

  const themeCommands = [
    { id: 'theme-toggle', label: `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`, category: 'Appearance', icon: theme === 'light' ? Moon : Sun, action: () => toggleTheme(), keywords: 'dark light black white day night mode' },
    // Preset Gradients
    ...Object.keys(gradientThemes).map((key) => ({
      id: `theme-preset-${key}`,
      label: `Theme Preset: ${gradientThemes[key].name}`,
      category: 'Theme Presets',
      icon: Sparkles,
      action: () => setGradientTheme(key),
      keywords: `preset theme color accent style gradient ${key} ${gradientThemes[key].name.toLowerCase()}`
    })),
    
    // Backdrop Types
    { id: 'bg-aura', label: 'Background Style: Aura Glows', category: 'Backgrounds', icon: Sparkles, action: () => setBgStyle('aura'), keywords: 'backdrop style aura glow gradients' },
    { id: 'bg-grid', label: 'Background Style: Holographic Grid', category: 'Backgrounds', icon: Layers, action: () => setBgStyle('grid'), keywords: 'backdrop style grid HUD matrix neon' },
    { id: 'bg-minimal', label: 'Background Style: Minimal Solid', category: 'Backgrounds', icon: X, action: () => setBgStyle('minimal'), keywords: 'backdrop style minimal solid dark grey clean' },
    { id: 'bg-celestial', label: 'Background Style: Celestial Stars', category: 'Backgrounds', icon: Compass, action: () => setBgStyle('celestial'), keywords: 'backdrop style celestial stars cosmos sky galaxy space' },
  ];

  const interactiveCommands = [
    { id: 'action-ai', label: 'Chat with Sicky\'s AI Twin', category: 'Actions', icon: MessageSquare, action: () => openAiAssistant(), keywords: 'ai twin clone chatbot assistant conversation prompt matchmaker' },
    { id: 'action-customizer', label: 'Open Advanced Theme Customizer', category: 'Actions', icon: Settings, action: () => openThemeCustomizer(), keywords: 'theme customization customizer preset wheel layout typography font size contrast' },
    { id: 'action-top', label: 'Scroll to Top of Screen', category: 'Actions', icon: ArrowUp, action: () => window.scrollTo({ top: 0, behavior: 'smooth' }), keywords: 'scroll top up header top page' },
  ];

  const allCommands = [...navigationCommands, ...themeCommands, ...interactiveCommands];

  // Helper action: navigate to sections or pages
  const navigateTo = (href) => {
    setIsOpen(false);
    if (href.startsWith('/')) {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const sectionId = href.replace('#', '');
      const targetHash = sectionId === 'hero' ? '/' : `/#${sectionId}`;
      if (window.location.pathname !== '/' && window.location.pathname !== '') {
        navigate(targetHash);
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }, 150);
      } else {
        navigate(targetHash);
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    }
  };

  // Helper action: trigger AI twin chatbot
  const openAiAssistant = () => {
    setIsOpen(false);
    const triggerBtn = document.querySelector('[title="Ask Portfolio AI"]');
    if (triggerBtn) {
      triggerBtn.click();
    } else {
      // Fallback custom event dispatch
      window.dispatchEvent(new CustomEvent('toggle-ai-chat'));
    }
  };

  // Helper action: trigger Theme customizer
  const openThemeCustomizer = () => {
    setIsOpen(false);
    const triggerBtn = document.querySelector('[aria-label="Toggle Theme Customizer"]');
    if (triggerBtn) {
      triggerBtn.click();
    } else {
      window.dispatchEvent(new CustomEvent('toggle-theme-customizer'));
    }
  };

  // Filter commands based on search
  const filtered = allCommands.filter((cmd) => {
    const text = (cmd.label + ' ' + cmd.category + ' ' + cmd.keywords).toLowerCase();
    return text.includes(query.toLowerCase());
  });

  // Handle keyboard navigation inside the list
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10dvh] px-4 pb-4">
          {/* Backdrop Blur Layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-md"
          />

          {/* Palette Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
            onKeyDown={handleKeyDown}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
              <Search className="text-slate-450 dark:text-slate-400 flex-shrink-0" size={18} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search commands, sections, or styles..."
                className="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-450 dark:placeholder-slate-450 outline-none w-full"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-bold font-mono text-slate-500 border border-slate-200 dark:border-slate-700">
                ESC
              </kbd>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-650 transition-colors"
                aria-label="Close Command Palette"
              >
                <X size={15} />
              </button>
            </div>

            {/* Commands List Area */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-2 space-y-1" ref={listRef}>
              {filtered.length > 0 ? (
                // Grouping by Category or showing simple flat list with category tags
                filtered.map((cmd, index) => {
                  const Icon = cmd.icon;
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => cmd.action()}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-left transition-all ${
                        isSelected 
                          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/10' 
                          : 'text-slate-650 dark:text-slate-350 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-1.5 rounded-xl flex-shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                          <Icon size={15} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate">{cmd.label}</p>
                          <p className={`text-[9px] truncate ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                            {cmd.category}
                          </p>
                        </div>
                      </div>
                      
                      {isSelected && (
                        <motion.div layoutId="arrow" className="text-white flex items-center gap-1 text-[10px] font-bold font-mono">
                          SELECT <ArrowRight size={12} className="animate-pulse" />
                        </motion.div>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-10 text-slate-450 dark:text-slate-500">
                  <Terminal className="mx-auto mb-2 opacity-50" size={20} />
                  <p className="text-xs">No matching commands found.</p>
                </div>
              )}
            </div>

            {/* Bottom Keyboard Shortcuts Guide */}
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[9px] text-slate-450 dark:text-slate-500 font-mono">
              <div className="flex gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-750">↓↑</kbd> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-750">↵</kbd> Select
                </span>
              </div>
              <div>
                <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-750">⌘K</kbd> to toggle</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
