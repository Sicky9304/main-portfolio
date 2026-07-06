import React from 'react';
import { MarkdownRenderer } from '../../../components/ai/MarkdownRenderer';

export const EditorPreview = ({ blogForm, editorMode, textAlign }) => {
  return (
    <div 
      className={`flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950 p-8 overflow-y-auto custom-scrollbar ${
        editorMode === 'write' ? 'hidden' : 'flex'
      }`}
    >
      <div className="max-w-3xl mx-auto w-full text-left space-y-6 select-text">
        {blogForm.thumbnail && (
          <div className="h-44 sm:h-64 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-900 bg-slate-950">
            <img src={blogForm.thumbnail} alt={blogForm.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-primary font-bold">{blogForm.category}</span>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 dark:text-white leading-tight">
            {blogForm.title || 'Untitled Post'}
          </h1>
        </div>

        <article className={`prose prose-invert max-w-none pt-4 border-t border-slate-100 dark:border-slate-900 ${textAlign}`}>
          <MarkdownRenderer content={blogForm.content} />
        </article>
      </div>
    </div>
  );
};
