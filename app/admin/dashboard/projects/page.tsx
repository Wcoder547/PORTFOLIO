"use client";

import { useState, useEffect, useCallback, useRef, DragEvent } from "react";
import {
  Folder,
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
  Code2,
  ExternalLink,
  ImagePlus,
  Camera,
  Link2,
  Building2,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Project {
  id: string;
  title: string;
  description: string;
  image: string | null;
  tech: string[];
  link: string;
  company?: string;
}

// ─── API shape from MongoDB ───────────────────────────────────────────────────
interface ProjectAPI {
  _id: string;
  title: string;
  description: string;
  thumbnail?: { public_id: string; url: string };
  techStack: string[];
  liveUrl?: string;
  company?: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  image?: string;
  link?: string;
  tech?: string;
}

// ─── Normalize MongoDB → frontend ────────────────────────────────────────────
const normalize = (p: ProjectAPI): Project => ({
  id: p._id,
  title: p.title,
  description: p.description,
  image: p.thumbnail?.url ?? null,
  tech: p.techStack ?? [],
  link: p.liveUrl ?? "",
  company: p.company ?? "",
});

// ─── Validators ───────────────────────────────────────────────────────────────
const isValidUrl = (v: string) => {
  if (!v) return false;
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
};

const validate = (form: Omit<Project, "id">): FormErrors => {
  const e: FormErrors = {};
  if (!form.title.trim()) e.title = "Title is required.";
  else if (form.title.length > 100) e.title = "Max 100 characters.";
  if (!form.description.trim()) e.description = "Description is required.";
  else if (form.description.trim().length < 20)
    e.description = "At least 20 characters.";
  else if (form.description.length > 600) e.description = "Max 600 characters.";
  if (!form.link) e.link = "Live link is required.";
  else if (!isValidUrl(form.link)) e.link = "Enter a valid URL (https://...).";
  if (form.tech.length === 0) e.tech = "Add at least one tech tag.";
  return e;
};

const hasErrors = (e: FormErrors) => Object.values(e).some(Boolean);

// ─── Tag colors ───────────────────────────────────────────────────────────────
const tagColors = [
  "bg-blue-500/10 border-blue-500/30 text-blue-300",
  "bg-violet-500/10 border-violet-500/30 text-violet-300",
  "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
  "bg-amber-500/10 border-amber-500/30 text-amber-300",
  "bg-pink-500/10 border-pink-500/30 text-pink-300",
  "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
  "bg-orange-500/10 border-orange-500/30 text-orange-300",
];

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {msg}
    </p>
  );
}

