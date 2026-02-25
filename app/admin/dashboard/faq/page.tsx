"use client";

import { useState, useEffect, useCallback } from "react";
import {
  HelpCircle,
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
  MessageSquare,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQAPI {
  _id: string;
  question: string;
  answer: string;
}

interface FormErrors {
  question?: string;
  answer?: string;
}

// ─── Normalize MongoDB → frontend ─────────────────────────────────────────────
const normalize = (f: FAQAPI): FAQ => ({
  id: f._id,
  question: f.question,
  answer: f.answer,
});

// ─── Validators ───────────────────────────────────────────────────────────────
const validate = (form: Omit<FAQ, "id">): FormErrors => {
  const e: FormErrors = {};
  if (!form.question.trim()) e.question = "Question is required.";
  else if (form.question.trim().length < 10)
    e.question = "At least 10 characters.";
  else if (form.question.length > 200) e.question = "Max 200 characters.";
  if (!form.answer.trim()) e.answer = "Answer is required.";
  else if (form.answer.trim().length < 20) e.answer = "At least 20 characters.";
  else if (form.answer.length > 1000) e.answer = "Max 1000 characters.";
  return e;
};

const hasErrors = (e: FormErrors) => Object.values(e).some(Boolean);

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {msg}
    </p>
  );
}

