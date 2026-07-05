import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

import { RevealOnScroll, SectionHeading } from "../components/ui/Animations";
import { useApi } from "../hooks/useApi";
import { fetchTestimonials } from "../api";

const FALLBACK_TESTIMONIALS = [
  {
    name: "Prof. Rajesh Sharma",
    role: "Faculty Mentor, MCKVIE",
    text: "Sicky consistently demonstrates exceptional problem-solving skills and a strong work ethic. His projects show a deep understanding of full-stack development principles.",
    avatar: "👨‍🏫",
  },
  {
    name: "Ankit Verma",
    role: "Team Lead, College Project",
    text: "Working with Sicky was a great experience. He delivered clean, well-documented code and was always willing to help teammates understand complex concepts.",
    avatar: "👨‍💻",
  },
  {
    name: "Priya Das",
    role: "Peer Developer",
    text: "His attention to detail and passion for creating polished user interfaces really sets him apart. The AgriConnect project was incredibly well-executed.",
    avatar: "👩‍💻",
  },
];

export const Testimonials = () => {
  const {
    data,
    loading,
    error,
  } = useApi(fetchTestimonials, FALLBACK_TESTIMONIALS);

  // Always use safe data
  const testimonials =
    Array.isArray(data) && data.length > 0
      ? data
      : FALLBACK_TESTIMONIALS;

  const [current, setCurrent] = useState(0);

  // Keep current index valid
  useEffect(() => {
    if (current >= testimonials.length) {
      setCurrent(0);
    }
  }, [current, testimonials]);

  if (loading) {
    return (
      <section id="testimonials" className="section-padding">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            Loading testimonials...
          </p>
        </div>
      </section>
    );
  }

  if (!testimonials.length) {
    return null;
  }

  const testimonial = testimonials[current];

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section id="testimonials" className="section-padding relative">
      <div className="max-w-6xl mx-auto px-6">

        <SectionHeading
          label="Testimonials"
          title="What People Say"
          description="Feedback from mentors, peers, and collaborators I've worked with."
        />

        {error && (
          <p className="text-center text-sm text-yellow-600 dark:text-yellow-400 mb-6">
            Backend data unavailable. Showing demo testimonials.
          </p>
        )}

        <RevealOnScroll>
          <div className="max-w-3xl mx-auto relative">

            <div className="glass rounded-[32px] p-10 sm:p-12 relative overflow-hidden min-h-[280px]">

              <Quote
                size={48}
                className="absolute top-6 right-8 text-primary/10 dark:text-primary/5"
              />

              <AnimatePresence mode="wait">

                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >

                  <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-200 leading-relaxed italic mb-8">
                    &ldquo;{testimonial?.text}&rdquo;
                  </p>

                  <div className="flex items-center gap-4">

                    {testimonial?.avatar && (testimonial.avatar.startsWith("http") || testimonial.avatar.startsWith("/")) ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-primary"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-primary/10 dark:bg-primary/5 flex items-center justify-center border-2 border-primary">
                        <span className="text-3xl">
                          {testimonial?.avatar || "🙂"}
                        </span>
                      </div>
                    )}

                    <div>

                      <h4
                        className="text-base font-bold text-slate-900 dark:text-white"
                        style={{
                          fontFamily: "Satoshi, sans-serif",
                        }}
                      >
                        {testimonial?.name || "Anonymous"}
                      </h4>

                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {testimonial?.role || ""}
                      </p>

                    </div>

                  </div>

                </motion.div>

              </AnimatePresence>

            </div>

            <div className="flex items-center justify-center gap-4 mt-8">

              <button
                onClick={prev}
                className="p-3 rounded-xl glass text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light transition-colors cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex gap-2">

                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === current
                        ? "w-8 bg-primary"
                        : "w-2 bg-slate-300 dark:bg-slate-600"
                      }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}

              </div>

              <button
                onClick={next}
                className="p-3 rounded-xl glass text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light transition-colors cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight size={18} />
              </button>

            </div>

          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
};