const emptyForm: Omit<Project, "id"> = {
  title: "",
  description: "",
  image: null,
  tech: [],
  link: "",
  company: "",
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null); // actual File for upload
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);

  // ── 1. Fetch all on mount ──────────────────────────────────────────────────
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);

      const res = await fetch("/api/admin/api-projects");
      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Failed to fetch");
      setProjects((json.data as ProjectAPI[]).map(normalize));
    } catch (err: unknown) {
      setFetchError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const touch = (f: string) => setTouched((p) => new Set([...p, f]));

  const openAdd = () => {
    setForm(emptyForm);
    setImageFile(null);
    setErrors({});
    setTouched(new Set());
    setTechInput("");
    setSaveError(null);
    setEditingId("new");
  };

  const openEdit = (p: Project) => {
    setForm({
      title: p.title,
      description: p.description,
      image: p.image, // existing Cloudinary URL
      tech: [...p.tech],
      link: p.link,
      company: p.company ?? "",
    });
    setImageFile(null); // no new file yet
    setErrors({});
    setTouched(new Set());
    setTechInput("");
    setSaveError(null);
    setEditingId(p.id);
  };

  const closeForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setErrors({});
    setTouched(new Set());
    setSaveError(null);
  };

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrors((e) => ({
        ...e,
        image: "Only image files allowed (JPG, PNG, WEBP).",
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((e) => ({ ...e, image: "Image must be under 5MB." }));
      return;
    }
    setImageFile(file); // store real File for FormData
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((f) => ({ ...f, image: ev.target?.result as string }));
      setErrors((e) => ({ ...e, image: undefined }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  };

  const addTag = () => {
    const t = techInput.trim();
    if (t && !form.tech.includes(t))
      setForm((f) => ({ ...f, tech: [...f.tech, t] }));
    setTechInput("");
  };

  const removeTag = (tag: string) =>
    setForm((f) => ({ ...f, tech: f.tech.filter((t) => t !== tag) }));

  // ── 2. Save — POST (new) or PUT (edit) with FormData ──────────────────────
  const handleSave = async () => {
    const allFields = new Set([
      "title",
      "description",
      "link",
      "tech",
      "image",
    ]);
    setTouched(allFields);
    const e = validate(form);
    setErrors(e);
    if (hasErrors(e)) return;

    setSaving(true);
    setSaveError(null);

    try {
      const isNew = editingId === "new";
      const url = isNew
        ? "/api/admin/api-projects"
        : `/api/admin/api-projects/${editingId}`;
      const method = isNew ? "POST" : "PUT";

      // ── Build FormData (backend uses req.formData()) ──────────────
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("description", form.description.trim());
      fd.append("techStack", JSON.stringify(form.tech));
      fd.append("liveUrl", form.link.trim());
      fd.append("category", "fullstack");
      fd.append("status", "completed");
      fd.append("isVisible", "true");
      if (form.company?.trim()) fd.append("company", form.company.trim());

      // Only upload a new thumbnail if user selected a new file
      if (imageFile) {
        fd.append("thumbnail", imageFile);
      }

      // On PUT: if user cleared the existing image
      if (!isNew && !form.image && !imageFile) {
        fd.append("removeThumbnail", "true");
      }

      const res = await fetch(url, { method, body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to save");

      const savedProject = normalize(json.data as ProjectAPI);

      if (isNew) {
        setProjects((prev) => [savedProject, ...prev]);
      } else {
        setProjects((prev) =>
          prev.map((p) => (p.id === editingId ? savedProject : p)),
        );
      }

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        closeForm();
      }, 1200);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // ── 3. Delete ──────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    setDeleteId(id);
    try {
      const res = await fetch(`/api/admin/api-projects/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to delete");
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: unknown) {
      console.error("[Delete Project]", err);
    } finally {
      setDeleteId(null);
    }
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
        : "border-zinc-700/50 focus:ring-blue-500/40 focus:border-transparent"
    }`;

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
          <p className="text-zinc-500 text-sm">Loading projects...</p>
        </div>
      </div>
    );
  }

  // ── Fetch error state ─────────────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <AlertCircle className="h-8 w-8 text-red-400" />
          <p className="text-zinc-300 text-sm font-medium">{fetchError}</p>
          <button
            onClick={fetchProjects}
            className="mt-2 px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition-all">
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-600 mb-2">
              <span>Dashboard</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-zinc-400 font-medium">Projects</span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Folder className="h-5 w-5 text-white" />
              </div>
              Projects
            </h1>
            <p className="text-sm text-zinc-500 mt-1 ml-12">
              {projects.length} projects · Shown on your public portfolio.
            </p>
          </div>
          <button
            onClick={openAdd}
            disabled={editingId !== null}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:from-blue-400 hover:to-cyan-400 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0">
            <Plus className="h-4 w-4" />
            Add Project
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
              className="rounded-2xl border border-blue-500/30 bg-zinc-900/80 shadow-2xl shadow-blue-500/5 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-blue-500/5">
                <h2 className="text-sm font-bold text-blue-300 flex items-center gap-2">
                  {editingId === "new" ? (
                    <>
                      <Plus className="h-4 w-4" /> New Project
                    </>
                  ) : (
                    <>
                      <Pencil className="h-4 w-4" /> Edit Project
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
                {/* Row 1: Image + Title/Company/Link */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Image drop zone */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      <Camera className="h-3.5 w-3.5 text-blue-400" /> Thumbnail
                    </label>
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => imageInputRef.current?.click()}
                      className={`relative h-40 rounded-xl cursor-pointer group transition-all duration-200 overflow-hidden ${
                        isDragging
                          ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-zinc-900 scale-[1.02]"
                          : getErr("image")
                            ? "ring-2 ring-red-500/60"
                            : "ring-2 ring-zinc-700/50 hover:ring-blue-500/50"
                      }`}>
                      {form.image ? (
                        <>
                          <Image
                            src={form.image}
                            alt="Preview"
                            fill
                            className="object-cover"
                            unoptimized
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
                          <ImagePlus
                            className={`h-8 w-8 transition-colors ${getErr("image") ? "text-red-400" : "text-zinc-500 group-hover:text-blue-400"}`}
                          />
                          <span
                            className={`text-xs transition-colors ${getErr("image") ? "text-red-400" : "text-zinc-600 group-hover:text-zinc-400"}`}>
                            Click or drag
                          </span>
                          <span className="text-xs text-zinc-700">
                            JPG, PNG · Max 5MB
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleImageSelect(f);
                        touch("image");
                      }}
                    />
                    {form.image && (
                      <button
                        onClick={() => {
                          setForm((f) => ({ ...f, image: null }));
                          setImageFile(null);
                        }}
                        className="flex items-center gap-1.5 text-xs text-red-400/70 hover:text-red-400 transition-colors">
                        <Trash2 className="h-3 w-3" /> Remove image
                      </button>
                    )}
                    <FieldError msg={getErr("image")} />
                  </div>

                  {/* Title + Company + Link */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        <FileText className="h-3.5 w-3.5 text-blue-400" />
                        Project Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        value={form.title}
                        onChange={(e) => {
                          setForm({ ...form, title: e.target.value });
                          touch("title");
                        }}
                        onBlur={() => touch("title")}
                        placeholder="Calm Llama - AI Chatbot"
                        className={inputClass(getErr("title"))}
                      />
                      <div className="flex items-start justify-between">
                        <FieldError msg={getErr("title")} />
                        <span
                          className={`text-xs font-mono ml-auto ${form.title.length > 90 ? "text-amber-400" : "text-zinc-600"}`}>
                          {form.title.length}/100
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        <Building2 className="h-3.5 w-3.5 text-blue-400" />
                        Company / Client
                        <span className="text-zinc-600 font-normal normal-case ml-1">
                          (optional)
                        </span>
                      </label>
                      <input
                        value={form.company}
                        onChange={(e) =>
                          setForm({ ...form, company: e.target.value })
                        }
                        placeholder="ToraTec AI, Dublin"
                        className={inputClass()}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        <Link2 className="h-3.5 w-3.5 text-blue-400" />
                        Live Link <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          value={form.link}
                          onChange={(e) => {
                            setForm({ ...form, link: e.target.value });
                            touch("link");
                          }}
                          onBlur={() => touch("link")}
                          placeholder="https://yourproject.vercel.app"
                          className={`${inputClass(getErr("link"))} ${form.link && !getErr("link") ? "pr-10" : ""}`}
                        />
                        {form.link && !getErr("link") && (
                          <a
                            href={form.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-blue-400 transition-colors">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                      <FieldError msg={getErr("link")} />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => {
                      setForm({ ...form, description: e.target.value });
                      touch("description");
                    }}
                    onBlur={() => touch("description")}
                    rows={3}
                    placeholder="What does this project do? What problem does it solve?"
                    className={`${inputClass(getErr("description"))} resize-none`}
                  />
                  <div className="flex items-start justify-between gap-2">
                    <FieldError msg={getErr("description")} />
                    <span
                      className={`text-xs font-mono ml-auto ${form.description.length > 450 ? "text-amber-400" : "text-zinc-600"}`}>
                      {form.description.length}/500
                    </span>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="space-y-2.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    <Code2 className="h-3.5 w-3.5 text-blue-400" />
                    Tech Stack <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                          touch("tech");
                        }
                      }}
                      placeholder="e.g. Next.js — press Enter to add"
                      className="flex-1 rounded-xl bg-zinc-800/70 border border-zinc-700/50 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all hover:border-zinc-600"
                    />
                    <button
                      onClick={() => {
                        addTag();
                        touch("tech");
                      }}
                      disabled={!techInput.trim()}
                      className="px-4 py-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 font-semibold hover:bg-blue-500/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {form.tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-zinc-800/30 border border-zinc-800/50">
                      <AnimatePresence>
                        {form.tech.map((tag, i) => (
                          <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${tagColors[i % tagColors.length]}`}>
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="hover:text-red-400 transition-colors">
                              <X className="h-3 w-3" />
                            </button>
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                  <FieldError msg={getErr("tech")} />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                  <div>
                    {hasErrors(liveErrors) && touched.size > 0 && (
                      <p className="flex items-center gap-1.5 text-xs text-amber-400">
                        <AlertCircle className="h-3.5 w-3.5" /> Fill required
                        fields to save.
                      </p>
                    )}
                    {saveError && (
                      <p className="flex items-center gap-1.5 text-xs text-red-400">
                        <AlertCircle className="h-3.5 w-3.5" /> {saveError}
                      </p>
                    )}
                  </div>
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
                          : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-400 hover:to-cyan-400 shadow-blue-500/25"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}>
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                        </>
                      ) : saved ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" /> Saved!
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />{" "}
                          {editingId === "new" ? "Add Project" : "Save Changes"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Project Cards ─────────────────────────────────────────── */}
        <div className="space-y-4">
          <AnimatePresence>
            {projects.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-zinc-800">
                <Folder className="h-12 w-12 text-zinc-700 mb-4" />
                <p className="text-zinc-500 font-medium">No projects yet.</p>
                <p className="text-xs text-zinc-600 mt-1">
                  Click Add Project to get started.
                </p>
              </motion.div>
            )}

            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, scale: 0.97 }}
                transition={{ delay: index * 0.04 }}
                className={`group rounded-2xl border bg-zinc-900/60 shadow-lg transition-all duration-200 overflow-hidden ${
                  editingId === project.id
                    ? "border-blue-500/40 opacity-50 pointer-events-none"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}>
                <div className="flex gap-4 p-5">
                  <div className="mt-1 shrink-0 text-zinc-700 cursor-grab hover:text-zinc-500 transition-colors hidden sm:flex items-start pt-1">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="shrink-0 h-20 w-28 rounded-xl overflow-hidden bg-zinc-800/60 ring-1 ring-zinc-700/50">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={112}
                        height={80}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImagePlus className="h-6 w-6 text-zinc-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                      <div>
                        <h3 className="font-bold text-white text-base leading-tight line-clamp-1">
                          {project.title}
                        </h3>
                        {project.company && (
                          <p className="text-xs text-blue-300 font-medium mt-0.5">
                            {project.company}
                          </p>
                        )}
                      </div>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 flex items-center gap-1.5 text-xs text-zinc-500 hover:text-blue-400 transition-colors bg-zinc-800/50 px-2.5 py-1 rounded-full border border-zinc-700/50 hover:border-blue-500/30">
                        <ExternalLink className="h-3 w-3" /> Preview
                      </a>
                    </div>
                    <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                    {project.tech.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tech
                          .slice(0, previewId === project.id ? undefined : 5)
                          .map((tag, i) => (
                            <span
                              key={tag}
                              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${tagColors[i % tagColors.length]}`}>
                              {tag}
                            </span>
                          ))}
                        {project.tech.length > 5 && (
                          <button
                            onClick={() =>
                              setPreviewId(
                                previewId === project.id ? null : project.id,
                              )
                            }
                            className="rounded-full border border-zinc-700/50 bg-zinc-800/50 px-2.5 py-0.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
                            {previewId === project.id ? (
                              <>
                                <EyeOff className="h-3 w-3" /> Less
                              </>
                            ) : (
                              <>
                                <Eye className="h-3 w-3" />+
                                {project.tech.length - 5} more
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(project)}
                      disabled={editingId !== null}
                      className="p-2 rounded-lg text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={deleteId === project.id || editingId !== null}
                      className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Delete">
                      {deleteId === project.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-red-400" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {projects.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-zinc-600 pb-6">
            <GripVertical className="h-3.5 w-3.5" />
            Projects displayed top-to-bottom on your portfolio.
          </div>
        )}
      </div>
    </div>
  );
}
