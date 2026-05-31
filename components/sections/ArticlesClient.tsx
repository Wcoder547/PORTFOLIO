"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiClock, FiCalendar } from "react-icons/fi";
import { useEffect, useState } from "react";

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  image: {
    public_id?: string;
    url: string;
  };
  featured: boolean;
  published: boolean;
  readTime: string;
  date: string;
  author?: {
    name: string;
    bio: string;
    avatar: string;
  };
  tableOfContents?: {
    id: string;
    title: string;
  }[];
}

export default function ArticlesClient() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedArticles() {
      try {
        const res = await fetch("/api/articles?featured=true", {
          cache: "no-store",
        });

        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          setArticles(json.data);
        } else if (Array.isArray(json.data)) {
          setArticles(json.data);
        } else if (Array.isArray(json)) {
          setArticles(json);
        } else {
          setArticles([]);
        }
      } catch (error) {
        console.error("Failed to fetch featured articles:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedArticles();
  }, []);

  if (loading) {
    return (
      <section
        className="py-28 px-6 lg:px-16 max-w-6xl mx-auto"
        id="articles"
      >
        <div className="mb-20">
          <div className="flex items-end justify-between pb-5 border-b border-white/10">
            <h2 className="text-[clamp(48px,7vw,88px)] font-bold text-white leading-none tracking-[-0.03em]">
              Articles
            </h2>
          </div>
        </div>

        <p className="text-[#444] text-base">Loading articles...</p>
      </section>
    );
  }

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

      {/* Articles grid */}
      {articles.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article, index) => (
              <motion.article
                key={article._id || article.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: index * 0.07 }}
                className="group flex flex-col border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15 transition-all duration-300 overflow-hidden"
                style={{ borderRadius: "10px" }}
              >
                {/* Thumbnail */}
                <Link
                  href={`/articles/${article.slug}`}
                  className="block relative h-56 overflow-hidden flex-shrink-0"
                >
                  <Image
                    src={article.image?.url || "/placeholder.png"}
                    alt={article.title}
                    fill
                    unoptimized
                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
                    style={{ borderRadius: "10px 10px 0 0" }}
                  />

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
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center gap-1.5 text-[11px] text-[#555] font-mono">
                      <FiClock className="size-3" strokeWidth={1.5} />
                      {article.readTime || "5 min read"}
                    </span>

                    <span className="flex items-center gap-1.5 text-[11px] text-[#555] font-mono">
                      <FiCalendar className="size-3" strokeWidth={1.5} />
                      {article.date}
                    </span>
                  </div>

                  <Link href={`/articles/${article.slug}`}>
                    <h3 className="text-[20px] font-semibold text-white leading-snug tracking-[-0.015em] mb-3 line-clamp-2 group-hover:text-[#ccc] transition-colors duration-200">
                      {article.title}
                    </h3>
                  </Link>

                  <p className="text-[14px] text-[#666] leading-[1.85] line-clamp-2 flex-1 font-light mb-5">
                    {article.excerpt}
                  </p>

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

                  <div className="pt-4 border-t border-white/6">
                    <Link
                      href={`/articles/${article.slug}`}
                      className="inline-flex items-center gap-2 text-[12px] tracking-[0.08em] uppercase text-[#555] hover:text-white transition-colors duration-200 group/link"
                    >
                      Read article
                      <FiArrowRight
                        className="size-3.5 group-hover/link:translate-x-1 transition-transform duration-200"
                        strokeWidth={1.5}
                      />
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
              <FiArrowRight className="size-4 group-hover/more:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </>
      )}
    </section>
  );
}