import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { fetchBlog } from '../../api/index.js';
import { BlogHeaderHub } from './blogUI/BlogHeaderHub';
import { BlogContentArea } from './blogUI/BlogContentArea';
import { BlogAiChatCompanion } from './blogUI/BlogAiChatCompanion';

export const BlogDetailsPage = ({ slug: propSlug }) => {
  const { slug: routeSlug } = useParams();
  const navigate = useNavigate();
  const slug = propSlug || routeSlug;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadBlog = async () => {
      window.dispatchEvent(new CustomEvent('start-global-loading'));
      setLoading(true);
      try {
        const data = await fetchBlog(slug);
        setBlog(data);
      } catch (err) {
        console.error('Error fetching blog details', err);
      } finally {
        setLoading(false);
        window.dispatchEvent(new CustomEvent('stop-global-loading'));
      }
    };
    loadBlog();
  }, [slug]);

  // Dynamic SEO Meta Tags & JSON-LD Schema Injection for search engine optimization
  useEffect(() => {
    if (!blog) return;

    // 1. Set document title
    const originalTitle = document.title;
    document.title = blog.seoTitle || `${blog.title} | Sicky Kumar`;

    // Helper to dynamically manage meta tags in head
    const setMeta = (nameOrProperty, value, isProperty = false) => {
      if (!value) return null;
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${nameOrProperty}"]`);
      let created = false;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, nameOrProperty);
        document.head.appendChild(element);
        created = true;
      }
      element.setAttribute('content', value);
      return { element, created };
    };

    // Helper to manage canonical link tag
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    let canonicalCreated = false;
    let originalCanonical = '';
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
      canonicalCreated = true;
    } else {
      originalCanonical = canonicalElement.getAttribute('href') || '';
    }
    canonicalElement.setAttribute('href', blog.canonicalUrl || window.location.href);

    // 2. Set basic headers
    const metaDesc = setMeta('description', blog.seoDescription || blog.description || '');
    const metaKeywords = setMeta('keywords', (blog.tags || []).join(', ') || 'mern, web development, coding, sicky kumar');
    
    // 3. Set Open Graph (OG) headers
    const ogTitle = setMeta('og:title', blog.ogTitle || blog.title, true);
    const ogDesc = setMeta('og:description', blog.ogDescription || blog.description || '', true);
    const ogImg = setMeta('og:image', blog.ogImage || blog.thumbnail || '', true);
    const ogUrl = setMeta('og:url', window.location.href, true);
    const ogType = setMeta('og:type', 'article', true);

    // 4. Set Twitter Cards headers
    const twCard = setMeta('twitter:card', 'summary_large_image');
    const twTitle = setMeta('twitter:title', blog.ogTitle || blog.title);
    const twDesc = setMeta('twitter:description', blog.ogDescription || blog.description || '');
    const twImg = setMeta('twitter:image', blog.ogImage || blog.thumbnail || '');

    // 5. Inject JSON-LD Schema
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      },
      "headline": blog.title,
      "description": blog.description,
      "image": blog.thumbnail || "/images/blogs/ai_saas.webp",
      "datePublished": blog.createdAt,
      "dateModified": blog.updatedAt || blog.createdAt,
      "author": {
        "@type": "Person",
        "name": blog.author || "Sicky Kumar"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Sicky Kumar Portfolio",
        "logo": {
          "@type": "ImageObject",
          "url": "/images/blogs/ai_saas.webp"
        }
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'jsonld-blog-schema';
    script.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(script);

    // Cleanup: restore title, canonical, and remove newly injected nodes
    return () => {
      document.title = originalTitle;
      if (canonicalCreated) {
        canonicalElement.remove();
      } else if (originalCanonical) {
        canonicalElement.setAttribute('href', originalCanonical);
      }

      const elements = [
        metaDesc, metaKeywords, ogTitle, ogDesc, ogImg, ogUrl, ogType,
        twCard, twTitle, twDesc, twImg
      ];
      elements.forEach(item => {
        if (item && item.created && item.element) {
          item.element.remove();
        }
      });
      script.remove();
    };
  }, [blog]);

  const handleBack = () => {
    navigate('/blog');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return null;
  }

  if (!blog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="text-red-500 text-lg font-bold">⚠️ Article Not Found</div>
        <p className="text-xs text-slate-500">The blog post you are looking for does not exist or has been deleted.</p>
        <button
          onClick={handleBack}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-850 hover:bg-slate-800 text-xs font-semibold text-white transition-all cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft size={14} /> Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="relative text-slate-800 dark:text-slate-100 max-w-6xl mx-auto px-6 pt-2 pb-12 md:pt-4 md:pb-12 space-y-8 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Blog Header Hub */}
      <BlogHeaderHub blog={blog} handleBack={handleBack} />

      {/* Blog Content & Sidebars */}
      <BlogContentArea blog={blog} handleShare={handleShare} copied={copied} />

      {/* Futuristic AI Companion Panel */}
      <BlogAiChatCompanion blog={blog} />
    </div>
  );
};
