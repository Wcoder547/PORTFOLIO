"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Star, StarOff,
  Search, Save, ArrowLeft, FileText, RefreshCw,
  Upload, ExternalLink, Clock, ChevronDown, Check,
  Hash, AlignLeft, Bold, Italic, Code, Quote, List,
  ListOrdered, Minus, Link2, Heading1, Heading2, Heading3,
} from "lucide-react";
import Link from "next/link";

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

const DEFAULT_CATEGORIES = [
  "Next.js", "TypeScript", "AI", "React", "Node.js",
  "Database", "DevOps", "CSS", "Authentication", "Other",
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
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 overflow-hidden animate-pulse">
      <div className="h-48 bg-zinc-800/60" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-16 bg-zinc-800 rounded-full" />
        <div className="h-5 w-3/4 bg-zinc-800 rounded-lg" />
        <div className="h-3 w-full bg-zinc-800/60 rounded" />
        <div className="h-3 w-4/5 bg-zinc-800/60 rounded" />
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, color = "bg-emerald-500" }: {
  checked: boolean; onChange: () => void; color?: string;
}) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-all duration-200 flex-shrink-0 ${checked ? color : "bg-zinc-700"}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

// ── Markdown Toolbar ─────────────────────────────────────────────────────────
// Inserts markdown syntax at the cursor position in the textarea
function useMarkdownEditor(
  value: string,
  onChange: (val: string) => void,
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
) {
  const insertAtCursor = (before: string, after = "", placeholder = "") => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || placeholder;
    const newValue = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(newValue);
    // Restore cursor after state update
    requestAnimationFrame(() => {
      el.focus();
      const newStart = start + before.length;
      const newEnd = newStart + selected.length;
      el.setSelectionRange(newStart, newEnd);
    });
  };

  const insertLinePrefix = (prefix: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const lineEnd = value.indexOf("\n", start);
    const end = lineEnd === -1 ? value.length : lineEnd;
    const line = value.slice(lineStart, end);

    // If line already starts with this prefix, remove it (toggle)
    let newLine: string;
    if (line.startsWith(prefix)) {
      newLine = line.slice(prefix.length);
    } else {
      newLine = prefix + line;
    }

    const newValue = value.slice(0, lineStart) + newLine + value.slice(end);
    onChange(newValue);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length);
    });
  };

  return { insertAtCursor, insertLinePrefix };
}

