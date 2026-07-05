import { ChevronLeft, Calendar, Clock, BookOpen, Sparkles, User, RefreshCcw } from 'lucide-react';
import { AudioReader } from '../ai/AudioReader';

export const BlogHeaderHub = ({ blog, handleBack }) => {
  if (!blog) return null;

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <button
        onClick={handleBack}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary transition-colors cursor-pointer group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Articles
      </button>

      {/* Header Info */}
      <div className="space-y-4 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-[10px] font-extrabold uppercase tracking-widest shadow-md">
            {blog.category}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-slate-800 bg-slate-950 text-slate-400 text-[9px] font-mono">
            Complexity: <span className="text-secondary font-bold">{blog.complexity || 'Intermediate'}</span>
          </span>
        </div>

        <div className="max-w-full mx-auto">
          <h1 className="pb-4 font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-[-0.03em] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400">
            {blog.title}
          </h1>
        </div>

        {/* Metadata row */}
        {/* Blog Meta */}
        <div className="flex flex-wrap items-center gap-3 py-4 border-y border-slate-200 dark:border-slate-800 text-sm">

          {/* Published Date */}
          <div className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-900 px-3 py-1.5">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-slate-700 dark:text-slate-300">
              Published{" "}
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Reading Time */}
          <div className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-900 px-3 py-1.5">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-slate-700 dark:text-slate-300">
              {blog.readTime || "5 min read"}
            </span>
          </div>

          {/* Author */}
          <div className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-900 px-3 py-1.5">
            <User className="w-4 h-4 text-primary" />
            <span className="text-slate-700 dark:text-slate-300">
              Sicky Kumar
            </span>
          </div>

          {/* Updated */}
          {blog.updatedAt && (
            <div className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-900 px-3 py-1.5">
              <RefreshCcw className="w-4 h-4 text-primary" />
              <span className="text-slate-700 dark:text-slate-300">
                Updated{" "}
                {new Date(blog.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          )}

        </div>
      </div>

      {/* ─── AUDIO PLAYBACK WAVEFORM PANEL ─── */}
      <AudioReader text={blog.content} />

      {/* Premium Hero Banner */}
      <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl group">

        {/* Hero Image */}
        {blog.thumbnail ? (
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full aspect-[16/8] object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
          />
        ) : (
          <div className="aspect-[16/8] flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 dark:from-slate-900 dark:via-slate-950 dark:to-black">
            <BookOpen className="w-20 h-20 text-primary/70" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">

          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 text-xs text-white mb-4">
            📖 {blog.category || "Web Development"}
          </div>

          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight max-w-4xl">
            {blog.title}
          </h2>

        </div>

      </div>
      
      {/* ───────────────── TL;DR / Key Takeaways ───────────────── */}
      {blog.tldr && blog.tldr.length > 0 && (
        <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50 to-primary/5 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 sm:p-8 shadow-lg">

          {/* Background Blur */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-secondary/10 blur-3xl" />

          {/* Header */}
          <div className="relative flex items-center gap-3 mb-6">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                TL;DR
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-400">
                Key takeaways from this article in under 30 seconds.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="relative grid gap-4">

            {blog.tldr.map((bullet, index) => (

              <div
                key={index}
                className="group flex items-start gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
              >

                {/* Number */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white shadow-md">
                  {index + 1}
                </div>

                {/* Text */}
                <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
                  {bullet}
                </p>

              </div>

            ))}

          </div>

        </section>
      )}

    </div>
  );
};
