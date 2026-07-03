import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin } from 'lucide-react';
import { RevealOnScroll, SectionHeading } from '../components/ui/Animations';
import { MagneticButton } from '../components/ui/MagneticButton';
import { submitContact } from '../api/index.js';

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [focusedField, setFocusedField] = useState(null);

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



  return (
    <section id="contact" className="section-padding relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          label="Contact"
          title="Let's Work Together"
          description="Have a project in mind or just want to connect? I'd love to hear from you."
        />

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Info & Socials */}
          <RevealOnScroll direction="left">
            <div className="space-y-8">
              {/* Big CTA Card */}
              <div className="glass rounded-[32px] p-8 sm:p-10 relative overflow-hidden">
                <div className="blob blob-primary w-[200px] h-[200px] -top-20 -right-20 opacity-30" />
                <div className="relative z-10">
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                    Got a project?
                    <br />
                    <span className="gradient-text">Let&apos;s talk.</span>
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                    I&apos;m currently available for freelance work and full-time opportunities.
                    If you have an idea, let&apos;s build something amazing together.
                  </p>

                  {/* Availability Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-sm font-semibold border border-emerald-100 dark:border-emerald-900/40">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </span>
                    Available for new projects
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="glass rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Email</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">sickykumar01@gmail.com</p>
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


            </div>
          </RevealOnScroll>

          {/* Right: Contact Form */}
          <RevealOnScroll direction="right" delay={0.1}>
            <div className="glass rounded-[32px] p-8 sm:p-10">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 space-y-4"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    className="text-5xl"
                  >
                    ✉️
                  </motion.div>
                  <h4 className="text-xl font-bold gradient-text" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                    Message Sent!
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Thank you for reaching out. I&apos;ll get back to you shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3
                    className="text-xl font-bold text-slate-900 dark:text-white mb-2"
                    style={{ fontFamily: 'Satoshi, sans-serif' }}
                  >
                    Send a Message
                  </h3>

                  {/* Error Banner */}
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
                      htmlFor="contact-name"
                      className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedField === 'name' || formData.name
                          ? 'top-1 text-[10px] font-bold text-primary'
                          : 'top-4 text-sm text-slate-400'
                        }`}
                    >
                      Your Name
                    </label>
                    <input
                      id="contact-name"
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
                      htmlFor="contact-email"
                      className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedField === 'email' || formData.email
                          ? 'top-1 text-[10px] font-bold text-primary'
                          : 'top-4 text-sm text-slate-400'
                        }`}
                    >
                      Email Address
                    </label>
                    <input
                      id="contact-email"
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
                      htmlFor="contact-message"
                      className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedField === 'message' || formData.message
                          ? 'top-1 text-[10px] font-bold text-primary'
                          : 'top-4 text-sm text-slate-400'
                        }`}
                    >
                      Your Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full pt-6 pb-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <MagneticButton
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-2xl text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-60 transition-all duration-300 cursor-pointer"
                  >
                    {status === 'submitting' ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Sending...
                      </>
                    ) : (
                          <div className=' flex px-2 w-full'>
                        <Send size={14} className='mx-2'/>
                        Send Message
                      </div>
                    )}
                  </MagneticButton>
                </form>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
};
