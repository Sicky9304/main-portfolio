import React from 'react';
import { 
  Undo, Redo, Bold, Italic, Strikethrough, 
  List, ListOrdered, CheckSquare, Quote,
  AlignLeft, AlignCenter, AlignRight, AlignJustify
} from 'lucide-react';

export const EditorCanvas = ({
  blogForm,
  setBlogForm,
  selectedFont,
  setSelectedFont,
  selectedSize,
  setSelectedSize,
  lineHeight,
  setLineHeight,
  letterSpacing,
  setLetterSpacing,
  textAlign,
  setTextAlign,
  editorMode,
  setEditorMode,
  historyIndex,
  history,
  handleUndo,
  handleRedo,
  insertMarkdown,
  handleTitleChange,
  isDirty,
  onImageFileSelect
}) => {

  const handleTextareaChange = (e) => {
    setBlogForm(prev => ({ ...prev, content: e.target.value }));
  };

  return (
    <div className={`flex-grow flex flex-col min-w-0 border-r border-slate-200 dark:border-slate-900 ${editorMode === 'preview' ? 'hidden' : 'flex'}`}>
      
      {/* Sticky Formatting Toolbar */}
      <div className="p-2 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-900 flex flex-wrap gap-1 sticky top-0 z-30 justify-between items-center select-none">
        <div className="flex flex-wrap gap-0.5 items-center">
          
          {/* History */}
          <button 
            onClick={handleUndo} 
            disabled={historyIndex <= 0}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-slate-500 hover:text-slate-850 cursor-pointer disabled:opacity-30"
            title="Undo"
          >
            <Undo size={13} />
          </button>
          <button 
            onClick={handleRedo} 
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-slate-500 hover:text-slate-850 cursor-pointer disabled:opacity-30"
            title="Redo"
          >
            <Redo size={13} />
          </button>
          
          <span className="w-px h-5 bg-slate-200 dark:bg-slate-850 mx-1.5"></span>

          {/* Font selector */}
          <select 
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
            className="text-[10px] bg-slate-100 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded px-1.5 py-1 focus:outline-none cursor-pointer text-slate-700 dark:text-slate-300"
          >
            {['Inter', 'Poppins', 'Roboto', 'Montserrat', 'Playfair Display', 'Merriweather', 'JetBrains Mono'].map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>

          <span className="w-px h-5 bg-slate-200 dark:bg-slate-850 mx-1.5"></span>

          {/* Markdown wraps */}
          {['H1', 'H2', 'H3'].map((h, i) => (
            <button 
              key={h}
              onClick={() => insertMarkdown('#'.repeat(i + 1) + ' ')}
              className="px-2 py-1 text-[10px] font-extrabold hover:bg-slate-100 dark:hover:bg-slate-900 rounded cursor-pointer"
            >
              {h}
            </button>
          ))}

          <span className="w-px h-5 bg-slate-200 dark:bg-slate-850 mx-1.5"></span>

          <button 
            onClick={() => insertMarkdown('**', '**')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded text-slate-500 hover:text-slate-850 cursor-pointer"
            title="Bold"
          >
            <Bold size={13} />
          </button>
          <button 
            onClick={() => insertMarkdown('*', '*')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded text-slate-500 hover:text-slate-850 cursor-pointer"
            title="Italic"
          >
            <Italic size={13} />
          </button>
          <button 
            onClick={() => insertMarkdown('~~', '~~')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded text-slate-500 hover:text-slate-850 cursor-pointer"
            title="Strikethrough"
          >
            <Strikethrough size={13} />
          </button>
          <button 
            onClick={() => insertMarkdown('==', '==')}
            className="px-1.5 py-0.5 text-[9px] border border-yellow-500/25 bg-yellow-500/10 text-yellow-550 hover:bg-yellow-500/20 rounded cursor-pointer"
            title="Highlight"
          >
            Highlight
          </button>
          
          <span className="w-px h-5 bg-slate-200 dark:bg-slate-850 mx-1.5"></span>

          <button 
            onClick={() => insertMarkdown('* ')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded text-slate-500 hover:text-slate-850 cursor-pointer"
            title="Bullet list"
          >
            <List size={13} />
          </button>
          <button 
            onClick={() => insertMarkdown('1. ')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded text-slate-500 hover:text-slate-850 cursor-pointer"
            title="Ordered list"
          >
            <ListOrdered size={13} />
          </button>
          <button 
            onClick={() => insertMarkdown('- [ ] ')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded text-slate-500 hover:text-slate-850 cursor-pointer"
            title="Task list"
          >
            <CheckSquare size={13} />
          </button>
          <button 
            onClick={() => insertMarkdown('> ')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded text-slate-500 hover:text-slate-850 cursor-pointer"
            title="Quote"
          >
            <Quote size={13} />
          </button>
          
          <span className="w-px h-5 bg-slate-200 dark:bg-slate-850 mx-1.5"></span>

          {/* Alignment Controls */}
          <button 
            onClick={() => setTextAlign('text-left')}
            className={`p-1.5 rounded cursor-pointer ${
              textAlign === 'text-left' 
                ? 'bg-slate-100 dark:bg-slate-900 text-primary border border-slate-250 dark:border-slate-800' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-850'
            }`}
            title="Align Left"
          >
            <AlignLeft size={13} />
          </button>
          <button 
            onClick={() => setTextAlign('text-center')}
            className={`p-1.5 rounded cursor-pointer ${
              textAlign === 'text-center' 
                ? 'bg-slate-100 dark:bg-slate-900 text-primary border border-slate-250 dark:border-slate-800' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-850'
            }`}
            title="Align Center"
          >
            <AlignCenter size={13} />
          </button>
          <button 
            onClick={() => setTextAlign('text-right')}
            className={`p-1.5 rounded cursor-pointer ${
              textAlign === 'text-right' 
                ? 'bg-slate-100 dark:bg-slate-900 text-primary border border-slate-250 dark:border-slate-800' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-850'
            }`}
            title="Align Right"
          >
            <AlignRight size={13} />
          </button>
          <button 
            onClick={() => setTextAlign('text-justify')}
            className={`p-1.5 rounded cursor-pointer ${
              textAlign === 'text-justify' 
                ? 'bg-slate-100 dark:bg-slate-900 text-primary border border-slate-250 dark:border-slate-800' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-850'
            }`}
            title="Justify Content"
          >
            <AlignJustify size={13} />
          </button>
          
          <span className="w-px h-5 bg-slate-200 dark:bg-slate-850 mx-1.5"></span>

          <button 
            onClick={() => insertMarkdown('\`', '\`')}
            className="px-1.5 py-0.5 text-[9px] bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-350 font-mono rounded border border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            code
          </button>
          <button 
            onClick={() => insertMarkdown('\n\`\`\`javascript\n', '\n\`\`\`\n')}
            className="px-1.5 py-0.5 text-[9px] bg-slate-900 text-cyan-400 font-mono rounded border border-slate-800 cursor-pointer ml-0.5"
          >
            BlockCode
          </button>
          <button 
            onClick={() => insertMarkdown('\n| Column 1 | Column 2 |\n|---|---|\n| Cell 1 | Cell 2 |\n')}
            className="px-1.5 py-0.5 text-[9px] hover:bg-slate-100 dark:hover:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 cursor-pointer ml-0.5"
          >
            Table
          </button>

          <select 
            onChange={(e) => {
              if (e.target.value) {
                insertMarkdown(e.target.value);
                e.target.value = '';
              }
            }}
            className="text-[10px] bg-slate-100 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded px-1 ml-1 cursor-pointer focus:outline-none"
          >
            <option value="">Callouts</option>
            <option value="\n> [!NOTE]\n> Info description text here\n">Info Box</option>
            <option value="\n> [!WARNING]\n> Warning details write here\n">Warning Box</option>
            <option value="\n> [!IMPORTANT]\n> Critical success check here\n">Success Box</option>
          </select>
        </div>

        {/* Editor Screen Split Mode */}
        <div className="flex gap-0.5 items-center">
          {['write', 'split', 'preview'].map(m => (
            <button 
              key={m}
              onClick={() => setEditorMode(m)} 
              className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase cursor-pointer ${
                editorMode === m ? 'bg-primary text-white font-extrabold' : 'hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Meta Input Section */}
      <div className="px-8 pt-6 pb-4 bg-white dark:bg-slate-950/80 border-b border-slate-100 dark:border-slate-900 text-left space-y-3 select-text">
        <input 
          type="text" 
          placeholder="Enter Blog Post Title..."
          value={blogForm.title}
          onChange={handleTitleChange}
          className="w-full text-xl sm:text-2xl font-black font-heading bg-transparent border-none focus:outline-none placeholder-slate-350 dark:placeholder-slate-800 text-slate-900 dark:text-white"
        />
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Slug URL path (e.g. server-components-nextjs)"
            value={blogForm.slug}
            onChange={(e) => {
              setBlogForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }));
            }}
            className="text-[11px] font-mono bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-400 focus:outline-none w-1/2"
          />
          <input 
            type="text" 
            placeholder="Thumbnail cover URL path..."
            value={blogForm.thumbnail}
            onChange={(e) => {
              setBlogForm(prev => ({ ...prev, thumbnail: e.target.value }));
            }}
            className="text-[11px] font-mono bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-400 focus:outline-none w-1/2"
          />
        </div>
      </div>

      {/* Custom Writing Textarea Area */}
      <div className="flex-grow relative w-full h-full">
        <textarea
          id="editor-canvas"
          value={blogForm.content}
          onChange={handleTextareaChange}
          style={{ fontFamily: selectedFont }}
          className={`absolute inset-0 w-full h-full p-8 resize-none focus:outline-none border-none text-slate-800 dark:text-slate-200 select-text overflow-y-auto custom-scrollbar ${selectedSize} ${lineHeight} ${letterSpacing} ${textAlign}`}
          placeholder="Tell your story... Use Markdown syntax or the formatting toolbar."
        />
      </div>

    </div>
  );
};
