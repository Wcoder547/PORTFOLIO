"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiClock, FiCalendar } from "react-icons/fi";
import { Article } from "@/lib/articles-data";

interface Props {
  articles: Article[];
}

export default function ArticlesClient({ articles }: Props) {
  return (
    <section className="py-28 px-6 lg:px-16 max-w-6xl mx-auto" id="articles">

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        className="mb-20"
      >
        <div className="flex items-end justify-between pb-5 border-b border-white/10">
          <h2 className="text-[clamp(48px,7vw,88px)] font-bold text-white leading-none tracking-[-0.03em]">
            Articles
          </h2>
          {articles.length > 0 && (
            <span className="text-[11px] tracking-[0.25em] uppercase text-[#555] mb-2 font-mono">
              {articles.length} posts
            </span>
          )}
        </div>
      </motion.div>

      {/* Empty state */}
      {articles.length === 0 && (
        <p className="text-[#444] text-base">No articles yet.</p>
      )}

      {/* Articles grid — 2 columns, wider cards */}
      {articles.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article, index) => (
              <motion.article
                key={article.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: index * 0.07 }}
                className="group flex flex-col border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15 transition-all duration-300 overflow-hidden"
                style={{ borderRadius: "10px" }}
              >
                {/* Thumbnail */}
                <Link href={`/articles/${article.slug}`} className="block relative h-56 overflow-hidden flex-shrink-0">
                  <Image
                    src={article.image.url}
                    alt={article.title}
                    fill
                    unoptimized
                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
                    style={{ borderRadius: "10px 10px 0 0" }}
                  />
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span
                      className="text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 bg-black/70 border border-white/15 text-[#aaa] backdrop-blur-sm"
                      style={{ borderRadius: "4px" }}
                    >
                      {article.category}
                    </span>
                  </div>
                  {article.featured && (
                    <div className="absolute top-3 right-3">
                      <span
                        className="text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 bg-black/70 border border-white/20 text-white backdrop-blur-sm"
                        style={{ borderRadius: "4px" }}
                      >
                        Featured
                      </span>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="flex flex-col flex-1 p-7">
                  {/* Meta row */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center gap-1.5 text-[11px] text-[#555] font-mono">
                      <FiClock className="size-3" strokeWidth={1.5} />
                      {article.readTime}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-[#555] font-mono">
                      <FiCalendar className="size-3" strokeWidth={1.5} />
                      {article.date}
                    </span>
                  </div>

                  {/* Title */}
                  <Link href={`/articles/${article.slug}`}>
                    <h3 className="text-[20px] font-semibold text-white leading-snug tracking-[-0.015em] mb-3 line-clamp-2 group-hover:text-[#ccc] transition-colors duration-200">
                      {article.title}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-[14px] text-[#666] leading-[1.85] line-clamp-2 flex-1 font-light mb-5">
                    {article.excerpt}
                  </p>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {article.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] tracking-[0.06em] uppercase px-2.5 py-1 border border-white/8 text-[#555]"
                          style={{ borderRadius: "4px" }}
                        >
                          #{tag}
                        </span>
                      ))}
                      {article.tags.length > 4 && (
                        <span
                          className="text-[10px] px-2.5 py-1 border border-white/6 text-[#444]"
                          style={{ borderRadius: "4px" }}
                        >
                          +{article.tags.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Read more */}
                  <div className="pt-4 border-t border-white/6">
                    <Link
                      href={`/articles/${article.slug}`}
                      className="inline-flex items-center gap-2 text-[12px] tracking-[0.08em] uppercase text-[#555] hover:text-white transition-colors duration-200 group/link"
                    >
                      Read article
                      <FiArrowRight className="size-3.5 group-hover/link:translate-x-1 transition-transform duration-200" strokeWidth={1.5} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* View all */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            className="mt-16"
          >
            <Link
              href="/articles"
              className="inline-flex items-center gap-3 px-6 py-3 border border-white/25 hover:border-white/60 text-[13px] text-[#999] hover:text-white transition-all duration-200 group/more"
              style={{ borderRadius: "2px" }}
            >
              View all articles
              <svg
                className="size-4 group-hover/more:translate-x-1 transition-transform duration-200"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </>
      )}
    </section>
  );
}