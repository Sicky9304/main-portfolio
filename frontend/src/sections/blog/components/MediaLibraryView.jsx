import React from 'react';
import { Search, Upload, X, RotateCw, Crop, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MediaLibraryView = ({ 
  mediaItems, 
  mediaSearch, 
  setMediaSearch, 
  onUpload, 
  selectedMediaItem, 
  setSelectedMediaItem, 
  cropRotation, 
  setCropRotation, 
  onInsert 
}) => {
  return (
    <div className="p-6 space-y-6 text-left">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="relative w-80">
          <input 
            type="text" 
            placeholder="Search media library..."
            value={mediaSearch}
            onChange={(e) => setMediaSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
        <button 
          onClick={() => document.getElementById('mediaLibraryUploadRef').click()}
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Upload size={14} /> Upload Media
          <input 
            type="file" 
            id="mediaLibraryUploadRef" 
            onChange={onUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </button>
      </div>

      {/* Media gallery grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {mediaItems.filter(item => item.name.toLowerCase().includes(mediaSearch.toLowerCase())).map((item, idx) => (
          <div 
            key={idx} 
            onClick={() => {
              setSelectedMediaItem(item);
              setCropRotation(0);
            }}
            className="group border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden cursor-pointer bg-white dark:bg-slate-900 hover:border-primary/45 transition-colors relative"
          >
            <div className="h-28 bg-slate-950 flex items-center justify-center overflow-hidden">
              <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
            </div>
            <div className="p-2 border-t border-slate-100 dark:border-slate-850">
              <span className="block text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">{item.name}</span>
              <span className="block text-[8px] font-mono text-slate-400 mt-0.5">{item.size} • {item.category}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Media Details / crop-rotate editor overlay */}
      <AnimatePresence>
        {selectedMediaItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-xl glass border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-4 bg-slate-950 border-b border-slate-850 flex justify-between items-center">
                <h4 className="text-sm font-extrabold text-white font-heading truncate max-w-xs">{selectedMediaItem.name}</h4>
                <button 
                  onClick={() => setSelectedMediaItem(null)} 
                  className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="p-6 space-y-6 flex flex-col items-center">
                <div className="h-48 rounded-xl bg-slate-950 overflow-hidden flex items-center justify-center w-full max-w-md border border-slate-900">
                  <img 
                    src={selectedMediaItem.url} 
                    alt={selectedMediaItem.name} 
                    style={{ transform: `rotate(${cropRotation}deg)` }}
                    className="max-h-full max-w-full object-contain transition-transform duration-300" 
                  />
                </div>

                <div className="flex gap-2 w-full justify-center">
                  <button 
                    onClick={() => setCropRotation(prev => (prev + 90) % 360)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:text-primary text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCw size={13} /> Rotate 90°
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedMediaItem(null);
                      alert('WebP Image layout updated and synced!');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Crop size={13} /> Crop & Save
                  </button>
                </div>

                <div className="w-full space-y-3 pt-3 border-t border-slate-850 text-xs text-slate-400 font-mono">
                  <div className="flex justify-between">
                    <span>File URL:</span>
                    <span className="text-slate-200 select-all font-semibold truncate max-w-xs">{selectedMediaItem.url}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="text-slate-200">{selectedMediaItem.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="text-slate-200">1200 x 800 (WebP)</span>
                  </div>
                </div>

                <button 
                  onClick={() => onInsert(selectedMediaItem)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs hover:shadow-lg transition-all cursor-pointer flex justify-center items-center gap-1"
                >
                  <CheckCircle size={14} /> Insert / Reuse image
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
