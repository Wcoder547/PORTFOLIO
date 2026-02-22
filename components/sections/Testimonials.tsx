"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiStar,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

interface Testimonial {
  _id: string;
  quote: string;
  author: string;
  title: string;
  location: string;
  avatar?: { url: string };
}

function TestimonialSkeleton() {
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-zinc-950/80 p-8 min-h-[320px] animate-pulse space-y-6">
      <div className="flex justify-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-5 w-5 rounded-full bg-white/10" />
        ))}
      </div>
      <div className="space-y-2 mx-auto max-w-md">
        <div className="h-4 bg-white/10 rounded w-full" />
        <div className="h-4 bg-white/10 rounded w-5/6 mx-auto" />
        <div className="h-4 bg-white/10 rounded w-4/6 mx-auto" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="h-16 w-16 rounded-full bg-white/10" />
        <div className="h-4 bg-white/10 rounded w-32" />
        <div className="h-3 bg-white/10 rounded w-24" />
      </div>
    </div>
  );
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/testimonials");

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error(
          `Server returned ${res.status} ${res.statusText} (non-JSON). ` +
            `Make sure /api/testimonials/route.ts exists and MONGODB_URI is set in .env.local.`,
        );
      }

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to fetch");
      setTestimonials(json.data ?? []);
      setCurrent(0);
    } catch (err: unknown) {
      console.error("[Testimonials fetch]", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const total = testimonials.length;
  const next = () => setCurrent((prev) => (prev + 1) % total);
  const prev = () => setCurrent((prev) => (prev - 1 + total) % total);
  const goTo = (index: number) => setCurrent(index);

  return (
    <section
      id="testimonials"
      className="py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-white to-emerald-300 bg-clip-text text-transparent drop-shadow-2xl mb-4">
          Client Testimonials
        </h2>
        <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto">
          Real words from founders, directors, and teams I have worked with.
        </p>
        <div className="h-px mx-auto w-24 lg:w-32 bg-gradient-to-r from-emerald-400 via-white/60 to-transparent mt-6" />
      </motion.div>

      {loading && (
        <div className="max-w-4xl mx-auto">
          <TestimonialSkeleton />
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center gap-4 py-16 text-center max-w-lg mx-auto">
          <FiAlertCircle className="size-10 text-red-400" />
          <p className="text-red-300 text-sm">{error}</p>
          <button
            onClick={fetchTestimonials}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-all border border-white/20">
            <FiRefreshCw className="size-4" /> Try again
          </button>
        </div>
      )}

      {!loading && !error && testimonials.length === 0 && (
        <p className="text-center text-white/50 py-16">No testimonials yet.</p>
      )}

      {!loading && !error && testimonials.length > 0 && (
        <div
          className="relative mx-auto w-full max-w-sm px-2 sm:max-w-sm sm:px-4 md:max-w-3xl lg:max-w-4xl"
          role="region"
          aria-label="Testimonials carousel">
          <div
            className="w-full overflow-hidden rounded-2xl bg-black/10 border border-white/10"
            tabIndex={0}
            aria-roledescription="carousel"
            aria-live="polite">
            <div
              id="testimonials-track"
              className="flex duration-500 ease-out transition-transform"
              style={{ transform: `translateX(-${current * 100}%)` }}>
              {testimonials.map((t, index) => (
                <div
                  key={t._id}
                  className="w-full shrink-0 px-2 sm:px-4 md:px-6"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${total}`}>
                  <div className="bg-zinc-950/80 text-white group min-h-[320px] rounded-2xl border border-white/10 p-5 shadow-sm transition-all hover:shadow-xl sm:min-h-[340px] sm:p-6 md:p-8 lg:p-10">
                    <div className="mb-6 flex justify-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FiStar
                          key={i}
                          className="size-4 sm:size-5 md:size-6 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>

                    <blockquote className="mb-6 text-center text-sm italic leading-relaxed sm:text-sm md:text-lg lg:text-xl text-white/80">
                      &quot;{t.quote}&quot;
                    </blockquote>

                    <div className="flex flex-col items-center">
                      {t.avatar?.url ? (
                        <Image
                          alt={t.author}
                          src={t.avatar.url}
                          width={80}
                          height={80}
                          unoptimized
                          className="mb-4 size-12 sm:size-16 md:size-20 rounded-full border-4 border-white/20 object-cover"
                        />
                      ) : (
                        <div className="mb-4 size-12 sm:size-16 md:size-20 rounded-full border-4 border-white/20 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center text-lg sm:text-xl font-bold text-white">
                          {t.author.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="text-center">
                        <div className="text-base sm:text-lg md:text-xl font-semibold text-white">
                          {t.author}
                        </div>
                        <div className="text-xs sm:text-sm text-white/70">
                          {t.title}
                        </div>
                        <div className="text-xs sm:text-sm text-white/60">
                          {t.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prev / Next — only show when more than 1 */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous testimonial"
                className="bg-black/70 hover:bg-black/90 absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full p-1.5 shadow-lg transition-all sm:inline-flex sm:p-2 md:p-3">
                <FiArrowLeft className="size-4 sm:size-5 md:size-6" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className="bg-black/70 hover:bg-black/90 absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full p-1.5 shadow-lg transition-all sm:inline-flex sm:p-2 md:p-3">
                <FiArrowRight className="size-4 sm:size-5 md:size-6" />
              </button>
            </>
          )}

          {/* Dots */}
          {total > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={current === index}
                  className={`size-2.5 sm:size-3 rounded-full transition-all ${
                    current === index
                      ? "bg-emerald-400"
                      : "bg-zinc-600 hover:bg-zinc-500"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
