import { 
  LayoutDashboard, BookOpen, FileSignature, Image, Layers, Tag,
  Save, ShieldAlert, Sparkles 
} from 'lucide-react';
import { useBlogWorkspace } from './hooks/useBlogWorkspace';
import { INITIAL_BLOG_FORM } from './components/editorDefaults';

// Modular Component Views
import { DashboardView } from './components/DashboardView';
import { BlogListView } from './components/BlogListView';
import { MediaLibraryView } from './components/MediaLibraryView';
import { CategoriesManagerView } from './components/CategoriesManagerView';
import { TagsManagerView } from './components/TagsManagerView';
import { EditorCanvas } from './components/EditorCanvas';
import { EditorPreview } from './components/EditorPreview';
import { EditorSettingsSidebar } from './components/EditorSettingsSidebar';
import { GhostwriterView } from './components/GhostwriterView';

export const AdminBlogTab = ({ token }) => {
  const {
    blogs, loading, isDesktop, sidebarWidth, setSidebarWidth, rightPanelWidth, setRightPanelWidth,
    editorSplitRatio, setEditorSplitRatio, sidebarHidden, setSidebarHidden, rightPanelHidden, setRightPanelHidden,
    workspaceTab, setWorkspaceTab, editorMode, setEditorMode, isDirty, lastSaved, history, historyIndex,
    selectedFont, setSelectedFont, selectedSize, setSelectedSize, lineHeight, setLineHeight, letterSpacing, setLetterSpacing, textAlign, setTextAlign,
    categories, setCategories, newCategoryName, setNewCategoryName, tagInput, setTagInput, tagsDatabase, setTagsDatabase,
    mediaItems, mediaSearch, setMediaSearch, selectedMediaItem, setSelectedMediaItem, cropRotation, setCropRotation,
    isEditing, blogForm, setBlogForm, handleSidebarDrag, handleRightPanelDrag, handleSplitDrag,
    saveDraft, handlePublish, insertMarkdown, handleTitleChange, handleAddTag, getStatistics, calculateSeoScore,
    handleEditOpen, handleDelete, toggleFeaturedStatus, handleMediaUpload, handleAiGenerate
  } = useBlogWorkspace(token);

  if (!isDesktop) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-3xl space-y-4 w-full">
        <div className="p-4 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">
          <ShieldAlert size={36} className="animate-pulse" />
        </div>
        <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-white">Desktop Screen Required</h3>
        <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
          Please access the Publishing Canvas and SEO Workspace on a desktop screen layout.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0 border border-slate-200 dark:border-slate-900 rounded-3xl bg-white dark:bg-slate-950 overflow-hidden shadow-2xl relative w-full h-full">
      
      {/* ─── LEFT SIDEBAR ─── */}
      <aside 
        style={{ width: sidebarHidden ? 0 : sidebarWidth, minWidth: sidebarHidden ? 0 : 160 }}
        className={`bg-white dark:bg-slate-950 flex flex-col justify-between p-4 overflow-hidden transition-all duration-75 ${
          sidebarHidden ? 'w-0 p-0 border-r-0' : 'border-r border-slate-200 dark:border-slate-900'
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-widest font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SaaS Publisher
            </span>
          </div>

          <nav className="space-y-1.5 text-left">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={14} /> },
              { id: 'blogs', label: 'All Blogs', icon: <BookOpen size={14} /> },
              { id: 'ghostwriter', label: 'AI Ghostwriter', icon: <Sparkles size={14} className="text-secondary animate-pulse" /> },
              { id: 'editor', label: 'Writing Canvas', icon: <FileSignature size={14} /> },
              { id: 'media', label: 'Media Library', icon: <Image size={14} /> },
              { id: 'categories', label: 'Categories', icon: <Layers size={14} /> },
              { id: 'tags', label: 'Tags Manager', icon: <Tag size={14} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setWorkspaceTab(tab.id);
                  if (tab.id === 'editor' && !isEditing) {
                    setBlogForm(INITIAL_BLOG_FORM);
                  }
                }}
                className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                  workspaceTab === tab.id 
                    ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-l-4 border-primary'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-slate-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="pt-4 border-t border-slate-200 dark:border-slate-900 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-[9px] font-mono text-slate-500">Live Database Synced</span>
        </div>
      </aside>

      {/* Sidebar drag handle */}
      {!sidebarHidden && (
        <div 
          onMouseDown={handleSidebarDrag}
          onDoubleClick={() => setSidebarWidth(240)}
          className="w-1 bg-slate-200 hover:bg-primary/50 dark:bg-slate-900 dark:hover:bg-primary/50 cursor-col-resize transition-all duration-150 relative flex items-center justify-center flex-shrink-0 z-30"
        />
      )}

      {/* ─── MAIN CANVAS WORKSPACE ─── */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950/20">
        
        {/* Header toolbar toggles */}
        <header className="h-14 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-900 flex justify-between items-center px-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarHidden(!sidebarHidden)}
              className="p-1 rounded bg-slate-100 dark:bg-slate-900 text-slate-500 cursor-pointer text-xs flex items-center gap-1 hover:text-primary transition-colors font-semibold"
            >
              {sidebarHidden ? 'Show Sidebar' : 'Hide Sidebar'}
            </button>
            <span className="text-slate-300 dark:text-slate-800">|</span>
            <h2 className="text-xs font-black uppercase text-slate-800 dark:text-white tracking-widest font-heading flex items-center gap-1.5">
              {workspaceTab === 'editor' ? (isEditing ? 'Modify Post' : 'New Article Draft') : `${workspaceTab}`}
            </h2>
            {workspaceTab === 'editor' && (
              <span className="text-[10px] text-slate-500 font-mono bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-850 flex items-center gap-1">
                {isDirty ? 'Unsaved changes' : 'Autosaved'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {workspaceTab === 'editor' && (
              <>
                <button onClick={saveDraft} disabled={loading} className="px-3 py-1 rounded-lg border border-slate-250 dark:border-slate-800 text-xs font-bold flex items-center gap-1 hover:border-primary bg-white/60 dark:bg-slate-900/60 cursor-pointer">
                  <Save size={12} /> Save Draft
                </button>
                <button onClick={handlePublish} disabled={loading} className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary hover:shadow-lg text-white text-xs font-black flex items-center gap-1 cursor-pointer">
                  Publish Live
                </button>
              </>
            )}
            <button 
              onClick={() => setRightPanelHidden(!rightPanelHidden)}
              className="p-1 rounded bg-slate-100 dark:bg-slate-900 text-slate-500 cursor-pointer text-xs flex items-center gap-1 hover:text-primary transition-colors font-semibold"
            >
              {rightPanelHidden ? 'Show SidePanel' : 'Hide SidePanel'}
            </button>
          </div>
        </header>

        {/* Workspace switch viewport */}
        <main className="flex-1 overflow-y-auto min-w-0 relative">
          {workspaceTab === 'dashboard' && (
            <DashboardView blogs={blogs} onWriteClick={() => setWorkspaceTab('editor')} />
          )}

          {workspaceTab === 'blogs' && (
            <BlogListView blogs={blogs} onEdit={handleEditOpen} onDelete={handleDelete} onToggleFeatured={toggleFeaturedStatus} />
          )}

          {workspaceTab === 'ghostwriter' && (
            <GhostwriterView loading={loading} onGenerate={handleAiGenerate} />
          )}

          {workspaceTab === 'editor' && (
            <div id="editor-preview-container" className="flex h-full min-w-0">
              <div style={{ width: `${editorSplitRatio}%` }} className="h-full flex flex-col min-w-0">
                <EditorCanvas
                  blogForm={blogForm} setBlogForm={setBlogForm}
                  selectedFont={selectedFont} setSelectedFont={setSelectedFont}
                  selectedSize={selectedSize} setSelectedSize={setSelectedSize}
                  lineHeight={lineHeight} setLineHeight={setLineHeight}
                  letterSpacing={letterSpacing} setLetterSpacing={setLetterSpacing}
                  textAlign={textAlign} setTextAlign={setTextAlign}
                  editorMode={editorMode} setEditorMode={setEditorMode}
                  historyIndex={historyIndex} history={history}
                  handleUndo={() => {}} handleRedo={() => {}}
                  insertMarkdown={insertMarkdown} handleTitleChange={handleTitleChange}
                  isDirty={isDirty} onImageFileSelect={handleMediaUpload}
                />
              </div>

              {editorMode === 'split' && (
                <div 
                  onMouseDown={handleSplitDrag}
                  onDoubleClick={() => setEditorSplitRatio(50)}
                  className="w-1 bg-slate-200 hover:bg-primary/50 dark:bg-slate-900 dark:hover:bg-primary/50 cursor-col-resize transition-all duration-150 relative flex items-center justify-center flex-shrink-0 z-30"
                />
              )}

              <div style={{ width: `${100 - editorSplitRatio}%` }} className="h-full flex flex-col min-w-0">
                <EditorPreview blogForm={blogForm} editorMode={editorMode} textAlign={textAlign} />
              </div>
            </div>
          )}

          {workspaceTab === 'media' && (
            <MediaLibraryView
              mediaItems={mediaItems} mediaSearch={mediaSearch} setMediaSearch={setMediaSearch}
              onUpload={handleMediaUpload} selectedMediaItem={selectedMediaItem} setSelectedMediaItem={setSelectedMediaItem}
              cropRotation={cropRotation} setCropRotation={setCropRotation}
              onInsert={(item) => {
                insertMarkdown(`\n![${item.name}](${item.url})\n`);
                setSelectedMediaItem(null);
                setWorkspaceTab('editor');
              }}
            />
          )}

          {workspaceTab === 'categories' && (
            <CategoriesManagerView 
              categories={categories} newCategoryName={newCategoryName} setNewCategoryName={setNewCategoryName}
              onAddCategory={() => {
                if (newCategoryName.trim()) {
                  setCategories([...categories, newCategoryName.trim()]);
                  setNewCategoryName('');
                }
              }}
              onDeleteCategory={(cat) => setCategories(categories.filter(c => c !== cat))}
            />
          )}

          {workspaceTab === 'tags' && (
            <TagsManagerView tagsDatabase={tagsDatabase} onDeleteTag={(tag) => setTagsDatabase(tagsDatabase.filter(t => t.name !== tag))} />
          )}
        </main>
      </div>

      {/* Right panel resizer handle */}
      {workspaceTab === 'editor' && !rightPanelHidden && (
        <div 
          onMouseDown={handleRightPanelDrag}
          onDoubleClick={() => setRightPanelWidth(320)}
          className="w-1 bg-slate-200 hover:bg-primary/50 dark:bg-slate-900 dark:hover:bg-primary/50 cursor-col-resize transition-all duration-150 relative flex items-center justify-center flex-shrink-0 z-30"
        />
      )}

      {/* ─── RIGHT SETTINGS PANEL ─── */}
      {workspaceTab === 'editor' && (
        <aside 
          style={{ width: rightPanelHidden ? 0 : rightPanelWidth, minWidth: rightPanelHidden ? 0 : 250 }}
          className={`bg-white dark:bg-slate-950 overflow-y-auto overflow-x-hidden transition-all duration-75 ${
            rightPanelHidden ? 'w-0 p-0 border-l-0' : 'border-l border-slate-200 dark:border-slate-900 p-5'
          }`}
        >
          <EditorSettingsSidebar
            blogForm={blogForm} setBlogForm={setBlogForm}
            categories={categories} tagInput={tagInput} setTagInput={setTagInput}
            onAddTag={handleAddTag} onRemoveTag={(tag) => setBlogForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))}
            tagsDatabase={tagsDatabase} seoScore={calculateSeoScore()}
            getKeywordDensity={() => {
              const occurrences = blogForm.content.toLowerCase().split(blogForm.focusKeyword.toLowerCase()).length - 1;
              const words = blogForm.content.trim().split(/\s+/).filter(Boolean).length;
              return words > 0 ? `${((occurrences / words) * 100).toFixed(1)}%` : '0.0%';
            }}
            stats={getStatistics()}
          />
        </aside>
      )}

    </div>
  );
};
