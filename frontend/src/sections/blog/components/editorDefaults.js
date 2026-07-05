export const DEFAULT_CATEGORIES = [
  'Web Development', 
  'JavaScript', 
  'Backend', 
  'Tools & DevOps', 
  'Career & Productivity'
];

export const DEFAULT_TAGS = [
  { name: 'React', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  { name: 'Node.js', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { name: 'MongoDB', color: 'bg-green-500/10 text-green-450 border-green-500/20' },
  { name: 'Next.js', color: 'bg-slate-500/10 text-slate-400 border-slate-550/20' },
];

export const DEFAULT_MEDIA_ITEMS = [
  { url: '/images/blogs/mern_roadmap.webp', name: 'MERN Stack Roadmap', date: '2026-07-05', size: '102 KB', category: 'Roadmaps' },
  { url: '/images/blogs/ai_saas.webp', name: 'AI SaaS Architect', date: '2026-07-05', size: '59 KB', category: 'Architecture' },
  { url: '/images/blogs/server_components.webp', name: 'React Server Components', date: '2026-07-05', size: '50 KB', category: 'Next.js' },
];

export const INITIAL_BLOG_FORM = {
  title: '',
  slug: '',
  description: '',
  content: '',
  category: 'Web Development',
  tags: [],
  readTime: '5 min read',
  thumbnail: '',
  featured: false,
  complexity: 'Intermediate',
  tldr: '',
  audioDuration: '5:30',
  status: 'Draft',
  seoTitle: '',
  seoDescription: '',
  focusKeyword: '',
  canonicalUrl: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  textAlign: 'text-justify',
};
