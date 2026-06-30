import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-surface-light dark:bg-surface-dark"
        >
          {/* Animated Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <div className="text-5xl font-bold" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">SK</span>
            </div>
          </motion.div>

          {/* Loading Bar */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 200, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="h-1 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800"
            style={{ width: 200 }}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              className="h-full w-full loading-bar"
            />
          </motion.div>

          {/* Loading Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-sm font-medium text-slate-400 dark:text-slate-500 tracking-widest uppercase"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Loading Experience
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
