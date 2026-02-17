"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCalendar, FiClock } from "react-icons/fi";
import { getFeaturedArticles } from "@/lib/articles-data";

export function Articles() {
  const featuredArticles = getFeaturedArticles();

  return (
    <section
      id="articles"
      className="py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-white to-emerald-300 bg-clip-text text-transparent drop-shadow-2xl mb-4">
          Latest Articles
        </h2>
        <p className="text-white/70 text-sm md:text-base max-w-2xl mx-auto">
          Insights on web development, AI, and modern tech stacks
        </p>
        <div className="h-px mx-auto w-24 lg:w-32 bg-gradient-to-r from-emerald-400 via-white/60 to-transparent mt-6" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {featuredArticles.map((article, index) => (
          <motion.article
            key={article.slug}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300">
            <Link href={`/articles/${article.slug}`}>
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-semibold">
                  {article.category}
                </div>
              </div>
            </Link>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 text-xs text-white/60">
                <span className="flex items-center gap-1">
                  <FiCalendar className="size-3" />
                  {article.date}
                </span>
                <span className="flex items-center gap-1">
                  <FiClock className="size-3" />
                  {article.readTime}
                </span>
              </div>

              <Link href={`/articles/${article.slug}`}>
                <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {article.title}
                </h3>
              </Link>

              <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>

              <Link
                href={`/articles/${article.slug}`}
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors group/link">
                Read More
                <FiArrowRight className="size-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="flex justify-center">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105">
          View All Articles
          <FiArrowRight className="size-5" />
        </Link>
      </motion.div>
    </section>
  );
}
