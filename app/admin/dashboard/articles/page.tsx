"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Search,
  X,
  Save,
  ArrowLeft,
  FileText,
  RefreshCw,
  Upload,
  Tag,
  BookOpen,
  ExternalLink,
  Clock,
} from "lucide-react";
import Link from "next/link";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

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

type View = "list" | "create" | "edit";

if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("A props object containing a")
    ) {
      return;
    }
    originalError(...args);
  };
}
const DEFAULT_CATEGORIES = [
  "Next.js",
  "TypeScript",
  "AI",
  "React",
  "Node.js",
  "Database",
  "DevOps",
  "CSS",
  "Authentication",
  "Other",
];

function calcReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  return `${Math.ceil(Math.max(1, words / 200))} min read`;
}

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  category: "Next.js",
  tags: "",
  featured: false,
  published: false,
  authorName: "Waseem Akram",
  authorBio: "Full-Stack Developer from Pakistan",
  authorAvatar: "",
};

function ArticleSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden animate-pulse">
      <div className="h-44 bg-zinc-800" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-20 bg-zinc-800 rounded" />
        <div className="h-5 w-3/4 bg-zinc-800 rounded" />
        <div className="h-3 w-full bg-zinc-800 rounded" />
        <div className="h-3 w-4/5 bg-zinc-800 rounded" />
      </div>
    </div>
  );
}

