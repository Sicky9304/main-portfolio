import React, { useState } from 'react';
import { Sparkles, RefreshCw, Send, ArrowRight } from 'lucide-react';

export const GhostwriterView = ({ loading, onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return alert('Please describe what the blog should be about.');
    onGenerate(prompt, title);
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-left space-y-6">
      
      {/* Introduction Card */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-sm space-y-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center text-primary">
          <Sparkles size={20} className="animate-pulse" />
        </div>
        <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-800 dark:text-white font-heading">AI Ghostwriter Agent</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Tell the writing agent what technical guide, tutorial, or post you want to publish. The agent will craft a complete article in formatted Markdown with headings, code snippets, and callouts, which you can edit and finalize in the editor.
        </p>
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-sm space-y-5">
        <div className="space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 pl-0.5">Suggested Title (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g. Master React Portals in 10 Minutes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 pl-0.5">Topic Details & Content Guidance</label>
            <textarea 
              rows={5}
              placeholder="Describe what the post is about, the target audience, key takeaways, and code examples to include (e.g. 'Write a detailed tutorial about React Portals, explaining use cases like modals and dropdowns, with simple code examples...')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none text-slate-800 dark:text-slate-200 leading-relaxed"
            />
          </div>

        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-95 text-white font-bold text-xs hover:shadow-lg transition-all cursor-pointer flex justify-center items-center gap-2 active:translate-y-0.5 disabled:opacity-40"
        >
          {loading ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              Crafting Article Draft...
            </>
          ) : (
            <>
              <Send size={12} />
              Generate Blog Draft <ArrowRight size={12} />
            </>
          )}
        </button>
      </form>

    </div>
  );
};
