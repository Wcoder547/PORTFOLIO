"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCalendar, FiClock } from "react-icons/fi";
import { Article } from "@/lib/articles-data";

interface Props {
  articles: Article[];
}

export default function ArticlesClient({ articles }: Props) {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-16" id="articles">
      <div className="max-w-7xl mx-auto">
        {/* Header — matches Projects style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-white to-emerald-300 bg-clip-text text-transparent drop-shadow-2xl mb-6">
            Latest Articles
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Thoughts on web development, AI, and modern engineering
          </p>
          <div className="h-px mx-auto w-24 lg:w-32 bg-gradient-to-r from-emerald-400 via-white/60 to-transparent mt-6" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 overflow-hidden">
              {/* Thumbnail */}
              <Link href={`/articles/${article.slug}`}>
                <div className="relative h-48 rounded-xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                  <Image
                    src={article.image.url}
                    alt={article.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/90 text-white backdrop-blur-sm">
                    {article.category}
                  </div>
                  {article.featured && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white backdrop-blur-sm">
                      Featured
                    </div>
                  )}
                </div>
              </Link>

              {/* Content */}
              <div className="flex-1 flex flex-col mt-6 space-y-3">
                <div className="flex items-center gap-4 text-xs text-white/50">
                  <span className="flex items-center gap-1">
                    <FiCalendar className="size-3" /> {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiClock className="size-3" /> {article.readTime}
                  </span>
                </div>

                <Link href={`/articles/${article.slug}`}>
                  <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </Link>

                <p className="text-white/70 text-sm leading-relaxed line-clamp-3 flex-1">
                  {article.excerpt}
                </p>

                <Link
                  href={`/articles/${article.slug}`}
                  className="group/btn inline-flex items-center gap-2 mt-2">
                  <motion.span
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 hover:border-white/40 text-white text-sm font-medium transition-all duration-300">
                    Read More
                    <FiArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </motion.span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All */}
        {articles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 flex justify-center">
            <Link href="/articles" className="group">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 justify-center whitespace-nowrap rounded-full text-sm font-semibold border border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/50 px-8 py-4 transition-all duration-300 text-white shadow-xl hover:shadow-emerald-500/30">
                View All Articles
                <svg
                  className="size-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </motion.button>
            </Link>
          </motion.div>
        )}

        {/* Empty state */}
        {articles.length === 0 && (
          <div className="text-center py-20 text-white/40">
            <p>No featured articles yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
