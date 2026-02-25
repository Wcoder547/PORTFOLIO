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
    <section className="py-20 px-6 md:px-12 lg:px-16" id="articles">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Latest Articles
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Thoughts on web development, AI, and modern engineering
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article.slug}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300">
              <Link href={`/articles/${article.slug}`}>
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={article.image.url}
                    alt={article.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-semibold">
                    {article.category}
                  </div>
                  {article.featured && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold">
                      Featured
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 text-xs text-white/60">
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

        {/* View All */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all hover:scale-105">
            View All Articles
            <FiArrowRight className="size-4" />
          </Link>
        </motion.div>

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
