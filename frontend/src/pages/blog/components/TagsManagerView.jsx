import React from 'react';

export const TagsManagerView = ({ tagsDatabase, onDeleteTag }) => {
  return (
    <div className="p-6 max-w-xl mx-auto text-left space-y-6">
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-500 font-heading">Global Tags Cloud</h3>
        <p className="text-xs text-slate-450 leading-normal">
          View and manage all system-wide colorized tags used for categorizing MERN stack roadmap segments.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {tagsDatabase.map(tag => (
            <span 
              key={tag.name} 
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${tag.color}`}
            >
              {tag.name}
              <button 
                onClick={() => onDeleteTag(tag.name)}
                className="hover:text-red-500 text-[13px] font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
