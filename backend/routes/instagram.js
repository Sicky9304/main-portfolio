import { Router } from 'express';
import axios from 'axios';
import adminAuth from '../middleware/adminAuth.js';
import InstagramDraft from '../models/InstagramDraft.js';

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
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
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

// POST /api/instagram/publish (Secure Admin Only)
router.post('/publish', adminAuth, async (req, res) => {
  try {
    const { imageUrl, videoUrl, mediaUrls, caption, postType = 'IMAGE' } = req.body;
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const userId = process.env.INSTAGRAM_USER_ID;

    if (!accessToken || !userId) {
      return res.status(500).json({ success: false, message: 'Instagram credentials not configured.' });
    }

    if (postType !== 'STORY' && (!caption || caption.trim().length === 0)) {
      return res.status(400).json({ success: false, message: 'A caption is required.' });
    }

    let containerId = null;

    if (postType === 'CAROUSEL') {
      if (!mediaUrls || !Array.isArray(mediaUrls) || mediaUrls.length < 2) {
        return res.status(400).json({ success: false, message: 'Carousel requires at least 2 public media URLs.' });
      }

      // Step 1: Create individual item containers
      const itemContainerIds = [];
      for (const url of mediaUrls) {
        const itemRes = await axios.post(`${IG_BASE_URL}/${userId}/media`, null, {
          params: {
            image_url: url,
            is_carousel_item: true,
            access_token: accessToken,
          },
        });
        if (itemRes.data?.id) {
          itemContainerIds.push(itemRes.data.id);
        }
      }

      // Step 2: Create the main Carousel Container linking those items
      const carouselRes = await axios.post(`${IG_BASE_URL}/${userId}/media`, null, {
        params: {
          media_type: 'CAROUSEL',
          children: itemContainerIds.join(','),
          caption: caption.trim(),
          access_token: accessToken,
        },
      });
      containerId = carouselRes.data?.id;

    } else {
      const mediaUrl = postType === 'REELS' ? videoUrl : imageUrl;
      if (!mediaUrl || !mediaUrl.startsWith('http')) {
        return res.status(400).json({ success: false, message: 'A valid public media URL is required.' });
      }

      const params = {
        access_token: accessToken,
      };

      if (postType !== 'STORY') {
        params.caption = caption.trim();
      }

      if (postType === 'REELS') {
        params.media_type = 'REELS';
        params.video_url = mediaUrl;
      } else if (postType === 'STORY') {
        params.media_type = 'STORIES';
        const isVideo = mediaUrl.toLowerCase().match(/\.(mp4|mov|avi|wmv|flv|mkv|webm|m4v|3gp|qt)/) || videoUrl;
        if (isVideo) {
          params.video_url = mediaUrl;
        } else {
          params.image_url = mediaUrl;
        }
      } else {
        params.image_url = mediaUrl;
      }

      const containerResponse = await axios.post(`${IG_BASE_URL}/${userId}/media`, null, { params, timeout: 20000 });
      containerId = containerResponse.data?.id;
    }

    if (!containerId) {
      return res.status(500).json({ success: false, message: 'Failed to create Instagram media container.' });
    }

    // Wait for container validation (specifically for reels and video stories)
    const mediaUrl = postType === 'REELS' ? videoUrl : imageUrl;
    const isVideoStory = postType === 'STORY' && (mediaUrl?.toLowerCase().match(/\.(mp4|mov|avi|wmv|flv|mkv|webm|m4v|3gp|qt)/) || videoUrl);
    if (postType === 'REELS' || isVideoStory) {
      let isReady = false;
      let attempts = 0;
      while (!isReady && attempts < 12) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        attempts++;
        try {
          const statusRes = await axios.get(`${IG_BASE_URL}/${containerId}`, {
            params: {
              fields: 'status_code',
              access_token: accessToken,
            },
          });
          if (statusRes.data?.status_code === 'FINISHED') isReady = true;
          if (statusRes.data?.status_code === 'ERROR') {
            return res.status(500).json({ success: false, message: 'Instagram failed to process video.' });
          }
        } catch (e) {}
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // Step 2: Publish the container
    const publishResponse = await axios.post(`${IG_BASE_URL}/${userId}/media_publish`, null, {
      params: {
        creation_id: containerId,
        access_token: accessToken,
      },
      timeout: 15000,
    });

    // Invalidate Cache
    firstPageCache = null;
    cacheTimestamp = null;

    return res.json({
      success: true,
      message: `Successfully published ${postType} to Instagram! 🎉`,
      postId: publishResponse.data?.id,
    });

  } catch (error) {
    console.error("Instagram publish failed:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.error?.message || 'Instagram API publish returned an error.',
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
    const { postType, mediaUrl, mediaUrls, caption } = req.body;
    if (!caption || caption.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Caption is required.' });
    }
    const newDraft = new InstagramDraft({
      postType,
      mediaUrl,
      mediaUrls,
      caption: caption.trim()
    });
    await newDraft.save();
    return res.json({ success: true, message: 'Draft saved successfully! ✓', data: newDraft });
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
