import { Shield, Lock, Database, Mail, Globe, Cookie, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { RevealOnScroll, SectionHeading } from '../../components/ui/Animations';
import { Link } from 'react-router-dom';

const sections = [
  {
    icon: Database,
    gradient: 'from-primary to-secondary',
    title: 'Information We Collect',
    content: [
      'When you contact us through forms or email, we may collect your name, email address, and message.',
      'Basic analytics data such as browser type, operating system, pages visited, and session duration may be collected to improve website performance.',
      'We do not intentionally collect sensitive personal information.',
    ],
  },
  {
    icon: Lock,
    gradient: 'from-secondary to-accent',
    title: 'How We Use Your Information',
    content: [
      'Respond to inquiries and project requests.',
      'Improve website performance and user experience.',
      'Maintain website security.',
      'Provide portfolio updates and professional communication.',
    ],
  },
  {
    icon: Cookie,
    gradient: 'from-accent to-primary',
    title: 'Cookies',
    content: [
      'This website may use cookies or similar technologies for analytics and performance improvements.',
      'You can disable cookies anytime through your browser settings.',
    ],
  },
  {
    icon: Globe,
    gradient: 'from-primary to-accent',
    title: 'Third-Party Services',
    content: [
      'This portfolio may integrate trusted third-party services such as:',
      '• Google Analytics',
      '• Meta (Facebook / Instagram)',
      '• GitHub • Cloudinary • Vercel',
      'Each service follows its own privacy policy.',
    ],
  },
  {
    icon: Shield,
    gradient: 'from-secondary to-primary',
    title: 'Data Security',
    content: [
      'Reasonable technical measures are used to protect your information from unauthorized access, misuse, or disclosure.',
      'However, no internet transmission is completely secure.',
    ],
  },
  {
    icon: CheckCircle,
    gradient: 'from-accent to-secondary',
    title: 'Your Rights',
    content: [
      'Request access to your personal information.',
      'Request correction or deletion of your information.',
      'Contact us regarding privacy concerns at any time.',
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <main className="relative min-h-screen bg-surface-light dark:bg-surface-dark overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob blob-primary w-[500px] h-[500px] -top-32 -right-32 opacity-20" />
        <div className="blob blob-secondary w-[400px] h-[400px] bottom-0 -left-20 opacity-15" />
        <div className="blob blob-accent w-[300px] h-[300px] top-1/2 right-1/4 opacity-10" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 pt-32">

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <div className="mx-auto mb-6 w-20 h-20 rounded-3xl glass flex items-center justify-center shadow-lg">
            <Shield size={38} className="text-primary" />
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
          >
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            Your privacy matters. This page explains what information is collected,
            how it is used, and how your data is protected while using this portfolio website.
          </p>
          <span className="inline-block mt-5 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            Last Updated • July 2026
          </span>
        </motion.div>

        {/* Intro card */}
        <RevealOnScroll direction="up">
          <div className="glass rounded-[28px] p-8 mb-6 relative overflow-hidden">
            <div className="blob blob-primary w-[180px] h-[180px] -top-12 -right-12 opacity-20 pointer-events-none" />
            <h2
              className="text-xl font-bold text-slate-900 dark:text-white mb-3"
              style={{ fontFamily: 'Satoshi, sans-serif' }}
            >
              Introduction
            </h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Welcome to{' '}
              <span className="font-semibold gradient-text">Sicky Kumar Portfolio</span>.
              This Privacy Policy describes how information is collected, used, and protected
              when you visit this website. By accessing this website, you agree to the
              practices described below.
            </p>
          </div>
        </RevealOnScroll>

        {/* Sections — 6 items = clean 3×2 grid */}
        <div className="grid sm:grid-cols-2 gap-5 mb-6">
          {sections.map((item, index) => {
            const Icon = item.icon;
            return (
              <RevealOnScroll key={index} direction="up" delay={index * 0.07}>
                <div className="glass rounded-[24px] p-6 h-full hover:border-primary/20 border border-transparent transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <h2
                      className="text-lg font-bold text-slate-900 dark:text-white"
                      style={{ fontFamily: 'Satoshi, sans-serif' }}
                    >
                      {item.title}
                    </h2>
                  </div>
                  <ul className="space-y-2.5">
                    {item.content.map((text, i) => (
                      <li
                        key={i}
                        className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex gap-2"
                      >
                        {!text.startsWith('•') && (
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                        )}
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        {/* Contact CTA */}
        <RevealOnScroll direction="up" delay={0.1}>
          <div className="glass rounded-[24px] p-6 border border-primary/20 relative overflow-hidden">
            <div className="blob blob-secondary w-[150px] h-[150px] -bottom-10 -right-10 opacity-20 pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                <Mail size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <h2
                  className="text-lg font-bold text-slate-900 dark:text-white mb-1"
                  style={{ fontFamily: 'Satoshi, sans-serif' }}
                >
                  Questions about this Policy?
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Feel free to reach out at{' '}
                  <a href="mailto:connect@sickykumar.in" className="text-primary font-medium hover:underline">
                    connect@sickykumar.in
                  </a>{' '}
                  or visit{' '}
                  <a href="https://www.sickykumar.in" className="text-secondary font-medium hover:underline" target="_blank" rel="noreferrer">
                    sickykumar.in
                  </a>
                </p>
              </div>
              <Link
                to="/contact"
                className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg transition-all"
              >
                Contact Me
              </Link>
            </div>
          </div>
        </RevealOnScroll>

      </div>
    </main>
  );
}