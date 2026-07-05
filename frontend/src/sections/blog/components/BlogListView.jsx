import React from 'react';
import { Edit3, Sparkles, Trash2, Eye, BookOpen } from 'lucide-react';

export const BlogListView = ({ blogs, onEdit, onDelete, onToggleFeatured }) => {
  return (
    <div className="p-6 space-y-4 text-left">
      {blogs.length === 0 ? (
        <div className="text-center p-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-500 font-mono">
          No articles found. Click "Write Article" to publish your first post!
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.map(blog => (
            <div 
              key={blog.slug}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:border-primary/45 rounded-2xl shadow-sm hover:shadow-md hover:shadow-primary/5 transition-all flex flex-col justify-between gap-4 h-full"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className={`text-[8px] font-black font-mono tracking-widest px-2 py-0.5 rounded-full uppercase border ${
                    blog.status === 'Published'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/25'
                  }`}>
                    {blog.status || 'Draft'}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">Order: {blog.order || 0}</span>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-inner">
                    {blog.thumbnail ? (
                      <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen size={16} className="text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight leading-snug line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono truncate">/blog/{blog.slug}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                  {blog.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex gap-2">
                  <button 
                    onClick={() => onEdit(blog)}
                    className="p-2 bg-slate-50 dark:bg-slate-950 hover:text-primary rounded-xl border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 size={12} />
                  </button>
                  <button 
                    onClick={() => onToggleFeatured(blog)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      blog.featured 
                        ? 'bg-secondary/10 text-secondary border-secondary/25' 
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:text-secondary'
                    }`}
                    title="Featured toggle"
                  >
                    <Sparkles size={12} />
                  </button>
                  <button 
                    onClick={() => onDelete(blog.slug, blog.title)}
                    className="p-2 bg-slate-50 dark:bg-slate-950 hover:text-red-500 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <a 
                  href={`/blog/${blog.slug}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] text-primary hover:underline flex items-center gap-0.5"
                >
                  View Site <Eye size={10} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
