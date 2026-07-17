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
    scheduledFor: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'published', 'failed'],
      default: 'draft',
    },
    errorMessage: {
      type: String,
    },
    userTags: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    collaborators: {
      type: [String],
      default: [],
    },
    location: {
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
