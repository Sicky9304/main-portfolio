import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import {
  Upload, X, Loader2, Send, Hash, BarChart3, Play, Heart, ImagePlus, CheckCircle
} from 'lucide-react';
import { RevealOnScroll } from '../../components/ui/Animations';

const getApiBase = () => {
  const url = import.meta.env.VITE_API_URL || '';
  if (url.endsWith('/api')) return url;
  return url ? `${url}/api` : '/api';
};
const API_BASE = getApiBase();
const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || 'Sicky9304@';

// ============================================================
// PUBLISH CREATOR STUDIO FORM (CAROUSEL + REELS)
// ============================================================
export const PublishForm = memo(({ onSuccess }) => {
  const [postType, setPostType] = useState('IMAGE'); // 'IMAGE' | 'REELS' | 'CAROUSEL'
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [carouselUrls, setCarouselUrls] = useState([]);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState(null);

  // AI Hashtag State
  const [aiTopic, setAiTopic] = useState('');
  const [generatingTags, setGeneratingTags] = useState(false);

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
    }, 1000);
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
            headers: { 'Content-Type': 'application/json', 'x-admin-passcode': ADMIN_PASSCODE },
            body: JSON.stringify({ file: base64 }),
          });
          const data = await res.json();
          if (data.success) uploadedUrls.push(data.url);
        }
        setCarouselUrls(prev => [...prev, ...uploadedUrls]);
        setPreview(uploadedUrls[0]);
        setStatus({ type: 'success', msg: `${uploadedUrls.length} image(s) added to Carousel ✓` });
      } else {
        const file = files[0];
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target.result);
          reader.readAsDataURL(file);
        });
        const res = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-passcode': ADMIN_PASSCODE },
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

  const handlePublish = async () => {
    const mediaUrl = postType === 'REELS' ? videoUrl : imageUrl;
    if (postType === 'CAROUSEL' && carouselUrls.length < 2) {
      return setStatus({ type: 'error', msg: 'Add at least 2 images for a Carousel.' });
    }
    if (postType !== 'CAROUSEL' && !mediaUrl) {
      return setStatus({ type: 'error', msg: 'Upload media first.' });
    }
    if (!caption.trim()) return setStatus({ type: 'error', msg: 'Caption cannot be empty.' });

    setPublishing(true);
    setStatus(null);

    try {
      const res = await fetch(`${API_BASE}/instagram/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-passcode': ADMIN_PASSCODE },
        body: JSON.stringify({
          imageUrl: postType === 'IMAGE' ? mediaUrl : undefined,
          videoUrl: postType === 'REELS' ? mediaUrl : undefined,
          mediaUrls: postType === 'CAROUSEL' ? carouselUrls : undefined,
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
      onSuccess?.();
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <RevealOnScroll direction="up">
      <div className="glass rounded-[28px] p-6 border border-primary/15 relative overflow-hidden mb-8">
        <div className="blob blob-primary w-[150px] h-[150px] -top-10 -right-10 opacity-10 pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <ImagePlus size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Publish Creator Studio</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Post directly to Instagram Feed, Reels or Carousel</p>
              </div>
            </div>

            {/* Post Type Selector */}
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 flex-wrap">
              {['IMAGE', 'REELS', 'CAROUSEL'].map((type) => (
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
                  {type === 'IMAGE' ? 'Image' : type === 'REELS' ? 'Reel' : 'Carousel'}
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
                                onClick={() => setPreview(url)}
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
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  multiple={postType === 'CAROUSEL'}
                  accept={postType === 'REELS' ? 'video/*' : 'image/*'}
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Caption & AI Generator */}
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
          </div>

          {status && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              <CheckCircle size={14} className={status.type === 'success' ? 'text-green-400' : 'text-red-400'} />
              {status.msg}
            </div>
          )}

          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing || uploading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm shadow-lg disabled:opacity-50"
          >
            {publishing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Publish to Instagram
          </button>
        </div>
      </div>
    </RevealOnScroll>
  );
});

// ============================================================
// ADMIN INSIGHTS BOARD
// ============================================================
export const InsightsBoard = memo(() => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
    fetch(`${API_BASE}/instagram/posts-insights`, {
      headers: { 'x-admin-passcode': ADMIN_PASSCODE }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setInsights(data.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="glass rounded-[24px] p-6 border border-primary/15 text-center text-xs text-slate-400">Loading metrics...</div>;

  return (
    <RevealOnScroll direction="up">
      <div className="glass rounded-[28px] p-6 border border-primary/15 mb-8 relative overflow-hidden">
        <div className="flex items-center gap-2.5 mb-5">
          <BarChart3 size={18} className="text-primary" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Admin Post Insights Analytics</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {insights.slice(0, 3).map((item, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
              <p className="text-[11px] text-slate-400 truncate">{item.caption || 'No Caption'}</p>
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span className="flex items-center gap-1"><Heart size={11} className="text-rose-500" /> {item.like_count}</span>
                <span className="flex items-center gap-1"><Play size={11} className="text-primary" /> Reach: {item.reach}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RevealOnScroll>
  );
});
