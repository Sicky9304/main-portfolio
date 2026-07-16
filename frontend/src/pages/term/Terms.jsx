import { FileText, ShieldCheck, Scale, AlertTriangle, Mail, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { RevealOnScroll } from '../../components/ui/Animations';
import { Link } from 'react-router-dom';

const sections = [
  {
    icon: FileText,
    gradient: 'from-primary to-secondary',
    title: 'Acceptance of Terms',
    content: [
      'By accessing this website, you agree to these Terms & Conditions.',
      'If you do not agree with any part of these terms, please discontinue using this website.',
    ],
  },
  {
    icon: ShieldCheck,
    gradient: 'from-secondary to-accent',
    title: 'Website Usage',
    content: [
      'This portfolio is intended to showcase projects, skills, blogs, and professional information.',
      'You agree not to misuse, attack, scrape, or disrupt the website or its services.',
    ],
  },
  {
    icon: Scale,
    gradient: 'from-accent to-primary',
    title: 'Intellectual Property',
    content: [
      'All projects, source code, designs, graphics, logos, and written content belong to Sicky Kumar unless otherwise stated.',
      'Unauthorized copying, redistribution, or commercial use is prohibited without permission.',
    ],
  },
  {
    icon: AlertTriangle,
    gradient: 'from-primary to-accent',
    title: 'Limitation of Liability',
    content: [
      'The information provided on this website is for informational purposes only.',
      'While every effort is made to keep the content accurate, no guarantees are provided regarding completeness or reliability.',
      'We are not responsible for any loss or damages resulting from the use of this website.',
    ],
  },
  {
    icon: RefreshCcw,
    gradient: 'from-secondary to-primary',
    title: 'Changes to These Terms',
    content: [
      'These Terms & Conditions may be updated at any time.',
      'Changes become effective immediately after they are published on this page.',
    ],
  },
];

export default function Terms() {
  return (
    <main className="relative min-h-screen bg-surface-light dark:bg-surface-dark overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob blob-accent w-[500px] h-[500px] -top-32 -left-32 opacity-20" />
        <div className="blob blob-primary w-[400px] h-[400px] bottom-0 -right-20 opacity-15" />
        <div className="blob blob-secondary w-[300px] h-[300px] top-1/2 left-1/4 opacity-10" />
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
            <FileText size={38} className="text-accent" />
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
          >
            Terms &amp; <span className="gradient-text">Conditions</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            These Terms &amp; Conditions explain the rules, responsibilities, and legal
            information related to using this portfolio website.
          </p>
          <span className="inline-block mt-5 px-4 py-1.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
            Last Updated • July 2026
          </span>
        </motion.div>

        {/* Agreement banner */}
        <RevealOnScroll direction="up">
          <div className="glass rounded-[28px] p-6 mb-6 flex items-start gap-4 border border-primary/15 relative overflow-hidden">
            <div className="blob blob-primary w-[150px] h-[150px] -top-10 -right-10 opacity-15 pointer-events-none" />
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                By using this website, you accept these terms.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Please read through all sections carefully. If you have any questions, don't hesitate to{' '}
                <Link to="/contact" className="text-primary font-medium hover:underline">
                  contact us
                </Link>
                .
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* Sections grid */}
        <div className="grid sm:grid-cols-2 gap-5 mb-6">
          {sections.map((item, index) => {
            const Icon = item.icon;
            return (
              <RevealOnScroll key={index} direction="up" delay={index * 0.07}>
                <div className="glass rounded-[24px] p-6 h-full hover:border-accent/20 border border-transparent transition-all duration-300">
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
                        className="flex gap-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/60 flex-shrink-0" />
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
        <RevealOnScroll direction="up" delay={0.15}>
          <div className="glass rounded-[24px] p-6 border border-accent/20 relative overflow-hidden">
            <div className="blob blob-accent w-[150px] h-[150px] -bottom-10 -left-10 opacity-20 pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center flex-shrink-0">
                <Mail size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <h2
                  className="text-lg font-bold text-slate-900 dark:text-white mb-1"
                  style={{ fontFamily: 'Satoshi, sans-serif' }}
                >
                  Questions about these Terms?
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Reach out at{' '}
                  <a href="mailto:connect@sickykumar.in" className="text-accent font-medium hover:underline">
                    connect@sickykumar.in
                  </a>{' '}
                  or visit{' '}
                  <a href="https://www.sickykumar.in" className="text-primary font-medium hover:underline" target="_blank" rel="noreferrer">
                    sickykumar.in
                  </a>
                </p>
              </div>
              <Link
                to="/contact"
                className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-secondary text-white text-sm font-semibold shadow-md shadow-accent/20 hover:shadow-lg transition-all"
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