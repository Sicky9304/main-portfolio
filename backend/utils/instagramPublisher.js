import axios from 'axios';

const IG_BASE_URL = 'https://graph.instagram.com';

/**
 * Publishes a post to Instagram
 * @param {Object} postData 
 * @param {string} postData.postType - 'IMAGE', 'REELS', 'CAROUSEL', 'STORY'
 * @param {string} postData.imageUrl - URL of the image
 * @param {string} postData.videoUrl - URL of the video
 * @param {Array<string>} postData.mediaUrls - URLs for carousel
 * @param {string} postData.caption - Caption
 * @returns {Promise<Object>} Response from Instagram
 */
export async function publishToInstagram({ imageUrl, videoUrl, mediaUrls, caption, postType = 'IMAGE', userTags, collaborators }) {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!accessToken || !userId) {
    throw new Error('Instagram credentials not configured.');
  }

  if (postType !== 'STORY' && (!caption || caption.trim().length === 0)) {
    throw new Error('A caption is required.');
  }

  let containerId = null;

  if (postType === 'CAROUSEL') {
    if (!mediaUrls || !Array.isArray(mediaUrls) || mediaUrls.length < 2) {
      throw new Error('Carousel requires at least 2 public media URLs.');
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
      throw new Error('A valid public media URL is required.');
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

    // Add user tags and collaborators if specified (only valid for Feed/Reels posts)
    if (postType !== 'STORY') {
      if (userTags && Array.isArray(userTags) && userTags.length > 0) {
        params.user_tags = JSON.stringify(userTags);
      }
      if (collaborators && Array.isArray(collaborators) && collaborators.length > 0) {
        params.collaborators = JSON.stringify(collaborators);
      }
    }

    const containerResponse = await axios.post(`${IG_BASE_URL}/${userId}/media`, null, { params, timeout: 20000 });
    containerId = containerResponse.data?.id;
  }

  if (!containerId) {
    throw new Error('Failed to create Instagram media container.');
  }

  // Wait for container validation (reels and video stories)
  const mediaUrlToCheck = postType === 'REELS' ? videoUrl : imageUrl;
  const isVideoStory = postType === 'STORY' && (mediaUrlToCheck?.toLowerCase().match(/\.(mp4|mov|avi|wmv|flv|mkv|webm|m4v|3gp|qt)/) || videoUrl);
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
          throw new Error('Instagram failed to process video.');
        }
      } catch (e) {
        console.warn('Status check warning:', e.message);
      }
    }
  } else {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  // Publish the container
  const publishResponse = await axios.post(`${IG_BASE_URL}/${userId}/media_publish`, null, {
    params: {
      creation_id: containerId,
      access_token: accessToken,
    },
    timeout: 15000,
  });

  return publishResponse.data;
}
