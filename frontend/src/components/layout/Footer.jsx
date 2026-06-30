import { motion } from 'framer-motion';
import { ArrowUp, Code2, Mail, Heart } from 'lucide-react';
import { Github, Linkedin } from '../ui/BrandIcons';
import { RevealOnScroll } from '../ui/Animations';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com/Sicky9304', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/sickykumar', label: 'LinkedIn' },
    { icon: Code2, href: 'https://leetcode.com/u/Sicky9304', label: 'LeetCode' },
    { icon: Mail, href: 'mailto:sickykumar01@gmail.com', label: 'Email' },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const el = document.getElementById(href.replace('#', ''));
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative overflow-hidden">
      {/* Gradient Top Border */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="relative bg-slate-50/50 dark:bg-slate-950/50">
        {/* Blobs */}
        <div className="blob blob-primary w-[300px] h-[300px] -bottom-40 left-1/4 opacity-20" />
        <div className="blob blob-accent w-[200px] h-[200px] -bottom-20 right-1/4 opacity-15" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-8">
          <RevealOnScroll>
            <div className="grid md:grid-cols-3 gap-12 mb-16">
              {/* Brand */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                  <span className="gradient-text">Sicky Kumar</span>
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                  Full-Stack MERN Developer building scalable SaaS products and modern
                  web experiences from West Bengal, India.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">
                  Quick Links
                </h4>
                <ul className="space-y-2.5">
                  {footerLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={(e) => scrollToSection(e, link.href)}
                        className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Socials */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">
                  Connect
                </h4>
                <div className="flex gap-3">
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3 }}
                      className="p-3 rounded-xl glass text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light transition-colors"
                      title={label}
                    >
                      <Icon size={18} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* Bottom Bar */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
              &copy; {currentYear} Sicky Kumar. Built with <Heart size={12} className="text-pink fill-pink" /> and React.
            </p>

            {/* Back to Top */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -3 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light transition-colors cursor-pointer"
            >
              Back to top <ArrowUp size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};