export default function ArticlesAdminPage() {
  const [view, setView] = useState<View>("list");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<Article | null>(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "published" | "draft"
  >("all");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("admin_article_categories");
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        if (Array.isArray(parsed) && parsed.length > 0) setCategories(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "admin_article_categories",
        JSON.stringify(categories),
      );
    } catch {}
  }, [categories]);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/articles");
      const json = await res.json();
      if (json.data) {
        setArticles(json.data);
        setCategories((prev) => {
          const fromDB = (json.data as Article[])
            .map((a) => a.category)
            .filter(Boolean);
          return [...new Set([...prev, ...fromDB])].sort();
        });
      }
    } catch {
      showToast("Failed to load articles", false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const addCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (
      categories.map((c) => c.toLowerCase()).includes(trimmed.toLowerCase())
    ) {
      showToast("Category already exists", false);
      return;
    }
    setCategories((prev) => [...prev, trimmed].sort());
    setNewCategory("");
    showToast(`"${trimmed}" added`);
  };

  const removeCategory = (cat: string) => {
    const inUse = articles.some((a) => a.category === cat);
    if (inUse) {
      showToast(
        `"${cat}" is used by ${articles.filter((a) => a.category === cat).length} article(s)`,
        false,
      );
      return;
    }
    setCategories((prev) => prev.filter((c) => c !== cat));
    showToast(`"${cat}" removed`);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image max 5MB", false);
      return;
    }
    if (!file.type.startsWith("image/")) {
      showToast("Only image files allowed", false);
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const openEdit = (article: Article) => {
    setEditTarget(article);
    setForm({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      tags: article.tags.join(", "),
      featured: article.featured,
      published: article.published,
      authorName: article.author.name,
      authorBio: article.author.bio,
      authorAvatar: article.author.avatar,
    });
    setImagePreview(article.image?.url || null);
    setImageFile(null);
    setView("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCreate = () => {
    setEditTarget(null);
    setForm({ ...emptyForm, category: categories[0] || "Next.js" });
    setImagePreview(null);
    setImageFile(null);
    setView("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async () => {
    if (saving) return;
    if (!form.title.trim()) {
      showToast("Title is required", false);
      return;
    }
    if (!form.excerpt.trim()) {
      showToast("Excerpt is required", false);
      return;
    }
    if (!form.content.trim()) {
      showToast("Content is required", false);
      return;
    }
    if (view === "create" && !imageFile) {
      showToast("Cover image is required", false);
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("excerpt", form.excerpt.trim());
      fd.append("content", form.content.trim());
      fd.append("category", form.category);
      fd.append("tags", form.tags);
      fd.append("featured", String(form.featured));
      fd.append("published", String(form.published));
      fd.append("authorName", form.authorName);
      fd.append("authorBio", form.authorBio);
      fd.append("authorAvatar", form.authorAvatar);
      if (imageFile) fd.append("image", imageFile);

      const url =
        view === "edit"
          ? `/api/admin/articles/${editTarget!._id}`
          : "/api/admin/articles";
      const method = view === "edit" ? "PATCH" : "POST";
      const res = await fetch(url, { method, body: fd });
      const json = await res.json();

      if (!res.ok) {
        showToast(json.message || "Save failed", false);
        return;
      }
      showToast(view === "edit" ? "Article updated!" : "Article created!");
      await fetchArticles();
      setView("list");
    } catch {
      showToast("Something went wrong", false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a._id !== id));
        showToast("Article deleted");
      } else showToast("Delete failed", false);
    } catch {
      showToast("Delete failed", false);
    } finally {
      setDeletingId(null);
    }
  };

  const quickToggle = async (
    article: Article,
    field: "published" | "featured",
  ) => {
    setArticles((prev) =>
      prev.map((a) =>
        a._id === article._id ? { ...a, [field]: !a[field] } : a,
      ),
    );
    try {
      const fd = new FormData();
      fd.append("title", article.title);
      fd.append("excerpt", article.excerpt);
      fd.append("content", article.content);
      fd.append("category", article.category);
      fd.append("tags", article.tags.join(", "));
      fd.append(
        "featured",
        String(field === "featured" ? !article.featured : article.featured),
      );
      fd.append(
        "published",
        String(field === "published" ? !article.published : article.published),
      );
      fd.append("authorName", article.author.name);
      fd.append("authorBio", article.author.bio);
      fd.append("authorAvatar", article.author.avatar);
      await fetch(`/api/admin/articles/${article._id}`, {
        method: "PATCH",
        body: fd,
      });
    } catch {
      setArticles((prev) =>
        prev.map((a) =>
          a._id === article._id ? { ...a, [field]: a[field] } : a,
        ),
      );
      showToast("Toggle failed", false);
    }
  };

  const filtered = articles.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "All" || a.category === filterCat;
    const matchStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "published"
          ? a.published
          : !a.published;
    return matchSearch && matchCat && matchStatus;
  });

  const publishedCount = articles.filter((a) => a.published).length;
  const draftCount = articles.filter((a) => !a.published).length;
  const featuredCount = articles.filter((a) => a.featured).length;

  if (view === "list") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        {toast && (
          <div
            className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-2xl border transition-all ${toast.ok ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" : "bg-red-500/20 border-red-500/40 text-red-300"}`}>
            {toast.msg}
          </div>
        )}
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <FileText className="h-8 w-8 text-violet-400" /> Articles
              </h1>
              <p className="text-zinc-500 text-sm mt-1">
                Manage your blog posts and articles
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchArticles}
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
                title="Refresh">
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/20 transition-all">
                <Plus className="h-4 w-4" /> New Article
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "Total",
                value: articles.length,
                color: "from-violet-500 to-purple-600",
              },
              {
                label: "Published",
                value: publishedCount,
                color: "from-emerald-500 to-teal-500",
              },
              {
                label: "Drafts",
                value: draftCount,
                color: "from-amber-500 to-orange-500",
              },
              {
                label: "Featured",
                value: featuredCount,
                color: "from-pink-500 to-rose-500",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <div
                  className={`text-2xl font-black bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                  {s.value}
                </div>
                <div className="text-xs text-zinc-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-sm"
              />
            </div>
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as "all" | "published" | "draft")
              }
              className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <p className="text-zinc-600 text-sm">
            {filtered.length} article{filtered.length !== 1 ? "s" : ""}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <ArticleSkeleton key={i} />
              ))
            ) : filtered.length === 0 ? (
              <div className="col-span-3 text-center py-20 text-zinc-600">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No articles found</p>
              </div>
            ) : (
              filtered.map((article) => (
                <div
                  key={article._id}
                  className={`group rounded-2xl border bg-zinc-900 overflow-hidden transition-all duration-200 hover:border-zinc-600 ${article.published ? "border-zinc-800" : "border-zinc-800/50 opacity-75"}`}>
                  <div className="relative h-44 bg-zinc-800 overflow-hidden">
                    {article.image?.url ? (
                      <Image
                        src={article.image.url}
                        alt={article.title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FileText className="h-10 w-10 text-zinc-700" />
                      </div>
                    )}
                    <div
                      className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold ${article.published ? "bg-emerald-500/90 text-white" : "bg-zinc-800/90 text-zinc-400 border border-zinc-700"}`}>
                      {article.published ? "Published" : "Draft"}
                    </div>
                    {article.featured && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                        {article.category}
                      </span>
                      <span className="text-xs text-zinc-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {article.readTime}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base line-clamp-2 mb-2 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-zinc-500 text-xs line-clamp-2 mb-4">
                      {article.excerpt}
                    </p>
                    {article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">
                            #{tag}
                          </span>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-600">
                            +{article.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-3 border-t border-zinc-800">
                      <button
                        onClick={() => openEdit(article)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-all">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => quickToggle(article, "published")}
                        title={article.published ? "Unpublish" : "Publish"}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-all">
                        {article.published ? (
                          <EyeOff className="h-3.5 w-3.5 text-amber-400" />
                        ) : (
                          <Eye className="h-3.5 w-3.5 text-emerald-400" />
                        )}
                      </button>
                      <button
                        onClick={() => quickToggle(article, "featured")}
                        title={article.featured ? "Unfeature" : "Feature"}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-all">
                        {article.featured ? (
                          <Star className="h-3.5 w-3.5 text-yellow-400" />
                        ) : (
                          <StarOff className="h-3.5 w-3.5 text-zinc-500" />
                        )}
                      </button>
                      {article.published && (
                        <Link
                          href={`/articles/${article.slug}`}
                          target="_blank"
                          title="View live"
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-all ml-auto">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      )}
                      <button
                        onClick={() => handleDelete(article._id)}
                        disabled={deletingId === article._id}
                        className={`p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all disabled:opacity-50 ${article.published ? "" : "ml-auto"}`}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // CREATE / EDIT VIEW
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-2xl border ${toast.ok ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" : "bg-red-500/20 border-red-500/40 text-red-300"}`}>
          {toast.msg}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView("list")}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-white">
                {view === "create" ? "New Article" : "Edit Article"}
              </h1>
              <p className="text-zinc-500 text-sm">
                {view === "create"
                  ? "Write and publish a new post"
                  : `Editing: ${editTarget?.title}`}
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Article"}
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* ── Left: Editor ── */}
          <div className="xl:col-span-2 space-y-6">
            {/* Title */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Article Title *
              </label>
              <input
                type="text"
                placeholder="Enter a compelling title..."
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                className="w-full bg-transparent text-2xl font-black text-white placeholder:text-zinc-700 focus:outline-none border-b border-zinc-800 focus:border-violet-500 pb-2 transition-colors"
              />
              {form.title && (
                <p className="text-xs text-zinc-600">
                  Slug:{" "}
                  <span className="text-zinc-500 font-mono">
                    {form.title
                      .toLowerCase()
                      .replace(/[^a-z0-9\s-]/g, "")
                      .trim()
                      .replace(/\s+/g, "-")}
                  </span>
                </p>
              )}
            </div>

            {/* Excerpt */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Excerpt / Summary *
              </label>
              <textarea
                rows={3}
                placeholder="A short description shown in article cards..."
                value={form.excerpt}
                maxLength={500}
                onChange={(e) =>
                  setForm((f) => ({ ...f, excerpt: e.target.value }))
                }
                className="w-full bg-transparent text-zinc-200 placeholder:text-zinc-700 focus:outline-none resize-none text-sm leading-relaxed"
              />
              <p
                className={`text-xs ${form.excerpt.length > 450 ? "text-amber-500" : "text-zinc-700"}`}>
                {form.excerpt.length}/500
              </p>
            </div>

            {/* ✅ MD Editor — replaces textarea + toolbar entirely */}
            <div className="rounded-2xl border border-zinc-800 overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5" /> Content *
                </label>
                {form.content && (
                  <span className="text-xs text-zinc-600">
                    ~{calcReadTime(form.content)}
                  </span>
                )}
              </div>
              <div data-color-mode="dark">
                <MDEditor
                  value={form.content}
                  onChange={(val) =>
                    setForm((f) => ({ ...f, content: val ?? "" }))
                  }
                  height={600}
                  preview="live"
                  visibleDragbar={false}
                  style={{ borderRadius: 0, border: "none" }}
                />
              </div>
            </div>
          </div>

          {/* ── Right: Sidebar ── */}
          <div className="space-y-6">
            {/* Cover Image */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                <Upload className="h-4 w-4 text-violet-400" /> Cover Image *
              </h3>
              <label className="block cursor-pointer">
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden h-44 group">
                    <Image
                      src={imagePreview}
                      alt="Cover"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Upload className="h-5 w-5 text-white" />
                      <p className="text-white text-xs font-medium">
                        Click to change
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border-2 border-dashed border-zinc-700 h-44 flex flex-col items-center justify-center gap-2 hover:border-violet-500/50 transition-colors">
                    <Upload className="h-8 w-8 text-zinc-600" />
                    <p className="text-xs text-zinc-500">
                      Click to upload cover image
                    </p>
                    <p className="text-xs text-zinc-700">
                      JPG, PNG, WebP · max 5MB
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImage}
                />
              </label>
            </div>

            {/* Category & Tags */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                <Tag className="h-4 w-4 text-violet-400" /> Category & Tags
              </h3>
              <div>
                <label className="text-xs text-zinc-500 mb-1.5 block">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1.5 block">
                  Add New Category
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. GraphQL"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCategory()}
                    className="flex-1 px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                  <button
                    onClick={addCategory}
                    className="px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {categories.map((cat) => {
                  const count = articles.filter(
                    (a) => a.category === cat,
                  ).length;
                  const isActive = form.category === cat;
                  return (
                    <span
                      key={cat}
                      onClick={() => setForm((f) => ({ ...f, category: cat }))}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${isActive ? "bg-violet-500/20 border-violet-500/40 text-violet-300" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"}`}>
                      {cat}
                      {count > 0 ? (
                        <span className="text-[9px] text-zinc-600 ml-0.5">
                          {count}
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCategory(cat);
                          }}
                          className="ml-0.5 hover:text-red-400 transition-colors">
                          <X className="h-2.5 w-2.5" />
                        </button>
                      )}
                    </span>
                  );
                })}
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1.5 block">
                  Tags <span className="text-zinc-700">(comma separated)</span>
                </label>
                <input
                  type="text"
                  placeholder="nextjs, react, typescript"
                  value={form.tags}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tags: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
                {form.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.tags
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">
                          #{tag}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Publish Settings */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-300">
                Publish Settings
              </h3>
              {[
                {
                  key: "published" as const,
                  label: "Published",
                  desc: "Visible on public site",
                  color: "bg-emerald-500",
                },
                {
                  key: "featured" as const,
                  label: "Featured",
                  desc: "Highlighted with badge",
                  color: "bg-purple-500",
                },
              ].map(({ key, label, desc, color }) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-200 font-medium">{label}</p>
                    <p className="text-xs text-zinc-600">{desc}</p>
                  </div>
                  <button
                    onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${form[key] ? color : "bg-zinc-700"}`}>
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${form[key] ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                </div>
              ))}
            </div>

            {/* Author */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-300">Author</h3>
              {[
                {
                  key: "authorName" as const,
                  label: "Name",
                  placeholder: "Waseem Akram",
                },
                {
                  key: "authorBio" as const,
                  label: "Bio",
                  placeholder: "Full-Stack Developer",
                },
                {
                  key: "authorAvatar" as const,
                  label: "Avatar URL",
                  placeholder: "https://github.com/...",
                },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-xs text-zinc-500 mb-1.5 block">
                    {label}
                  </label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                </div>
              ))}
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-violet-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              <Save className="h-4 w-4" />
              {saving
                ? "Saving..."
                : view === "create"
                  ? "Publish Article"
                  : "Update Article"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
