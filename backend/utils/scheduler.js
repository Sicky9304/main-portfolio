import InstagramDraft from '../models/InstagramDraft.js';
import { publishToInstagram } from './instagramPublisher.js';

let intervalId = null;

export function startScheduler() {
  if (intervalId) return;

  console.log('[Scheduler] Instagram post scheduler started.');

  // Run every 60 seconds
  intervalId = setInterval(async () => {
    try {
      const now = new Date();
      // Find all scheduled posts that are due
      const pendingPosts = await InstagramDraft.find({
        status: 'scheduled',
        scheduledFor: { $lte: now }
      });

      if (pendingPosts.length === 0) return;

      console.log(`[Scheduler] Found ${pendingPosts.length} pending scheduled post(s) to publish.`);

      for (const post of pendingPosts) {
        try {
          console.log(`[Scheduler] Publishing post ${post._id} of type ${post.postType}...`);
          
          await publishToInstagram({
            imageUrl: post.mediaUrl,
            videoUrl: post.mediaUrl, // Mapping both since publisher utility selects based on postType
            mediaUrls: post.mediaUrls,
            caption: post.caption,
            postType: post.postType,
            userTags: post.userTags,
            collaborators: post.collaborators
          });

          console.log(`[Scheduler] Post ${post._id} published successfully!`);
          
          // Mark as published
          post.status = 'published';
          post.errorMessage = undefined;
          await post.save();
        } catch (postError) {
          console.error(`[Scheduler] Error publishing post ${post._id}:`, postError.message);
          
          // Mark as failed and save error message
          post.status = 'failed';
          post.errorMessage = postError.message;
          await post.save();
        }
      }
    } catch (err) {
      console.error('[Scheduler] Critical error in post scheduler loop:', err.message);
    }
  }, 60000);
}

export function stopScheduler() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('[Scheduler] Instagram post scheduler stopped.');
  }
}