const emptyForm: Omit<FAQ, "id"> = { question: "", answer: "" };

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // ── 1. Fetch on mount ─────────────────────────────────────────────────────
  const fetchFaqs = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);

      const res = await fetch("/api/admin/faqs");
      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Failed to fetch");
      setFaqs((json.data as FAQAPI[]).map(normalize));
    } catch (err: unknown) {
      setFetchError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const touch = (f: string) => setTouched((p) => new Set([...p, f]));

  const openAdd = () => {
    setForm(emptyForm);
    setErrors({});
    setTouched(new Set());
    setPreviewOpen(false);
    setSaveError(null);
    setEditingId("new");
  };

  const openEdit = (faq: FAQ) => {
    setForm({ question: faq.question, answer: faq.answer });
    setErrors({});
    setTouched(new Set());
    setPreviewOpen(false);
    setSaveError(null);
    setEditingId(faq.id);
  };

  const closeForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setTouched(new Set());
    setPreviewOpen(false);
    setSaveError(null);
  };

  // ── 2. Save ───────────────────────────────────────────────────────────────
  const handleSave = async () => {
    const allFields = new Set(["question", "answer"]);
    setTouched(allFields);
    const e = validate(form);
    setErrors(e);
    if (hasErrors(e)) return;

    setSaving(true);
    setSaveError(null);

    try {
      const isNew = editingId === "new";
      const url = isNew ? "/api/admin/faqs" : `/api/admin/faqs/${editingId}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: form.question.trim(),
          answer: form.answer.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to save");

      const savedFaq = normalize(json.data as FAQAPI);

      if (isNew) {
        setFaqs((prev) => [...prev, savedFaq]);
      } else {
        setFaqs((prev) => prev.map((f) => (f.id === editingId ? savedFaq : f)));
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

  // ── 3. Delete ─────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    setDeleteId(id);
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to delete");
      setFaqs((prev) => prev.filter((f) => f.id !== id));
    } catch (err: unknown) {
      console.error("[Delete FAQ]", err);
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
        : "border-zinc-700/50 focus:ring-violet-500/40 focus:border-transparent"
    }`;

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />
          <p className="text-zinc-500 text-sm">Loading FAQs...</p>
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
            onClick={fetchFaqs}
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
              <span className="text-zinc-400 font-medium">FAQ</span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <HelpCircle className="h-5 w-5 text-white" />
              </div>
              FAQ
            </h1>
            <p className="text-sm text-zinc-500 mt-1 ml-12">
              {faqs.length} questions · Shown as accordion on your portfolio.
            </p>
          </div>
          <button
            onClick={openAdd}
            disabled={editingId !== null}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-violet-500/25 hover:from-violet-400 hover:to-indigo-500 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0">
            <Plus className="h-4 w-4" />
            Add FAQ
          </button>
        </div>

        {/* ── Stats bar ────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Total Questions",
              value: faqs.length,
              color: "text-violet-400",
            },
            {
              label: "Avg Answer Length",
              value: faqs.length
                ? `${Math.round(faqs.reduce((a, f) => a + f.answer.length, 0) / faqs.length)} chars`
                : "—",
              color: "text-blue-400",
            },
            {
              label: "Last Updated",
              value: "Live",
              color: "text-emerald-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-center">
              <div className={`text-xl font-black ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Add / Edit Form ──────────────────────────────────────── */}
        <AnimatePresence>
          {editingId !== null && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-violet-500/30 bg-zinc-900/80 shadow-2xl shadow-violet-500/5 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-violet-500/5">
                <h2 className="text-sm font-bold text-violet-300 flex items-center gap-2">
                  {editingId === "new" ? (
                    <>
                      <Plus className="h-4 w-4" /> New FAQ Item
                    </>
                  ) : (
                    <>
                      <Pencil className="h-4 w-4" /> Edit FAQ Item
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
                {/* Question */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    <HelpCircle className="h-3.5 w-3.5 text-violet-400" />
                    Question <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.question}
                    onChange={(e) => {
                      setForm({ ...form, question: e.target.value });
                      touch("question");
                    }}
                    onBlur={() => touch("question")}
                    placeholder="e.g. What services do you offer?"
                    className={inputClass(getErr("question"))}
                  />
                  <div className="flex items-start justify-between gap-2">
                    <FieldError msg={getErr("question")} />
                    <span
                      className={`text-xs font-mono ml-auto shrink-0 ${form.question.length > 180 ? "text-amber-400" : "text-zinc-600"}`}>
                      {form.question.length}/200
                    </span>
                  </div>
                </div>

                {/* Answer */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    <MessageSquare className="h-3.5 w-3.5 text-violet-400" />
                    Answer <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={form.answer}
                    onChange={(e) => {
                      setForm({ ...form, answer: e.target.value });
                      touch("answer");
                    }}
                    onBlur={() => touch("answer")}
                    rows={5}
                    placeholder="Write a clear, helpful answer..."
                    className={`${inputClass(getErr("answer"))} resize-none`}
                  />
                  <div className="flex items-start justify-between gap-2">
                    <FieldError msg={getErr("answer")} />
                    <span
                      className={`text-xs font-mono ml-auto shrink-0 ${form.answer.length > 900 ? "text-amber-400" : "text-zinc-600"}`}>
                      {form.answer.length}/1000
                    </span>
                  </div>
                </div>

                {/* Live preview */}
                {(form.question || form.answer) && (
                  <div className="space-y-2">
                    <button
                      onClick={() => setPreviewOpen((p) => !p)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-wider">
                      {previewOpen ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5" /> Hide Preview
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5" /> Show Preview (as on
                          portfolio)
                        </>
                      )}
                    </button>
                    <AnimatePresence>
                      {previewOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden">
                          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 overflow-hidden">
                            <div className="flex items-center justify-between p-5">
                              <h3 className="pr-4 text-base font-semibold text-white">
                                {form.question ||
                                  "Your question will appear here..."}
                              </h3>
                              <ChevronDown className="h-5 w-5 text-emerald-400 shrink-0" />
                            </div>
                            {form.answer && (
                              <div className="px-5 pb-5 pt-0 border-t border-white/5">
                                <p className="text-white/80 leading-relaxed text-sm mt-3">
                                  {form.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                  <div>
                    {hasErrors(liveErrors) && touched.size > 0 && (
                      <p className="flex items-center gap-1.5 text-xs text-amber-400">
                        <AlertCircle className="h-3.5 w-3.5" /> Fill all
                        required fields to save.
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
                          : "bg-gradient-to-r from-violet-500 to-indigo-600 text-white hover:from-violet-400 hover:to-indigo-500 shadow-violet-500/25"
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
                          {editingId === "new" ? "Add FAQ" : "Save Changes"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FAQ List ──────────────────────────────────────────────── */}
        <div className="space-y-3">
          <AnimatePresence>
            {faqs.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-zinc-800">
                <HelpCircle className="h-12 w-12 text-zinc-700 mb-4" />
                <p className="text-zinc-500 font-medium">No FAQ items yet.</p>
                <p className="text-xs text-zinc-600 mt-1">
                  Click "Add FAQ" to get started.
                </p>
              </motion.div>
            )}

            {faqs.map((faq, index) => {
              const isExpanded = expandedId === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, scale: 0.97 }}
                  transition={{ delay: index * 0.03 }}
                  className={`group rounded-2xl border bg-zinc-900/60 shadow-lg transition-all duration-200 overflow-hidden ${
                    editingId === faq.id
                      ? "border-violet-500/40 opacity-50 pointer-events-none"
                      : isExpanded
                        ? "border-violet-500/30"
                        : "border-zinc-800 hover:border-zinc-700"
                  }`}>
                  {/* Question row */}
                  <div className="flex items-center gap-3 px-4 py-4">
                    <div className="shrink-0 text-zinc-700 cursor-grab hover:text-zinc-500 transition-colors hidden sm:block">
                      <GripVertical className="h-5 w-5" />
                    </div>
                    <div className="h-7 w-7 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-300 shrink-0">
                      {index + 1}
                    </div>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                      className="flex-1 text-left flex items-center justify-between gap-3 min-w-0">
                      <span className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors truncate">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-zinc-500 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180 text-violet-400" : ""}`}
                      />
                    </button>
                    <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(faq)}
                        disabled={editingId !== null}
                        className="p-2 rounded-lg text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id)}
                        disabled={deleteId === faq.id || editingId !== null}
                        className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Delete">
                        {deleteId === faq.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-red-400" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded answer */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden">
                        <div className="px-4 pb-4 pt-0 ml-[4.5rem] border-t border-zinc-800/50">
                          <p className="text-sm text-zinc-400 leading-relaxed pt-3">
                            {faq.answer}
                          </p>
                          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-zinc-800/30">
                            <span className="text-xs text-zinc-600 font-mono">
                              {faq.answer.length} chars
                            </span>
                            <span className="text-xs text-zinc-700">·</span>
                            <span className="text-xs text-zinc-600">
                              ~{Math.ceil(faq.answer.split(" ").length / 200)}{" "}
                              min read
                            </span>
                            <button
                              onClick={() => openEdit(faq)}
                              disabled={editingId !== null}
                              className="ml-auto flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors disabled:opacity-30">
                              <Pencil className="h-3 w-3" /> Edit
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {faqs.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-zinc-600 pb-6">
            <GripVertical className="h-3.5 w-3.5" />
            FAQs display top-to-bottom on your portfolio.
          </div>
        )}
      </div>
    </div>
  );
}
