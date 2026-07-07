import { ArrowLeft, ExternalLink, Github, Sparkles } from 'lucide-react';

export const ProjectHeader = ({ project, onBack }) => {
  return (
    <div className="space-y-6">
      {/* Back button */}
      <button 
        onClick={onBack}
        className="group px-3.5 py-2 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-250 hover:text-primary hover:border-primary/30 dark:hover:border-primary/20 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer transition-all duration-300 flex items-center gap-1.5 backdrop-blur-sm shadow-sm dark:shadow-md hover:shadow-primary/5"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Projects
      </button>

      {/* Hero Banner Area */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-250 dark:border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-8 md:p-12 flex flex-col md:flex-row gap-6 md:gap-8 items-center shadow-xl dark:shadow-2xl">
        {/* Dynamic Glow Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${project.color || 'from-primary to-secondary'} opacity-[0.03] dark:opacity-[0.06] blur-2xl pointer-events-none`} />

        {/* Project Thumbnail/Emoji */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 relative overflow-hidden group shadow-lg">
          {project.thumbnail ? (
            <img 
              src={project.thumbnail} 
              alt={project.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <span className="text-4xl sm:text-5xl animate-bounce-slow">{project.emoji || '🚀'}</span>
          )}
        </div>

        {/* Project Info */}
        <div className="flex-1 text-center md:text-left space-y-3.5 min-w-0 overflow-hidden w-full">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider border ${
              project.status === 'Completed' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                : project.status === 'In Progress'
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                  : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400'
            }`}>
              {project.status || 'Completed'}
            </span>
            {project.featured && (
              <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider flex items-center gap-1">
                <Sparkles size={10} /> Featured Project
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-heading leading-tight break-words">
            {project.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium max-w-2xl break-words">
            {project.tagline}
          </p>

          {/* Action Links */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2.5 pt-2">
            {project.demo && (
              <a 
                href={project.demo} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white font-semibold text-xs transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 flex items-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                Live Demo <ExternalLink size={12} />
              </a>
            )}
            {project.github && (
              <a 
                href={project.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-250 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-all duration-300 flex items-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                Source Code <Github className="w-3.5 h-3.5 fill-current" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tech Stack List */}
      <div className="glass border border-slate-200 dark:border-slate-850 rounded-2xl p-4 sm:p-5 flex flex-wrap gap-2 items-center shadow-sm dark:shadow-md">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mr-2">Tech Stack:</span>
        <div className="flex flex-wrap gap-1.5">
          {project.tech?.map((t, idx) => (
            <span 
              key={idx} 
              className="text-xs px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 font-mono font-medium shadow-sm"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
