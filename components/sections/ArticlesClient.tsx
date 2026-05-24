"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiClock } from "react-icons/fi";
import { Article } from "@/lib/articles-data";

interface Props {
  articles: Article[];
}

export default function ArticlesClient({ articles }: Props) {
  return (
    <section className="py-28 px-6 lg:px-16 max-w-6xl mx-auto" id="articles">

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <div className="flex items-end justify-between pb-5 border-b border-white/10">
          <h2 className="text-[clamp(48px,7vw,88px)] font-bold text-white leading-none tracking-[-0.03em]">
            Articles
          </h2>
          {articles.length > 0 && (
            <span className="text-[11px] tracking-[0.25em] uppercase text-[#555] mb-2">
              {articles.length} posts
            </span>
          )}
        </div>
      </motion.div>

      {/* Empty state */}
      {articles.length === 0 && (
        <p className="text-[#444] text-base">No articles yet.</p>
      )}

      {/* Articles grid */}
      {articles.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/8">
            {articles.map((article, index) => (
              <motion.article
                key={article.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                className="group bg-[#0d0d0d] p-9 hover:bg-white/[0.03] transition-colors duration-300 flex flex-col"
              >
                {/* Thumbnail */}
                <Link href={`/articles/${article.slug}`}>
                  <div
                    className="relative h-52 overflow-hidden mb-6"
                    style={{ borderRadius: "2px" }}
                  >
                    <Image
                      src={article.image.url}
                      alt={article.title}
                      fill
                      unoptimized
                      className="object-cover opacity-75 group-hover:opacity-95 group-hover:scale-[1.03] transition-all duration-500"
                    />
                    {/* Category pill */}
                    <div className="absolute bottom-3 left-3">
                      <span
                        className="text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 bg-[#0d0d0d]/80 border border-white/15 text-[#888]"
                        style={{ borderRadius: "2px" }}
                      >
                        {article.category}
                      </span>
                    </div>
                    {article.featured && (
                      <div className="absolute top-3 right-3">
                        <span
                          className="text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 bg-[#0d0d0d]/80 border border-white/15 text-[#777]"
                          style={{ borderRadius: "2px" }}
                        >
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Meta */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center gap-1.5 text-[11px] text-[#555] tracking-wide">
                    <FiClock className="size-3" />
                    {article.readTime}
                  </span>
                  <span className="text-[#333]">·</span>
                  <span className="text-[11px] text-[#555] tracking-wide">
                    {article.date}
                  </span>
                </div>

                {/* Title */}
                <Link href={`/articles/${article.slug}`}>
                  <h3 className="text-[22px] font-semibold text-white leading-snug tracking-[-0.01em] mb-3 line-clamp-2 group-hover:text-[#ccc] transition-colors duration-200">
                    {article.title}
                  </h3>
                </Link>

                {/* Excerpt */}
                <p className="text-[15px] text-[#777] leading-[1.85] line-clamp-3 flex-1 font-light">
                  {article.excerpt}
                </p>

                {/* Read more */}
                <Link
                  href={`/articles/${article.slug}`}
                  className="inline-flex items-center gap-2 mt-6 text-[13px] tracking-[0.06em] uppercase text-[#666] hover:text-[#aaa] transition-colors duration-200 group/link"
                >
                  Read article
                  <FiArrowRight className="size-3.5 group-hover/link:translate-x-1 transition-transform duration-200" />
                </Link>
              </motion.article>
            ))}
          </div>

          {/* View all */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
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