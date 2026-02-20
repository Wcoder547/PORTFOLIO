"use client";

import { useState, useRef, DragEvent } from "react";
import {
  Star,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  ChevronRight,
  GripVertical,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Camera,
  ImagePlus,
  MapPin,
  User2,
  Briefcase,
  Quote,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  location: string;
  avatar: string | null; // base64 or URL
}

interface FormErrors {
  quote?: string;
  author?: string;
  title?: string;
  location?: string;
  avatar?: string;
}

// ─── Default data (mirrors your frontend) ─────────────────────────────────────
const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "I have worked with Waseem throughout two projects. He has always shown tremendous initiative to get work done. I was impressed with his back end skills, as well as having a great eye for UX and UI.",
    author: "Lucca Allen",
    title: "Co-Founder @ ToraTech AI",
    location: "Dublin, Ireland",
    avatar: null,
  },
  {
    id: "2",
    quote:
      "Waseem approached his tasks with a positive attitude and showed a clear willingness to learn. His openness to feedback and guidance was a valuable part of the collaboration.",
    author: "Daniela Vélez",
    title: "Global Marketing Director @ Dragon Sino Group",
    location: "Coventry, United Kingdom",
    avatar: null,
  },
];

// ─── Validators ───────────────────────────────────────────────────────────────
const validate = (form: Omit<Testimonial, "id">): FormErrors => {
  const e: FormErrors = {};
  if (!form.quote.trim()) e.quote = "Quote is required.";
  else if (form.quote.trim().length < 30)
    e.quote = "Quote must be at least 30 characters.";
  else if (form.quote.length > 600)
    e.quote = "Quote must be under 600 characters.";

  if (!form.author.trim()) e.author = "Author name is required.";
  else if (form.author.length > 80) e.author = "Max 80 characters.";

  if (!form.title.trim()) e.title = "Role / title is required.";
  else if (form.title.length > 100) e.title = "Max 100 characters.";

  if (!form.location.trim()) e.location = "Location is required.";
  else if (form.location.length > 80) e.location = "Max 80 characters.";

  return e;
};

const hasErrors = (e: FormErrors) => Object.values(e).some(Boolean);

// ─── Field error ──────────────────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {msg}
    </p>
  );
}

const emptyForm: Omit<Testimonial, "id"> = {
  quote: "",
  author: "",
  title: "",
  location: "",
  avatar: null,
};

