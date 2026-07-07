import { useNavigate } from 'react-router-dom';
import { Link2, Linkedin, Twitter, Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { MarkdownRenderer } from '../../../components/ai/MarkdownRenderer';

export const BlogContentArea = ({ blog, handleShare, copied }) => {
  const navigate = useNavigate();
  if (!blog) return null;

  const navigateToBlog = (slug) => {
    navigate(`/blog/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start w-full max-w-full overflow-hidden">
      {/* Main Content Column */}
      <div className="lg:col-span-8 min-w-0 w-full space-y-6 text-left order-1 lg:order-2 overflow-hidden">
        <article className="prose prose-invert max-w-none prose-sm sm:prose-base">
          <MarkdownRenderer content={blog.content} />
        </article>

        {/* Next/Prev Article Navigation */}
        <div className="pt-10 mt-10 border-t border-slate-200 dark:border-slate-900">
          <div className="grid sm:grid-cols-2 gap-4">
            {blog.prevBlog ? (
              <button
                onClick={() => navigateToBlog(blog.prevBlog.slug)}
                className="group flex flex-col items-start gap-2 p-5 rounded-2xl bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900 hover:border-primary/45 transition-all duration-300 text-left cursor-pointer shadow-sm hover:shadow-primary/5"
              >
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-550 dark:text-slate-500 flex items-center gap-1.5 group-hover:text-primary transition-colors">
                  <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                  Previous Article
                </span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary dark:group-hover:text-primary-light transition-colors leading-snug">
                  {blog.prevBlog.title}
                </span>
              </button>
            ) : (
              <div className="hidden sm:block"></div>
            )}

            {blog.nextBlog ? (
              <button
                onClick={() => navigateToBlog(blog.nextBlog.slug)}
                className="group flex flex-col items-end gap-2 p-5 rounded-2xl bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900 hover:border-primary/45 transition-all duration-300 text-right cursor-pointer shadow-sm hover:shadow-primary/5 sm:col-start-2"
              >
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-550 dark:text-slate-500 flex items-center gap-1.5 group-hover:text-primary transition-colors">
                  Next Article
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary dark:group-hover:text-primary-light transition-colors leading-snug">
                  {blog.nextBlog.title}
                </span>
              </button>
            ) : (
              <div className="hidden sm:block"></div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Column */}
      <aside className="lg:col-span-4 space-y-6 text-left border-t lg:border-t-0 lg:border-r border-slate-900 pt-8 lg:pt-0 lg:pr-6 order-2 lg:order-1">
        {/* Social share panel */}
        <div className="space-y-4 border-t border-slate-900 pt-6">
          <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold">Share Telemetry</h4>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl glass hover:text-primary transition-colors cursor-pointer flex items-center justify-center flex-1 sm:flex-initial"
              title="Copy Link"
            >
              {copied ? (
                <span className="text-[10px] font-semibold text-emerald-400">Copied Link!</span>
              ) : (
                <Link2 size={16} />
              )}
            </button>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl glass hover:text-primary transition-colors flex items-center justify-center flex-1 sm:flex-initial"
              title="Share on LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl glass hover:text-primary transition-colors flex items-center justify-center flex-1 sm:flex-initial"
              title="Share on Twitter"
            >
              <Twitter size={16} />
            </a>
          </div>
        </div>

        {/* Author Bio Panel */}
        {/* Author Bio */}
        <div className=" mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center text-white font-extrabold text-lg shadow-lg">
                SK
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Sicky Kumar
                </h3>

                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  <Star size={10} className="fill-current" />
                  Verified Author
                </span>
              </div>

              <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                MERN Stack Developer • Full Stack Engineer • Technical Blogger
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Hi, I'm <strong>Sicky Kumar</strong>, a passionate MERN Stack Developer
                who enjoys building modern web applications with
                <strong> React</strong>, <strong>Node.js</strong>,
                <strong> Express.js</strong>, <strong>MongoDB</strong>,
                <strong> Tailwind CSS</strong>, and AI-powered technologies.
                Through this blog, I share practical tutorials, real-world projects,
                deployment guides, JavaScript tips, React best practices, and full-stack
                development articles to help developers learn faster and build
                production-ready applications.
              </p>

              {/* Expertise */}
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "React",
                  "Node.js",
                  "Express.js",
                  "MongoDB",
                  "JavaScript",
                  "Tailwind CSS",
                  "Next.js",
                  "AI",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Trust */}
              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span>📚 Practical Tutorials</span>
                <span>⚡ Production Ready Code</span>
                <span>🚀 SEO Friendly Guides</span>
                <span>💻 Full Stack Development</span>
              </div>
            </div>


          </div>
        </div>
      </aside>
    </div>
  );
};
