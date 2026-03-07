"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  ChevronRight,
  GripVertical,
  Calendar,
  Building2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Code2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  techStack: string[];
}

interface ExperienceAPI {
  _id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  techStack: string[];
}

const normalize = (e: ExperienceAPI): Experience => ({
  id: e._id,
  company: e.company,
  role: e.role,
  duration: e.duration,
  description: e.description,
  techStack: e.techStack ?? [],
});

const emptyForm: Omit<Experience, "id"> = {
  company: "",
  role: "",
  duration: "",
  description: "",
  techStack: [],
};

const tagColors = [
  "bg-blue-500/10 border-blue-500/30 text-blue-300",
  "bg-violet-500/10 border-violet-500/30 text-violet-300",
  "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
  "bg-amber-500/10 border-amber-500/30 text-amber-300",
  "bg-pink-500/10 border-pink-500/30 text-pink-300",
  "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
];

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true); // initial fetch
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);

      const res = await fetch("/api/admin/experience");
      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Failed to fetch");

      setExperiences((json.data as ExperienceAPI[]).map(normalize));
    } catch (err: unknown) {
      setFetchError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const openAdd = () => {
    setForm(emptyForm);
    setTechInput("");
    setSaveError(null);
    setEditingId("new");
  };

  const openEdit = (exp: Experience) => {
    setForm({
      company: exp.company,
      role: exp.role,
      duration: exp.duration,
      description: exp.description,
      techStack: [...exp.techStack],
    });
    setTechInput("");
    setSaveError(null);
    setEditingId(exp.id);
  };

  const closeForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setTechInput("");
    setSaveError(null);
  };

  const addTag = () => {
    const t = techInput.trim();
    if (t && !form.techStack.includes(t)) {
      setForm((f) => ({ ...f, techStack: [...f.techStack, t] }));
    }
    setTechInput("");
  };

  const removeTag = (tag: string) =>
    setForm((f) => ({ ...f, techStack: f.techStack.filter((t) => t !== tag) }));

  const handleSave = async () => {
    if (!form.company || !form.role || !form.duration) return;

    setSaving(true);
    setSaveError(null);

    try {
      const isNew = editingId === "new";

      const url = isNew
        ? "/api/admin/experience"
        : `/api/admin/experience/${editingId}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: form.company.trim(),
          role: form.role.trim(),
          duration: form.duration.trim(),
          description: form.description.trim(),
          techStack: form.techStack,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to save");

      const saved = normalize(json.data as ExperienceAPI);

      if (isNew) {
        setExperiences((prev) => [saved, ...prev]);
      } else {
        setExperiences((prev) =>
          prev.map((e) => (e.id === editingId ? saved : e)),
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

  const handleDelete = async (id: string) => {
    setDeleteId(id);

    try {
      const res = await fetch(`/api/admin/experience/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Failed to delete");

      setExperiences((prev) => prev.filter((e) => e.id !== id));
    } catch (err: unknown) {
      console.error("[Delete Experience]", err);
    } finally {
      setDeleteId(null);
    }
  };

  const isFormValid =
    form.company.trim() && form.role.trim() && form.duration.trim();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
          <p className="text-zinc-500 text-sm">Loading experiences...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <AlertCircle className="h-8 w-8 text-red-400" />
          <p className="text-zinc-300 text-sm font-medium">{fetchError}</p>
          <button
            onClick={fetchExperiences}
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-600 mb-2">
              <span>Dashboard</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-zinc-400 font-medium">Experience</span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              Experience
            </h1>
            <p className="text-sm text-zinc-500 mt-1 ml-12">
              {experiences.length} entries · Shown on your public portfolio
              timeline.
            </p>
          </div>

          <button
            onClick={openAdd}
            disabled={editingId !== null}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0">
            <Plus className="h-4 w-4" />
            Add Experience
          </button>
        </div>

        <AnimatePresence>
          {editingId !== null && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-emerald-500/30 bg-zinc-900/80 shadow-2xl shadow-emerald-500/5 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-emerald-500/5">
                <h2 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                  {editingId === "new" ? (
                    <>
                      <Plus className="h-4 w-4" /> New Experience
                    </>
                  ) : (
                    <>
                      <Pencil className="h-4 w-4" /> Edit Experience
                    </>
                  )}
                </h2>
                <button
                  onClick={closeForm}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors rounded-lg p-1 hover:bg-zinc-800">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                      Company / Organization *
                    </label>
                    <input
                      value={form.company}
                      onChange={(e) =>
                        setForm({ ...form, company: e.target.value })
                      }
                      placeholder="DevelopersHub Corporation"
                      className="w-full rounded-xl bg-zinc-800/70 border border-zinc-700/50 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all hover:border-zinc-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
                      Role / Title *
                    </label>
                    <input
                      value={form.role}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                      placeholder="Full-Stack Developer"
                      className="w-full rounded-xl bg-zinc-800/70 border border-zinc-700/50 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all hover:border-zinc-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                    Duration *
                  </label>
                  <input
                    value={form.duration}
                    onChange={(e) =>
                      setForm({ ...form, duration: e.target.value })
                    }
                    placeholder="2023 - Present"
                    className="w-full md:w-1/2 rounded-xl bg-zinc-800/70 border border-zinc-700/50 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all hover:border-zinc-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={4}
                    placeholder="What did you build? What impact did you make?"
                    className="w-full rounded-xl bg-zinc-800/70 border border-zinc-700/50 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all resize-none hover:border-zinc-600"
                  />
                  <div className="flex justify-end">
                    <span
                      className={`text-xs font-mono ${form.description.length > 400 ? "text-amber-400" : "text-zinc-600"}`}>
                      {form.description.length}/500
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    <Code2 className="h-3.5 w-3.5 text-emerald-400" />
                    Tech Stack
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="e.g. Next.js — press Enter to add"
                      className="flex-1 rounded-xl bg-zinc-800/70 border border-zinc-700/50 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all hover:border-zinc-600"
                    />
                    <button
                      onClick={addTag}
                      disabled={!techInput.trim()}
                      className="px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-semibold hover:bg-emerald-500/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {form.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-zinc-800/30 border border-zinc-800/50">
                      <AnimatePresence>
                        {form.techStack.map((tag, i) => (
                          <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${tagColors[i % tagColors.length]}`}>
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="hover:text-red-400 transition-colors ml-0.5">
                              <X className="h-3 w-3" />
                            </button>
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                  <div>
                    {!isFormValid && (
                      <p className="flex items-center gap-1.5 text-xs text-amber-400">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Company, role and duration are required.
                      </p>
                    )}
                    {/* ── API error shown inline ── */}
                    {saveError && (
                      <p className="flex items-center gap-1.5 text-xs text-red-400">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {saveError}
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
                      disabled={saving || saved || !isFormValid}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg ${
                        saved
                          ? "bg-emerald-500 text-white shadow-emerald-500/20"
                          : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500 shadow-emerald-500/25"
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
                          {editingId === "new" ? "Add Entry" : "Save Changes"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <AnimatePresence>
            {experiences.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-zinc-800">
                <Briefcase className="h-12 w-12 text-zinc-700 mb-4" />
                <p className="text-zinc-500 font-medium">
                  No experience entries yet.
                </p>
                <p className="text-xs text-zinc-600 mt-1">
                  Click "Add Experience" to get started.
                </p>
              </motion.div>
            )}

            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, scale: 0.97 }}
                transition={{ delay: index * 0.04 }}
                className={`group rounded-2xl border bg-zinc-900/60 shadow-lg transition-all duration-200 overflow-hidden ${
                  editingId === exp.id
                    ? "border-emerald-500/40 opacity-50 pointer-events-none"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}>
                <div className="p-5 flex gap-4">
                  <div className="mt-1 shrink-0 text-zinc-700 cursor-grab hidden sm:block">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="mt-0.5 h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                      <div>
                        <h3 className="font-bold text-white text-base leading-tight">
                          {exp.company}
                        </h3>
                        <p className="text-sm text-emerald-300 font-medium">
                          {exp.role}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 shrink-0 bg-zinc-800/50 px-3 py-1 rounded-full">
                        <Calendar className="h-3.5 w-3.5" />
                        {exp.duration}
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">
                        {exp.description}
                      </p>
                    )}
                    {exp.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {exp.techStack.map((tag, i) => (
                          <span
                            key={tag}
                            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${tagColors[i % tagColors.length]}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(exp)}
                      disabled={editingId !== null}
                      className="p-2 rounded-lg text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      disabled={deleteId === exp.id || editingId !== null}
                      className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Delete">
                      {deleteId === exp.id ? (
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

        {experiences.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-zinc-600 pb-6">
            <GripVertical className="h-3.5 w-3.5" />
            Entries are displayed top-to-bottom on your portfolio timeline.
          </div>
        )}
      </div>
    </div>
  );
}
