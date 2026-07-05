import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { fetchBlog } from '../../api/index.js';
import { BlogHeaderHub } from '../../components/blogUI/BlogHeaderHub';
import { BlogContentArea } from '../../components/blogUI/BlogContentArea';
import { BlogAiChatCompanion } from '../../components/blogUI/BlogAiChatCompanion';

export const BlogDetailsPage = ({ slug }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadBlog = async () => {
      setLoading(true);
      try {
        const data = await fetchBlog(slug);
        setBlog(data);
      } catch (err) {
        console.error('Error fetching blog details', err);
      } finally {
        setLoading(false);
      }
    };
    loadBlog();
  }, [slug]);

  // SEO Schema Injection (JSON-LD) for faster Google Ranking
  useEffect(() => {
    if (!blog) return;

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
        "name": "Sicky Kumar"
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

    return () => {
      const existingScript = document.getElementById('jsonld-blog-schema');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [blog]);

  const handleBack = () => {
    window.history.pushState({}, '', '/blog');
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500">
        <RefreshCw className="animate-spin text-primary mb-3" size={32} />
        <span className="font-mono text-xs">LOADING TELEMETRY LOGS...</span>
      </div>
    );
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
