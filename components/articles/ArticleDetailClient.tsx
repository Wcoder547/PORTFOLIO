"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiTwitter, FiLinkedin, FiLink, FiClock, FiCalendar } from "react-icons/fi";

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  image: { public_id: string; url: string };
  featured: boolean;
  published: boolean;
  readTime: string;
  author: { name: string; bio: string; avatar: string };
  createdAt: string;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-") || "section";
}

async function renderMarkdown(content: string): Promise<string> {
  const { marked } = await import("marked");
  const renderer = new marked.Renderer();
  const seen: Record<string, number> = {};
  renderer.heading = function ({ text, depth }) {
    const base = slugify(text);
    seen[base] = (seen[base] ?? 0) + 1;
    const id = seen[base] > 1 ? `${base}-${seen[base]}` : base;
    return `<h${depth} id="${id}">${text}</h${depth}>\n`;
  };
  marked.setOptions({ renderer });
  return marked(content) as string;
}

export default function ArticleDetailClient({ article }: { article: Article }) {
  const [html, setHtml] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    renderMarkdown(article.content).then(setHtml);
  }, [article.content]);

  const share = (platform: "twitter" | "linkedin" | "copy") => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (platform === "twitter")
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(url)}`, "_blank");
    else if (platform === "linkedin")
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
    else
      navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const date = new Date(article.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
      <style>{`
        /* ── Body text ─────────────────────────────────────────────── */
        .prose {
          color: rgba(255,255,255,0.75);
          font-size: 20px;
          line-height: 1.88;
          font-family: charter, Georgia, Cambria, "Times New Roman", Times, serif;
          font-weight: 400;
          letter-spacing: -0.003em;
        }
        .prose p  { margin: 0 0 2em; }
        .prose p:last-child { margin-bottom: 0; }

        /* ── Headings ──────────────────────────────────────────────── */
        .prose h1 {
          color: rgba(255,255,255,0.92);
          font-size: 30px;
          font-weight: 700;
          font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
          letter-spacing: -0.022em;
          line-height: 1.18;
          margin: 3.5em 0 0.5em;
        }
        .prose h2 {
          color: rgba(255,255,255,0.88);
          font-size: 24px;
          font-weight: 700;
          font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
          letter-spacing: -0.018em;
          line-height: 1.22;
          margin: 3em 0 0.5em;
        }
        .prose h3 {
          color: rgba(255,255,255,0.84);
          font-size: 20px;
          font-weight: 600;
          font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
          letter-spacing: -0.012em;
          line-height: 1.28;
          margin: 2.5em 0 0.4em;
        }
        .prose h4 {
          color: rgba(255,255,255,0.8);
          font-size: 18px;
          font-weight: 600;
          font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
          margin: 2em 0 0.3em;
        }
        .prose h1:first-child,
        .prose h2:first-child,
        .prose h3:first-child { margin-top: 0; }

        /* ── Inline ────────────────────────────────────────────────── */
        .prose strong { color: rgba(255,255,255,0.9); font-weight: 700; }
        .prose em     { font-style: italic; }
        .prose a {
          color: rgba(255,255,255,0.85) !important;
          text-decoration: underline;
          text-decoration-color: rgba(255,255,255,0.25);
          text-underline-offset: 3px;
        }
        .prose a:hover {
          text-decoration-color: rgba(255,255,255,0.6);
        }

        /* ── Code ──────────────────────────────────────────────────── */
        .prose code {
          font-family: "Menlo", "Monaco", "Courier New", monospace;
          font-size: 15px;
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.85);
          padding: 2px 6px;
          border-radius: 3px;
        }
        .prose pre {
          background: #1a1a1a;
          border-radius: 4px;
          padding: 1.25em 1.5em;
          overflow-x: auto;
          margin: 2em 0;
        }
        .prose pre code {
          background: transparent;
          padding: 0;
          font-size: 14px;
          color: rgba(255,255,255,0.8);
          line-height: 1.75;
        }

        /* ── Lists ─────────────────────────────────────────────────── */
        .prose ul,
        .prose ol { margin: 0 0 2em; padding-left: 2em; }
        .prose ul  { list-style: disc; }
        .prose ol  { list-style: decimal; }
        .prose li  { margin-bottom: 0.4em; font-size: 20px; }
        .prose li::marker { color: rgba(255,255,255,0.35); }

        /* ── Blockquote ────────────────────────────────────────────── */
        .prose blockquote {
          border-left: 3px solid rgba(255,255,255,0.15);
          margin: 2em 0;
          padding: 0 0 0 1.5em;
          font-style: italic;
          color: rgba(255,255,255,0.55);
          font-size: 21px;
        }
        .prose blockquote p { color: inherit; }

        /* ── HR ────────────────────────────────────────────────────── */
        .prose hr {
          border: none;
          text-align: center;
          margin: 3em 0;
          letter-spacing: 0.6em;
          color: rgba(255,255,255,0.25);
        }
        .prose hr::before { content: "···"; }

        /* ── Image ─────────────────────────────────────────────────── */
        .prose img {
          width: 100%;
          border-radius: 4px;
          margin: 2em 0;
        }

        /* ── Table ─────────────────────────────────────────────────── */
        .prose table {
          width: 100%;
          border-collapse: collapse;
          font-size: 16px;
          margin: 2em 0;
          font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
        }
        .prose th {
          text-align: left;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          border-bottom: 1px solid rgba(255,255,255,0.12);
          padding: 8px 12px;
          font-size: 14px;
          letter-spacing: 0.02em;
        }
        .prose td {
          padding: 10px 12px;
          color: rgba(255,255,255,0.55);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .prose tr:last-child td { border-bottom: none; }
      `}</style>

      <main className="min-h-screen bg-[#121212]">
        {/* ── Single centered column — exactly like Medium ─────────── */}
        <div className="max-w-[728px] mx-auto px-6 pt-12 pb-24">

          {/* Back */}
          <div className="mb-10">
            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 text-[13px] text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.6)] transition-colors"
              style={{ fontFamily: 'sohne, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              <FiArrowLeft className="size-3.5" /> All articles
            </Link>
          </div>

          {/* ── Title ──────────────────────────────────────────────── */}
          <h1
            className="text-white mb-4"
            style={{
              fontFamily: 'sohne, "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: "clamp(28px, 5vw, 42px)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.12,
              color: "rgba(255,255,255,0.93)",
            }}
          >
            {article.title}
          </h1>

          {/* ── Subtitle / excerpt ─────────────────────────────────── */}
          {article.excerpt && (
            <p
              className="mb-8"
              style={{
                fontFamily: 'charter, Georgia, Cambria, "Times New Roman", Times, serif',
                fontSize: "22px",
                lineHeight: 1.58,
                color: "rgba(255,255,255,0.4)",
                fontWeight: 400,
              }}
            >
              {article.excerpt}
            </p>
          )}

          {/* ── Author row — exactly Medium style ──────────────────── */}
          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-white/[0.08]">
            {/* Avatar */}
            <div className="relative w-10 h-10 flex-shrink-0 overflow-hidden rounded-full">
              {article.author?.avatar ? (
                <Image src={article.author.avatar} alt={article.author.name} fill unoptimized className="object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-[14px] font-semibold"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                >
                  {article.author?.name?.[0] ?? "W"}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {/* Name */}
              <p
                className="text-[15px] font-medium leading-none mb-1"
                style={{
                  fontFamily: 'sohne, "Helvetica Neue", Helvetica, Arial, sans-serif',
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                {article.author?.name}
              </p>
              {/* Meta row */}
              <p
                className="text-[13px] flex items-center gap-1.5"
                style={{ color: "rgba(255,255,255,0.3)", fontFamily: 'sohne, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                <span>{date}</span>
                <span>·</span>
                <span>{article.readTime}</span>
              </p>
            </div>

            {/* Share buttons — right side */}
            <div className="flex items-center gap-4">
              {[
                { icon: FiTwitter, fn: () => share("twitter") },
                { icon: FiLinkedin, fn: () => share("linkedin") },
                { icon: FiLink, fn: () => share("copy") },
              ].map(({ icon: Icon, fn }, i) => (
                <button
                  key={i}
                  onClick={fn}
                  className="transition-colors"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
                >
                  <Icon className="size-4" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Hero image — inside column, like Medium ─────────────── */}
          {article.image?.url && (
            <div className="w-full mb-10 overflow-hidden rounded-sm">
              <Image
                src={article.image.url}
                alt={article.title}
                width={728}
                height={400}
                unoptimized
                priority
                className="w-full object-cover"
                style={{ maxHeight: "400px" }}
              />
            </div>
          )}

          {/* ── Body ───────────────────────────────────────────────── */}
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: html || "" }}
          />

          {/* ── Tags ───────────────────────────────────────────────── */}
          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-16 pt-8 border-t border-white/[0.06]">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[13px] px-3 py-1 rounded-full cursor-default transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.4)",
                    fontFamily: 'sohne, "Helvetica Neue", Helvetica, Arial, sans-serif',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* ── Share ──────────────────────────────────────────────── */}
          <div className="mt-8 pt-8 border-t border-white/[0.06] flex items-center justify-between">
            <span
              className="text-[13px]"
              style={{
                color: "rgba(255,255,255,0.3)",
                fontFamily: 'sohne, "Helvetica Neue", Helvetica, Arial, sans-serif',
              }}
            >
              Share this article
            </span>
            <div className="flex items-center gap-3">
              {[
                { icon: FiTwitter, label: "Twitter", fn: () => share("twitter") },
                { icon: FiLinkedin, label: "LinkedIn", fn: () => share("linkedin") },
                { icon: FiLink, label: copied ? "Copied!" : "Copy link", fn: () => share("copy") },
              ].map(({ icon: Icon, label, fn }) => (
                <button
                  key={label}
                  onClick={fn}
                  className="flex items-center gap-2 text-[13px] px-4 py-2 rounded-full transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.45)",
                    fontFamily: 'sohne, "Helvetica Neue", Helvetica, Arial, sans-serif',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
                    (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.8)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.45)";
                  }}
                >
                  <Icon className="size-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Copy link confirmation ──────────────────────────────── */}
          {copied && (
            <div
              className="fixed bottom-6 left-1/2 -translate-x-1/2 text-[13px] px-4 py-2 rounded-full"
              style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)" }}
            >
              Link copied
            </div>
          )}
        </div>
      </main>
    </>
  );
}