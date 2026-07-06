import { useRouteError } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, RefreshCw, Compass } from 'lucide-react';

export const ErrorPage = () => {
  const error = useRouteError();
  console.error('Captured Route Error:', error);

  // Extract status codes and messages (support react-router-dom routing errors)
  const statusCode = error?.status || 500;
  const statusMessage = error?.statusText || error?.message || 'Unexpected Application Error';

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      {/* Glowing Neon Auras */}
      <div className="absolute w-[450px] h-[450px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -translate-y-24" />
      <div className="absolute w-[350px] h-[350px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none translate-y-24" />

      {/* Glassmorphic Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-[0_30px_70px_rgba(239,68,68,0.1)] text-center relative z-10 space-y-6"
      >
        {/* Warning Icon Halo */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-red-500/15 border border-red-500/30 animate-pulse" />
          <div className="absolute inset-2 rounded-xl bg-red-500/20 border border-dashed border-red-500/40 animate-spin" style={{ animationDuration: '8s' }} />
          <ShieldAlert className="w-9 h-9 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)] relative z-10" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black font-heading tracking-tight bg-gradient-to-r from-red-400 via-pink-500 to-primary bg-clip-text text-transparent">
            System Telemetry Error
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans leading-relaxed">
            The application routing deck encountered an unhandled exception or matched a non-existent routing node.
          </p>
        </div>

        {/* Console Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 text-left font-mono text-[10px] text-slate-450 space-y-2.5 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-1">
            <span className="text-red-500 font-bold uppercase tracking-wider text-[8px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
              CRITICAL_EXCEPTION
            </span>
            <span className="text-[8px] opacity-40">NODE_CORE_v2.0</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold">➜ status_code:</span> <span className="text-white">{statusCode}</span>
          </div>
          <div className="leading-relaxed">
            <span className="text-slate-500 font-bold">➜ exception_log:</span> <span className="text-red-400 font-bold">{statusMessage}</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold">➜ current_url:</span> <span className="text-slate-400 select-all">{window.location.pathname}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleGoHome}
            className="flex-1 px-5 py-3 bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25 text-white text-xs font-bold rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <Compass size={14} /> Return to Home
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-3 border border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-900/60 text-slate-400 hover:text-white text-xs font-bold rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw size={12} /> Reload Node
          </button>
        </div>
      </motion.div>
    </div>
  );
};
