import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send, Mail, MapPin, Copy, CheckCheck,
  Globe, Github, Linkedin, Instagram, Facebook,
  MessageCircle, ExternalLink, Phone,
} from 'lucide-react';
import { RevealOnScroll, SectionHeading } from '../../components/ui/Animations';
import { MagneticButton } from '../../components/ui/MagneticButton';
import { submitContact } from '../../api/index.js';
import { Whatsapp, Telegram } from '../../components/ui/BrandIcons';

const SOCIALS = [
  {
    name: 'GitHub',
    handle: '@Sicky9304',
    icon: Github,
    gradient: 'from-slate-600 to-slate-900',
    url: 'https://github.com/Sicky9304',
  },
  {
    name: 'LinkedIn',
    handle: '/in/sickykumar',
    icon: Linkedin,
    gradient: 'from-sky-500 to-blue-700',
    url: 'https://www.linkedin.com/in/sicky-kumar-059a3b256/',
  },
  {
    name: 'Instagram',
    handle: '@sicky9304s',
    icon: Instagram,
    gradient: 'from-pink-500 via-purple-500 to-orange-400',
    url: 'https://instagram.com/sicky9304s',
  },
  {
    name: 'WhatsApp',
    handle: '+91 93044 90856',
    icon: Whatsapp,
    gradient: 'from-green-500 to-emerald-600',
    url: 'https://wa.me/919304490856',
  },
  {
    name: 'Telegram',
    handle: '@sicky9304s',
    icon: Telegram,
    gradient: 'from-sky-400 to-cyan-500',
    url: 'https://t.me/+919304490856',
  },
  {
    name: 'Portfolio',
    handle: 'sickykumar.in',
    icon: Globe,
    gradient: 'from-violet-500 to-indigo-600',
    url: 'https://www.sickykumar.in',
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setStatus('submitting');
    setErrorMessage('');
    try {
      await submitContact(formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const copyEmail = async () => {
    await navigator.clipboard.writeText('connect@sickykumar.in');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const floatingField = (field) =>
    focusedField === field || formData[field]
      ? 'top-1 text-[10px] font-bold text-primary'
      : 'top-4 text-sm text-slate-400 dark:text-slate-500';

  return (
    <main className="relative min-h-screen bg-surface-light dark:bg-surface-dark bg-style-aura overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob blob-primary w-[500px] h-[500px] -top-32 -left-32 opacity-20" />
        <div className="blob blob-secondary w-[400px] h-[400px] bottom-0 right-0 opacity-15" />
        <div className="blob blob-accent w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 pt-32">
        {/* Page heading */}
        <SectionHeading
          label="Get In Touch"
          title="Let's Work Together"
          description="Have a project in mind, a question, or just want to say hello? I'd love to hear from you."
        />

        <div className="grid lg:grid-cols-2 gap-10 mt-4">

          {/* ── LEFT COLUMN ── */}
          <RevealOnScroll direction="left">
            <div className="flex flex-col gap-6 h-full">

              {/* CTA hero card */}
              <div className="glass rounded-[28px] p-8 relative overflow-hidden">
                <div className="blob blob-primary w-[200px] h-[200px] -top-16 -right-16 opacity-25 pointer-events-none" />
                <div className="relative z-10">
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3"
                    style={{ fontFamily: 'Satoshi, sans-serif' }}
                  >
                    Got a project?{' '}
                    <span className="gradient-text">Let's talk.</span>
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6 text-sm">
                    I'm currently available for freelance work and full-time opportunities.
                    If you have an idea, let's build something amazing together.
                  </p>

                  {/* Availability badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-sm font-semibold border border-emerald-100 dark:border-emerald-900/40">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </span>
                    Available for new projects
                  </div>
                </div>
              </div>

              {/* Email + Location info cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="glass rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Email</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      connect@sickykumar.in
                    </p>
                  </div>
                </div>
                <div className="glass rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Location</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">West Bengal, India</p>
                  </div>
                </div>
              </div>

              {/* Copy / Send email quick actions */}
              <div className="glass rounded-2xl p-5 flex flex-wrap items-center gap-3">
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium flex-1 min-w-[120px]">
                  Quick Actions
                </span>
                <MagneticButton
                  onClick={copyEmail}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all cursor-pointer"
                >
                  {copied ? <CheckCheck size={15} /> : <Copy size={15} />}
                  {copied ? 'Copied!' : 'Copy Email'}
                </MagneticButton>
                <a
                  href="mailto:connect@sickykumar.in"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 transition-all cursor-pointer"
                >
                  <Send size={15} />
                  Send Email
                </a>
              </div>

            </div>
          </RevealOnScroll>

          {/* ── RIGHT COLUMN: Contact Form ── */}
          <RevealOnScroll direction="right" delay={0.1}>
            <div className="glass rounded-[28px] p-8 sm:p-10 h-full">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center py-16 space-y-4"
                >
                  <motion.div
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl"
                  >
                    ✉️
                  </motion.div>
                  <h4 className="text-xl font-bold gradient-text" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                    Message Sent!
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                    Thank you for reaching out. I'll get back to you shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3
                    className="text-xl font-bold text-slate-900 dark:text-white mb-1"
                    style={{ fontFamily: 'Satoshi, sans-serif' }}
                  >
                    Send a Message
                  </h3>

                  {/* Error banner */}
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-sm"
                    >
                      {errorMessage}
                    </motion.div>
                  )}

                  {/* Name */}
                  <div className="relative">
                    <label
                      htmlFor="cp-name"
                      className={`absolute left-4 transition-all duration-300 pointer-events-none ${floatingField('name')}`}
                    >
                      Your Name
                    </label>
                    <input
                      id="cp-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full pt-6 pb-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <label
                      htmlFor="cp-email"
                      className={`absolute left-4 transition-all duration-300 pointer-events-none ${floatingField('email')}`}
                    >
                      Email Address
                    </label>
                    <input
                      id="cp-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full pt-6 pb-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div className="relative">
                    <label
                      htmlFor="cp-message"
                      className={`absolute left-4 transition-all duration-300 pointer-events-none ${floatingField('message')}`}
                    >
                      Your Message
                    </label>
                    <textarea
                      id="cp-message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full pt-6 pb-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full flex items-center justify-center gap-2 py-4 px-8 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-2xl text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-60 transition-all duration-300 cursor-pointer"
                  >
                    {status === 'submitting' ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </RevealOnScroll>
        </div>

        {/* ── SOCIAL PROFILES GRID ── */}
        <RevealOnScroll direction="up" delay={0.15}>
          <div className="mt-14">
            <h2
              className="text-xl font-bold text-slate-900 dark:text-white mb-6"
              style={{ fontFamily: 'Satoshi, sans-serif' }}
            >
              Find me on{' '}
              <span className="gradient-text">Social Platforms</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {SOCIALS.map((social, i) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    whileHover={{ y: -4, scale: 1.03 }}
                    className="group glass rounded-2xl p-5 flex flex-col items-center gap-3 text-center cursor-pointer border border-white/5 hover:border-primary/20 transition-all duration-300"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${social.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
                    >
                      <Icon size={22} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{social.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[100px]">{social.handle}</p>
                    </div>
                    <ExternalLink
                      size={13}
                      className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </main>
  );
}