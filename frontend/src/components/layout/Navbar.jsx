import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Menu, X, FileText, Download, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Detect active section if on home page
      if (window.location.pathname === '/' || window.location.pathname === '') {
        const sections = ['hero', 'about', 'skills', 'projects', 'services', 'contact'];
        let currentSection = 'hero';
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i]);
          if (el && el.getBoundingClientRect().top <= 150) {
            currentSection = sections[i];
            break;
          }
        }
        
        if (currentSection !== activeSection) {
          setActiveSection(currentSection);
          const targetHash = currentSection === 'hero' ? '/' : `/#${currentSection}`;
          window.history.replaceState(null, '', targetHash);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  // Listen to path changes to update active path and handle indicator
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('locationchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('locationchange', handleLocationChange);
    };
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    const sectionId = id.replace('#', '');
    
    // Update hash in browser address bar immediately
    const targetHash = sectionId === 'hero' ? '/' : `/#${sectionId}`;
    window.history.pushState({}, '', targetHash);
    
    if (window.location.pathname !== '/' && window.location.pathname !== '') {
      const navEvent = new PopStateEvent('popstate');
      window.dispatchEvent(navEvent);
      
      // Give a tiny timeout for home page to mount, then scroll
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          const offset = 100;
          const top = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        const offset = 100;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  const handleLinkClick = (e, href) => {
    if (href === '/blog') {
      e.preventDefault();
      setMenuOpen(false);
      window.history.pushState({}, '', '/blog');
      const navEvent = new PopStateEvent('popstate');
      window.dispatchEvent(navEvent);
    } else {
      scrollToSection(e, href);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-4 left-0 right-0 mx-auto z-50 transition-all duration-500 ${
          scrolled ? 'w-[92%] max-w-5xl' : 'w-[100%] max-w-6xl'
        }`}
      >
        <div className={`backdrop-blur-xl bg-white/70 dark:bg-slate-950/75 border border-emerald-500/15 dark:border-emerald-500/10 rounded-2xl px-6 py-3 flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'shadow-lg shadow-emerald-500/5 dark:shadow-emerald-500/5' : ''
        }`}>
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => scrollToSection(e, '#hero')}
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
          >
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent inline-block">Sicky</span>
            <span className="text-slate-400">.</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isBlogLink = link.href === '/blog';
              const cleanPath = currentPath.replace(/\/$/, '');
              const isActive = isBlogLink
                ? (cleanPath === '/blog' || cleanPath.startsWith('/blog/'))
                : (cleanPath === '' || cleanPath === '/' ? activeSection === link.href.replace('#', '') : false);

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-300 ${
                    isActive
                      ? 'text-primary dark:text-primary-light'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-primary/5 dark:bg-primary/10 rounded-xl"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search/Command Palette Button */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 cursor-pointer flex items-center gap-1.5"
              aria-label="Open Command Palette"
              title="Search / Command Palette (Ctrl+K)"
            >
              <Search size={16} />
              <kbd className="text-[9px] font-mono opacity-60 bg-white/40 dark:bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-200/20 dark:border-slate-800">⌘K</kbd>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 cursor-pointer"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun size={16} />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Resume Download Button */}
            <a
              href={import.meta.env.VITE_API_URL 
                ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api/profile/resume` 
                : '/api/profile/resume'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              aria-label="Download resume"
            >
              <Download size={14} />
              Resume
            </a>
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 cursor-pointer"
              aria-label="Open Command Palette"
            >
              <Search size={16} />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-655 dark:text-slate-300 cursor-pointer"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 cursor-pointer"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="backdrop-blur-xl bg-white/70 dark:bg-slate-950/75 border border-emerald-500/15 dark:border-emerald-500/10 mt-2 rounded-2xl p-4 md:hidden"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="block py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light rounded-xl hover:bg-primary/5 transition-colors"
                >
                  {link.label}
                </a>
              ))}

              {/* Resume Download — Mobile */}
              <a
                href={import.meta.env.VITE_API_URL 
                  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api/profile/resume` 
                  : '/api/profile/resume'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 mt-2 py-3 px-4 text-sm font-semibold text-primary dark:text-primary-light rounded-xl hover:bg-primary/5 transition-colors"
                aria-label="Download resume"
              >
                <Download size={14} />
                Download Resume
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};
