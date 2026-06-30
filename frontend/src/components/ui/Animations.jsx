import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * Wraps a section and reveals it with a premium animation when scrolled into view.
 * direction: 'up' | 'down' | 'left' | 'right'
 */
export const RevealOnScroll = ({ children, direction = 'up', delay = 0, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const directionOffsets = {
    up: { y: 60 },
    down: { y: -60 },
    left: { x: 60 },
    right: { x: -60 },
  };

  const offset = directionOffsets[direction] || directionOffsets.up;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Reveals text word by word with a staggered animation.
 */
export const TextReveal = ({ text, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const words = text.split(' ');

  return (
    <span ref={ref} className={className}>
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: delay + index * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
          {index < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </span>
  );
};

/**
 * Section heading with label, title, and optional description.
 */
export const SectionHeading = ({ label, title, description }) => {
  return (
    <div className="mb-16 max-w-2xl">
      <RevealOnScroll>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-primary/5 dark:bg-primary/10 text-primary dark:text-primary-light border border-primary/10 dark:border-primary/20 mb-4">
          {label}
        </span>
      </RevealOnScroll>
      <RevealOnScroll delay={0.1}>
        <h2
          className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-tight"
          style={{ fontFamily: 'Satoshi, sans-serif' }}
        >
          {title}
        </h2>
      </RevealOnScroll>
      {description && (
        <RevealOnScroll delay={0.2}>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        </RevealOnScroll>
      )}
    </div>
  );
};
