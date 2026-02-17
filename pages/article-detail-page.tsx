"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiChevronRight,
  FiTwitter,
  FiLinkedin,
  FiLink,
  FiCheck,
} from "react-icons/fi";
import { Article } from "@/lib/articles-data";

interface ArticleDetailPageProps {
  article: Article;
}

export default function ArticleDetailPage({ article }: ArticleDetailPageProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      article.title,
    )}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank");
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      window.location.href,
    )}`;
    window.open(url, "_blank");
  };

  return (
    <main className="min-h-screen py-16 px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-white/60 mb-8"
          aria-label="Breadcrumb">
          <Link href="/" className="hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <FiChevronRight className="size-4" />
          <Link
            href="/articles"
            className="hover:text-emerald-400 transition-colors">
            Articles
          </Link>
          <FiChevronRight className="size-4" />
          <span className="text-white font-medium line-clamp-1">
            {article.category}
          </span>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all hover:scale-105">
            <FiArrowLeft className="size-4" />
            Back to Articles
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            {
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative h-[400px] rounded-2xl overflow-hidden mb-8">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-emerald-500/90 backdrop-blur-sm text-white text-sm font-semibold">
                  {article.category}
                </div>
              </motion.div>
            }

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm mb-6">
                <span className="flex items-center gap-2">
                  <FiCalendar className="size-4" />
                  {article.date}
                </span>
                <span className="flex items-center gap-2">
                  <FiClock className="size-4" />
                  {article.readTime}
                </span>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  width={60}
                  height={60}
                  className="rounded-full border-2 border-emerald-400"
                />
                <div>
                  <div className="font-semibold text-white">
                    {article.author.name}
                  </div>
                  <div className="text-sm text-white/60">
                    {article.author.bio}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 mb-8 pb-8 border-b border-white/10">
              <span className="text-white/60 text-sm font-medium">Share:</span>
              <button
                onClick={shareOnTwitter}
                className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all"
                aria-label="Share on Twitter">
                <FiTwitter className="size-5 text-white" />
              </button>
              <button
                onClick={shareOnLinkedIn}
                className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-blue-600/20 hover:border-blue-600/50 transition-all"
                aria-label="Share on LinkedIn">
                <FiLinkedin className="size-5 text-white" />
              </button>
              <button
                onClick={handleCopyLink}
                className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all"
                aria-label="Copy link">
                {copiedLink ? (
                  <FiCheck className="size-5 text-emerald-400" />
                ) : (
                  <FiLink className="size-5 text-white" />
                )}
              </button>
            </motion.div>

            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="prose prose-invert prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-white
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-emerald-400
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-emerald-300
                prose-p:text-white/80 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:text-emerald-300
                prose-strong:text-white prose-strong:font-semibold
                prose-code:text-emerald-300 prose-code:bg-white/10 prose-code:px-2 prose-code:py-1 prose-code:rounded
                prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:p-6
                prose-ul:text-white/80 prose-ul:list-disc prose-ul:ml-6
                prose-li:mb-2"
              dangerouslySetInnerHTML={{
                __html: convertMarkdownToHtml(article.content),
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 pt-8 border-t border-white/10">
              <h3 className="text-white font-semibold mb-4">Tags:</h3>
              <div className="flex flex-wrap gap-3">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm hover:bg-emerald-500/20 hover:border-emerald-400/50 transition-all">
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-4">
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {article.tableOfContents.map((item, index) => (
                    <a
                      key={index}
                      href={`#${item.id}`}
                      className="block text-sm text-white/60 hover:text-emerald-400 transition-colors py-2 border-l-2 border-transparent hover:border-emerald-400 pl-4">
                      {item.title}
                    </a>
                  ))}
                </nav>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function convertMarkdownToHtml(markdown: string): string {
  let html = markdown;
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, '<h2 id="$1">$1</h2>');
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");
  html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");
  html = html.replace(
    /```(\w+)?\n([\s\S]*?)```/gim,
    "<pre><code>$2</code></pre>",
  );
  html = html.replace(/`([^`]+)`/gim, "<code>$1</code>");
  html = html.replace(/^- (.*$)/gim, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");
  html = html.replace(/\n\n/g, "</p><p>");
  html = "<p>" + html + "</p>";
  return html;
}
