import mongoose from 'mongoose';

const instagramDraftSchema = new mongoose.Schema(
  {
    postType: {
      type: String,
      enum: ['IMAGE', 'REELS', 'CAROUSEL', 'STORY'],
      required: true,
    },
    mediaUrl: {
      type: String,
    },
    mediaUrls: {
      type: [String],
      default: [],
    },
    caption: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const InstagramDraft = mongoose.model('InstagramDraft', instagramDraftSchema);
export default InstagramDraft;
