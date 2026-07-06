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

// Pre-save hook to automatically generate perfect SEO values if they are missing
blogSchema.pre('save', function (next) {
  // 1. Auto-generate slug from title if missing
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  // 2. Auto-generate SEO Title (max 60 chars)
  if (!this.seoTitle) {
    const brandSuffix = " | Sicky's Engineering Blog";
    if (this.title) {
      if (this.title.length + brandSuffix.length <= 60) {
        this.seoTitle = `${this.title}${brandSuffix}`;
      } else {
        this.seoTitle = this.title;
      }
    }
  }

  // 3. Auto-generate SEO Description (max 160 chars)
  if (!this.seoDescription) {
    const rawDesc = this.description || this.content || '';
    const cleanDesc = rawDesc
      .replace(/[#*`_\[\]()\-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    this.seoDescription = cleanDesc.slice(0, 155) + (cleanDesc.length > 155 ? '...' : '');
  }

  // 4. Auto-generate Open Graph parameters
  if (!this.ogTitle) {
    this.ogTitle = this.seoTitle || this.title;
  }
  if (!this.ogDescription) {
    this.ogDescription = this.seoDescription;
  }
  if (!this.ogImage) {
    this.ogImage = this.thumbnail || 'https://www.sickykumar.in/images/blogs/default-blog.webp';
  }

  // 5. Auto-generate canonical URL
  if (!this.canonicalUrl) {
    this.canonicalUrl = `https://www.sickykumar.in/blog/${this.slug}`;
  }

  // 6. Auto-generate tags/keywords fallback
  if ((!this.tags || this.tags.length === 0) && this.category) {
    this.tags = [this.category.toLowerCase(), 'mern', 'webdev', 'software-engineering'];
  }

  next();
});

blogSchema.index({ featured: 1 });
blogSchema.index({ createdAt: -1 });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
