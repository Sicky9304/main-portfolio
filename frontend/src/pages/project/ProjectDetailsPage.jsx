import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProject } from '../../api/index.js';
import { ProjectHeader } from './components/ProjectHeader';
import { ProjectTabs } from './components/ProjectTabs';
import { ProjectAiCompanion } from './components/ProjectAiCompanion';

const FALLBACK_PROJECTS = [
  {
    _id: 'instagram-creator-studio',
    slug: 'instagram-creator-studio',
    title: 'Instagram Creator Studio',
    tagline: 'Meta Graph API Instagram Feed, Reels, Scheduler & Creator Studio Hub',
    description: 'A fully integrated Instagram management console that enables creators to browse live posts and reels via Meta Graph APIs, compose/publish single or carousel posts, write AI-assisted captions with Gemini 2.5, perform global OpenStreetMap geolocation lookup, and schedule posts using a background Node.js draft-publish automation scheduler.',
    problem: 'Managing content publishing, tag/collaborator searching, and scheduling requires toggling across multiple tools. Third-party Instagram schedulers are expensive and lack custom portfolio feed integrations.',
    features: [
      'Meta Graph API live feed synchronization (photos, videos, reels, carousels)',
      'Instagram Creator Studio publishing board with WebP canvas compression',
      'AI Caption Copilot powered by Google Gemini 2.5 Flash',
      'Global Location search via OpenStreetMap Nominatim API proxy',
      'Secure passcode validation and local session cache persistence',
      'Background draft publishing scheduler using cron automation tasks',
    ],
    tech: ['React.js', 'Node.js', 'Express.js', 'Meta Graph API', 'Gemini 2.5', 'MongoDB', 'Framer Motion'],
    github: 'https://github.com/Sicky9304/main-portfolio.git',
    demo: '/instagram',
    color: 'from-pink-500 via-purple-600 to-indigo-700',
    emoji: '📸',
    status: 'Completed',
    thumbnail: '/images/blogs/instagram_studio.webp',
    challenges: 'Managing cross-domain request redirections and header strips for public searches, handling Meta Graph API rate-limiting rules, and synchronizing real-time draft publishing with Cron schedulers on Node.',
    architecture: 'Uses a MERN stack. React.js renders the custom 3D dark glass console, which queries Express endpoints. The Express router proxies location requests to OpenStreetMap and executes background publishing via a Cron task-scheduler querying MongoDB Atlas drafts.',
    results: 'Enabled seamless Instagram feed browsing, AI caption writing, worldwide location tagging, and fully automated scheduled posting direct from a single unified personal portfolio.',
    codeSnippet: `// Node.js Express cron draft publisher scheduler
cron.schedule('*/5 * * * *', async () => {
  const dueDrafts = await InstagramDraft.find({
    status: 'Scheduled',
    scheduledFor: { $lte: new Date() }
  });
  for (const draft of dueDrafts) {
    await publishToInstagram(draft);
    draft.status = 'Published';
    await draft.save();
  }
});`
  },
  {
    _id: 'ai-food-app',
    slug: 'ai-food-app',
    title: 'AI-Powered Food App',
    tagline: 'MERN food delivery platform with Stripe checkout & on-demand AI review analysis',
    description: 'A premium full-stack MERN food ordering application integrated with Stripe payment checkout, admin dashboard order processing, dynamic cart management, and on-demand LLM sentiment analysis for restaurant reviews.',
    problem: 'Standard food delivery templates lack interactive AI capabilities, secure and automated order status update panels for administrators, and robust, crash-free review aggregation tools.',
    features: [
      'Stripe hosted checkout sessions with dynamic cart serialization',
      'On-demand AI sentiment analysis of customer reviews using Groq Llama 3.1',
      'Secure admin order panel for updating delivery status from Processing to Delivered',
      'Robust AI-driven dish description and allergens metadata generator',
      'Global error handler with development and production fallback environments',
      'Vite build optimization with Rollup dynamic manual code splitting',
    ],
    tech: ['React.js', 'Redux Toolkit', 'Node.js', 'Express.js', 'MongoDB', 'Stripe', 'Groq AI'],
    github: 'https://github.com/Sicky9304/ai-powered-food-app.git',
    demo: 'https://github.com/Sicky9304/ai-powered-food-app',
    color: 'from-orange-500 to-amber-500',
    emoji: '🍔',
    status: 'Completed',
    thumbnail: '/images/blogs/food_app.webp',
    challenges: '### Technical Challenges\n- **Unmounting Local Component State**: A page-wide loading spinner state in the Redux store unmounted child cards during review analyses, resetting their visual expansion states.\n- **JSON Output Formatting**: The LLM occasionally returned Markdown formatting headers, causing backend JSON parse errors.\n\n### Solutions\n- Decoupled localized component loaders from the global slice reducer to keep components mounted.\n- Added custom parse guards and regex cleanups to strip markdown code blocks from the API responses.',
    architecture: '### App System Architecture\n```mermaid\ngraph TD\n  Client[React App] -->|Axios-fetch| API[Express API]\n  API -->|Mongoose| MongoDB[(MongoDB Atlas)]\n  API -->|Stripe SDK| Stripe[Stripe Checkout]\n  API -->|Groq API| Groq[Llama 3.1 8b]\n```',
    results: '### Key Results\n- **100% stable review toggle expansion** on the first click.\n- **Zero-error JSON parsing** for AI description generator inputs.',
    codeSnippet: '// Clean markdown formatting from LLM JSON response\nconst cleaned = content.replace(/```json|```/g, "").trim();\nreturn JSON.parse(cleaned);',
  }
];

