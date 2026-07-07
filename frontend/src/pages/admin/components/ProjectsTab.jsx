import { FileText, Upload, RefreshCw, CheckCircle, Link2, Sparkles, Plus, Edit3, Trash2 } from 'lucide-react';

export const ProjectsTab = ({
  projects,
  profile,
  resumeFile,
  resumeStatus,
  resumeError,
  fileInputRef,
  handleResumeSelect,
  handleUploadResume,
  openCreateForm,
  openEditForm,
  handleDeleteProject
}) => {
  return (
    <>
      {/* Resume and Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Resume Upload Module */}
        <div className="glass border border-slate-250 dark:border-slate-800/80 rounded-3xl p-5 sm:p-6 md:col-span-1 space-y-4 shadow-lg dark:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative group text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 font-heading">
            <FileText size={16} className="text-primary" /> Dynamic PDF Resume
          </div>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Upload your updated PDF resume. The PDF will be stored as binary base64 directly in the database.
          </p>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="h-32 border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-primary/55 hover:bg-slate-100/50 dark:hover:bg-slate-950/40 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 group/drop"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleResumeSelect}
              accept="application/pdf"
              className="hidden" 
            />
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-555 dark:text-slate-400 group-hover/drop:text-primary group-hover/drop:border-primary/30 transition-colors shadow-sm dark:shadow-none">
              <Upload size={18} />
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium px-4 text-center truncate w-full">
              {resumeFile ? (resumeFile.name.length > 22 ? resumeFile.name.substring(0, 19) + '...' : resumeFile.name) : 'Select Resume PDF'}
            </span>
          </div>

          {resumeError && (
            <p className="text-xs text-red-555 dark:text-red-400 font-semibold bg-red-500/10 dark:bg-red-950/15 p-2 rounded-lg border border-red-200 dark:border-red-900/20 text-center">
              ⚠️ {resumeError}
            </p>
          )}
          
          {resumeFile && (
            <button 
              onClick={handleUploadResume}
              disabled={resumeStatus === 'uploading'}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-xs hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              {resumeStatus === 'uploading' ? (
                <RefreshCw className="animate-spin" size={14} />
              ) : (
                <>
                  <CheckCircle size={14} /> Save to Database
                </>
              )}
            </button>
          )}

          {resumeStatus === 'success' && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1.5 bg-emerald-500/10 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-250 dark:border-emerald-900/20">
              ✔️ Resume uploaded successfully!
            </p>
          )}

          {profile?.resumeBase64 && (
            <div className="pt-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-900">
              <span className="text-xs text-slate-500 font-mono">Current PDF Available</span>
              <a 
                href="/api/profile/resume" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-primary hover:text-primary-light hover:underline flex items-center gap-1 transition-colors"
              >
                View Current <Link2 size={10} />
              </a>
            </div>
          )}
        </div>

        {/* Quick Stats & Configs */}
        <div className="glass border border-slate-250 dark:border-slate-800/80 rounded-3xl p-5 sm:p-6 md:col-span-2 flex flex-col justify-between shadow-lg dark:shadow-xl hover:shadow-secondary/5 transition-all duration-300">
          <div className="space-y-2">
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 font-heading">
              <Sparkles size={16} className="text-secondary" /> Portfolio Summary
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Overview of configured resources.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800/80 transition-all duration-300 group/stat shadow-sm dark:shadow-none">
                <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white bg-gradient-to-r from-slate-800 dark:from-white to-slate-500 dark:to-slate-400 bg-clip-text text-transparent group-hover/stat:text-primary transition-colors">{projects.length}</span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1.5 font-medium">Projects</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800/80 transition-all duration-300 group/stat shadow-sm dark:shadow-none">
                <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white bg-gradient-to-r from-slate-800 dark:from-white to-slate-500 dark:to-slate-400 bg-clip-text text-transparent group-hover/stat:text-secondary transition-colors">
                  {projects.filter(p => p.thumbnail).length}
                </span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1.5 font-medium">With Image</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800/80 transition-all duration-300 col-span-2 sm:col-span-1 flex flex-col justify-center items-center text-center shadow-sm dark:shadow-none">
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 dark:bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-250 dark:border-emerald-900/30 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-555 dark:bg-emerald-400 animate-pulse"></span>
                  Sync Active
                </span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-2 font-medium font-sans">Database Status</span>
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-slate-200 dark:border-slate-900 mt-6">
            <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/80"></span>
              MongoDB + Cloudinary REST Services
            </span>
            <button 
              onClick={openCreateForm}
              className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white text-xs font-semibold hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer flex items-center gap-1.5 active:translate-y-0.5"
            >
              <Plus size={14} /> New Project
            </button>
          </div>
        </div>
      </div>

      {/* Projects Listing */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 font-heading">
            📂 Manage Projects ({projects.length})
          </h2>
          <button 
            onClick={openCreateForm}
            className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 text-xs font-semibold transition-all duration-300 cursor-pointer flex items-center gap-1 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus size={12} /> Add Project
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {projects.map((proj) => (
            <div 
              key={proj.slug}
              className="p-3 sm:p-4 rounded-2xl glass border border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 transition-all duration-300 shadow-sm dark:shadow-lg hover:shadow-primary/5 flex flex-col gap-2.5 min-w-0 overflow-hidden"
            >
              {/* Top: thumbnail + info */}
              <div className="flex gap-3 items-start min-w-0 overflow-hidden">
                {/* Thumbnail */}
                <div className="w-11 h-10 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-inner">
                  {proj.thumbnail ? (
                    <img src={proj.thumbnail} alt={proj.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg">{proj.emoji || '🚀'}</span>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1 space-y-0.5 overflow-hidden">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white font-heading leading-snug flex items-center gap-1.5 flex-wrap">
                    <span className="break-words">{proj.title}</span>
                    {proj.featured && (
                      <span className="text-[8px] bg-primary/20 text-primary border border-primary/25 px-1.5 py-0.5 rounded font-sans font-semibold flex-shrink-0 whitespace-nowrap">
                        Featured
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono truncate w-full">/{proj.slug}</p>

                  {/* Tech tags */}
                  {proj.tech && proj.tech.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {proj.tech.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-900 text-slate-600 dark:text-slate-400 font-mono whitespace-nowrap">
                          {t}
                        </span>
                      ))}
                      {proj.tech.length > 3 && (
                        <span className="text-[9px] px-1 py-0.5 text-slate-500 font-mono">+{proj.tech.length - 3}</span>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-1 pt-0.5">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">Order: {proj.order}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono whitespace-nowrap ${
                      proj.status === 'Completed' 
                        ? 'bg-emerald-500/10 dark:bg-emerald-950/15 border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                        : proj.status === 'In Progress'
                          ? 'bg-amber-500/10 dark:bg-amber-950/15 border-amber-200 dark:border-amber-900/30 text-amber-600 dark:text-amber-400'
                          : 'bg-indigo-500/10 dark:bg-indigo-950/15 border-indigo-200 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    }`}>{proj.status}</span>
                  </div>
                </div>
              </div>

              {/* Bottom: action buttons */}
              <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/60">
                <button 
                  onClick={() => openEditForm(proj)}
                  className="flex-1 flex items-center justify-center p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-primary/40 hover:text-primary text-slate-600 dark:text-slate-400 transition-all duration-300 cursor-pointer shadow-sm dark:shadow-md"
                  title="Edit Project"
                >
                  <Edit3 size={13} />
                </button>
                <button 
                  onClick={() => handleDeleteProject(proj.slug)}
                  className="flex-1 flex items-center justify-center p-2 rounded-xl bg-red-500/5 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 text-red-650 dark:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 dark:hover:bg-red-900/20 transition-all duration-300 cursor-pointer shadow-sm dark:shadow-md"
                  title="Delete Project"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
