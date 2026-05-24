"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { FiArrowLeft, FiArrowRight, FiAlertCircle, FiRefreshCw } from "react-icons/fi";

interface Testimonial {
  _id: string;
  quote: string;
  author: string;
  title: string;
  location: string;
  avatar?: { url: string };
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
        throw new Error(`Server returned ${res.status} ${res.statusText} (non-JSON).`);
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

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  const total = testimonials.length;
  const next = () => setCurrent((p) => (p + 1) % total);
  const prev = () => setCurrent((p) => (p - 1 + total) % total);

  return (
    <section id="testimonials" className="py-28 px-6 lg:px-16 max-w-6xl mx-auto">

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <div className="flex items-end justify-between pb-5 border-b border-white/10">
          <h2 className="text-[clamp(48px,7vw,88px)] font-bold text-white leading-none tracking-[-0.03em]">
            Testimonials
          </h2>
          {!loading && testimonials.length > 0 && (
            <span className="text-[11px] tracking-[0.25em] uppercase text-[#555] mb-2">
              {testimonials.length} reviews
            </span>
          )}
        </div>
      </motion.div>

      {/* Loading skeleton */}
      {loading && (
        <div className="animate-pulse space-y-6 max-w-3xl">
          <div className="h-5 w-2/3 bg-white/5 rounded" />
          <div className="h-5 w-full bg-white/5 rounded" />
          <div className="h-5 w-1/2 bg-white/5 rounded" />
          <div className="flex items-center gap-4 mt-8">
            <div className="w-14 h-14 rounded-full bg-white/5" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-white/5 rounded" />
              <div className="h-3 w-24 bg-white/5 rounded" />
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <FiAlertCircle className="size-8 text-[#666]" />
          <p className="text-[#555] text-sm max-w-md">{error}</p>
          <button
            onClick={fetchTestimonials}
            className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-[#888] hover:text-white hover:border-white/25 text-sm transition-all duration-200"
            style={{ borderRadius: "2px" }}
          >
            <FiRefreshCw className="size-4" /> Try again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && testimonials.length === 0 && (
        <p className="text-[#444] text-base">No testimonials yet.</p>
      )}

      {/* Carousel */}
      {!loading && !error && testimonials.length > 0 && (
        <div className="relative">
          {/* Slide */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((t, index) => (
                <div key={t._id} className="w-full shrink-0">
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 lg:gap-20 items-start py-2">

                    {/* Left — quote */}
                    <div className="space-y-8">
                      {/* Big quote mark */}
                      <span className="text-[80px] leading-none text-[#222] font-serif select-none">
                        &ldquo;
                      </span>
                      <blockquote className="text-[20px] lg:text-[24px] text-[#ccc] leading-[1.75] font-light tracking-[-0.01em] -mt-10">
                        {t.quote}
                      </blockquote>

                      {/* Nav — only when multiple */}
                      {total > 1 && (
                        <div className="flex items-center gap-4 pt-4">
                          <button
                            onClick={prev}
                            aria-label="Previous"
                            className="w-10 h-10 border border-white/15 text-[#666] hover:text-white hover:border-white/35 transition-all duration-200 flex items-center justify-center"
                            style={{ borderRadius: "2px" }}
                          >
                            <FiArrowLeft className="size-4" />
                          </button>
                          <button
                            onClick={next}
                            aria-label="Next"
                            className="w-10 h-10 border border-white/15 text-[#666] hover:text-white hover:border-white/35 transition-all duration-200 flex items-center justify-center"
                            style={{ borderRadius: "2px" }}
                          >
                            <FiArrowRight className="size-4" />
                          </button>
                          <span className="text-[12px] text-[#444] font-mono tracking-widest ml-2">
                            {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Right — author */}
                    <div className="flex flex-col items-start lg:items-end gap-4 pt-2">
                      {/* Avatar */}
                      {t.avatar?.url ? (
                        <Image
                          src={t.avatar.url}
                          alt={t.author}
                          width={72}
                          height={72}
                          unoptimized
                          className="object-cover opacity-80"
                          style={{ borderRadius: "2px", width: 72, height: 72 }}
                        />
                      ) : (
                        <div
                          className="w-[72px] h-[72px] border border-white/10 bg-white/[0.04] flex items-center justify-center"
                          style={{ borderRadius: "2px" }}
                        >
                          <span className="text-[22px] font-bold text-[#333] tracking-tight">
                            {t.author.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}

                      {/* Author info */}
                      <div className="lg:text-right space-y-1">
                        <p className="text-[17px] font-semibold text-white tracking-[-0.01em]">
                          {t.author}
                        </p>
                        <p className="text-[13px] text-[#888] font-light">
                          {t.title}
                        </p>
                        <p className="text-[12px] text-[#555] font-light tracking-wide">
                          {t.location}
                        </p>
                      </div>

                      {/* Index indicator */}
                      <span className="text-[11px] text-[#333] font-mono tracking-widest mt-2">
                        _{String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}