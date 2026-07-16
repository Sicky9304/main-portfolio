import { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, X, Loader2, Send, Hash, ImagePlus, CheckCircle, FileText, Trash2, Globe
} from 'lucide-react';
import { RevealOnScroll } from '../../components/ui/Animations';

const getApiBase = () => {
  const url = import.meta.env.VITE_API_URL || '';
  if (url.endsWith('/api')) return url;
  return url ? `${url}/api` : '/api';
};
const API_BASE = getApiBase();

export const PublishForm = memo(({ onSuccess, passcode }) => {
  const [activeTab, setActiveTab] = useState('CREATE'); // 'CREATE' | 'DRAFTS'
  const [postType, setPostType] = useState('IMAGE'); // 'IMAGE' | 'REELS' | 'CAROUSEL'
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [carouselUrls, setCarouselUrls] = useState([]);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState(null);

  // Drafts state
  const [drafts, setDrafts] = useState([]);
  const [loadingDrafts, setLoadingDrafts] = useState(false);

  // AI Hashtag State
  const [aiTopic, setAiTopic] = useState('');
  const [generatingTags, setGeneratingTags] = useState(false);

  const fetchDrafts = useCallback(async () => {
    setLoadingDrafts(true);
    try {
      const res = await fetch(`${API_BASE}/instagram/drafts`, {
        headers: { 'x-admin-token': passcode }
      });
      const data = await res.json();
      if (data.success) {
        setDrafts(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load drafts:", err);
    } finally {
      setLoadingDrafts(false);
    }
  }, [passcode]);

  useEffect(() => {
    if (activeTab === 'DRAFTS') {
      fetchDrafts();
    }
  }, [activeTab, fetchDrafts]);

  const generateAIHashtags = () => {
    if (!aiTopic.trim()) return;
    setGeneratingTags(true);
    setTimeout(() => {
      const basicTags = aiTopic.toLowerCase().split(' ').map(word => `#${word.replace(/[^a-z0-9]/g, '')}`).join(' ');
      const devTags = ` #webdevelopment #mernstack #coding #sickykumar #developer #techtools`;
      setCaption(prev => `${prev}\n\n${basicTags}${devTags}`);
      setGeneratingTags(false);
      setAiTopic('');
      setStatus({ type: 'success', msg: 'AI tags appended to caption!' });
    }, 800);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setStatus(null);

    try {
      if (postType === 'CAROUSEL') {
        const uploadedUrls = [];
        for (const file of files) {
          const base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(ev.target.result);
            reader.readAsDataURL(file);
          });
          const res = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-admin-token': passcode
            },
            body: JSON.stringify({ file: base64 }),
          });
          const data = await res.json();
          if (data.success) uploadedUrls.push(data.url);
        }
        setCarouselUrls(prev => [...prev, ...uploadedUrls]);
        if (uploadedUrls.length > 0) {
          setPreview(uploadedUrls[0]);
        }
        setStatus({ type: 'success', msg: `${uploadedUrls.length} image(s) uploaded ✓` });
      } else {
        const file = files[0];
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target.result);
          reader.readAsDataURL(file);
        });
        const res = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-admin-token': passcode
          },
          body: JSON.stringify({ file: base64 }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Upload failed');

        if (postType === 'REELS') {
          setVideoUrl(data.url);
        } else {
          setImageUrl(data.url);
        }
        setPreview(data.url);
        setStatus({ type: 'success', msg: 'Media uploaded successfully ✓' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleAction = async (actionType) => {
    const mediaUrl = postType === 'REELS' ? videoUrl : imageUrl;
    if (postType === 'CAROUSEL' && carouselUrls.length < 2) {
      return setStatus({ type: 'error', msg: 'Add at least 2 images for a Carousel.' });
    }
    if (postType !== 'CAROUSEL' && !mediaUrl) {
      return setStatus({ type: 'error', msg: 'Upload media first.' });
    }
    if (postType !== 'STORY' && !caption.trim()) {
      return setStatus({ type: 'error', msg: 'Caption cannot be empty.' });
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const endpoint = actionType === 'DRAFT' ? '/instagram/drafts' : '/instagram/publish';
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': passcode
        },
        body: JSON.stringify({
          imageUrl: postType === 'IMAGE' ? mediaUrl : undefined,
          videoUrl: postType === 'REELS' ? mediaUrl : undefined,
          mediaUrls: postType === 'CAROUSEL' ? carouselUrls : undefined,
          mediaUrl: postType !== 'CAROUSEL' ? mediaUrl : undefined,
          caption,
          postType
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setStatus({ type: 'success', msg: data.message });
      setImageUrl('');
      setVideoUrl('');
      setCarouselUrls([]);
      setCaption('');
      setPreview(null);
      if (actionType === 'PUBLISH') {
        onSuccess?.();
      }
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const publishDraft = async (draft) => {
    setStatus(null);
    try {
      // 1. Publish to Instagram
      const res = await fetch(`${API_BASE}/instagram/publish`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': passcode
        },
        body: JSON.stringify({
          imageUrl: draft.postType === 'IMAGE' ? draft.mediaUrl : undefined,
          videoUrl: draft.postType === 'REELS' ? draft.mediaUrl : undefined,
          mediaUrls: draft.postType === 'CAROUSEL' ? draft.mediaUrls : undefined,
          caption: draft.caption,
          postType: draft.postType
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      // 2. Remove draft
      await fetch(`${API_BASE}/instagram/drafts/${draft._id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': passcode }
      });

      fetchDrafts();
      onSuccess?.();
      setStatus({ type: 'success', msg: 'Draft successfully published to Instagram! ✓' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    }
  };

  const deleteDraft = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/instagram/drafts/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': passcode }
      });
      const data = await res.json();
      if (data.success) {
        fetchDrafts();
        setStatus({ type: 'success', msg: 'Draft deleted successfully ✓' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    }
  };

  return (
    <RevealOnScroll direction="up">
      <div className="glass rounded-[28px] p-6 border border-primary/15 relative overflow-hidden mb-8 max-w-4xl mx-auto">
        <div className="blob blob-primary w-[150px] h-[150px] -top-10 -right-10 opacity-10 pointer-events-none" />

        <div className="relative z-10 space-y-6">
          
          {/* Main Module Tab Switcher */}
          <div className="flex justify-center gap-4 bg-white/5 p-1 rounded-2xl border border-white/10 max-w-xs mx-auto">
            <button
              onClick={() => { setActiveTab('CREATE'); setStatus(null); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'CREATE' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImagePlus size={14} />
              Create Post
            </button>
            <button
              onClick={() => { setActiveTab('DRAFTS'); setStatus(null); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'DRAFTS' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText size={14} />
              Drafts ({drafts.length})
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'CREATE' ? (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Publish Creator Studio</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Post directly to Instagram Feed, Reels or Carousel</p>
                  </div>

                  {/* Post Type Selector */}
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 flex-wrap">
                    {['IMAGE', 'REELS', 'CAROUSEL', 'STORY'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setPostType(type);
                          setImageUrl('');
                          setVideoUrl('');
                          setCarouselUrls([]);
                          setPreview(null);
                          setStatus(null);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          postType === type
                            ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {type === 'IMAGE' ? 'Image' : type === 'REELS' ? 'Reel' : type === 'CAROUSEL' ? 'Carousel' : 'Story'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Media Box */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Media Resource {postType === 'CAROUSEL' && `(${carouselUrls.length} Added)`}
                    </label>
                    <label className="flex flex-col items-center justify-center w-full aspect-square rounded-[16px] border-2 border-dashed border-primary/25 hover:border-primary/50 cursor-pointer bg-primary/5 hover:bg-primary/10 transition-all duration-200 relative overflow-hidden">
                      {preview ? (
                        <div className="relative w-full h-full p-2">
                          {postType === 'REELS' ? (
                            <video src={preview} controls className="w-full h-full object-cover rounded-[14px]" />
                          ) : (
                            <div className="w-full h-full">
                              <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-[14px]" />
                              {postType === 'CAROUSEL' && (
                                <div className="absolute bottom-4 left-4 flex gap-1.5 overflow-x-auto max-w-[80%] bg-black/60 p-1 rounded-lg">
                                  {carouselUrls.map((url, idx) => (
                                    <img
                                      key={idx}
                                      src={url}
                                      alt="thumb"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setPreview(url);
                                      }}
                                      className={`w-8 h-8 object-cover rounded border-2 cursor-pointer ${preview === url ? 'border-primary' : 'border-transparent'}`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setPreview(null);
                              setImageUrl('');
                              setVideoUrl('');
                              setCarouselUrls([]);
                            }}
                            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : uploading ? (
                        <div className="flex flex-col items-center gap-2 text-slate-500">
                          <Loader2 size={28} className="animate-spin text-primary" />
                          <span className="text-xs font-medium">Uploading...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-slate-500 text-center p-4">
                          <Upload size={28} className="text-primary/60" />
                          <span className="text-xs font-semibold">Select Files</span>
                          <span className="text-[10px] text-slate-400">
                            {postType === 'IMAGE' && 'JPG, PNG, WebP'}
                            {postType === 'REELS' && 'MP4 / MOV videos'}
                            {postType === 'CAROUSEL' && 'Add multiple images'}
                            {postType === 'STORY' && 'Photo or Video file'}
                          </span>
                        </div>
                      )}
                      <input
                        type="file"
                        multiple={postType === 'CAROUSEL'}
                        accept={postType === 'REELS' ? 'video/*' : postType === 'STORY' ? 'image/*,video/*' : 'image/*'}
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>

                  {/* Caption & AI Generator */}
                  {postType !== 'STORY' ? (
                    <div className="flex flex-col space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          AI Hashtag Generator
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={aiTopic}
                            onChange={(e) => setAiTopic(e.target.value)}
                            placeholder="e.g. Nextjs portfolio website"
                            className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-primary/40"
                          />
                          <button
                            type="button"
                            onClick={generateAIHashtags}
                            disabled={generatingTags || !aiTopic.trim()}
                            className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/25 hover:bg-primary/20 text-xs font-semibold text-primary flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <Hash size={13} />
                            Generate
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Caption
                        </label>
                        <textarea
                          value={caption}
                          onChange={(e) => setCaption(e.target.value)}
                          maxLength={2200}
                          rows={6}
                          placeholder="Write your caption..."
                          className="flex-1 w-full px-4 py-3 rounded-[14px] bg-white/5 border border-white/10 focus:border-primary/40 focus:outline-none text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 resize-none leading-relaxed"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-2xl text-center space-y-2">
                      <Globe size={32} className="text-primary/60" />
                      <p className="text-xs font-bold text-slate-300">Instagram Story Post Mode</p>
                      <p className="text-[10px] text-slate-500 leading-relaxed max-w-[240px]">
                        Captions and hashtags are not supported on Stories via the Meta API. Upload a photo or video to post directly.
                      </p>
                    </div>
                  )}
                </div>

                {status && (
                  <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    <CheckCircle size={14} className={status.type === 'success' ? 'text-green-400' : 'text-red-400'} />
                    {status.msg}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleAction('PUBLISH')}
                    disabled={submitting || uploading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm shadow-lg disabled:opacity-50"
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />}
                    Publish to Instagram
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction('DRAFT')}
                    disabled={submitting || uploading}
                    className="px-6 py-3 rounded-xl bg-white/5 text-xs text-slate-300 border border-white/10 hover:bg-white/10 transition-all font-semibold"
                  >
                    Save to Drafts
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="drafts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {loadingDrafts ? (
                  <div className="flex justify-center py-12">
                    <Loader2 size={28} className="animate-spin text-primary" />
                  </div>
                ) : drafts.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No drafts saved yet. Choose "Save to Drafts" when composing.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {drafts.map((draft) => (
                      <div key={draft._id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 relative">
                          {draft.postType === 'REELS' ? (
                            <video src={draft.mediaUrl} className="w-full h-full object-cover" />
                          ) : (
                            <img src={draft.postType === 'CAROUSEL' ? draft.mediaUrls[0] : draft.mediaUrl} alt="draft" className="w-full h-full object-cover" />
                          )}
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-[8px] font-bold text-white uppercase">
                            {draft.postType}
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col justify-between overflow-hidden">
                          <div className="space-y-1">
                            <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                              {draft.caption}
                            </p>
                            <span className="text-[9px] text-slate-500">
                              Saved {new Date(draft.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => publishDraft(draft)}
                              className="flex-1 py-1.5 rounded-lg bg-primary text-white text-[10px] font-bold flex items-center justify-center gap-1"
                            >
                              <Send size={10} />
                              Publish
                            </button>
                            <button
                              onClick={() => deleteDraft(draft._id)}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {status && (
                  <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    <CheckCircle size={14} className={status.type === 'success' ? 'text-green-400' : 'text-red-400'} />
                    {status.msg}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </RevealOnScroll>
  );
});
