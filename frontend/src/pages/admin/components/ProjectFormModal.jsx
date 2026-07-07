import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, RefreshCw } from 'lucide-react';

export const ProjectFormModal = ({
  showForm,
  setShowForm,
  isEditing,
  projectForm,
  setProjectForm,
  imagePreview,
  setImagePreview,
  uploadingImage,
  dragActive,
  loading,
  handleDrag,
  handleDrop,
  handleImageSelect,
  handleProjectSubmit
}) => {
  return (
    <AnimatePresence>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 20 }}
            className="w-full glass border border-slate-800 rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl relative"
            style={{ maxHeight: '92dvh', width: 'min(672px, 100%)' }}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-slate-950/80 backdrop-blur-md border-b border-slate-850 flex justify-between items-center flex-shrink-0">
              <h3 className="font-bold text-base sm:text-lg font-heading text-white">
                {isEditing ? `Edit Project: ${isEditing.title}` : 'Add New Project'}
              </h3>
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center active:scale-95"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleProjectSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 custom-scrollbar text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Project Title</label>
                  <input 
                    type="text" 
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm text-white transition-all duration-300"
                    placeholder="e.g. AgriConnect"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Project Slug (URL Path)</label>
                  <input 
                    type="text" 
                    required
                    value={projectForm.slug}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                    disabled={!!isEditing}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm text-white transition-all duration-300 disabled:opacity-40"
                    placeholder="e.g. agriconnect"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Tagline</label>
                  <input 
                    type="text" 
                    required
                    value={projectForm.tagline}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm text-white transition-all duration-300"
                    placeholder="Connecting farmers to markets"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5 text-center">Emoji</label>
                    <input 
                      type="text" 
                      value={projectForm.emoji}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, emoji: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm text-center text-white transition-all duration-300"
                      placeholder="🌱"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5 text-center">Display Order</label>
                    <input 
                      type="number" 
                      value={projectForm.order}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm text-center text-white transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm text-white transition-all duration-300"
                  placeholder="Detail what the project does..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">The Problem Solved (Case Study)</label>
                <textarea 
                  rows={2}
                  value={projectForm.problem}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, problem: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm text-white transition-all duration-300"
                  placeholder="What issue does this solve?"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Tech Stack (comma separated)</label>
                  <input 
                    type="text" 
                    required
                    value={projectForm.tech}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, tech: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm text-white transition-all duration-300"
                    placeholder="React.js, Node.js, Express.js, PostgreSQL"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Key Features (comma separated)</label>
                  <input 
                    type="text" 
                    value={projectForm.features}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, features: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm text-white transition-all duration-300"
                    placeholder="Marketplace, Soil Readings, Admin advice feed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">GitHub Repository Link</label>
                  <input 
                    type="url" 
                    value={projectForm.github}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, github: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm text-white transition-all duration-300"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Live Demo Link</label>
                  <input 
                    type="url" 
                    value={projectForm.demo}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, demo: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm text-white transition-all duration-300"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Background Gradient</label>
                  <select 
                    value={projectForm.color}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary focus:outline-none text-sm text-slate-300 cursor-pointer"
                  >
                    <option value="from-primary to-secondary">Cyan to Purple</option>
                    <option value="from-emerald-500 to-accent">Emerald to Cyan</option>
                    <option value="from-pink to-secondary">Pink to Purple</option>
                    <option value="from-accent to-primary">Cyan to Teal</option>
                    <option value="from-amber-400 to-red-500">Yellow to Red</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Development Status</label>
                  <select 
                    value={projectForm.status}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary focus:outline-none text-sm text-slate-300 cursor-pointer"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Planned">Planned</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-2 sm:pt-6 pl-1">
                  <input 
                    type="checkbox"
                    id="featured"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-primary focus:ring-primary/20 focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="featured" className="text-xs font-semibold text-slate-400 cursor-pointer select-none">Featured Project</label>
                </div>
              </div>

              {/* Cloudinary Thumbnail Uploader */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400 pl-0.5">
                  Thumbnail Image (Upload to Cloudinary)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                  <div className="sm:col-span-3">
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('imageFileRef').click()}
                      className={`h-24 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-300 bg-slate-950/40 hover:bg-slate-950/60 ${
                        dragActive ? 'border-primary bg-primary/5' : 'border-slate-800 hover:border-primary/30'
                      }`}
                    >
                      <input 
                        type="file" 
                        id="imageFileRef"
                        onChange={handleImageSelect}
                        accept="image/*"
                        className="hidden" 
                      />
                      <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                        <Upload size={14} className={uploadingImage ? 'animate-bounce' : ''} />
                      </div>
                      <span className="text-xs text-slate-400 font-medium text-center px-4 truncate w-full">
                        {uploadingImage ? 'Uploading to Cloudinary...' : 'Drop image here or click to browse'}
                      </span>
                    </div>
                  </div>
                  <div className="sm:col-span-1 h-24 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center relative w-full shadow-inner">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono text-center px-2">No Image</span>
                    )}
                  </div>
                </div>
                
                <input 
                  type="url" 
                  value={projectForm.thumbnail}
                  onChange={(e) => {
                    setProjectForm(prev => ({ ...prev, thumbnail: e.target.value }));
                    setImagePreview(e.target.value);
                  }}
                  className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-primary focus:outline-none text-xs text-slate-800 dark:text-white"
                  placeholder="Or enter custom image URL directly"
                />
              </div>
              
              {/* Case Study Details */}
              <div className="border-t border-slate-800 pt-4 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary font-heading">Case Study Content (Markdown Supported)</h4>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Technical Challenges & Solutions</label>
                  <textarea 
                    rows={4}
                    value={projectForm.challenges || ''}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, challenges: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:outline-none text-xs text-white font-mono"
                    placeholder="Describe challenges faced and solutions used..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">System Architecture Flow</label>
                  <textarea 
                    rows={4}
                    value={projectForm.architecture || ''}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, architecture: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:outline-none text-xs text-white font-mono"
                    placeholder="Explain system design details or Mermaid flowchart..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Core Code Snippet</label>
                  <textarea 
                    rows={4}
                    value={projectForm.codeSnippet || ''}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, codeSnippet: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:outline-none text-xs text-white font-mono"
                    placeholder="Show key implementation code snippet..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Key Results / Metrics</label>
                  <textarea 
                    rows={3}
                    value={projectForm.results || ''}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, results: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary/50 focus:outline-none text-xs text-white font-mono"
                    placeholder="Detail speed improvements, responsiveness, user metrics..."
                  />
                </div>
              </div>

              <div className="h-2"></div>
            </form>

            {/* Form Footer */}
            <div className="p-4 sm:p-5 bg-slate-50/95 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-850 flex justify-end gap-3 flex-shrink-0">
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/60 text-xs font-semibold text-slate-600 dark:text-slate-350 transition-all cursor-pointer flex items-center justify-center"
              >
                Cancel
              </button>
              <button 
                type="submit"
                onClick={handleProjectSubmit}
                disabled={loading || uploadingImage}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark font-semibold text-xs text-white transition-all cursor-pointer flex items-center gap-1.5 active:translate-y-0.5"
              >
                {loading ? <RefreshCw className="animate-spin" size={14} /> : 'Save Project'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