export const ProjectDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      window.dispatchEvent(new CustomEvent('start-global-loading'));
      setLoading(true);
      try {
        const data = await fetchProject(slug);
        if (data) {
          setProject(data);
        } else {
          const fallback = FALLBACK_PROJECTS.find(p => p.slug === slug);
          setProject(fallback);
        }
      } catch (err) {
        console.error('Error fetching project details:', err);
        const fallback = FALLBACK_PROJECTS.find(p => p.slug === slug);
        setProject(fallback);
      } finally {
        setLoading(false);
        window.dispatchEvent(new CustomEvent('stop-global-loading'));
      }
    };
    loadProject();
  }, [slug]);

  // Dynamic SEO Meta Tags injection
  useEffect(() => {
    if (!project) return;

    const originalTitle = document.title;
    document.title = `${project.title} | Case Study | Sicky Kumar`;

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

    const metaDesc = setMeta('description', project.tagline || project.description || '');
    const ogTitle = setMeta('og:title', `${project.title} - Case Study`, true);
    const ogDesc = setMeta('og:description', project.tagline || '', true);
    const ogImg = setMeta('og:image', project.thumbnail || '', true);

    return () => {
      document.title = originalTitle;
      [metaDesc, ogTitle, ogDesc, ogImg].forEach(item => {
        if (item && item.created && item.element) item.element.remove();
      });
    };
  }, [project]);

  const handleBack = () => {
    navigate('/');
    // Scroll down to the projects section if navigated back
    setTimeout(() => {
      const el = document.getElementById('projects');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark transition-colors duration-300">
        <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-light dark:bg-surface-dark transition-colors duration-300 px-4 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white font-heading">
          Project Case Study Not Found
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm">
          The requested project might have been removed or has a different URL path.
        </p>
        <button 
          onClick={handleBack}
          className="mt-6 px-4 py-2 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold cursor-pointer"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-slate-800 dark:text-slate-100 p-4 sm:p-6 md:p-12 relative transition-colors duration-300 w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-8 pb-16">
        <ProjectHeader project={project} onBack={handleBack} />
        <ProjectTabs project={project} />
        <ProjectAiCompanion project={project} />
      </div>
    </div>
  );
};
