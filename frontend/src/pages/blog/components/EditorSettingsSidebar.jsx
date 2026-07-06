import React from 'react';

export const EditorSettingsSidebar = ({
  blogForm,
  setBlogForm,
  categories,
  tagInput,
  setTagInput,
  onAddTag,
  onRemoveTag,
  tagsDatabase,
  seoScore,
  getKeywordDensity,
  stats
}) => {
  return (
    <div className="w-full h-full text-left space-y-6 select-none p-1">
      
      {/* State Status Controls */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 dark:border-slate-900 pb-2">Publish Control</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-455 dark:text-slate-400 mb-1">State Status</label>
            <select 
              value={blogForm.status}
              onChange={(e) => setBlogForm(prev => ({ ...prev, status: e.target.value }))}
              className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-455 dark:text-slate-400 mb-1">Complexity</label>
            <select 
              value={blogForm.complexity}
              onChange={(e) => setBlogForm(prev => ({ ...prev, complexity: e.target.value }))}
              className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input 
              type="checkbox"
              id="sbFeatured"
              checked={blogForm.featured}
              onChange={(e) => setBlogForm(prev => ({ ...prev, featured: e.target.checked }))}
              className="w-4 h-4 rounded text-primary focus:ring-primary/25 cursor-pointer"
            />
            <label htmlFor="sbFeatured" className="text-xs font-semibold text-slate-655 dark:text-slate-450 cursor-pointer">Featured Post</label>
          </div>
        </div>
      </div>

      {/* Categorization & Tags */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 dark:border-slate-900 pb-2">Categories & Tags</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-455 dark:text-slate-400 mb-1">Primary Category</label>
            <select 
              value={blogForm.category}
              onChange={(e) => setBlogForm(prev => ({ ...prev, category: e.target.value }))}
              className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-455 dark:text-slate-400 mb-1">Tags (Enter or Comma)</label>
            <input 
              type="text" 
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={onAddTag}
              placeholder="Add React, Node, etc..."
              className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none"
            />
            <div className="flex flex-wrap gap-1.5 pt-2">
              {blogForm.tags.map(tag => {
                const tagColor = tagsDatabase.find(t => t.name.toLowerCase() === tag.toLowerCase())?.color || 'bg-slate-500/10 text-slate-400 border-slate-550/20';
                return (
                  <span 
                    key={tag} 
                    className={`text-[9px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${tagColor}`}
                  >
                    {tag}
                    <button onClick={() => onRemoveTag(tag)} className="hover:text-red-500 text-[10px] font-bold">×</button>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SEO Controls */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-900 pb-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">SEO Manager</h3>
          <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
            seoScore >= 80 
              ? 'bg-emerald-500/10 text-emerald-400' 
              : (seoScore >= 50 ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500')
          }`}>
            SEO: {seoScore}/100
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-455 dark:text-slate-400 mb-1">Focus Keyword</label>
            <input 
              type="text" 
              placeholder="Focus keyword..."
              value={blogForm.focusKeyword}
              onChange={(e) => setBlogForm(prev => ({ ...prev, focusKeyword: e.target.value }))}
              className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none"
            />
            {blogForm.focusKeyword && (
              <span className="text-[9px] font-mono text-slate-500 block pt-1">
                Keyword Density: {getKeywordDensity()}
              </span>
            )}
          </div>

          <div>
            <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-455 dark:text-slate-400 mb-1">SEO Meta Title</label>
            <input 
              type="text" 
              placeholder="SEO Title..."
              value={blogForm.seoTitle}
              onChange={(e) => setBlogForm(prev => ({ ...prev, seoTitle: e.target.value }))}
              className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none"
            />
            <span className="text-[9px] font-mono text-slate-500 block pt-0.5">{blogForm.seoTitle.length}/60 chars</span>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-455 dark:text-slate-400 mb-1">Meta Description</label>
            <textarea 
              rows={2}
              placeholder="Meta Description..."
              value={blogForm.seoDescription}
              onChange={(e) => setBlogForm(prev => ({ ...prev, seoDescription: e.target.value }))}
              className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none"
            />
            <span className="text-[9px] font-mono text-slate-500 block pt-0.5">{blogForm.seoDescription.length}/160 chars</span>
          </div>

          {/* Google Live Search Snippet Preview */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-250 dark:border-slate-850 rounded-xl space-y-1.5 select-text">
            <span className="text-[9px] font-black uppercase text-slate-400 font-mono block">Google Live Snippet</span>
            <div className="text-[11px] text-blue-500 dark:text-blue-400 font-sans font-semibold hover:underline truncate">
              {blogForm.seoTitle || blogForm.title || 'Enter Title...'}
            </div>
            <div className="text-[10px] text-green-600 dark:text-green-550 font-mono truncate leading-none">
              https://sickykumar.in › blog › {blogForm.slug || 'slug'}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal line-clamp-2">
              {blogForm.seoDescription || blogForm.description || 'Enter description to preview search engine results...'}
            </p>
          </div>
        </div>
      </div>

      {/* Writing metrics stats */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 dark:border-slate-900 pb-2">Writing Stats</h3>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500">
          <div className="p-2 bg-slate-100/50 dark:bg-slate-900/50 rounded border border-slate-200 dark:border-slate-850">
            Words: <span className="font-bold text-slate-700 dark:text-white">{stats.words}</span>
          </div>
          <div className="p-2 bg-slate-100/50 dark:bg-slate-900/50 rounded border border-slate-200 dark:border-slate-850">
            Chars: <span className="font-bold text-slate-700 dark:text-white">{stats.chars}</span>
          </div>
          <div className="p-2 bg-slate-100/50 dark:bg-slate-900/50 rounded border border-slate-200 dark:border-slate-850">
            Headings: <span className="font-bold text-slate-700 dark:text-white">{stats.headings}</span>
          </div>
          <div className="p-2 bg-slate-100/50 dark:bg-slate-900/50 rounded border border-slate-200 dark:border-slate-850">
            Paragraphs: <span className="font-bold text-slate-700 dark:text-white">{stats.paragraphs}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
