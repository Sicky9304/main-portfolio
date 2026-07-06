import { Router } from 'express';
import mongoose from 'mongoose';
import Blog from './Blog.js';
import adminAuth from '../middleware/adminAuth.js';

const router = Router();

/**
 * GET /api/blogs/public
 * Public — Fetch all published blogs sorted by order (ascending)
 * Allows optional filtering by category (?category=...)
 */
router.get('/public', async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { status: 'Published' };
    
    if (category) filter.category = category;

    const blogs = await Blog.find(filter).sort({ order: 1 });
    res.json({ success: true, data: blogs });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/blogs/rss
 * Public — Serve standard XML RSS feed of published blogs
 */
router.get('/rss', async (req, res, next) => {
  try {
    const blogs = await Blog.find({ status: 'Published' }).sort({ order: 1 });
    
    let rssItems = '';
    blogs.forEach(blog => {
      rssItems += `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <link>https://www.sickykumar.in/blog/${blog.slug}</link>
      <guid isPermaLink="true">https://www.sickykumar.in/blog/${blog.slug}</guid>
      <description><![CDATA[${blog.description}]]></description>
      <category><![CDATA[${blog.category}]]></category>
      <pubDate>${new Date(blog.createdAt).toUTCString()}</pubDate>
    </item>`;
    });

    const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Sicky Kumar | SaaS Engineering Blog</title>
    <link>https://www.sickykumar.in/blog</link>
    <description>Latest engineering posts on Web Development, DevOps, and MERN stack architectures by Sicky Kumar.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://www.sickykumar.in/api/blogs/rss" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

    res.set('Content-Type', 'application/rss+xml');
    res.send(rssXml);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/blogs/latest
 * Public — Fetch the top 3 latest published blogs
 */
router.get('/latest', async (req, res, next) => {
  try {
    const blogs = await Blog.find({ status: 'Published' })
      .sort({ publishDate: -1, createdAt: -1 })
      .limit(3);
    res.json({ success: true, data: blogs });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/blogs/featured
 * Public — Fetch all featured published blogs
 */
router.get('/featured', async (req, res, next) => {
  try {
    const blogs = await Blog.find({ status: 'Published', featured: true }).sort({ order: 1 });
    res.json({ success: true, data: blogs });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/blogs/trending
 * Public — Fetch trending published blogs sorted by views and likes
 */
router.get('/trending', async (req, res, next) => {
  try {
    const blogs = await Blog.find({ status: 'Published' })
      .sort({ views: -1, likes: -1 })
      .limit(5);
    res.json({ success: true, data: blogs });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/blogs
 * Admin — Fetch all blogs sorted by creation date (newest first)
 */
router.get('/', adminAuth, async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/blogs/create
 * Admin — Create a new blog post
 */
router.post('/create', adminAuth, async (req, res, next) => {
  try {
    const blog = await Blog.create({
      ...req.body,
      status: req.body.status || 'Draft'
    });
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    if (error.code === 11000) {
      error.message = 'A blog post with this slug already exists';
      error.statusCode = 400;
    }
    next(error);
  }
});

// Alias old create route for compatibility
router.post('/', adminAuth, async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    if (error.code === 11000) {
      error.message = 'A blog post with this slug already exists';
      error.statusCode = 400;
    }
    next(error);
  }
});

/**
 * GET /api/blogs/:slug
 * Public/Admin — Fetch a single blog post by slug or ID
 */
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const criteria = mongoose.Types.ObjectId.isValid(slug) 
      ? { _id: slug } 
      : { slug: slug };

    const blog = await Blog.findOne(criteria);
    if (!blog) {
      const err = new Error('Blog post not found');
      err.statusCode = 404;
      throw err;
    }
    
    // Increment view count dynamically on dynamic detail page visits
    if (blog.status === 'Published') {
      blog.views = (blog.views || 0) + 1;
      await blog.save();
    }

    // Find dynamic prev and next links (among Published blogs only)
    const allBlogs = await Blog.find({ status: 'Published' }).sort({ order: 1 });
    const currentIndex = allBlogs.findIndex(b => b.slug === blog.slug);
    const prevBlog = currentIndex > 0 ? { title: allBlogs[currentIndex - 1].title, slug: allBlogs[currentIndex - 1].slug } : null;
    const nextBlog = currentIndex < allBlogs.length - 1 ? { title: allBlogs[currentIndex + 1].title, slug: allBlogs[currentIndex + 1].slug } : null;

    res.json({ 
      success: true, 
      data: {
        ...blog.toObject(),
        prevBlog,
        nextBlog
      } 
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/blogs/:idOrSlug
 * Admin — Update an existing blog post (and push version history)
 */
router.put('/:idOrSlug', adminAuth, async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const criteria = mongoose.Types.ObjectId.isValid(idOrSlug) 
      ? { _id: idOrSlug } 
      : { slug: idOrSlug };

    const existing = await Blog.findOne(criteria);
    if (!existing) {
      const err = new Error('Blog post not found');
      err.statusCode = 404;
      throw err;
    }

    // Store historical state of title and content in versionHistory
    const historyEntry = {
      title: existing.title,
      content: existing.content,
      updatedAt: new Date()
    };

    const updateData = { ...req.body };
    
    // If transitioning status to Published, set publishDate
    if (req.body.status === 'Published' && existing.status !== 'Published') {
      updateData.publishDate = new Date();
    }

    const blog = await Blog.findOneAndUpdate(
      criteria,
      {
        ...updateData,
        $push: { versionHistory: historyEntry }
      },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/blogs/:idOrSlug/publish
 * Admin — Publish a blog post
 */
router.patch('/:idOrSlug/publish', adminAuth, async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const criteria = mongoose.Types.ObjectId.isValid(idOrSlug) 
      ? { _id: idOrSlug } 
      : { slug: idOrSlug };

    const blog = await Blog.findOneAndUpdate(
      criteria,
      { status: 'Published', publishDate: new Date() },
      { new: true }
    );
    if (!blog) {
      const err = new Error('Blog post not found');
      err.statusCode = 404;
      throw err;
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/blogs/:idOrSlug/unpublish
 * Admin — Revert a blog post to Draft
 */
router.patch('/:idOrSlug/unpublish', adminAuth, async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const criteria = mongoose.Types.ObjectId.isValid(idOrSlug) 
      ? { _id: idOrSlug } 
      : { slug: idOrSlug };

    const blog = await Blog.findOneAndUpdate(
      criteria,
      { status: 'Draft' },
      { new: true }
    );
    if (!blog) {
      const err = new Error('Blog post not found');
      err.statusCode = 404;
      throw err;
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/blogs/:idOrSlug/archive
 * Admin — Archive a blog post
 */
router.patch('/:idOrSlug/archive', adminAuth, async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const criteria = mongoose.Types.ObjectId.isValid(idOrSlug) 
      ? { _id: idOrSlug } 
      : { slug: idOrSlug };

    const blog = await Blog.findOneAndUpdate(
      criteria,
      { status: 'Archived' },
      { new: true }
    );
    if (!blog) {
      const err = new Error('Blog post not found');
      err.statusCode = 404;
      throw err;
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/blogs/:idOrSlug
 * Admin — Delete a blog post
 */
router.delete('/:idOrSlug', adminAuth, async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const criteria = mongoose.Types.ObjectId.isValid(idOrSlug) 
      ? { _id: idOrSlug } 
      : { slug: idOrSlug };

    const blog = await Blog.findOneAndDelete(criteria);
    if (!blog) {
      const err = new Error('Blog post not found');
      err.statusCode = 404;
      throw err;
    }
    res.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
