import { Trash2, UserX, ClipboardList, Clock, ShieldOff, Mail, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { RevealOnScroll } from '../../components/ui/Animations';
import { Link } from 'react-router-dom';

const sections = [
  {
    icon: ClipboardList,
    gradient: 'from-primary to-secondary',
    title: 'What Data We Hold',
    content: [
      'Contact form submissions including your name, email address, and message content.',
      'Basic analytics data such as page visits and session information collected via Vercel Analytics.',
      'No passwords, payment information, or sensitive personal data is ever stored.',
    ],
  },
  {
    icon: UserX,
    gradient: 'from-secondary to-accent',
    title: 'Your Right to Deletion',
    content: [
      'You have the right to request the permanent deletion of any personal data associated with you.',
      'Upon a verified request, all identifiable records (name, email, messages) will be removed from our database within 7 business days.',
      'Analytics data, which is aggregated and non-identifiable, may be retained for performance reporting.',
    ],
  },
  {
    icon: RotateCcw,
    gradient: 'from-accent to-primary',
    title: 'How to Submit a Request',
    content: [
      'Send a data deletion request to connect@sickykumar.in with the subject line "Data Deletion Request".',
      'Include the email address you used when contacting us so we can locate your records.',
      'You will receive a confirmation reply within 2 business days acknowledging your request.',
    ],
  },
  {
    icon: Clock,
    gradient: 'from-primary to-accent',
    title: 'Processing Timeline',
    content: [
      'Deletion requests are processed within 7 business days of identity verification.',
      'You will receive a final confirmation email once your data has been permanently removed.',
      'If we are unable to locate data matching your request, you will be notified accordingly.',
    ],
  },
  {
    icon: ShieldOff,
    gradient: 'from-secondary to-primary',
    title: 'Exceptions',
    content: [
      'Certain data may be retained if required by applicable law or to resolve ongoing disputes.',
      'Aggregated, anonymized analytics data that cannot identify you individually is exempt from deletion.',
      'Data already purged from active systems may still exist in automated backups for a limited retention window.',
    ],
  },
];

export default function DataDeletion() {
  return (
    <main className="relative min-h-screen bg-surface-light dark:bg-surface-dark overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob blob-secondary w-[500px] h-[500px] -top-32 -left-32 opacity-20" />
        <div className="blob blob-accent w-[400px] h-[400px] bottom-0 -right-20 opacity-15" />
        <div className="blob blob-primary w-[300px] h-[300px] top-1/2 right-1/4 opacity-10" />
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
            <Trash2 size={38} className="text-secondary" />
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
          >
            Data <span className="gradient-text">Deletion</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            You are in control of your data. This page explains what personal information
            we hold, your right to have it removed, and exactly how to submit a deletion request.
          </p>
          <span className="inline-block mt-5 px-4 py-1.5 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20">
            Last Updated • July 2026
          </span>
        </motion.div>

        {/* Info banner */}
        <RevealOnScroll direction="up">
          <div className="glass rounded-[28px] p-6 mb-6 flex items-start gap-4 border border-secondary/15 relative overflow-hidden">
            <div className="blob blob-secondary w-[150px] h-[150px] -top-10 -right-10 opacity-15 pointer-events-none" />
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center flex-shrink-0 mt-0.5">
              <Trash2 size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                We respect your right to be forgotten.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                To exercise this right, simply email us at{' '}
                <a href="mailto:connect@sickykumar.in" className="text-secondary font-medium hover:underline">
                  connect@sickykumar.in
                </a>{' '}
                or use the{' '}
                <Link to="/contact" className="text-primary font-medium hover:underline">
                  contact form
                </Link>
                .
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* Time Taken Timeline */}
        <RevealOnScroll direction="up">
          <div className="glass rounded-[28px] p-6 mb-6 border border-accent/15 relative overflow-hidden">
            <div className="blob blob-accent w-[180px] h-[180px] -top-12 -left-12 opacity-10 pointer-events-none" />
            <div className="relative z-10">
              {/* Header */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Time Taken for Deletion</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">End-to-end processing timeline</p>
                </div>
                <span className="ml-auto flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold bg-accent/10 text-accent border border-accent/25">
                  Within 30 Days
                </span>
              </div>
              {/* Steps */}
              <div className="relative flex flex-col sm:flex-row gap-6 sm:gap-0 mt-2">
                {/* Desktop connector line behind circles */}
                <div className="hidden sm:block absolute top-[18px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-accent/30 via-secondary/40 to-accent/30 z-0" />

                {[
                  { step: '01', label: 'Request Received', time: 'Day 0', desc: 'We log your deletion request.' },
                  { step: '02', label: 'Acknowledgement', time: 'Within 2 Days', desc: 'Confirmation email is sent to you.' },
                  { step: '03', label: 'Verification', time: 'Within 5 Days', desc: 'We verify your identity & locate data.' },
                  { step: '04', label: 'Data Removed', time: 'Within 30 Days', desc: 'All personal records are permanently deleted.' },
                ].map((item, i) => (
                  <div key={i} className="relative z-10 flex sm:flex-col items-center sm:items-center flex-1 gap-4 sm:gap-0">
                    {/* Mobile vertical connector */}
                    {i < 3 && (
                      <div className="sm:hidden absolute left-[18px] top-9 w-0.5 h-full bg-gradient-to-b from-accent/40 to-transparent" />
                    )}
                    {/* Numbered circle */}
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md shadow-accent/20 z-10">
                      {item.step}
                    </div>
                    {/* Text */}
                    <div className="sm:text-center sm:mt-3 sm:px-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{item.label}</p>
                      <span className="inline-block mt-1 mb-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-secondary/10 text-secondary border border-secondary/20">
                        {item.time}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Sections grid */}
        <div className="grid sm:grid-cols-2 gap-5 mb-6">
          {sections.map((item, index) => {
            const Icon = item.icon;
            return (
              <RevealOnScroll key={index} direction="up" delay={index * 0.07}>
                <div className="glass rounded-[24px] p-6 h-full hover:border-secondary/20 border border-transparent transition-all duration-300">
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
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary/60 flex-shrink-0" />
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
          <div className="glass rounded-[24px] p-6 border border-secondary/20 relative overflow-hidden">
            <div className="blob blob-secondary w-[150px] h-[150px] -bottom-10 -left-10 opacity-20 pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center flex-shrink-0">
                <Mail size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <h2
                  className="text-lg font-bold text-slate-900 dark:text-white mb-1"
                  style={{ fontFamily: 'Satoshi, sans-serif' }}
                >
                  Ready to request deletion?
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Email us at{' '}
                  <a href="mailto:connect@sickykumar.in" className="text-secondary font-medium hover:underline">
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
                className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-secondary to-primary text-white text-sm font-semibold shadow-md shadow-secondary/20 hover:shadow-lg transition-all"
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
