import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink, Image, Video,
  Layers, Clock, RefreshCw, Lock, X, Users
} from 'lucide-react';
import { RevealOnScroll } from '../../components/ui/Animations';
import { PublishForm } from './CreatorStudio';

// ============================================================
// CONSTANTS & HELPERS
// ============================================================
const getApiBase = () => {
  const url = import.meta.env.VITE_API_URL || '';
  if (url.endsWith('/api')) return url;
  return url ? `${url}/api` : '/api';
};
const API_BASE = getApiBase();
const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || 'Sicky9304@';

// Session-persistent cache variables
let clientPostsCache = null;
let clientProfileCache = null;
let clientNextCursor = null;

function timeAgo(timestamp) {
  const diff = (Date.now() - new Date(timestamp)) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const InstaIcon = ({ size = 24, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

// ============================================================
// SKELETON LOADER
// ============================================================
const SkeletonCard = memo(() => (
  <div className="glass rounded-[20px] overflow-hidden animate-pulse">
    <div className="w-full aspect-square bg-white/10" />
    <div className="p-4 space-y-2">
      <div className="h-3 bg-white/10 rounded-full w-3/4" />
      <div className="h-3 bg-white/10 rounded-full w-1/2" />
      <div className="flex gap-3 mt-3">
        <div className="h-3 bg-white/10 rounded-full w-12" />
        <div className="h-3 bg-white/10 rounded-full w-12" />
      </div>
    </div>
  </div>
));

// ============================================================
// SINGLE POST CARD
// ============================================================
const PostCard = memo(({ post, index }) => {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(err => {
          console.warn("Video playback failed:", err);
        });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="glass rounded-[20px] overflow-hidden border border-transparent hover:border-primary/20 transition-all duration-300 group"
    >
      <div className="relative w-full aspect-square overflow-hidden bg-white/5">
        {post.mediaType === 'VIDEO' ? (
          <video
            ref={videoRef}
            src={post.mediaUrl}
            poster={post.thumbnailUrl}
            className="w-full h-full object-cover transition-transform duration-500"
            muted={!isHovered}
            loop
            playsInline
            style={{ transform: isHovered ? 'scale(1.06)' : 'scale(1)' }}
          />
        ) : !imgError ? (
          <motion.img
            src={post.mediaUrl}
            alt={post.caption || 'Instagram Post'}
            loading="lazy"
            onError={() => setImgError(true)}
            animate={{ scale: isHovered ? 1.06 : 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
            <Image size={32} />
            <span className="text-xs">Preview unavailable</span>
          </div>
        )}

        <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-semibold backdrop-blur-sm">
          {post.mediaType === 'VIDEO' ? <Video size={11} /> : post.mediaType === 'CAROUSEL_ALBUM' ? <Layers size={11} /> : <Image size={11} />}
          {post.mediaType === 'CAROUSEL_ALBUM' ? 'Album' : post.mediaType === 'VIDEO' ? 'Video' : 'Photo'}
        </span>
      </div>

      <div className="p-4">
        {post.caption && (
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3 line-clamp-2">
            {post.caption}
          </p>
        )}
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-600">
            <Clock size={10} />
            {timeAgo(post.timestamp)}
          </span>
        </div>
        <a
          href={post.permalink}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-3 flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border border-primary/10 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all duration-200"
        >
          <ExternalLink size={12} />
          View on Instagram
        </a>
      </div>
    </motion.article>
  );
});

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================
export default function InstagramPage() {
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Admin access gate states
  const [showAdminGate, setShowAdminGate] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [passcodeError, setPasscodeError] = useState('');

  const fetchPosts = useCallback(async (isRefresh = false) => {
    // If not a manual refresh and we have cached data, use it directly
    if (!isRefresh && clientPostsCache) {
      setPosts(clientPostsCache);
      setProfile(clientProfileCache);
      setNextCursor(clientNextCursor);
      setLoading(false);
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
      // Invalidate cache on manual refresh
      clientPostsCache = null;
      clientProfileCache = null;
      clientNextCursor = null;
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/instagram/posts?limit=15`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      
      const newPosts = data.data || [];
      const newCursor = data.paging?.cursors?.after || null;
      
      setPosts(newPosts);
      setNextCursor(newCursor);

      // Save to cache
      clientPostsCache = newPosts;
      clientNextCursor = newCursor;

      const profRes = await fetch(`${API_BASE}/instagram/profile`);
      const profData = await profRes.json();
      if (profData.success) {
        setProfile(profData.data);
        clientProfileCache = profData.data;
      }
    } catch (err) {
      setError(err.message || 'Failed to load Instagram posts.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadMorePosts = useCallback(async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);

    try {
      const res = await fetch(`${API_BASE}/instagram/posts?limit=15&after=${nextCursor}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      
      const newItems = data.data || [];
      const updatedCursor = data.paging?.cursors?.after || null;
      
      setPosts(prev => {
        const updatedPosts = [...prev, ...newItems];
        clientPostsCache = updatedPosts;
        return updatedPosts;
      });
      
      setNextCursor(updatedCursor);
      clientNextCursor = updatedCursor;
    } catch (err) {
      console.error("Failed to load more posts:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [nextCursor, loadingMore]);

  const sentinelRef = useRef(null);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Observer to trigger infinite scrolling
  useEffect(() => {
    if (loading || !nextCursor) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [loading, nextCursor, loadingMore, loadMorePosts]);

  const handlePasscode = () => {
    if (passcode === ADMIN_PASSCODE) {
      setIsAdmin(true);
      setShowAdminGate(false);
      setPasscodeError('');
    } else {
      setPasscodeError('Incorrect passcode.');
    }
  };

  return (
    <main className="relative min-h-screen bg-surface-light dark:bg-surface-dark overflow-hidden">
      <title>Creator Studio — Sicky Kumar</title>
      
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob blob-primary w-[500px] h-[500px] -top-32 -right-32 opacity-20" />
        <div className="blob blob-secondary w-[400px] h-[400px] bottom-0 -left-20 opacity-15" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 pt-32">
        
        {/* Profile Card Summary */}
        {profile && (
          <RevealOnScroll direction="up">
            <div className="glass rounded-[28px] p-5 mb-8 border border-primary/10 flex items-center justify-between max-w-lg mx-auto">
              <div className="flex items-center gap-4">
                <img src={profile.profile_picture_url || 'https://www.instagram.com/favicon.ico'} className="w-14 h-14 rounded-full object-cover border-2 border-primary" alt="ig_pfp" />
                <div>
                  <p className="text-sm font-bold text-white">@{profile.username}</p>
                  <p className="text-xs text-slate-400">{profile.biography}</p>
                </div>
              </div>
              <div className="text-right text-xs text-slate-400 space-y-1">
                {profile.followers_count > 0 && (
                  <p className="flex items-center gap-1 justify-end"><Users size={12} /> {profile.followers_count} Followers</p>
                )}
                {profile.media_count > 0 && <p>📸 {profile.media_count} Posts</p>}
              </div>
            </div>
          </RevealOnScroll>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mx-auto mb-6 w-20 h-20 rounded-3xl glass flex items-center justify-center shadow-lg">
            <InstaIcon size={38} className="text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Instagram <span className="gradient-text">Creator Feed</span>
          </h1>
          <p className="mx-auto max-w-2xl text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
            Latest posts &amp; reels directly connected with Instagram Live API.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={() => fetchPosts(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-semibold text-slate-300 hover:border-primary/20 transition-all duration-200"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing…' : 'Refresh Feed'}
            </button>
            {!isAdmin ? (
              <button
                type="button"
                onClick={() => setShowAdminGate(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-semibold text-slate-300 hover:border-primary/30 transition-all"
              >
                <Lock size={14} />
                Access Creator Studio
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAdmin(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all"
              >
                <X size={14} />
                Exit Creator Studio
              </button>
            )}
          </div>
        </motion.div>

        {/* Creator Studio Form */}
        {isAdmin && <PublishForm onSuccess={() => fetchPosts(true)} passcode={passcode} />}

        {/* Main Grid */}
        {!error ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {loading
                ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
                : posts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)
              }
            </div>

            {/* Infinite Scroll Loading Sentinel / Status */}
            {nextCursor && !loading ? (
              <div ref={sentinelRef} className="flex justify-center py-8">
                {loadingMore && (
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <RefreshCw size={14} className="animate-spin text-primary" />
                    Loading More...
                  </div>
                )}
              </div>
            ) : !loading && posts.length > 0 ? (
              <div className="flex justify-center py-8">
                <p className="text-xs font-semibold text-slate-500/80 dark:text-slate-450/60">
                  You've caught up with all posts!
                </p>
              </div>
            ) : null}
          </>
        ) : (
          <div className="text-center py-12 glass rounded-2xl max-w-md mx-auto border border-red-500/20">
            <p className="text-red-400 text-sm font-semibold mb-2">Error Loading Feed</p>
            <p className="text-slate-400 text-xs px-4">{error}</p>
          </div>
        )}

        {/* Passcode Gate Dialog */}
        <AnimatePresence>
          {showAdminGate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="glass rounded-[24px] p-6 w-full max-w-sm border border-primary/20">
                <h3 className="text-sm font-bold text-white text-center mb-4">Passcode Required</h3>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white mb-3"
                  placeholder="Enter Admin passcode"
                />
                {passcodeError && <p className="text-xs text-red-500 mb-3">{passcodeError}</p>}
                <div className="flex gap-2">
                  <button onClick={handlePasscode} className="flex-1 py-2 rounded-xl bg-primary text-xs font-bold text-white">Verify</button>
                  <button onClick={() => setShowAdminGate(false)} className="flex-1 py-2 rounded-xl bg-white/5 text-xs text-slate-300 border border-white/10">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
