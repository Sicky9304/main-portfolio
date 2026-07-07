import React from 'react';
import { BookOpen, Globe, FileText, Sparkles } from 'lucide-react';

export const DashboardView = ({ blogs, onWriteClick }) => {
  const publishedCount = blogs.filter(b => b.status === 'Published').length;
  const draftCount = blogs.filter(b => b.status === 'Draft' || !b.status).length;
  const featuredCount = blogs.filter(b => b.featured).length;

  return (
    <div className="p-6 space-y-6 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        {/* Total Blogs */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 flex items-center justify-between shadow-sm">
          <div>
            <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider">Total Articles</span>
            <span className="text-3xl font-black text-slate-800 dark:text-white mt-1.5 inline-block">{blogs.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <BookOpen size={20} />
          </div>
        </div>

        {/* Published */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 flex items-center justify-between shadow-sm">
          <div>
            <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider">Published Posts</span>
            <span className="text-3xl font-black text-slate-800 dark:text-white mt-1.5 inline-block">{publishedCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-450">
            <Globe size={20} />
          </div>
        </div>

        {/* Drafts */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 flex items-center justify-between shadow-sm">
          <div>
            <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider">Draft Articles</span>
            <span className="text-3xl font-black text-slate-800 dark:text-white mt-1.5 inline-block">{draftCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-550">
            <FileText size={20} />
          </div>
        </div>

        {/* Featured */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 flex items-center justify-between shadow-sm">
          <div>
            <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider">Featured Slides</span>
            <span className="text-3xl font-black text-slate-800 dark:text-white mt-1.5 inline-block">{featuredCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
            <Sparkles size={20} />
          </div>
        </div>

      </div>

      {/* Recent Entries */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-500 font-heading">Recent Publications</h3>
          <button 
            onClick={onWriteClick} 
            className="text-[10px] text-primary hover:underline font-bold"
          >
            Create post →
          </button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {blogs.slice(0, 4).map(b => (
            <div key={b.slug} className="py-3 flex justify-between items-center gap-4">
              <div className="min-w-0 flex-1">
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate block">{b.title}</span>
                <span className="text-[10px] text-slate-500 font-mono block mt-0.5">/blog/{b.slug}</span>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                b.status === 'Published' 
                  ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
              }`}>
                {b.status || 'Draft'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
