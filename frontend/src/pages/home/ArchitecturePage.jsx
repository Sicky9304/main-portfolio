import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Cpu, Layers, Terminal } from 'lucide-react';
import { fetchArchitecture } from '../../api/index.js';
import { MarkdownRenderer } from '../../components/ai/MarkdownRenderer';

export const ArchitecturePage = () => {
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArchitecture = async () => {
      setLoading(true);
      try {
        const data = await fetchArchitecture();
        setMarkdown(data);
      } catch (err) {
        console.error('Error fetching architecture doc', err);
      } finally {
        setLoading(false);
      }
    };
    loadArchitecture();
  }, []);

  const handleBack = () => {
    window.history.pushState({}, '', '/');
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500">
        <RefreshCw className="animate-spin text-primary mb-3" size={32} />
        <span className="font-mono text-xs">LOADING ARCHITECTURE LOGS...</span>
      </div>
    );
  }

  return (
    <div className="relative text-slate-800 dark:text-slate-100 max-w-6xl mx-auto px-6 pt-24 pb-12 space-y-8 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-900 pb-6 relative z-10">
        <div className="space-y-2">
          <button
            onClick={handleBack}
            className="group mb-2 flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
            <Cpu className="text-primary animate-pulse" size={32} />
            System Architecture
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
            Technical blueprint, features, and folder tree layout
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900 text-[10px] font-mono text-slate-550 dark:text-slate-400 flex items-center gap-1.5">
            <Terminal size={12} className="text-secondary" />
            v1.0.0
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900 text-[10px] font-mono text-slate-550 dark:text-slate-400 flex items-center gap-1.5">
            <Layers size={12} className="text-accent" />
            MERN + Gemini
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 w-full rounded-3xl bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900 p-6 md:p-10 shadow-xl backdrop-blur-xl">
        <article className="prose prose-invert max-w-none prose-sm sm:prose-base text-left">
          {markdown ? (
            <MarkdownRenderer content={markdown} />
          ) : (
            <div className="text-center py-10 font-mono text-xs text-red-500">
              ❌ Failed to retrieve system architecture logs.
            </div>
          )}
        </article>
      </div>
    </div>
  );
};
