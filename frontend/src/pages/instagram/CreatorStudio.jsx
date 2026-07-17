import { useState, useEffect, useCallback, memo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, X, Loader2, Send, Hash, ImagePlus, CheckCircle, FileText, Trash2, Globe, Sparkles
} from 'lucide-react';
import { RevealOnScroll } from '../../components/ui/Animations';

const getApiBase = () => {
  if (import.meta.env.DEV) {
    return '/api';
  }
  const url = import.meta.env.VITE_API_URL || '';
  if (url.endsWith('/api')) return url;
  return url ? `${url}/api` : '/api';
};
const API_BASE = getApiBase();

export const PublishForm = memo(({ onSuccess, passcode, profile }) => {
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
  const [generatingCaption, setGeneratingCaption] = useState(false);

  // Post Scheduling State
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [imageFit, setImageFit] = useState('cover'); // 'cover' | 'contain'

  // Tagging & Collaborators State
  const [tagInput, setTagInput] = useState('');
  const [collaboratorInput, setCollaboratorInput] = useState('');
  const [locationInput, setLocationInput] = useState('');

  // Auto-Suggestions Trays
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [showCollabSuggestions, setShowCollabSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  // Dynamic user data suggestions with localStorage backup
  const [suggestedTags, setSuggestedTags] = useState(() => {
    const saved = localStorage.getItem('ig_suggested_tags');
    const defaults = ['sickykumar', 'reactjs', 'nextjs', 'github', 'googledevs'];
    return saved ? JSON.parse(saved) : defaults;
  });

  const [suggestedLocations, setSuggestedLocations] = useState(() => {
    const saved = localStorage.getItem('ig_suggested_locations');
    const defaults = ['Mumbai, India', 'Bengaluru, India', 'Developer Desk 💻', 'Home 🏠', 'Road Trip 🚗'];
    return saved ? JSON.parse(saved) : defaults;
  });

  useEffect(() => {
    localStorage.setItem('ig_suggested_tags', JSON.stringify(suggestedTags));
  }, [suggestedTags]);

  useEffect(() => {
    localStorage.setItem('ig_suggested_locations', JSON.stringify(suggestedLocations));
  }, [suggestedLocations]);

  // Live Map search suggestions from OpenStreetMap Nominatim
  const [mapLocations, setMapLocations] = useState([]);
  const [searchingMap, setSearchingMap] = useState(false);

  useEffect(() => {
    const clean = locationInput.trim();
    if (clean.length < 3) {
      setMapLocations([]);
      return;
    }

    setSearchingMap(true);
    const delay = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(clean)}&limit=5`, {
          headers: { 'User-Agent': 'SickyMernPortfolio/1.0' }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          const formatted = data.map(item => {
            const parts = item.display_name.split(',');
            if (parts.length > 2) {
              return parts.slice(0, 2).join(',').trim();
            }
            return item.display_name;
          });
          setMapLocations(Array.from(new Set(formatted)));
        }
      } catch (err) {
        console.error("OSM Nominatim fetch error:", err);
      } finally {
        setSearchingMap(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [locationInput]);

  useEffect(() => {
    if (!passcode) return;
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`${API_BASE}/instagram/suggestions`, {
          headers: { 'x-admin-token': passcode }
        });
        const data = await res.json();
        if (data.success) {
          // Merge fetched API suggestions with local suggestions to avoid duplicates
          if (data.tags?.length > 0) {
            setSuggestedTags(prev => Array.from(new Set([...prev, ...data.tags])));
          }
          if (data.locations?.length > 0) {
            setSuggestedLocations(prev => Array.from(new Set([...prev, ...data.locations])));
          }
        }
      } catch (err) {
        console.error("Failed to load user autocomplete suggestions:", err);
      }
    };
    fetchSuggestions();
  }, [passcode]);

  // Refs for tracking clicks outside autocomplete containers
  const locationRef = useRef(null);
  const tagRef = useRef(null);
  const collabRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationSuggestions(false);
      }
      if (tagRef.current && !tagRef.current.contains(event.target)) {
        setShowTagSuggestions(false);
      }
      if (collabRef.current && !collabRef.current.contains(event.target)) {
        setShowCollabSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Suggestions search & auto-fill helpers
  const getActiveSearchTerm = (input) => {
    if (!input) return '';
    const parts = input.split(',');
    const lastPart = parts[parts.length - 1].trim();
    return lastPart.replace(/^@/, '').toLowerCase();
  };

  const tagSuggestionsPool = suggestedTags;
  const activeTagSearch = getActiveSearchTerm(tagInput);
  const filteredTagSuggestions = activeTagSearch 
    ? tagSuggestionsPool.filter(acc => acc.toLowerCase().includes(activeTagSearch))
    : tagSuggestionsPool;

  const handleSelectTag = (acc) => {
    const parts = tagInput.split(',').map(x => x.trim()).filter(Boolean);
    if (parts.length > 0) {
      parts[parts.length - 1] = acc;
    } else {
      parts.push(acc);
    }
    setTagInput(parts.join(', ') + ', ');
  };

  const activeCollabSearch = getActiveSearchTerm(collaboratorInput);
  const filteredCollabSuggestions = activeCollabSearch 
    ? tagSuggestionsPool.filter(acc => acc.toLowerCase().includes(activeCollabSearch))
    : tagSuggestionsPool;

  const handleSelectCollab = (acc) => {
    const parts = collaboratorInput.split(',').map(x => x.trim()).filter(Boolean);
    if (parts.length > 0) {
      parts[parts.length - 1] = acc;
    } else {
      parts.push(acc);
    }
    setCollaboratorInput(parts.join(', ') + ', ');
  };

  const locSuggestionsPool = suggestedLocations;
  const filteredLocSuggestions = locationInput.trim()
    ? locSuggestionsPool.filter(loc => loc.toLowerCase().includes(locationInput.toLowerCase()))
    : locSuggestionsPool;

  const triggerAutoCaption = async (mediaUrl, type) => {
    if (postType === 'STORY') return;
    setGeneratingCaption(true);
    try {
      const res = await fetch(`${API_BASE}/ai/auto-caption`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaUrl, postType: type })
      });
      const data = await res.json();
      if (data.success && data.text) {
        setCaption(data.text);
      }
    } catch (err) {
      console.error("AI auto-captioning error:", err);
    } finally {
      setGeneratingCaption(false);
    }
  };

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

  const generateAICaptionAndHashtags = async () => {
    if (!aiTopic.trim()) return;
    setGeneratingTags(true);
    setStatus(null);
    try {
      const mediaUrl = postType === 'REELS' ? videoUrl : imageUrl;
      const res = await fetch(`${API_BASE}/ai/auto-caption`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaUrl,
          postType,
          topic: aiTopic
        })
      });
      const data = await res.json();
      if (data.success && data.text) {
        setCaption(data.text);
        setAiTopic('');
        setStatus({ type: 'success', msg: 'AI caption & hashtags generated successfully! ✨' });
      } else {
        throw new Error(data.message || 'Failed to generate');
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', msg: 'AI generation failed: ' + err.message });
    } finally {
      setGeneratingTags(false);
    }
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
          triggerAutoCaption(uploadedUrls[0], 'CAROUSEL');
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
          triggerAutoCaption(data.url, 'REELS');
        } else {
          setImageUrl(data.url);
          triggerAutoCaption(data.url, 'IMAGE');
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

    const userTags = tagInput ? tagInput.split(',').map(username => ({
      username: username.trim(),
      x: 0.5,
      y: 0.5
    })).filter(t => t.username.length > 0) : undefined;

    const collaborators = collaboratorInput ? collaboratorInput.split(',').map(u => u.trim()).filter(u => u.length > 0) : undefined;
    const location = locationInput ? locationInput.trim() : undefined;

    const isScheduledPost = actionType === 'DRAFT' && isScheduling && scheduledDate;
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
          imageUrl: postType === 'IMAGE' || (postType === 'STORY' && !videoUrl) ? mediaUrl : undefined,
          videoUrl: postType === 'REELS' || (postType === 'STORY' && videoUrl) ? mediaUrl : undefined,
          mediaUrls: postType === 'CAROUSEL' ? carouselUrls : undefined,
          mediaUrl: postType !== 'CAROUSEL' ? mediaUrl : undefined,
          caption,
          postType,
          scheduledFor: isScheduledPost ? scheduledDate : undefined,
          userTags,
          collaborators,
          location
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
      setIsScheduling(false);
      setScheduledDate('');
      setTagInput('');
      setCollaboratorInput('');
      setLocationInput('');
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
      <div className="glass rounded-[28px] p-6 border border-primary/15 relative overflow-hidden mb-8 max-w-6xl w-full mx-auto">
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
                {/* Native Instagram-Style Post Composer Frame */}
                <div className="glass rounded-[28px] border border-slate-200 dark:border-white/15 overflow-hidden shadow-2xl flex flex-col">
                  
                  {/* Top Header Bar */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 select-none">
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('');
                        setVideoUrl('');
                        setCarouselUrls([]);
                        setCaption('');
                        setPreview(null);
                        setTagInput('');
                        setCollaboratorInput('');
                        setLocationInput('');
                        setIsScheduling(false);
                        setStatus(null);
                      }}
                      className="text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <span className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider">Create new post</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleAction('DRAFT')}
                        disabled={submitting || uploading || (isScheduling && !scheduledDate)}
                        className="text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        {isScheduling ? 'Schedule' : 'Save Draft'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction('PUBLISH')}
                        disabled={submitting || uploading}
                        className="text-sm font-bold text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400 disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        {submitting ? 'Sharing...' : 'Share'}
                      </button>
                    </div>
                  </div>

                  {/* Mode & Post Type Selection Bar */}
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-50/40 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 flex-wrap gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Post Format:</span>
                    <div className="flex bg-slate-100 dark:bg-white/5 p-0.5 rounded-lg border border-slate-200 dark:border-white/10">
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
                          className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                            postType === type ? 'bg-primary text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                          }`}
                        >
                          {type === 'IMAGE' ? 'Post' : type === 'REELS' ? 'Reel' : type === 'CAROUSEL' ? 'Carousel' : 'Story'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dual Column Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px]">
                    
                    {/* Left Column: Visual Media Preview Frame */}
                    <div className="md:col-span-6 bg-slate-100/40 dark:bg-black/30 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/10 min-h-[300px] md:min-h-0 aspect-square md:aspect-auto">
                      {preview ? (
                        <div className="absolute inset-0 p-3 flex flex-col justify-between">
                          <div className="w-full h-full relative overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-900 flex items-center justify-center">
                            {postType === 'REELS' ? (
                              <video src={preview} controls className="w-full h-full object-cover" />
                            ) : (
                              <img src={preview} alt="Preview" className={`w-full h-full transition-all duration-300 ${imageFit === 'cover' ? 'object-cover' : 'object-contain'}`} />
                            )}
                            
                            {/* Native Image Crop/Aspect toggle */}
                            {postType !== 'REELS' && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setImageFit(prev => prev === 'cover' ? 'contain' : 'cover');
                                }}
                                className="absolute bottom-4 right-4 px-2.5 py-1 text-[9px] font-bold rounded-lg bg-black/80 text-white border border-white/10 z-20 cursor-pointer"
                              >
                                {imageFit === 'cover' ? 'Fit Entire' : 'Fill Frame'}
                              </button>
                            )}

                            {postType === 'CAROUSEL' && (
                              <div className="absolute bottom-4 left-4 flex gap-1 bg-black/80 p-1 rounded-lg max-w-[50%] overflow-x-auto z-20">
                                {carouselUrls.map((url, idx) => (
                                  <img
                                    key={idx}
                                    src={url}
                                    alt="thumb"
                                    onClick={() => setPreview(url)}
                                    className={`w-7 h-7 object-cover rounded border cursor-pointer ${preview === url ? 'border-primary' : 'border-transparent'}`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setPreview(null);
                              setImageUrl('');
                              setVideoUrl('');
                              setCarouselUrls([]);
                            }}
                            className="absolute top-5 right-5 w-6 h-6 rounded-full bg-black/80 flex items-center justify-center text-white cursor-pointer hover:bg-black/90 z-20"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : uploading ? (
                        <div className="flex flex-col items-center gap-2 text-slate-500 py-12">
                          <Loader2 size={24} className="animate-spin text-primary" />
                          <span className="text-[10px] font-semibold">Uploading Media...</span>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-6 text-center cursor-pointer w-full h-full hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all select-none">
                          <Upload size={32} className="text-blue-500 mb-3 animate-pulse" />
                          <span className="text-xs font-bold text-slate-800 dark:text-white mb-1">Drag photos and videos here</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {postType === 'IMAGE' && 'JPG, PNG, WebP format'}
                            {postType === 'REELS' && 'Reel Video files'}
                            {postType === 'CAROUSEL' && 'Select multiple images'}
                            {postType === 'STORY' && 'Photo or short video'}
                          </span>
                          <input
                            type="file"
                            multiple={postType === 'CAROUSEL'}
                            accept={postType === 'REELS' ? 'video/*' : postType === 'STORY' ? 'image/*,video/*' : 'image/*'}
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={uploading}
                          />
                        </label>
                      )}
                    </div>

                    {/* Right Column: Native Compose Fields & Meta options */}
                    <div className="md:col-span-6 flex flex-col bg-slate-50/30 dark:bg-white/5">
                      
                      {postType !== 'STORY' ? (
                        <div className="p-4 flex flex-col flex-1 space-y-4">
                          
                          {/* Sicky User Header */}
                          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-white/5">
                            <img
                              src={profile?.profile_picture_url || 'https://www.instagram.com/favicon.ico'}
                              className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-white/20"
                              alt="avatar"
                            />
                            <div className="text-left">
                              <span className="text-xs font-bold text-slate-800 dark:text-white block">@{profile?.username || 'sickykumar'}</span>
                              {locationInput && (
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">📍 {locationInput}</span>
                              )}
                            </div>
                          </div>

                          {/* Borderless Caption Editor */}
                          <div className="flex flex-col flex-1 min-h-[140px]">
                            <textarea
                              value={caption}
                              onChange={(e) => setCaption(e.target.value)}
                              placeholder="Write a caption..."
                              className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none min-h-[120px] leading-relaxed p-0"
                              disabled={generatingCaption || generatingTags}
                            />
                          </div>

                          {/* AI Copilot Prompt Panel */}
                          <div className="bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 rounded-xl space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <Sparkles size={10} className="text-primary" />
                                AI Caption Copilot
                              </span>
                              {generatingTags && (
                                <span className="text-[8px] text-primary animate-pulse">Generating...</span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={aiTopic}
                                onChange={(e) => setAiTopic(e.target.value)}
                                placeholder="Topic seed (e.g. driving road trip)"
                                className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none"
                                disabled={generatingTags}
                              />
                              <button
                                type="button"
                                onClick={generateAICaptionAndHashtags}
                                disabled={generatingTags || !aiTopic.trim()}
                                className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold flex items-center justify-center cursor-pointer disabled:opacity-40"
                              >
                                Write
                              </button>
                            </div>
                          </div>

                          {/* Advanced Native Settings */}
                          <div className="border-t border-slate-200 dark:border-white/5 pt-3 space-y-2.5">
                            {/* Location row */}
                            <div className="relative" ref={locationRef}>
                              <div className="flex items-center justify-between gap-3 bg-slate-100/30 dark:bg-white/5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/5">
                                <span className="text-xs font-semibold text-slate-650 dark:text-slate-300">Add Location</span>
                                <input
                                  type="text"
                                  value={locationInput}
                                  onChange={(e) => setLocationInput(e.target.value)}
                                  onFocus={() => setShowLocationSuggestions(true)}
                                  placeholder="📍 Mumbai, India"
                                  className="bg-transparent border-none text-right text-xs text-slate-800 dark:text-white focus:outline-none placeholder-slate-400 dark:placeholder-slate-600 max-w-[60%] p-0"
                                />
                              </div>
                              
                              <AnimatePresence>
                                {showLocationSuggestions && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="relative mt-1.5 w-full bg-white/40 dark:bg-black/20 border border-slate-200/60 dark:border-white/10 rounded-xl p-2.5 flex flex-col gap-2.5 select-none overflow-hidden"
                                  >
                                    {/* Map Search Section */}
                                    {locationInput.trim().length >= 3 && (
                                      <div className="space-y-1 text-left">
                                        <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                                          <span>📍 Live Map Search</span>
                                          {searchingMap && <span className="animate-spin h-2 w-2 border border-primary border-t-transparent rounded-full" />}
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                          {mapLocations.map((loc) => (
                                            <button
                                              key={loc}
                                              type="button"
                                              onMouseDown={(e) => { e.preventDefault(); setLocationInput(loc); }}
                                              className="px-2 py-1 rounded-lg bg-primary/10 dark:bg-primary/20 hover:bg-primary hover:text-white text-[10px] text-primary dark:text-primary-light transition-all cursor-pointer border border-primary/20 whitespace-nowrap"
                                            >
                                              {loc}
                                            </button>
                                          ))}
                                          {mapLocations.length === 0 && !searchingMap && (
                                            <span className="text-[9px] text-slate-500 italic p-0.5">No map matches found</span>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Saved Locations Section */}
                                    <div className="space-y-1 text-left">
                                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">⭐ Saved Locations</span>
                                      <div className="flex flex-wrap gap-1">
                                        {filteredLocSuggestions.map((loc) => (
                                          <button
                                            key={loc}
                                            type="button"
                                            onMouseDown={(e) => { e.preventDefault(); setLocationInput(loc); }}
                                            className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-[10px] text-slate-600 dark:text-slate-300 transition-all cursor-pointer border border-slate-200/50 dark:border-slate-700/50 whitespace-nowrap"
                                          >
                                            {loc}
                                          </button>
                                        ))}
                                        {filteredLocSuggestions.length === 0 && (
                                          <span className="text-[10px] text-slate-500 p-1">No saved locations match</span>
                                        )}
                                      </div>
                                    </div>

                                    <form 
                                      onSubmit={(e) => {
                                        e.preventDefault();
                                        const val = e.target.customLoc.value.trim();
                                        if (val && !suggestedLocations.includes(val)) {
                                          setSuggestedLocations(prev => [...prev, val]);
                                          setLocationInput(val);
                                          e.target.reset();
                                        }
                                      }} 
                                      className="flex gap-1.5 border-t border-slate-100 dark:border-white/5 pt-2"
                                    >
                                      <input 
                                        name="customLoc" 
                                        type="text" 
                                        placeholder="Add custom location..." 
                                        className="flex-1 px-2.5 py-1 text-[10px] bg-slate-105 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg text-slate-800 dark:text-white focus:outline-none" 
                                      />
                                      <button type="submit" className="px-2.5 py-1 bg-primary text-white text-[10px] font-bold rounded-lg">+</button>
                                    </form>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Tagging row */}
                            <div className="relative" ref={tagRef}>
                              <div className="flex items-center justify-between gap-3 bg-slate-100/30 dark:bg-white/5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/5">
                                <span className="text-xs font-semibold text-slate-650 dark:text-slate-300">Tag People</span>
                                <input
                                  type="text"
                                  value={tagInput}
                                  onChange={(e) => setTagInput(e.target.value)}
                                  onFocus={() => setShowTagSuggestions(true)}
                                  placeholder="e.g. user1, user2"
                                  className="bg-transparent border-none text-right text-xs text-slate-800 dark:text-white focus:outline-none placeholder-slate-400 dark:placeholder-slate-600 max-w-[60%] p-0"
                                />
                              </div>
                              
                              <AnimatePresence>
                                {showTagSuggestions && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="relative mt-1.5 w-full bg-white/40 dark:bg-black/20 border border-slate-200/60 dark:border-white/10 rounded-xl p-2.5 flex flex-col gap-2 select-none overflow-hidden"
                                  >
                                    <div className="flex flex-wrap gap-1">
                                      {filteredTagSuggestions.map((acc) => (
                                        <button
                                          key={acc}
                                          type="button"
                                          onMouseDown={(e) => { e.preventDefault(); handleSelectTag(acc); }}
                                          className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-[10px] text-slate-600 dark:text-slate-300 transition-all cursor-pointer border border-slate-200/50 dark:border-slate-700/50 whitespace-nowrap"
                                        >
                                          @{acc}
                                        </button>
                                      ))}
                                      {filteredTagSuggestions.length === 0 && (
                                        <span className="text-[10px] text-slate-500 p-1">No matching users</span>
                                      )}
                                    </div>
                                    <form 
                                      onSubmit={(e) => {
                                        e.preventDefault();
                                        const val = e.target.customTag.value.trim().replace('@', '');
                                        if (val && !suggestedTags.includes(val)) {
                                          setSuggestedTags(prev => [...prev, val]);
                                          handleSelectTag(val);
                                          e.target.reset();
                                        }
                                      }} 
                                      className="flex gap-1.5 border-t border-slate-100 dark:border-white/5 pt-2"
                                    >
                                      <input 
                                        name="customTag" 
                                        type="text" 
                                        placeholder="Add custom username..." 
                                        className="flex-1 px-2.5 py-1 text-[10px] bg-slate-105 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg text-slate-800 dark:text-white focus:outline-none" 
                                      />
                                      <button type="submit" className="px-2.5 py-1 bg-primary text-white text-[10px] font-bold rounded-lg">+</button>
                                    </form>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Collaborator row */}
                            <div className="relative" ref={collabRef}>
                              <div className="flex items-center justify-between gap-3 bg-slate-100/30 dark:bg-white/5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/5">
                                <span className="text-xs font-semibold text-slate-650 dark:text-slate-300">Collaborator</span>
                                <input
                                  type="text"
                                  value={collaboratorInput}
                                  onChange={(e) => setCollaboratorInput(e.target.value)}
                                  onFocus={() => setShowCollabSuggestions(true)}
                                  placeholder="e.g. partner_account"
                                  className="bg-transparent border-none text-right text-xs text-slate-800 dark:text-white focus:outline-none placeholder-slate-400 dark:placeholder-slate-600 max-w-[60%] p-0"
                                />
                              </div>
                              
                              <AnimatePresence>
                                {showCollabSuggestions && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="relative mt-1.5 w-full bg-white/40 dark:bg-black/20 border border-slate-200/60 dark:border-white/10 rounded-xl p-2.5 flex flex-col gap-2 select-none overflow-hidden"
                                  >
                                    <div className="flex flex-wrap gap-1">
                                      {filteredCollabSuggestions.map((acc) => (
                                        <button
                                          key={acc}
                                          type="button"
                                          onMouseDown={(e) => { e.preventDefault(); handleSelectCollab(acc); }}
                                          className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-[10px] text-slate-600 dark:text-slate-300 transition-all cursor-pointer border border-slate-200/50 dark:border-slate-700/50 whitespace-nowrap"
                                        >
                                          @{acc}
                                        </button>
                                      ))}
                                      {filteredCollabSuggestions.length === 0 && (
                                        <span className="text-[10px] text-slate-500 p-1">No matching users</span>
                                      )}
                                    </div>
                                    <form 
                                      onSubmit={(e) => {
                                        e.preventDefault();
                                        const val = e.target.customCollab.value.trim().replace('@', '');
                                        if (val && !suggestedTags.includes(val)) {
                                          setSuggestedTags(prev => [...prev, val]);
                                          handleSelectCollab(val);
                                          e.target.reset();
                                        }
                                      }} 
                                      className="flex gap-1.5 border-t border-slate-100 dark:border-white/5 pt-2"
                                    >
                                      <input 
                                        name="customCollab" 
                                        type="text" 
                                        placeholder="Add custom username..." 
                                        className="flex-1 px-2.5 py-1 text-[10px] bg-slate-105 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg text-slate-800 dark:text-white focus:outline-none" 
                                      />
                                      <button type="submit" className="px-2.5 py-1 bg-primary text-white text-[10px] font-bold rounded-lg">+</button>
                                    </form>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Schedule Setting */}
                            <div className="bg-slate-100/30 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/5 space-y-2">
                              <label className="flex items-center justify-between cursor-pointer select-none">
                                <span className="text-xs font-semibold text-slate-650 dark:text-slate-300">Schedule Post</span>
                                <input
                                  type="checkbox"
                                  checked={isScheduling}
                                  onChange={(e) => setIsScheduling(e.target.checked)}
                                  className="rounded border-slate-350 dark:border-white/20 bg-white dark:bg-white/5 text-primary focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer"
                                />
                              </label>

                              {isScheduling && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="space-y-1 pt-1.5"
                                >
                                  <input
                                    type="datetime-local"
                                    value={scheduledDate}
                                    onChange={(e) => setScheduledDate(e.target.value)}
                                    required={isScheduling}
                                    className="w-full px-2.5 py-1.5 text-[9px] rounded-lg bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-300 focus:outline-none"
                                  />
                                </motion.div>
                              )}
                            </div>

                          </div>

                        </div>
                      ) : (
                        <div className="p-8 flex flex-col items-center justify-center text-center space-y-3 flex-1">
                          <Globe size={32} className="text-primary/60" />
                          <p className="text-xs font-bold text-slate-850 dark:text-white">Instagram Story Mode</p>
                          <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px]">
                            Stories are shared without captions, tags, or locations directly via the API. Upload your media and hit "Share" to post.
                          </p>
                        </div>
                      )}

                    </div>

                  </div>

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
                          <div className="space-y-1.5">
                            <p className="text-xs text-slate-350 line-clamp-2 leading-relaxed">
                              {draft.caption || '(No caption)'}
                            </p>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-slate-550">
                                Created {new Date(draft.createdAt).toLocaleDateString()}
                              </span>
                              {draft.status === 'scheduled' && (
                                <span className="text-[9.5px] font-semibold text-amber-450 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded w-fit">
                                  ⏰ Scheduled: {new Date(draft.scheduledFor).toLocaleString()}
                                </span>
                              )}
                              {draft.status === 'failed' && (
                                <span className="text-[9.5px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded w-fit" title={draft.errorMessage}>
                                  ⚠ Failed: {draft.errorMessage || 'Unknown error'}
                                </span>
                              )}
                              {draft.status === 'published' && (
                                <span className="text-[9.5px] font-semibold text-green-450 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded w-fit">
                                  ✓ Published
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            {draft.status !== 'published' && (
                              <button
                                onClick={() => publishDraft(draft)}
                                className="flex-1 py-1.5 rounded-lg bg-primary text-white text-[10px] font-bold flex items-center justify-center gap-1"
                              >
                                <Send size={10} />
                                {draft.status === 'scheduled' ? 'Publish Now' : 'Publish'}
                              </button>
                            )}
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
