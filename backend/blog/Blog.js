import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      // required: [true, 'Blog title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Blog slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      // required: [true, 'Description is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    readTime: {
      type: String,
      default: '5 min read',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    complexity: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    tldr: {
      type: [String],
      default: [],
    },
    audioDuration: {
      type: String,
      default: '5:30',
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Scheduled', 'Archived', 'Deleted'],
      default: 'Draft',
    },
    publishDate: {
      type: Date,
    },
    author: {
      type: String,
      default: 'Sicky Kumar',
    },
    tags: {
      type: [String],
      default: [],
    },
    textAlign: {
      type: String,
      default: 'text-left',
      trim: true,
    },
    seoTitle: {
      type: String,
      trim: true,
    },
    seoDescription: {
      type: String,
      trim: true,
    },
    focusKeyword: {
      type: String,
      trim: true,
    },
    canonicalUrl: {
      type: String,
      trim: true,
    },
    ogTitle: {
      type: String,
      trim: true,
    },
    ogDescription: {
      type: String,
      trim: true,
    },
    ogImage: {
      type: String,
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    bookmarks: {
      type: Number,
      default: 0,
    },
    versionHistory: [
      {
        title: String,
        content: String,
        updatedAt: { type: Date, default: Date.now }
      }
    ],
  },
  {
    timestamps: true,
  }
);

blogSchema.index({ featured: 1 });
blogSchema.index({ createdAt: -1 });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
