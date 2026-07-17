import { Router } from 'express';
import axios from 'axios';
import adminAuth from '../middleware/adminAuth.js';
import InstagramDraft from '../models/InstagramDraft.js';
import { publishToInstagram } from '../utils/instagramPublisher.js';

const router = Router();
const IG_BASE_URL = 'https://graph.instagram.com';

// Cache configuration (specifically for the first page)
let firstPageCache = null;
let profileCache = null;
let cacheTimestamp = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

function isCacheValid() {
  return firstPageCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_TTL_MS);
}

// GET /api/instagram/posts
router.get('/posts', async (req, res) => {
  try {
    const after = req.query.after || null;
    const limit = parseInt(req.query.limit) || 15;

    // Use cache only for the first page with default limit (no after cursor)
    if (!after && limit === 15 && isCacheValid()) {
      return res.json({ success: true, data: firstPageCache.data, paging: firstPageCache.paging, cached: true });
    }

    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const userId = process.env.INSTAGRAM_USER_ID;

    if (!accessToken || !userId) {
      return res.status(500).json({
        success: false,
        message: 'Instagram credentials are not configured in .env file.',
      });
    }

    // Only query fields supported by the Instagram Basic Display API
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,location,children{media_url,media_type,thumbnail_url}';
    const params = {
      fields,
      limit,
      access_token: accessToken,
    };
    if (after) {
      params.after = after;
    }

    const response = await axios.get(`${IG_BASE_URL}/${userId}/media`, {
      params,
      timeout: 10000,
    });

    const posts = response.data?.data || [];
    const paging = response.data?.paging || null;

    const cleanPosts = posts.map((post) => ({
      id: post.id,
      caption: post.caption || '',
      mediaType: post.media_type, // IMAGE, VIDEO, or CAROUSEL_ALBUM
      mediaUrl: post.media_url || post.thumbnail_url || null,
      thumbnailUrl: post.thumbnail_url || post.media_url || null,
      permalink: post.permalink,
      timestamp: post.timestamp,
      location: post.location?.name || '',
      carouselMedia: post.children?.data?.map(child => child.media_url || child.thumbnail_url) || []
    }));

    // Cache the first page response
    if (!after && limit === 15) {
      firstPageCache = { data: cleanPosts, paging };
      cacheTimestamp = Date.now();
    }

    return res.json({ success: true, data: cleanPosts, paging, cached: false });
  } catch (error) {
    console.error("Instagram API fetch failed:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.error?.message || 'Failed to fetch Instagram posts.',
    });
  }
});

// GET /api/instagram/profile
router.get('/profile', async (req, res) => {
  try {
    if (profileCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_TTL_MS)) {
      return res.json({ success: true, data: profileCache });
    }

    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const userId = process.env.INSTAGRAM_USER_ID;

    if (!accessToken || !userId) {
      return res.status(500).json({ success: false, message: 'Credentials missing' });
    }

    const response = await axios.get(`${IG_BASE_URL}/${userId}`, {
      params: {
        fields: 'username,name,biography,followers_count,media_count,profile_picture_url',
        access_token: accessToken,
      },
    });

    profileCache = response.data;
    return res.json({ success: true, data: response.data });
  } catch (error) {
    console.warn("Instagram profile fetch failed, using fallback:", error.message);
    const fallbackProfile = {
      username: "sickykumar",
      name: "Sicky Kumar",
      biography: "Creative Web Developer & Designer",
      followers_count: 154,
      media_count: 52
    };
    return res.json({ success: true, data: fallbackProfile });
  }
});