// The actual toolbar component
function MarkdownToolbar({
  value, onChange, textareaRef,
}: {
  value: string;
  onChange: (val: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const { insertAtCursor, insertLinePrefix } = useMarkdownEditor(value, onChange, textareaRef);

  const groups = [
    {
      label: "Headings",
      buttons: [
        { label: "H1", title: "Heading 1", action: () => insertLinePrefix("# "), icon: null, text: "H1", wide: true },
        { label: "H2", title: "Heading 2", action: () => insertLinePrefix("## "), icon: null, text: "H2", wide: true },
        { label: "H3", title: "Heading 3", action: () => insertLinePrefix("### "), icon: null, text: "H3", wide: true },
      ],
    },
    {
      label: "Format",
      buttons: [
        { label: "Bold", title: "Bold (wrap selected text)", action: () => insertAtCursor("**", "**", "bold text"), icon: <Bold className="h-3.5 w-3.5" />, text: null },
        { label: "Italic", title: "Italic (wrap selected text)", action: () => insertAtCursor("*", "*", "italic text"), icon: <Italic className="h-3.5 w-3.5" />, text: null },
        { label: "Inline code", title: "Inline code", action: () => insertAtCursor("`", "`", "code"), icon: <Code className="h-3.5 w-3.5" />, text: null },
      ],
    },
    {
      label: "Block",
      buttons: [
        { label: "Quote", title: "Blockquote", action: () => insertLinePrefix("> "), icon: <Quote className="h-3.5 w-3.5" />, text: null },
        { label: "Code block", title: "Code block", action: () => insertAtCursor("\n```\n", "\n```\n", "your code here"), icon: null, text: "{}" },
        { label: "Bullet list", title: "Bullet list item", action: () => insertLinePrefix("- "), icon: <List className="h-3.5 w-3.5" />, text: null },
        { label: "Numbered list", title: "Numbered list item", action: () => insertLinePrefix("1. "), icon: <ListOrdered className="h-3.5 w-3.5" />, text: null },
      ],
    },
    {
      label: "Insert",
      buttons: [
        { label: "Link", title: "Insert link", action: () => insertAtCursor("[", "](url)", "link text"), icon: <Link2 className="h-3.5 w-3.5" />, text: null },
        { label: "Divider", title: "Horizontal rule", action: () => insertAtCursor("\n\n---\n\n", "", ""), icon: <Minus className="h-3.5 w-3.5" />, text: null },
      ],
    },
  ];

  return (
    <div className="flex items-center gap-1 flex-wrap px-3 py-2 border-b border-white/6 bg-white/[0.015]">
      {groups.map((group, gi) => (
        <div key={group.label} className="flex items-center gap-0.5">
          {gi > 0 && <div className="w-px h-5 bg-white/10 mx-1.5 flex-shrink-0" />}
          {group.buttons.map((btn) => (
            <button
              key={btn.label}
              type="button"
              title={btn.title}
              onClick={btn.action}
              className="flex items-center justify-center h-7 px-2.5 rounded text-zinc-400 hover:text-white hover:bg-white/8 transition-all text-[12px] font-mono font-semibold"
            >
              {btn.icon ?? btn.text}
            </button>
          ))}
        </div>
      ))}
      <span className="ml-auto text-[10px] text-zinc-700 hidden sm:block">
        Markdown · H1 = #, H2 = ##, H3 = ###
      </span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ArticlesAdminPage() {
  const [view, setView] = useState<View>("list");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<Article | null>(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [catOpen, setCatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [renderedPreview, setRenderedPreview] = useState("");

  const catRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
    try { localStorage.setItem("admin_article_categories", JSON.stringify(categories)); } catch {}
  }, [categories]);

  // Render markdown for preview
  useEffect(() => {
    if (activeTab !== "preview" || !form.content) {
      setRenderedPreview("");
      return;
    }
    import("marked").then(({ marked }) => {
      const result = marked(form.content);
      if (typeof result === "string") setRenderedPreview(result);
      else result.then(setRenderedPreview);
    });
  }, [activeTab, form.content]);

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
          const fromDB = (json.data as Article[]).map((a) => a.category).filter(Boolean);
          return [...new Set([...prev, ...fromDB])].sort();
        });
      }
    } catch { showToast("Failed to load articles", false); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const addCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (categories.map((c) => c.toLowerCase()).includes(trimmed.toLowerCase())) {
      showToast("Category already exists", false); return;
    }
    setCategories((prev) => [...prev, trimmed].sort());
    setNewCategory("");
    showToast(`"${trimmed}" added`);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast("Image max 5MB", false); return; }
    if (!file.type.startsWith("image/")) { showToast("Only image files", false); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const openEdit = (article: Article) => {
    setEditTarget(article);
    setForm({
      title: article.title, excerpt: article.excerpt, content: article.content,
      category: article.category, tags: article.tags.join(", "),
      featured: article.featured, published: article.published,
      authorName: article.author.name, authorBio: article.author.bio,
      authorAvatar: article.author.avatar,
    });
    setImagePreview(article.image?.url || null);
    setImageFile(null);
    setView("edit");
    setActiveTab("write");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCreate = () => {
    setEditTarget(null);
    setForm({ ...emptyForm, category: categories[0] || "Next.js" });
    setImagePreview(null);
    setImageFile(null);
    setView("create");
    setActiveTab("write");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async () => {
    if (saving) return;
    if (!form.title.trim()) { showToast("Title is required", false); return; }
    if (!form.excerpt.trim()) { showToast("Excerpt is required", false); return; }
    if (!form.content.trim()) { showToast("Content is required", false); return; }
    if (view === "create" && !imageFile) { showToast("Cover image is required", false); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim()); fd.append("excerpt", form.excerpt.trim());
      fd.append("content", form.content.trim()); fd.append("category", form.category);
      fd.append("tags", form.tags); fd.append("featured", String(form.featured));
      fd.append("published", String(form.published)); fd.append("authorName", form.authorName);
      fd.append("authorBio", form.authorBio); fd.append("authorAvatar", form.authorAvatar);
      if (imageFile) fd.append("image", imageFile);
      const url = view === "edit" ? `/api/admin/articles/${editTarget!._id}` : "/api/admin/articles";
      const res = await fetch(url, { method: view === "edit" ? "PATCH" : "POST", body: fd });
      const json = await res.json();
      if (!res.ok) { showToast(json.message || "Save failed", false); return; }
      showToast(view === "edit" ? "Article updated!" : "Article published!");
      await fetchArticles();
      setView("list");
    } catch { showToast("Something went wrong", false); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      if (res.ok) { setArticles((prev) => prev.filter((a) => a._id !== id)); showToast("Deleted"); }
      else showToast("Delete failed", false);
    } catch { showToast("Delete failed", false); }
    finally { setDeletingId(null); }
  };

  const quickToggle = async (article: Article, field: "published" | "featured") => {
    setArticles((prev) => prev.map((a) => a._id === article._id ? { ...a, [field]: !a[field] } : a));
    try {
      const fd = new FormData();
      fd.append("title", article.title); fd.append("excerpt", article.excerpt);
      fd.append("content", article.content); fd.append("category", article.category);
      fd.append("tags", article.tags.join(", "));
      fd.append("featured", String(field === "featured" ? !article.featured : article.featured));
      fd.append("published", String(field === "published" ? !article.published : article.published));
      fd.append("authorName", article.author.name); fd.append("authorBio", article.author.bio);
      fd.append("authorAvatar", article.author.avatar);
      await fetch(`/api/admin/articles/${article._id}`, { method: "PATCH", body: fd });
    } catch {
      setArticles((prev) => prev.map((a) => a._id === article._id ? { ...a, [field]: a[field] } : a));
      showToast("Toggle failed", false);
    }
  };

  const filtered = articles.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "All" || a.category === filterCat;
    const matchStatus = filterStatus === "all" ? true : filterStatus === "published" ? a.published : !a.published;
    return matchSearch && matchCat && matchStatus;
  });

  // ── Toast ─────────────────────────────────────────────────────────────────
  const Toast = () => toast ? (
    <div className={`fixed top-5 right-5 z-50 px-4 py-2.5 rounded-lg text-sm font-medium shadow-2xl border ${toast.ok ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300" : "bg-red-500/15 border-red-500/30 text-red-300"}`}>
      {toast.msg}
    </div>
  ) : null;

  // ══════════════════════════════════════════════════════════════════════════
  // LIST VIEW
  // ══════════════════════════════════════════════════════════════════════════
  if (view === "list") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <Toast />
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-7">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Articles</h1>
              <p className="text-zinc-500 text-sm mt-0.5">{articles.length} total · {articles.filter(a => a.published).length} published</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={fetchArticles} className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all" title="Refresh">
                <RefreshCw className="h-4 w-4" />
              </button>
              <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-100 transition-all">
                <Plus className="h-4 w-4" /> New Article
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
              <input type="text" placeholder="Search articles..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 text-sm"
              />
            </div>
            <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
              className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm focus:outline-none">
              <option value="All">All Categories</option>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as "all" | "published" | "draft")}
              className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm focus:outline-none">
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <p className="text-zinc-600 text-xs">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <ArticleSkeleton key={i} />)
            ) : filtered.length === 0 ? (
              <div className="col-span-3 text-center py-20 text-zinc-700">
                <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No articles found</p>
              </div>
            ) : (
              filtered.map((article) => (
                <div key={article._id}
                  className={`group rounded-xl border bg-zinc-900 overflow-hidden hover:border-zinc-600 transition-all duration-200 ${article.published ? "border-zinc-800" : "border-zinc-800/40 opacity-60 hover:opacity-100"}`}>
                  <div className="relative h-48 bg-zinc-800 overflow-hidden">
                    {article.image?.url ? (
                      <Image src={article.image.url} alt={article.title} fill unoptimized className="object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                    ) : (
                      <div className="flex items-center justify-center h-full"><FileText className="h-8 w-8 text-zinc-700" /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide ${article.published ? "bg-emerald-500 text-white" : "bg-zinc-700 text-zinc-400"}`}>
                        {article.published ? "LIVE" : "DRAFT"}
                      </span>
                      {article.featured && <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-amber-500 text-black">FEATURED</span>}
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-black/60 text-zinc-400 border border-white/10">{article.category}</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] text-zinc-600">
                      <Clock className="h-3 w-3" /> {article.readTime}
                      <span>·</span>
                      <span>{new Date(article.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <h3 className="font-semibold text-white text-[15px] leading-snug line-clamp-2">{article.title}</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">{article.excerpt}</p>
                    {article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-500">#{tag}</span>
                        ))}
                        {article.tags.length > 3 && <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-600">+{article.tags.length - 3}</span>}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-zinc-800">
                      <button onClick={() => openEdit(article)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-all">
                        <Pencil className="h-3 w-3" /> Edit
                      </button>
                      <button onClick={() => quickToggle(article, "published")} title={article.published ? "Unpublish" : "Publish"} className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-all">
                        {article.published ? <EyeOff className="h-3.5 w-3.5 text-amber-400" /> : <Eye className="h-3.5 w-3.5 text-emerald-400" />}
                      </button>
                      <button onClick={() => quickToggle(article, "featured")} title={article.featured ? "Unfeature" : "Feature"} className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-all">
                        {article.featured ? <Star className="h-3.5 w-3.5 text-amber-400" /> : <StarOff className="h-3.5 w-3.5 text-zinc-600" />}
                      </button>
                      {article.published && (
                        <Link href={`/articles/${article.slug}`} target="_blank" className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 transition-all ml-auto">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      )}
                      <button onClick={() => handleDelete(article._id)} disabled={deletingId === article._id}
                        className={`p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all disabled:opacity-40 ${article.published ? "" : "ml-auto"}`}>
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

  // ══════════════════════════════════════════════════════════════════════════
  // EDITOR VIEW
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-zinc-100">
      <Toast />

      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-[#0f0f0f]/95 backdrop-blur border-b border-white/6">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setView("list")} className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-all flex-shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 text-[13px] text-zinc-600 min-w-0">
              <span className="hidden sm:block truncate max-w-[200px]">
                {view === "create" ? "New article" : editTarget?.title || "Edit article"}
              </span>
              {form.content && (
                <><span>·</span><span className="text-zinc-700 flex-shrink-0">{calcReadTime(form.content)}</span></>
              )}
            </div>
          </div>

          {/* Write / Preview tabs */}
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            {(["write", "preview"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded text-[12px] font-medium tracking-wide transition-all capitalize ${activeTab === tab ? "bg-white text-zinc-950" : "text-zinc-500 hover:text-zinc-300"}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-[12px] text-zinc-500">
              <Toggle checked={form.published} onChange={() => setForm(f => ({ ...f, published: !f.published }))} />
              <span>{form.published ? "Published" : "Draft"}</span>
            </div>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-zinc-950 font-semibold text-[13px] hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving..." : view === "create" ? "Publish" : "Update"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8 grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8">

        {/* ── Main Editor ─────────────────────────────────────────────────── */}
        <div className="min-w-0 space-y-6">

          {/* Cover image */}
          <label className="block cursor-pointer group">
            {imagePreview ? (
              <div className="relative w-full h-72 rounded-xl overflow-hidden">
                <Image src={imagePreview} alt="Cover" fill unoptimized className="object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur border border-white/20 rounded-lg text-white text-sm">
                    <Upload className="h-4 w-4" /> Change cover
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-44 rounded-xl border-2 border-dashed border-zinc-800 hover:border-zinc-600 flex flex-col items-center justify-center gap-3 transition-colors">
                <Upload className="h-7 w-7 text-zinc-700" />
                <p className="text-zinc-600 text-sm">Add a cover image</p>
                <p className="text-zinc-700 text-xs">JPG, PNG, WebP · max 5MB</p>
              </div>
            )}
            <input type="file" accept="image/*" className="sr-only" onChange={handleImage} />
          </label>

          {/* Title */}
          <textarea
            placeholder="Article title..."
            value={form.title}
            onChange={(e) => {
              setForm(f => ({ ...f, title: e.target.value }));
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            rows={1}
            className="w-full bg-transparent text-white placeholder:text-zinc-700 focus:outline-none resize-none text-[32px] sm:text-[40px] font-bold leading-[1.2] tracking-tight"
            style={{ overflow: "hidden" }}
          />

          {/* Slug preview */}
          {form.title && (
            <p className="text-zinc-700 text-xs font-mono -mt-2">
              /{form.title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-")}
            </p>
          )}

          {/* Excerpt */}
          <div className="border-b border-white/6 pb-6">
            <textarea
              placeholder="Short description — shown in article cards and used for SEO..."
              value={form.excerpt}
              onChange={(e) => {
                setForm(f => ({ ...f, excerpt: e.target.value }));
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              rows={2}
              maxLength={500}
              className="w-full bg-transparent text-zinc-400 placeholder:text-zinc-700 focus:outline-none resize-none text-[17px] leading-[1.7] font-light"
              style={{ overflow: "hidden" }}
            />
            <p className={`text-right text-[11px] mt-1 ${form.excerpt.length > 450 ? "text-amber-500" : "text-zinc-700"}`}>
              {form.excerpt.length}/500
            </p>
          </div>

          {/* Content editor / preview */}
          {activeTab === "write" ? (
            <div className="rounded-xl border border-white/6 overflow-hidden">
              {/* Formatting toolbar */}
              <MarkdownToolbar
                value={form.content}
                onChange={(val) => setForm(f => ({ ...f, content: val }))}
                textareaRef={textareaRef}
              />

              {/* Cheatsheet hint */}
              <div className="flex flex-wrap gap-x-5 gap-y-1 px-4 py-2 bg-white/[0.01] border-b border-white/4">
                {[
                  ["H1", "# Title"],
                  ["H2", "## Section"],
                  ["H3", "### Subsection"],
                  ["Bold", "**text**"],
                  ["Italic", "*text*"],
                  ["Code", "`inline`"],
                  ["Block", "```...```"],
                  ["Quote", "> text"],
                  ["Link", "[text](url)"],
                  ["Image", "![alt](url)"],
                ].map(([label, syntax]) => (
                  <span key={label} className="text-[11px] text-zinc-700 font-mono">
                    <span className="text-zinc-600">{label}:</span> {syntax}
                  </span>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={form.content}
                onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder={`Start writing your article here...\n\nUse the toolbar above to format — or type markdown directly:\n# Big heading\n## Section heading\n### Subsection\n\n**Bold text** and *italic text*\n\n\`\`\`js\n// Code blocks\nconsole.log("hello")\n\`\`\`\n\n> Blockquotes for key insights\n\n- Bullet lists\n- work like this\n\n1. Numbered lists\n2. work like this`}
                className="w-full bg-[#111] text-[#ccc] placeholder:text-zinc-700 focus:outline-none resize-none text-[15px] leading-[1.9] font-mono p-6"
                style={{ minHeight: "520px" }}
                onKeyDown={(e) => {
                  // Tab inserts 2 spaces instead of losing focus
                  if (e.key === "Tab") {
                    e.preventDefault();
                    const el = e.currentTarget;
                    const start = el.selectionStart;
                    const end = el.selectionEnd;
                    const newVal = form.content.slice(0, start) + "  " + form.content.slice(end);
                    setForm(f => ({ ...f, content: newVal }));
                    requestAnimationFrame(() => {
                      el.setSelectionRange(start + 2, start + 2);
                    });
                  }
                }}
              />

              {/* Footer: word count */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-white/4 bg-white/[0.01]">
                <span className="text-[11px] text-zinc-700">
                  {form.content.trim().split(/\s+/).filter(Boolean).length} words
                </span>
                {form.content && (
                  <span className="text-[11px] text-zinc-700">{calcReadTime(form.content)}</span>
                )}
              </div>
            </div>
          ) : (
            /* ── Preview — renders exactly like the client article page ── */
            <div className="rounded-xl border border-white/6 overflow-hidden">
              <div className="px-4 py-2 border-b border-white/6 flex items-center gap-2 bg-white/[0.02]">
                <Eye className="h-3.5 w-3.5 text-zinc-600" />
                <span className="text-[11px] text-zinc-600 uppercase tracking-widest font-medium">
                  Preview — exactly as readers will see it
                </span>
              </div>
              {form.content ? (
                <div
                  className="p-8 lg:p-12 prose prose-invert max-w-none
                    prose-p:text-[#999] prose-p:text-[18px] prose-p:leading-[1.95] prose-p:mb-7 prose-p:font-light
                    prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-white
                    prose-h1:text-[32px] prose-h1:mt-12 prose-h1:mb-5 prose-h1:leading-tight
                    prose-h2:text-[24px] prose-h2:mt-12 prose-h2:mb-5 prose-h2:pb-3 prose-h2:border-b prose-h2:border-white/8
                    prose-h3:text-[20px] prose-h3:mt-9 prose-h3:mb-3
                    prose-a:text-white prose-a:underline prose-a:decoration-white/30 prose-a:underline-offset-3
                    prose-strong:text-white prose-strong:font-semibold
                    prose-em:text-[#bbb]
                    prose-code:text-[#e0c97f] prose-code:bg-white/[0.07] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[14px] prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-[#111] prose-pre:border prose-pre:border-white/8 prose-pre:rounded-lg prose-pre:p-5
                    [&_pre_code]:bg-transparent [&_pre_code]:text-[#ccc] [&_pre_code]:text-[14px]
                    prose-ul:text-[#999] prose-ul:font-light prose-ul:my-6 prose-li:mb-2 prose-li:text-[17px]
                    prose-ol:text-[#999] prose-ol:font-light prose-ol:my-6
                    prose-blockquote:border-l-[3px] prose-blockquote:border-white/20 prose-blockquote:text-[#777] prose-blockquote:pl-6 prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:bg-white/[0.02] prose-blockquote:rounded-r-lg
                    prose-hr:border-white/8 prose-hr:my-10
                    prose-img:rounded-lg prose-img:w-full
                    [&_h2]:text-white [&_h3]:text-white [&_h1]:text-white"
                  dangerouslySetInnerHTML={{ __html: renderedPreview || "<p style='color:#555'>Rendering...</p>" }}
                />
              ) : (
                <div className="p-12 text-center text-zinc-700">
                  <FileText className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Nothing to preview yet — start writing in the Write tab.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right Sidebar ──────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Publish */}
          <div className="rounded-xl border border-white/6 bg-white/[0.02] p-5 space-y-4">
            <h3 className="text-[12px] font-semibold text-zinc-400 uppercase tracking-widest">Publish</h3>
            <div className="space-y-3">
              {([
                { key: "published" as const, label: "Published", desc: "Visible on public site", color: "bg-emerald-500" },
                { key: "featured" as const, label: "Featured", desc: "Shown with featured badge", color: "bg-amber-500" },
              ]).map(({ key, label, desc, color }) => (
                <div key={key} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[13px] text-zinc-200 font-medium leading-none">{label}</p>
                    <p className="text-[11px] text-zinc-600 mt-0.5">{desc}</p>
                  </div>
                  <Toggle checked={form[key]} onChange={() => setForm(f => ({ ...f, [key]: !f[key] }))} color={color} />
                </div>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="rounded-xl border border-white/6 bg-white/[0.02] p-5 space-y-3">
            <h3 className="text-[12px] font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Hash className="h-3.5 w-3.5" /> Category
            </h3>
            <div className="relative" ref={catRef}>
              <button onClick={() => setCatOpen(!catOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm hover:border-zinc-600 transition-all">
                {form.category}
                <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${catOpen ? "rotate-180" : ""}`} />
              </button>
              {catOpen && (
                <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl max-h-48 overflow-y-auto">
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => { setForm(f => ({ ...f, category: cat })); setCatOpen(false); }}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-all">
                      {cat}
                      {form.category === cat && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="New category..." value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCategory()}
                className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
              />
              <button onClick={addCategory} className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="rounded-xl border border-white/6 bg-white/[0.02] p-5 space-y-3">
            <h3 className="text-[12px] font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <AlignLeft className="h-3.5 w-3.5" /> Tags
            </h3>
            <input type="text" placeholder="nextjs, react, typescript..." value={form.tags}
              onChange={(e) => setForm(f => ({ ...f, tags: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
            />
            {form.tags && (
              <div className="flex flex-wrap gap-1.5">
                {form.tags.split(",").map(t => t.trim()).filter(Boolean).map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">#{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Author */}
          <div className="rounded-xl border border-white/6 bg-white/[0.02] p-5 space-y-3">
            <h3 className="text-[12px] font-semibold text-zinc-400 uppercase tracking-widest">Author</h3>
            {([
              { key: "authorName" as const, label: "Name", placeholder: "Waseem Akram" },
              { key: "authorBio" as const, label: "Bio", placeholder: "Full-Stack Developer" },
              { key: "authorAvatar" as const, label: "Avatar URL", placeholder: "https://..." },
            ]).map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-[11px] text-zinc-600 block mb-1">{label}</label>
                <input type="text" placeholder={placeholder} value={form[key]}
                  onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                />
              </div>
            ))}
          </div>

          {/* Save */}
          <button onClick={handleSave} disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : view === "create" ? "Publish Article" : "Update Article"}
          </button>
        </div>
      </div>
    </div>
  );
}