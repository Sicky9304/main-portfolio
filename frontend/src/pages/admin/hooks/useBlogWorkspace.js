import { useState, useEffect } from 'react';
import { 
  fetchAdminBlogs, createBlog, updateBlog, deleteBlog, uploadImage, generateBlogContent 
} from '../../../api/index.js';
import { compressToWebP } from '../../../lib/imageCompressor.js';
import { 
  DEFAULT_CATEGORIES, DEFAULT_TAGS, DEFAULT_MEDIA_ITEMS, INITIAL_BLOG_FORM 
} from '../components/editorDefaults';

export const useBlogWorkspace = (token) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Responsive & Resize layout states
  const [isDesktop, setIsDesktop] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(240); // px
  const [rightPanelWidth, setRightPanelWidth] = useState(320); // px
  const [editorSplitRatio, setEditorSplitRatio] = useState(50); // percentage (20 to 80)
  
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [rightPanelHidden, setRightPanelHidden] = useState(false);

  // Tab & Editor States
  const [workspaceTab, setWorkspaceTab] = useState('blogs');
  const [editorMode, setEditorMode] = useState('split');
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Editor configurations
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [selectedSize, setSelectedSize] = useState('text-base');
  const [lineHeight, setLineHeight] = useState('leading-relaxed');
  const [letterSpacing, setLetterSpacing] = useState('tracking-normal');
  const [textAlign, setTextAlign] = useState('text-left');

  // History tracker
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Tag & Category databases
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tagsDatabase, setTagsDatabase] = useState(DEFAULT_TAGS);

  // Media Library elements
  const [mediaItems, setMediaItems] = useState(DEFAULT_MEDIA_ITEMS);
  const [mediaSearch, setMediaSearch] = useState('');
  const [selectedMediaItem, setSelectedMediaItem] = useState(null);
  const [cropRotation, setCropRotation] = useState(0);

  // Blog Form State
  const [isEditing, setIsEditing] = useState(false);
  const [blogForm, setBlogForm] = useState(INITIAL_BLOG_FORM);

  // Desktop check
  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Fetch blogs
  useEffect(() => {
    const loadBlogs = async () => {
      setLoading(true);
      try {
        const data = await fetchAdminBlogs(token);
        setBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load blogs', err);
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, [refreshTrigger, token]);

  // Auto-Save Engine (5 seconds)
  useEffect(() => {
    if (workspaceTab !== 'editor' || !isDirty) return;
    const interval = setInterval(() => {
      saveDraftSilent();
    }, 5000);
    return () => clearInterval(interval);
  }, [workspaceTab, isDirty, blogForm]);

  // Drag resizers
  const handleSidebarDrag = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;
    const handleMove = (moveEvent) => {
      const newWidth = Math.max(160, Math.min(380, startWidth + (moveEvent.clientX - startX)));
      setSidebarWidth(newWidth);
    };
    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  const handleRightPanelDrag = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = rightPanelWidth;
    const handleMove = (moveEvent) => {
      const newWidth = Math.max(240, Math.min(420, startWidth + (startX - moveEvent.clientX)));
      setRightPanelWidth(newWidth);
    };
    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  const handleSplitDrag = (e) => {
    e.preventDefault();
    const container = document.getElementById('editor-preview-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const handleMove = (moveEvent) => {
      const percentage = Math.max(20, Math.min(80, ((moveEvent.clientX - rect.left) / rect.width) * 100));
      setEditorSplitRatio(percentage);
    };
    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  const saveDraftSilent = async () => {
    let finalForm = { ...blogForm };
    if (!finalForm.title || !finalForm.title.trim()) {
      finalForm.title = 'Untitled';
    }
    if (!finalForm.slug || !finalForm.slug.trim()) {
      finalForm.slug = `untitled-${Date.now()}`;
    }
    try {
      const formatted = {
        ...finalForm,
        tldr: typeof finalForm.tldr === 'string' ? finalForm.tldr.split(',').map(i => i.trim()).filter(Boolean) : finalForm.tldr
      };
      if (isEditing) {
        await updateBlog(isEditing.slug, formatted, token);
      } else {
        const response = await createBlog(formatted, token);
        if (response.success && response.data) setIsEditing(response.data);
      }
      setIsDirty(false);
      setLastSaved(new Date());
    } catch (err) {
      console.error('Autosave error', err);
    }
  };

  const saveDraft = async () => {
    let finalForm = { ...blogForm };
    if (!finalForm.title || !finalForm.title.trim()) {
      finalForm.title = 'Untitled';
    }
    if (!finalForm.slug || !finalForm.slug.trim()) {
      finalForm.slug = `untitled-${Date.now()}`;
    }
    setLoading(true);
    try {
      const formatted = {
        ...finalForm,
        tldr: typeof finalForm.tldr === 'string' ? finalForm.tldr.split(',').map(i => i.trim()).filter(Boolean) : finalForm.tldr
      };
      if (isEditing) {
        await updateBlog(isEditing.slug, formatted, token);
      } else {
        const res = await createBlog(formatted, token);
        if (res.success && res.data) setIsEditing(res.data);
      }
      setIsDirty(false);
      setLastSaved(new Date());
      setRefreshTrigger(p => p + 1);
    } catch (err) {
      alert(err.message || 'Draft save failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    let finalForm = { ...blogForm };
    if (!finalForm.title || !finalForm.title.trim()) {
      finalForm.title = 'Untitled';
    }
    if (!finalForm.slug || !finalForm.slug.trim()) {
      finalForm.slug = `untitled-${Date.now()}`;
    }
    if (!finalForm.description || !finalForm.description.trim()) {
      finalForm.description = finalForm.seoDescription || 'No description provided.';
    }
    setLoading(true);
    try {
      const formatted = {
        ...finalForm,
        status: 'Published',
        tldr: typeof finalForm.tldr === 'string' ? finalForm.tldr.split(',').map(i => i.trim()).filter(Boolean) : finalForm.tldr
      };
      if (isEditing) {
        await updateBlog(isEditing.slug, formatted, token);
      } else {
        await createBlog(formatted, token);
      }
      setIsDirty(false);
      setWorkspaceTab('blogs');
      setRefreshTrigger(p => p + 1);
      alert('🎉 Published Successfully!');
    } catch (err) {
      alert(err.message || 'Publish failed.');
    } finally {
      setLoading(false);
    }
  };

  const insertMarkdown = (before, after = '') => {
    const textarea = document.getElementById('editor-canvas');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end);
    const replacement = before + selection + after;
    const updated = text.substring(0, start) + replacement + text.substring(end);
    setBlogForm(prev => ({ ...prev, content: updated }));
    setIsDirty(true);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selection.length);
    }, 50);
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setBlogForm(prev => {
      const updated = { ...prev, title: val, seoTitle: prev.seoTitle || val, ogTitle: prev.ogTitle || val };
      if (!isEditing) {
        updated.slug = val.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
        updated.canonicalUrl = `https://sickykumar.in/blog/${updated.slug}`;
      }
      return updated;
    });
    setIsDirty(true);
  };

  const handleAddTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().replace(/,/g, '');
      if (!blogForm.tags.includes(tag)) {
        setBlogForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
        if (!tagsDatabase.some(t => t.name.toLowerCase() === tag.toLowerCase())) {
          setTagsDatabase(prev => [...prev, { name: tag, color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' }]);
        }
      }
      setTagInput('');
      setIsDirty(true);
    }
  };

  const getStatistics = () => {
    const text = blogForm.content || '';
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    const paragraphs = text.split('\n\n').filter(Boolean).length;
    const headings = text.split('\n').filter(line => line.startsWith('#')).length;
    return { words, chars, paragraphs, headings };
  };

  const calculateSeoScore = () => {
    let score = 0;
    const { title, description, content, focusKeyword } = blogForm;
    if (!focusKeyword) return 0;
    const titleLower = (title || '').toLowerCase();
    const descLower = (description || '').toLowerCase();
    const kw = focusKeyword.toLowerCase();

    if (titleLower.includes(kw)) score += 30;
    if (descLower.includes(kw)) score += 30;
    if (content.toLowerCase().includes(kw)) score += 20;
    if (titleLower.length >= 40 && titleLower.length <= 65) score += 20;
    return score;
  };

  const handleEditOpen = (blog) => {
    setIsEditing(blog);
    setBlogForm({
      title: blog.title || '', slug: blog.slug || '', description: blog.description || '', content: blog.content || '',
      category: blog.category || 'Web Development', tags: blog.tags || [], readTime: blog.readTime || '5 min read',
      thumbnail: blog.thumbnail || '', featured: blog.featured || false, complexity: blog.complexity || 'Intermediate',
      tldr: Array.isArray(blog.tldr) ? blog.tldr.join(', ') : '', audioDuration: blog.audioDuration || '5:30', status: blog.status || 'Draft',
      seoTitle: blog.seoTitle || blog.title || '', seoDescription: blog.seoDescription || blog.description || '', focusKeyword: blog.focusKeyword || '',
      canonicalUrl: blog.canonicalUrl || '', ogTitle: blog.ogTitle || '', ogDescription: blog.ogDescription || '', ogImage: blog.ogImage || '',
    });
    setWorkspaceTab('editor');
  };

  const handleDelete = async (slug, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteBlog(slug, token);
      setRefreshTrigger(p => p + 1);
    } catch (err) {
      alert(err.message || 'Deletion failed.');
    }
  };

  const toggleFeaturedStatus = async (blog) => {
    try {
      await updateBlog(blog.slug, { ...blog, featured: !blog.featured }, token);
      setRefreshTrigger(p => p + 1);
    } catch (err) {
      alert('Failed to toggle featured state.');
    }
  };

  const handleMediaUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      try {
        const file = e.target.files[0];
        const compressedBase64 = await compressToWebP(file);
        const res = await uploadImage(compressedBase64, token);
        if (res.success) {
          const newItem = { url: res.url, name: file.name, date: new Date().toISOString().split('T')[0], size: 'Compressed WebP', category: 'Uploads' };
          setMediaItems(prev => [newItem, ...prev]);
        }
      } catch (err) {
        alert('Upload failed.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAiGenerate = async (prompt, title) => {
    setLoading(true);
    try {
      const res = await generateBlogContent(prompt, title);
      if (res.success && res.text) {
        const suggestedTitle = title || prompt.substring(0, 40) + '...';
        const generatedSlug = suggestedTitle.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
        
        setBlogForm({
          ...INITIAL_BLOG_FORM,
          title: suggestedTitle,
          slug: generatedSlug,
          content: res.text,
          description: `An AI-generated guide on ${suggestedTitle}. Review and modify details before publishing.`,
          seoTitle: suggestedTitle,
          seoDescription: `An AI-generated guide on ${suggestedTitle}.`,
          canonicalUrl: `https://sickykumar.in/blog/${generatedSlug}`,
        });
        
        setIsDirty(true);
        setWorkspaceTab('editor');
        setEditorMode('split');
        alert('✨ AI generated a blog post draft successfully! Form and content populated.');
      }
    } catch (err) {
      alert(err.message || 'AI content generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return {
    blogs, loading, isDesktop, sidebarWidth, setSidebarWidth, rightPanelWidth, setRightPanelWidth,
    editorSplitRatio, setEditorSplitRatio, sidebarHidden, setSidebarHidden, rightPanelHidden, setRightPanelHidden,
    workspaceTab, setWorkspaceTab, editorMode, setEditorMode, isDirty, setIsDirty, lastSaved,
    selectedFont, setSelectedFont, selectedSize, setSelectedSize, lineHeight, setLineHeight, letterSpacing, setLetterSpacing, textAlign, setTextAlign,
    categories, setCategories, newCategoryName, setNewCategoryName, tagInput, setTagInput, tagsDatabase, setTagsDatabase,
    mediaItems, setMediaItems, mediaSearch, setMediaSearch, selectedMediaItem, setSelectedMediaItem, cropRotation, setCropRotation,
    isEditing, setIsEditing, blogForm, setBlogForm, handleSidebarDrag, handleRightPanelDrag, handleSplitDrag,
    saveDraft, handlePublish, insertMarkdown, handleTitleChange, handleAddTag, getStatistics, calculateSeoScore,
    handleEditOpen, handleDelete, toggleFeaturedStatus, handleMediaUpload, history, historyIndex, handleAiGenerate
  };
};
