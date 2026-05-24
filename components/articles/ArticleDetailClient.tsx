/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { Marked } from "marked";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiTwitter,
  FiLinkedin,
  FiLink,
  FiCheck,
} from "react-icons/fi";
import { Article, TocItem } from "@/lib/articles-data";

interface Props {
  article: Article;
}

function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split("\n");
  const toc: TocItem[] = [];
  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const title = match[2].trim().replace(/\*\*/g, "").replace(/`/g, "");
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      toc.push({ id, title, level });
    }
  }
  return toc;
}

const markedInstance = new Marked({
  async: false,
  breaks: true,
  gfm: true,
  renderer: {
    heading({ text, depth }) {
      const id = text
        .toLowerCase()
        .replace(/\*\*/g, "")
        .replace(/`/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    },
  },
});

export default function ArticleDetailClient({ article }: Props) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string>("");

  const tableOfContents = useMemo(() => extractToc(article.content), [article.content]);

  useEffect(() => {
    const result = markedInstance.parse(article.content) as string;
    setHtmlContent(result);
  }, [article.content]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareOnTwitter = () =>
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`,
      "_blank",
    );

  const shareOnLinkedIn = () =>
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
      "_blank",
    );

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
            href="/articles"
            className="inline-flex items-center gap-2 text-[13px] text-[#555] hover:text-white transition-colors duration-200 group"
          >
            <FiArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform duration-200" strokeWidth={1.5} />
            Back to articles
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-16 lg:gap-20">

          {/* ── Main column ─────────────────────────────────────────────── */}
          <div>
            {/* Category + meta */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="flex items-center gap-3 mb-6 flex-wrap"
            >
              <span
                className="text-[11px] tracking-[0.12em] uppercase px-2.5 py-1 border border-white/12 text-[#777]"
                style={{ borderRadius: "2px" }}
              >
                {article.category}
              </span>
              {article.featured && (
                <span
                  className="text-[11px] tracking-[0.12em] uppercase px-2.5 py-1 border border-white/15 text-[#888]"
                  style={{ borderRadius: "2px" }}
                >
                  Featured
                </span>
              )}
              <span className="flex items-center gap-1.5 text-[12px] text-[#444] font-mono">
                <FiCalendar className="size-3" strokeWidth={1.5} />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5 text-[12px] text-[#444] font-mono">
                <FiClock className="size-3" strokeWidth={1.5} />
                {article.readTime}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="text-[clamp(28px,4.5vw,52px)] font-bold text-white leading-[1.1] tracking-[-0.025em] mb-8"
            >
              {article.title}
            </motion.h1>

            {/* Author */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="flex items-center gap-4 mb-10 pb-10 border-b border-white/8"
            >
              {article.author.avatar ? (
                <div className="relative size-10 overflow-hidden flex-shrink-0" style={{ borderRadius: "2px" }}>
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className="size-10 flex items-center justify-center flex-shrink-0 border border-white/10 bg-white/[0.04] text-[15px] font-bold text-white"
                  style={{ borderRadius: "2px" }}
                >
                  {article.author.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-[14px] font-medium text-white leading-none">{article.author.name}</p>
                <p className="text-[12px] text-[#555] mt-1">{article.author.bio}</p>
              </div>
            </motion.div>

            {/* Hero image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative h-[360px] lg:h-[440px] overflow-hidden mb-12"
              style={{ borderRadius: "2px" }}
            >
              <Image
                src={article.image.url}
                alt={article.title}
                fill
                unoptimized
                className="object-cover"
              />
            </motion.div>

            {/* Article body */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="prose prose-invert max-w-none
                prose-p:text-[#999] prose-p:text-[16px] prose-p:leading-[1.9] prose-p:mb-6 prose-p:font-light
                prose-headings:scroll-mt-24
                prose-h1:text-white prose-h1:text-[28px] prose-h1:font-semibold prose-h1:tracking-[-0.02em] prose-h1:mt-14 prose-h1:mb-6
                prose-h2:text-white prose-h2:text-[22px] prose-h2:font-semibold prose-h2:tracking-[-0.02em] prose-h2:mt-14 prose-h2:mb-5 prose-h2:pb-4 prose-h2:border-b prose-h2:border-white/8
                prose-h3:text-white prose-h3:text-[18px] prose-h3:font-semibold prose-h3:mt-10 prose-h3:mb-4
                prose-a:text-white prose-a:underline prose-a:underline-offset-4 prose-a:decoration-white/25 hover:prose-a:decoration-white/60
                prose-strong:text-white prose-strong:font-semibold
                prose-em:text-[#888] prose-em:italic
                prose-blockquote:border-l-2 prose-blockquote:border-white/20 prose-blockquote:text-[#666] prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:my-8
                prose-code:text-[#bbb] prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[14px] prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-white/[0.04] prose-pre:border prose-pre:border-white/8 prose-pre:p-6 prose-pre:text-[13px] prose-pre:leading-relaxed prose-pre:overflow-x-auto prose-pre:my-8
                prose-ul:text-[#999] prose-ul:text-[15px] prose-ul:font-light prose-ul:space-y-2
                prose-ol:text-[#999] prose-ol:text-[15px] prose-ol:font-light prose-ol:space-y-2
                prose-li:mb-1.5
                prose-img:border prose-img:border-white/8 prose-img:my-8
                prose-hr:border-white/8 prose-hr:my-14
                prose-table:text-[#999] prose-th:text-white prose-th:bg-white/[0.04] prose-th:font-medium
                [&_pre]:!bg-white/[0.04] [&_pre]:!border [&_pre]:!border-white/8"
              style={{ "--tw-prose-pre-bg": "transparent" } as React.CSSProperties}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Tags */}
            {article.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36 }}
                className="mt-14 pt-10 border-t border-white/8"
              >
                <p className="text-[11px] tracking-[0.2em] uppercase text-[#444] mb-4">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[11px] tracking-[0.07em] uppercase px-3 py-[6px] border border-white/8 text-[#666] hover:text-[#aaa] hover:border-white/20 transition-all duration-150 cursor-default"
                      style={{ borderRadius: "2px" }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Share */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-10 pt-8 border-t border-white/8 flex items-center gap-4"
            >
              <span className="text-[11px] tracking-[0.2em] uppercase text-[#444]">Share</span>
              <button
                onClick={shareOnTwitter}
                className="p-2.5 border border-white/8 text-[#555] hover:text-white hover:border-white/20 transition-all duration-150"
                style={{ borderRadius: "2px" }}
                aria-label="Share on Twitter"
              >
                <FiTwitter className="size-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={shareOnLinkedIn}
                className="p-2.5 border border-white/8 text-[#555] hover:text-white hover:border-white/20 transition-all duration-150"
                style={{ borderRadius: "2px" }}
                aria-label="Share on LinkedIn"
              >
                <FiLinkedin className="size-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={handleCopyLink}
                className="p-2.5 border border-white/8 text-[#555] hover:text-white hover:border-white/20 transition-all duration-150"
                style={{ borderRadius: "2px" }}
                aria-label="Copy link"
              >
                {copiedLink
                  ? <FiCheck className="size-4 text-white" strokeWidth={1.5} />
                  : <FiLink className="size-4" strokeWidth={1.5} />
                }
              </button>
            </motion.div>
          </div>

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <div>
            <div className="sticky top-24 space-y-10">

              {/* Table of contents */}
              {tableOfContents.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#444] mb-5">
                    Contents
                  </p>
                  <nav className="space-y-0">
                    {tableOfContents.map((item, i) => (
                      <a
                        key={i}
                        href={`#${item.id}`}
                        className={`flex items-start gap-3 py-2 border-l transition-all duration-150 hover:border-white/25 hover:text-white text-[#555] text-[13px] leading-snug group ${
                          item.level === 2
                            ? "pl-4 border-white/6"
                            : "pl-7 border-white/4 text-[12px]"
                        }`}
                      >
                        <span className="text-[10px] font-mono text-[#333] mt-0.5 flex-shrink-0 group-hover:text-[#555]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </motion.div>
              )}

              {/* Back link */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Link
                  href="/articles"
                  className="text-[13px] text-[#444] hover:text-white transition-colors duration-150"
                >
                  ← All articles
                </Link>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}