// ─── Star rating display ──────────────────────────────────────────────────────
function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TestimonialsPage() {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(defaultTestimonials);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [avatarMode, setAvatarMode] = useState<"upload" | "url">("upload");

  const avatarInputRef = useRef<HTMLInputElement>(null);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const touch = (f: string) => setTouched((p) => new Set([...p, f]));

  const openAdd = () => {
    setForm(emptyForm);
    setErrors({});
    setTouched(new Set());
    setAvatarMode("upload");
    setEditingId("new");
  };

  const openEdit = (t: Testimonial) => {
    setForm({
      quote: t.quote,
      author: t.author,
      title: t.title,
      location: t.location,
      avatar: t.avatar,
    });
    setErrors({});
    setTouched(new Set());
    setAvatarMode(t.avatar?.startsWith("http") ? "url" : "upload");
    setEditingId(t.id);
  };

  const closeForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setTouched(new Set());
  };

  const handleAvatarFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrors((e) => ({ ...e, avatar: "Only image files allowed." }));
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setErrors((e) => ({ ...e, avatar: "Image must be under 3MB." }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((f) => ({ ...f, avatar: ev.target?.result as string }));
      setErrors((e) => ({ ...e, avatar: undefined }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleAvatarFile(file);
  };

  const handleSave = async () => {
    const allFields = new Set(["quote", "author", "title", "location"]);
    setTouched(allFields);
    const e = validate(form);
    setErrors(e);
    if (hasErrors(e)) return;

    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    // 👉 Replace with API call:
    // await fetch("/api/testimonials", { method: editingId === "new" ? "POST" : "PUT", body: JSON.stringify(form) })

    if (editingId === "new") {
      setTestimonials((prev) => [
        { ...form, id: Date.now().toString() },
        ...prev,
      ]);
    } else {
      setTestimonials((prev) =>
        prev.map((t) => (t.id === editingId ? { ...form, id: editingId } : t)),
      );
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      closeForm();
    }, 1200);
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    await new Promise((r) => setTimeout(r, 700));
    // 👉 Replace with: await fetch(`/api/testimonials/${id}`, { method: "DELETE" })
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    setDeleteId(null);
  };

  const liveErrors = validate(form);
  const getErr = (f: string) =>
    touched.has(f)
      ? (liveErrors as Record<string, string | undefined>)[f]
      : undefined;

  const inputClass = (err?: string) =>
    `w-full rounded-xl bg-zinc-800/70 border px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 transition-all hover:border-zinc-600 ${
      err
        ? "border-red-500/60 focus:ring-red-500/30"
        : "border-zinc-700/50 focus:ring-amber-500/40 focus:border-transparent"
    }`;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-600 mb-2">
              <span>Dashboard</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-zinc-400 font-medium">Testimonials</span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Star className="h-5 w-5 text-white fill-white" />
              </div>
              Testimonials
            </h1>
            <p className="text-sm text-zinc-500 mt-1 ml-12">
              {testimonials.length} testimonials · Shown in the carousel on your
              portfolio.
            </p>
          </div>
          <button
            onClick={openAdd}
            disabled={editingId !== null}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-400 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0">
            <Plus className="h-4 w-4" />
            Add Testimonial
          </button>
        </div>

        {/* ── Add / Edit Form ──────────────────────────────────────── */}
        <AnimatePresence>
          {editingId !== null && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-amber-500/30 bg-zinc-900/80 shadow-2xl shadow-amber-500/5 overflow-hidden">
              {/* Form header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-amber-500/5">
                <h2 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  {editingId === "new" ? (
                    <>
                      <Plus className="h-4 w-4" />
                      New Testimonial
                    </>
                  ) : (
                    <>
                      <Pencil className="h-4 w-4" />
                      Edit Testimonial
                    </>
                  )}
                </h2>
                <button
                  onClick={closeForm}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors rounded-lg p-1 hover:bg-zinc-800">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Row 1: Avatar + Author Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Avatar */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        <Camera className="h-3.5 w-3.5 text-amber-400" />
                        Avatar
                      </label>
                      {/* Toggle upload/URL */}
                      <div className="flex items-center bg-zinc-800/60 rounded-lg p-0.5 text-xs">
                        <button
                          onClick={() => setAvatarMode("upload")}
                          className={`px-2.5 py-1 rounded-md transition-all ${avatarMode === "upload" ? "bg-amber-500/20 text-amber-300 font-semibold" : "text-zinc-500 hover:text-zinc-300"}`}>
                          Upload
                        </button>
                        <button
                          onClick={() => setAvatarMode("url")}
                          className={`px-2.5 py-1 rounded-md transition-all ${avatarMode === "url" ? "bg-amber-500/20 text-amber-300 font-semibold" : "text-zinc-500 hover:text-zinc-300"}`}>
                          URL
                        </button>
                      </div>
                    </div>

                    {avatarMode === "upload" ? (
                      <>
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                          }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={handleDrop}
                          onClick={() => avatarInputRef.current?.click()}
                          className={`relative w-full h-36 rounded-2xl cursor-pointer group overflow-hidden transition-all duration-200 ${
                            isDragging
                              ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-zinc-900 scale-[1.02]"
                              : "ring-2 ring-zinc-700/50 hover:ring-amber-500/50"
                          }`}>
                          {form.avatar && !form.avatar.startsWith("http") ? (
                            <>
                              <Image
                                src={form.avatar}
                                alt="Avatar"
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                                <Camera className="h-6 w-6 text-white" />
                                <span className="text-xs text-zinc-300">
                                  Change
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full bg-zinc-800/60 flex flex-col items-center justify-center gap-2">
                              <ImagePlus className="h-8 w-8 text-zinc-500 group-hover:text-amber-400 transition-colors" />
                              <span className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors text-center px-2">
                                Click or drag photo
                              </span>
                              <span className="text-xs text-zinc-700">
                                Max 3MB
                              </span>
                            </div>
                          )}
                        </div>
                        <input
                          ref={avatarInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleAvatarFile(f);
                          }}
                        />
                        {form.avatar && !form.avatar.startsWith("http") && (
                          <button
                            onClick={() =>
                              setForm((f) => ({ ...f, avatar: null }))
                            }
                            className="flex items-center gap-1.5 text-xs text-red-400/70 hover:text-red-400 transition-colors">
                            <Trash2 className="h-3 w-3" />
                            Remove
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="url"
                          value={
                            form.avatar?.startsWith("http") ? form.avatar : ""
                          }
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              avatar: e.target.value || null,
                            }))
                          }
                          placeholder="https://example.com/avatar.jpg"
                          className="w-full rounded-xl bg-zinc-800/70 border border-zinc-700/50 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-transparent transition-all hover:border-zinc-600"
                        />
                        {/* URL preview */}
                        {form.avatar?.startsWith("http") && (
                          <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-800/40 border border-zinc-700/40">
                            <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-zinc-700/50 shrink-0">
                              <Image
                                src={form.avatar}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-xs text-zinc-400 truncate">
                              Preview
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    <FieldError msg={errors.avatar} />
                  </div>

                  {/* Author name + title + location */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        <User2 className="h-3.5 w-3.5 text-amber-400" />
                        Author Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        value={form.author}
                        onChange={(e) => {
                          setForm({ ...form, author: e.target.value });
                          touch("author");
                        }}
                        onBlur={() => touch("author")}
                        placeholder="Lucca Allen"
                        className={inputClass(getErr("author"))}
                      />
                      <FieldError msg={getErr("author")} />
                    </div>

                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        <Briefcase className="h-3.5 w-3.5 text-amber-400" />
                        Role / Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        value={form.title}
                        onChange={(e) => {
                          setForm({ ...form, title: e.target.value });
                          touch("title");
                        }}
                        onBlur={() => touch("title")}
                        placeholder="Co-Founder @ ToraTech AI"
                        className={inputClass(getErr("title"))}
                      />
                      <FieldError msg={getErr("title")} />
                    </div>

                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        <MapPin className="h-3.5 w-3.5 text-amber-400" />
                        Location <span className="text-red-400">*</span>
                      </label>
                      <input
                        value={form.location}
                        onChange={(e) => {
                          setForm({ ...form, location: e.target.value });
                          touch("location");
                        }}
                        onBlur={() => touch("location")}
                        placeholder="Dublin, Ireland"
                        className={inputClass(getErr("location"))}
                      />
                      <FieldError msg={getErr("location")} />
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    <Quote className="h-3.5 w-3.5 text-amber-400" />
                    Testimonial Quote <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={form.quote}
                    onChange={(e) => {
                      setForm({ ...form, quote: e.target.value });
                      touch("quote");
                    }}
                    onBlur={() => touch("quote")}
                    rows={5}
                    placeholder="Write the testimonial exactly as the client said it — keep it authentic and specific..."
                    className={`${inputClass(getErr("quote"))} resize-none`}
                  />
                  <div className="flex items-start justify-between gap-2">
                    <FieldError msg={getErr("quote")} />
                    <span
                      className={`text-xs font-mono ml-auto shrink-0 ${form.quote.length > 550 ? "text-amber-400" : "text-zinc-600"}`}>
                      {form.quote.length}/600
                    </span>
                  </div>
                </div>

                {/* Live preview */}
                {(form.quote || form.author) && (
                  <div className="rounded-xl border border-zinc-700/40 bg-zinc-800/30 p-4 space-y-3">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5" />
                      Preview (as shown on portfolio)
                    </p>
                    <div className="space-y-3">
                      <StarRating />
                      {form.quote && (
                        <p className="text-sm text-zinc-300 italic leading-relaxed line-clamp-3">
                          "{form.quote}"
                        </p>
                      )}
                      <div className="flex items-center gap-3">
                        {form.avatar ? (
                          <Image
                            src={form.avatar}
                            alt="avatar"
                            className="h-9 w-9 rounded-full object-cover ring-2 ring-zinc-700/50 shrink-0"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {form.author
                              ? form.author.slice(0, 2).toUpperCase()
                              : "?"}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {form.author || "Author Name"}
                          </p>
                          <p className="text-xs text-zinc-400">
                            {form.title || "Role"}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {form.location || "Location"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                  {hasErrors(liveErrors) && touched.size > 0 && (
                    <p className="flex items-center gap-1.5 text-xs text-amber-400">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Fill required fields to save.
                    </p>
                  )}
                  <div className="flex items-center gap-3 ml-auto">
                    <button
                      onClick={closeForm}
                      className="px-4 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 text-sm font-medium hover:bg-zinc-800/50 transition-all">
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving || saved}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg ${
                        saved
                          ? "bg-emerald-500 text-white"
                          : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 shadow-amber-500/25"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}>
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : saved ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Saved!
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          {editingId === "new"
                            ? "Add Testimonial"
                            : "Save Changes"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Testimonials List ─────────────────────────────────────── */}
        <div className="space-y-4">
          <AnimatePresence>
            {testimonials.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-zinc-800">
                <Star className="h-12 w-12 text-zinc-700 mb-4" />
                <p className="text-zinc-500 font-medium">
                  No testimonials yet.
                </p>
                <p className="text-xs text-zinc-600 mt-1">
                  Click Add Testimonial to get started.
                </p>
              </motion.div>
            )}

            {testimonials.map((t, index) => {
              const isExpanded = expandedId === t.id;
              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, scale: 0.97 }}
                  transition={{ delay: index * 0.04 }}
                  className={`group rounded-2xl border bg-zinc-900/60 shadow-lg transition-all duration-200 overflow-hidden ${
                    editingId === t.id
                      ? "border-amber-500/40 opacity-50 pointer-events-none"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}>
                  <div className="p-5 flex gap-4">
                    {/* Drag handle */}
                    <div className="shrink-0 text-zinc-700 cursor-grab hover:text-zinc-500 transition-colors hidden sm:flex items-start pt-1">
                      <GripVertical className="h-5 w-5" />
                    </div>

                    {/* Avatar */}
                    <div className="shrink-0">
                      {t.avatar ? (
                        <Image
                          src={t.avatar}
                          alt={t.author}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-zinc-700/50"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500/30 flex items-center justify-center text-sm font-bold text-amber-300">
                          {t.author.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Stars */}
                      <StarRating />

                      {/* Quote */}
                      <p
                        className={`text-sm text-zinc-300 italic leading-relaxed transition-all ${isExpanded ? "" : "line-clamp-2"}`}>
                        "{t.quote}"
                      </p>

                      {/* Expand if long */}
                      {t.quote.length > 150 && (
                        <button
                          onClick={() =>
                            setExpandedId(isExpanded ? null : t.id)
                          }
                          className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                          {isExpanded ? (
                            <>
                              <EyeOff className="h-3 w-3" />
                              Collapse
                            </>
                          ) : (
                            <>
                              <Eye className="h-3 w-3" />
                              Read more
                            </>
                          )}
                        </button>
                      )}

                      {/* Author info */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
                        <span className="text-sm font-bold text-white">
                          {t.author}
                        </span>
                        <span className="text-xs text-amber-300/80 font-medium">
                          {t.title}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-zinc-500">
                          <MapPin className="h-3 w-3" />
                          {t.location}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(t)}
                        disabled={editingId !== null}
                        className="p-2 rounded-lg text-zinc-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        disabled={deleteId === t.id || editingId !== null}
                        className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Delete">
                        {deleteId === t.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-red-400" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {testimonials.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-zinc-600 pb-6">
            <GripVertical className="h-3.5 w-3.5" />
            Testimonials display in carousel order. Drag to reorder (connect to
            API).
          </div>
        )}
      </div>
    </div>
  );
}
