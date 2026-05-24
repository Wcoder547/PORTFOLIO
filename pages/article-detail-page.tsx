import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiTwitter,
  FiLinkedin,
  FiLink,
  FiCheck,
} from "react-icons/fi";
import type { GetServerSideProps } from "next";
import type { Article } from "@/lib/articles-data";

interface ArticleDetailPageProps {
  article: Article | null;
}

export default function ArticleDetailPage({ article }: ArticleDetailPageProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!article) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-5">
        <p className="text-[#555] text-[15px]">Article not found.</p>
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-[13px] text-[#555] hover:text-white transition-colors duration-200 group"
        >
          <FiArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform duration-200" strokeWidth={1.5} />
          Back to articles
        </Link>
      </main>
    );
  }

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank");
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank");
  };

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
              className="flex items-center gap-4 mb-6 flex-wrap"
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
              <div className="relative size-10 overflow-hidden flex-shrink-0" style={{ borderRadius: "2px" }}>
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  fill
                  className="object-cover"
                />
              </div>
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
                prose-h2:text-white prose-h2:text-[22px] prose-h2:font-semibold prose-h2:tracking-[-0.02em] prose-h2:mt-14 prose-h2:mb-5
                prose-h3:text-white prose-h3:text-[18px] prose-h3:font-semibold prose-h3:mt-10 prose-h3:mb-4
                prose-a:text-white prose-a:underline prose-a:underline-offset-4 prose-a:decoration-white/30 hover:prose-a:decoration-white/70
                prose-strong:text-white prose-strong:font-semibold
                prose-code:text-[#bbb] prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[14px]
                prose-pre:bg-white/[0.04] prose-pre:border prose-pre:border-white/8 prose-pre:p-6 prose-pre:text-[13px] prose-pre:leading-relaxed
                prose-ul:text-[#999] prose-ul:text-[16px] prose-li:mb-2 prose-li:font-light
                prose-blockquote:border-l-2 prose-blockquote:border-white/20 prose-blockquote:text-[#777] prose-blockquote:pl-5 prose-blockquote:italic"
              style={{ "--tw-prose-pre-bg": "transparent" } as React.CSSProperties}
              dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(article.content) }}
            />

            {/* Tags */}
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
              {article.tableOfContents?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#444] mb-5">
                    Contents
                  </p>
                  <nav className="space-y-1">
                    {article.tableOfContents.map((item, i) => (
                      <a
                        key={i}
                        href={`#${item.id}`}
                        className="flex items-start gap-3 py-2 border-l border-white/6 pl-4 hover:border-white/25 hover:text-white text-[#555] text-[13px] transition-all duration-150 leading-snug group"
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

              {/* Back to articles */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="pt-2"
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.query.slug as string | undefined;
  if (!slug) return { props: { article: null } };

  const { getArticleBySlug } = await import("@/lib/articles-data");
  const article = await getArticleBySlug(slug);
  if (!article) return { props: { article: null } };

  return { props: { article: JSON.parse(JSON.stringify(article)) } };
};

function convertMarkdownToHtml(markdown: string): string {
  let html = markdown;
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, '<h2 id="$1">$1</h2>');
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");
  html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/gim, "<pre><code>$2</code></pre>");
  html = html.replace(/`([^`]+)`/gim, "<code>$1</code>");
  html = html.replace(/^- (.*$)/gim, "<li>$1</li>");
  html = html.replace(/(<li>[\s\S]*<\/li>)/, "<ul>$1</ul>");
  html = html.replace(/\n\n/g, "</p><p>");
  html = "<p>" + html + "</p>";
  return html;
}