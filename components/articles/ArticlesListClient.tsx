"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiSearch,
  FiArrowRight,
  FiX,
} from "react-icons/fi";
import { Article } from "@/lib/articles-data";

interface Props {
  articles: Article[];
  categories: string[];
}

export default function ArticlesListClient({ articles, categories }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === "All" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const hasFilters = selectedCategory !== "All" || searchQuery.trim() !== "";

  return (
    <main className="min-h-screen py-16 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto">

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[13px] text-[#555] hover:text-white transition-colors duration-200 group"
          >
            <FiArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform duration-200" strokeWidth={1.5} />
            Back to home
          </Link>
        </motion.div>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-16"
        >
          <div className="flex items-end justify-between pb-5 border-b border-white/10">
            <h1 className="text-[clamp(48px,7vw,88px)] font-bold text-white leading-none tracking-[-0.03em]">
              Articles
            </h1>
            <span className="text-[11px] tracking-[0.25em] uppercase text-[#555] mb-2 font-mono">
              {filteredArticles.length} {filteredArticles.length === 1 ? "piece" : "pieces"}
            </span>
          </div>
        </motion.div>

        {/* Search + filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="mb-12 space-y-6"
        >
          {/* Search */}
          <div className="relative max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#444]" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white/[0.04] border border-white/10 text-white text-[13px] placeholder-[#444] focus:outline-none focus:border-white/30 transition-colors duration-150"
              style={{ borderRadius: "2px" }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888] transition-colors"
              >
                <FiX className="size-4" strokeWidth={1.5} />
              </button>
            )}
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] tracking-[0.1em] uppercase px-3 py-[7px] border transition-all duration-150 ${
                  selectedCategory === cat
                    ? "border-white/40 text-white bg-white/8"
                    : "border-white/8 text-[#555] hover:text-[#999] hover:border-white/18"
                }`}
                style={{ borderRadius: "2px" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Article list */}
        <AnimatePresence mode="wait">
          {filteredArticles.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-0"
            >
              {filteredArticles.map((article, index) => (
                <motion.article
                  key={article.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="group grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-16 py-12 border-b border-white/8 items-start"
                >
                  {/* Left — text */}
                  <div className="space-y-4 order-2 lg:order-1">
                    {/* Index + category + featured */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[12px] text-[#444] font-mono tracking-widest">
                        _{String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 border border-white/10 text-[#666]"
                        style={{ borderRadius: "2px" }}
                      >
                        {article.category}
                      </span>
                      {article.featured && (
                        <span
                          className="text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 border border-white/15 text-[#888]"
                          style={{ borderRadius: "2px" }}
                        >
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <Link href={`/articles/${article.slug}`}>
                      <h2 className="text-[20px] lg:text-[24px] font-semibold text-white tracking-[-0.02em] leading-snug hover:text-[#ccc] transition-colors duration-150">
                        {article.title}
                      </h2>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-[14px] text-[#777] leading-[1.85] font-light max-w-lg line-clamp-3">
                      {article.excerpt}
                    </p>

                    {/* Meta + read link */}
                    <div className="flex items-center gap-5 pt-1 flex-wrap">
                      <span className="flex items-center gap-1.5 text-[12px] text-[#444] font-mono">
                        <FiCalendar className="size-3" strokeWidth={1.5} />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1.5 text-[12px] text-[#444] font-mono">
                        <FiClock className="size-3" strokeWidth={1.5} />
                        {article.readTime}
                      </span>
                      <Link
                        href={`/articles/${article.slug}`}
                        className="lg:ml-auto flex items-center gap-1.5 text-[13px] text-[#666] hover:text-white transition-colors duration-200 group/link"
                      >
                        Read article
                        <FiArrowRight className="size-3.5 group-hover/link:translate-x-0.5 transition-transform duration-200" strokeWidth={1.5} />
                      </Link>
                    </div>
                  </div>

                  {/* Right — thumbnail */}
                  <Link
                    href={`/articles/${article.slug}`}
                    className="order-1 lg:order-2 block overflow-hidden"
                    style={{ borderRadius: "2px" }}
                  >
                    <div className="relative h-48 lg:h-52 overflow-hidden">
                      <Image
                        src={article.image.url}
                        alt={article.title}
                        fill
                        unoptimized
                        className="object-cover opacity-75 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
                      />
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center space-y-4"
            >
              <p className="text-[#444] text-[15px]">No articles match your filters.</p>
              {hasFilters && (
                <button
                  onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                  className="text-[13px] text-[#555] hover:text-white transition-colors duration-150 underline underline-offset-4"
                >
                  Clear filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}