// GET /api/instagram/suggestions (Secure Admin Only)
router.get('/suggestions', adminAuth, async (req, res) => {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const userId = process.env.INSTAGRAM_USER_ID;

    const tags = new Set(['sickykumar', 'reactjs', 'nextjs', 'github', 'googledevs']);
    const locations = new Set(['Mumbai, India', 'Bengaluru, India', 'Developer Desk 💻', 'Home 🏠', 'Road Trip 🚗']);

    if (accessToken && userId) {
      try {
        const response = await axios.get(`${IG_BASE_URL}/${userId}/media`, {
          params: {
            fields: 'caption,location',
            limit: 30,
            access_token: accessToken
          },
          timeout: 5000
        });
        const posts = response.data?.data || [];
        posts.forEach(post => {
          if (post.caption) {
            const matches = post.caption.match(/@([a-zA-Z0-9_\.]+)/g);
            if (matches) {
              matches.forEach(m => tags.add(m.replace('@', '').toLowerCase()));
            }
          }
          if (post.location && post.location.name) {
            locations.add(post.location.name);
          }
        });
      } catch (err) {
        console.error('[Suggestions] Failed to fetch live suggestions from Instagram API:', err.message);
      }
    }

    return res.json({
      success: true,
      tags: Array.from(tags),
      locations: Array.from(locations)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch suggestions.' });
  }
});

// GET /api/instagram/search-users (Secure Admin Only)
router.get('/search-users', adminAuth, async (req, res) => {
  try {
    const query = (req.query.q || '').trim();
    if (!query || query.length < 2) {
      return res.json({ success: true, users: [] });
    }

    const searchUrl = `https://search.yahoo.com/search?q=site:instagram.com+${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const html = await response.text();
    console.log('[Search] Query:', query, 'HTML Length:', html.length);

    const regex = /instagram\.com\/([a-zA-Z0-9_\.]+)/gi;
    const users = new Set();
    const blacklist = ['p', 'reels', 'tv', 'stories', 'explore', 'developer', 'about', 'legal', 'accounts', 'terms', 'privacy', 'ar', 'help', 'reel'];

    let match;
    while ((match = regex.exec(html)) !== null) {
      const user = match[1].toLowerCase().split('/')[0];
      if (user && !blacklist.includes(user) && !user.includes('.')) {
        users.add(user);
      }
    }

    console.log('[Search] Found users count:', users.size);
    return res.json({ success: true, users: Array.from(users).slice(0, 8) });
  } catch (error) {
    console.error('Failed to search Instagram users:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to search users.' });
  }
});

// POST /api/instagram/publish (Secure Admin Only)
router.post('/publish', adminAuth, async (req, res) => {
  try {
    const { imageUrl, videoUrl, mediaUrls, caption, postType = 'IMAGE', userTags, collaborators } = req.body;
    
    const result = await publishToInstagram({
      imageUrl,
      videoUrl,
      mediaUrls,
      caption,
      postType,
      userTags,
      collaborators
    });

    // Invalidate Cache
    firstPageCache = null;
    cacheTimestamp = null;

    return res.json({
      success: true,
      message: `Successfully published ${postType} to Instagram! 🎉`,
      postId: result?.id,
    });

  } catch (error) {
    console.error("Instagram publish failed:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.error?.message || error.message || 'Instagram API publish returned an error.',
    });
  }
});

// GET /api/instagram/drafts (Secure Admin Only)
router.get('/drafts', adminAuth, async (req, res) => {
  try {
    const drafts = await InstagramDraft.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: drafts });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch drafts.' });
  }
});

// POST /api/instagram/drafts (Secure Admin Only)
router.post('/drafts', adminAuth, async (req, res) => {
  try {
    const { postType, mediaUrl, mediaUrls, caption, scheduledFor, userTags, collaborators, location } = req.body;
    if (postType !== 'STORY' && (!caption || caption.trim().length === 0)) {
      return res.status(400).json({ success: false, message: 'Caption is required.' });
    }
    const status = scheduledFor ? 'scheduled' : 'draft';
    const newDraft = new InstagramDraft({
      postType,
      mediaUrl,
      mediaUrls,
      caption: caption ? caption.trim() : '',
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      status,
      userTags,
      collaborators,
      location
    });
    await newDraft.save();
    return res.json({ success: true, message: scheduledFor ? 'Post scheduled successfully! ⏰' : 'Draft saved successfully! ✓', data: newDraft });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to save draft.' });
  }
});

// DELETE /api/instagram/drafts/:id (Secure Admin Only)
router.delete('/drafts/:id', adminAuth, async (req, res) => {
  try {
    const deletedDraft = await InstagramDraft.findByIdAndDelete(req.params.id);
    if (!deletedDraft) {
      return res.status(404).json({ success: false, message: 'Draft not found.' });
    }
    return res.json({ success: true, message: 'Draft deleted successfully! ✓' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete draft.' });
  }
});

export default router;
