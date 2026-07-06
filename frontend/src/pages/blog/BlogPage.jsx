import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Rss, Terminal, Database, Zap, Brain,
  Calendar, Clock, BookOpen, ChevronRight, Sliders,
  TrendingUp, Award, Activity, Search
} from 'lucide-react';
import { fetchBlogs } from '../../api/index.js';
import { TiltCard } from '../../components/ui/TiltCard';

export const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      window.dispatchEvent(new CustomEvent('start-global-loading'));
      setLoading(true);
      try {
        const fetchedBlogs = await fetchBlogs();
        setBlogs(Array.isArray(fetchedBlogs) ? fetchedBlogs : []);
      } catch (err) {
        console.error('Error loading blogs', err);
      } finally {
        setLoading(false);
        window.dispatchEvent(new CustomEvent('stop-global-loading'));
      }
    };
    loadBlogs();
  }, []);

  if (loading) {
    return null;
  }

  // RSS Feed served live from Vercel Serverless Function → direct MongoDB query
  // URL: https://www.sickykumar.in/api/rss
  const rssUrl = '/api/rss';

  // Featured Blog: Pick the first featured, or fallback to first overall
  const featuredBlog = blogs.find(b => b.featured) || blogs[0];

  // Grid blogs (excluding the featured one to prevent duplicates)
  const gridBlogs = blogs.filter(b => b.slug !== (featuredBlog?.slug || ''));

  const navigateToBlogDetails = (slug) => {
    window.history.pushState({}, '', `/blog/${slug}`);
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Web Development':
        return <Terminal className="w-4 h-4 text-cyan-400" />;
      case 'Backend':
        return <Database className="w-4 h-4 text-emerald-400" />;
      case 'Tools & DevOps':
        return <Zap className="w-4 h-4 text-purple-400" />;
      default:
        return <Brain className="w-4 h-4 text-pink-400" />;
    }
  };

  // Complexity Visual styles mapping
  const getComplexityBadge = (level) => {
    switch (level) {
      case 'Beginner':
        return 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5 shadow-[0_0_10px_rgba(16,185,129,0.05)]';
      case 'Advanced':
        return 'border-purple-500/30 text-purple-400 bg-purple-500/5 shadow-[0_0_10px_rgba(168,85,247,0.05)]';
      default: // Intermediate
        return 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5 shadow-[0_0_10px_rgba(6,182,212,0.05)]';
    }
  };

  const getComplexityGlow = (level) => {
    switch (level) {
      case 'Beginner':
        return 'group-hover:border-emerald-500/40 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]';
      case 'Advanced':
        return 'group-hover:border-purple-500/40 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]';
      default: // Intermediate
        return 'group-hover:border-cyan-500/40 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]';
    }
  };

  return (
    <div className="relative text-slate-800 dark:text-slate-100 max-w-6xl mx-auto px-6 pt-2 pb-12 md:pt-4 md:pb-20 space-y-20 sm:space-y-28 overflow-hidden">
      {/* SaaS mesh backgrounds */}
      <div className="absolute top-[-5%] left-[10%] w-[450px] h-[450px] bg-gradient-to-br from-primary/20 via-transparent to-secondary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-tr from-accent/15 via-transparent to-primary/10 rounded-full blur-[125px] pointer-events-none" />

      {/* ─── HERO TELEMETRY SECTION ─── */}
      <section className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7 space-y-4 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold text-primary-light uppercase tracking-wider shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[10px] text-slate-400">Telemetry Link Active</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none font-heading bg-gradient-to-b from-slate-900 via-slate-800 to-slate-650 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            SaaS Engineering,
            <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-black">
              Code & Architectures
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
            A future-proof engineering blog exploring Next.js Server Actions, REST/GraphQL orchestration, high-speed DB indexes, and 2030 SaaS interfaces.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => document.getElementById('articles-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 bg-gradient-to-r from-primary via-secondary to-accent hover:shadow-lg hover:shadow-primary/25 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-2"
            >
              Read Articles <ArrowRight size={15} />
            </button>
            <a
              href={rssUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-white/60 dark:bg-slate-950/60 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Rss size={15} className="text-secondary" /> RSS Telemetry
            </a>
          </div>

          {/* Telemetry Counter Dashboard Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 max-w-xl">
            <div className="p-3 rounded-2xl glass border border-slate-200 dark:border-slate-900 text-left relative overflow-hidden">
              <span className="absolute top-2 right-2 w-1 h-1 rounded-full bg-cyan-400"></span>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1"><BookOpen size={11} /> INDEX</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">25+</div>
              <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-0.5 mt-1"><TrendingUp size={10} /> +12% MoM</span>
            </div>
            <div className="p-3 rounded-2xl glass border border-slate-200 dark:border-slate-900 text-left relative overflow-hidden">
              <span className="absolute top-2 right-2 w-1 h-1 rounded-full bg-purple-400"></span>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1"><Activity size={11} /> SYNCS</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">10K+</div>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono mt-1 block">Live counters</span>
            </div>
            <div className="p-3 rounded-2xl glass border border-slate-200 dark:border-slate-900 text-left relative overflow-hidden">
              <span className="absolute top-2 right-2 w-1 h-1 rounded-full bg-pink-400"></span>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1"><Award size={11} /> FANS</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">5K+</div>
              <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-0.5 mt-1"><TrendingUp size={10} /> +8.4% growth</span>
            </div>
            <div className="p-3 rounded-2xl glass border border-slate-200 dark:border-slate-900 text-left relative overflow-hidden">
              <span className="absolute top-2 right-2 w-1 h-1 rounded-full bg-emerald-400"></span>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1"><Terminal size={11} /> UPTIME</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">99.9%</div>
              <span className="text-[9px] text-slate-500 font-mono mt-1 block">API nodes active</span>
            </div>
          </div>
        </div>

        {/* Interactive 3D HUD Laptop Display */}
        <div className="lg:col-span-5 hidden lg:flex items-center justify-center relative min-h-[380px]">
          {/* Glowing ring backdrops */}
          <div className="absolute w-80 h-80 rounded-full border border-primary/20 animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute w-64 h-64 rounded-full border border-dashed border-secondary/15 animate-spin" style={{ animationDuration: '35s', direction: 'reverse' }} />

          {/* Futuristic Panel */}
          <div className="relative w-80 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-[0_30px_70px_rgba(99,102,241,0.15)] flex flex-col justify-between overflow-hidden z-10 hover:-translate-y-2 transition-transform duration-500">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
              </div>
              <div className="text-[9px] font-mono text-slate-500">ENGINE_TELEMETRY.JSON</div>
            </div>

            <div className="space-y-3 font-mono text-[10px] text-slate-400 text-left select-none">
              <div className="text-primary font-bold">➜ sys.health_check()</div>
              <div className="grid grid-cols-2 gap-2 text-slate-500">
                <div className="p-1.5 bg-slate-900/50 rounded border border-slate-850">
                  <span className="text-white">API_Latency</span>: 24ms
                </div>
                <div className="p-1.5 bg-slate-900/50 rounded border border-slate-850">
                  <span className="text-white">SEO_Index</span>: 100%
                </div>
              </div>
              <div className="text-slate-500 text-[9px] leading-relaxed">
                <span className="text-emerald-400">SUCCESS:</span> loaded schemas for Google crawler bot.<br />
                <span className="text-secondary">LOAD_TIME:</span> 0.08s speed score.<br />
                <span className="text-accent">ROUTER:</span> popstate customer hooks parsed.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DYNAMIC HERO FEATURED POST ─── */}
      <section id="articles-section" className="relative z-10 text-left">
        <AnimatePresence mode="wait">
          {featuredBlog ? (
            <motion.div
              key={featuredBlog.slug}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              onClick={() => navigateToBlogDetails(featuredBlog.slug)}
              className="group cursor-pointer rounded-3xl glass border border-slate-200 dark:border-slate-900 overflow-hidden hover:border-slate-350 dark:hover:border-slate-800 transition-all duration-500 shadow-3xl hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)] flex flex-col md:grid md:grid-cols-12"
            >
              {/* Left Side: Thumbnail cover with responsive scale */}
              <div className="md:col-span-7 h-60 sm:h-80 md:h-[420px] w-full overflow-hidden bg-slate-950 relative border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-900">
                {featuredBlog.thumbnail ? (
                  <img
                    src={featuredBlog.thumbnail}
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-slate-650">
                    <BookOpen size={48} />
                  </div>
                )}
                {/* Featured Neon Badge */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Featured Post
                </div>
              </div>

              {/* Right Side: Key Takeaway panel details */}
              <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-primary-light font-black uppercase tracking-wider font-mono">
                      {featuredBlog.category}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${getComplexityBadge(featuredBlog.complexity)}`}>
                      {featuredBlog.complexity}
                    </span>
                  </div>

                  <h3 className="font-black text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight group-hover:text-primary transition-colors font-heading leading-tight">
                    {featuredBlog.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {featuredBlog.description}
                  </p>

                  {/* Highlights / TL;DR list preview */}
                  {featuredBlog.tldr && featuredBlog.tldr.length > 0 && (
                    <div className="pt-2.5 space-y-2 border-t border-slate-200 dark:border-slate-900">
                      <div className="text-[9px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400">Core Index Key Takeaways:</div>
                      {featuredBlog.tldr.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-start text-xs text-slate-700 dark:text-slate-350">
                          <span className="text-secondary select-none font-bold">▪</span>
                          <p className="line-clamp-1 leading-snug">{item}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-900">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5">
                    <Calendar size={10} />
                    <span>{new Date(featuredBlog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span>•</span>
                    <Clock size={10} />
                    <span>{featuredBlog.readTime}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center p-16 glass border border-slate-200 dark:border-slate-900 rounded-3xl text-slate-500">
              No articles published yet. Stay tuned, or publish some blogs from the admin panel!
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* ─── SAAS MESH CARDS GRID ─── */}
      {featuredBlog && gridBlogs.length > 0 && (
        <section className="relative z-10 space-y-8 text-left">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-900 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-heading">
              Additional Telemetry Logs
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Found {gridBlogs.length} logs</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridBlogs.map((blog) => (
              <TiltCard key={blog.slug} className="w-full">
                <div
                  onClick={() => navigateToBlogDetails(blog.slug)}
                  className={`group cursor-pointer rounded-2xl glass border border-slate-200 dark:border-slate-900 overflow-hidden flex flex-col justify-between hover:border-primary/45 dark:hover:border-primary-light/45 transition-all duration-500 h-full shadow-md hover:shadow-primary/10 ${getComplexityGlow(blog.complexity)}`}
                >
                  {/* Thumbnail / Header */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-950 border-b border-slate-200 dark:border-slate-900">
                    <img
                      src={blog.thumbnail || '/images/blogs/ai_saas_cover.webp'}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg">
                        {getCategoryIcon(blog.category)}
                      </div>
                      <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded backdrop-blur-md shadow-lg ${getComplexityBadge(blog.complexity)}`}>
                        {blog.complexity}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-3 text-left">
                      <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                        <Calendar size={10} />
                        <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>

                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight group-hover:text-primary dark:group-hover:text-primary-light transition-colors font-heading leading-snug line-clamp-2">
                        {blog.title}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {blog.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-900 pt-4 mt-2">
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono flex items-center gap-1">
                        <Clock size={10} />
                        {blog.readTime}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:text-primary group-hover:bg-primary/10 group-hover:border-primary/30 transition-all">
                        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
