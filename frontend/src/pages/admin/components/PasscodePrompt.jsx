import { motion } from 'framer-motion';
import { Lock, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';

export const PasscodePrompt = ({
  passcode,
  setPasscode,
  loading,
  errorMsg,
  onSubmit,
  onBack
}) => {
  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex flex-col items-center justify-center text-slate-800 dark:text-white px-4 relative overflow-hidden transition-colors duration-300">
      {/* Ambient background glow elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 relative z-10"
      >
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/5">
          <Lock size={28} className="text-primary animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-heading">
            Admin Portal
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Authorized Access Only • Secure Session Mode</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 pl-1">
              Passcode
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              disabled={loading}
              className="w-full px-5 py-3.5 rounded-xl bg-white/60 dark:bg-slate-950/80 border border-slate-250 dark:border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 text-center text-lg tracking-wider text-slate-800 dark:text-white focus:outline-none transition-all duration-300 shadow-sm dark:shadow-none"
            />
          </div>
          {errorMsg && (
            <p className="text-xs font-semibold text-red-500 dark:text-red-400 text-center bg-red-500/10 dark:bg-red-950/20 py-2 rounded-lg border border-red-200 dark:border-red-900/30">
              ⚠️ {errorMsg}
            </p>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark font-semibold text-white transition-all shadow-lg shadow-primary/10 hover:shadow-primary/25 cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : (
              <>
                <span>Verify Passcode</span>
                <Sparkles size={16} />
              </>
            )}
          </button>
        </form>

        <button 
          onClick={onBack}
          className="text-xs text-slate-500 dark:text-slate-450 hover:text-slate-700 dark:hover:text-slate-350 flex items-center gap-1 mx-auto cursor-pointer transition-colors"
        >
          <ArrowLeft size={12} /> Go back to website
        </button>
      </motion.div>
    </div>
  );
};
