"use client";

import { useState, useRef, DragEvent } from "react";
import {
  User2,
  FileText,
  Save,
  Upload,
  Camera,
  X,
  Download,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Trash2,
  Link2,
  ImagePlus,
  Sparkles,
  ChevronRight,
  Phone,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";

// ─── Social SVG Icons ─────────────────────────────────────────────────────────
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.72-4.03-1.42-4.03-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.69.8.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.44-2.14 2.93v5.68H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.58 0 4.25 2.36 4.25 5.43v6.31zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
);
const TwitterXIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);
const FiverrIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.004 15.588a.995.995 0 1 0 .002-1.99.995.995 0 0 0-.002 1.99zm-4.338-7.21c0-1.037.212-1.44 1.217-1.476h1.121V4.919h-1.8c-2.453 0-3.654 1.322-3.654 3.8v.6h-1.801v2.28h1.8v7.89h2.916v-7.89h2.101l.384-2.28h-2.284v-.94zM9.394 19.489H6.478l2.198-7.9H6.603l-2.195 7.9H1.49L4.12 9.496H1.478V7.216h7.916l-2.63 10.27h2.63v2.003z" />
  </svg>
);
const UpworkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.546-1.405 0-2.543-1.14-2.545-2.546V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
  </svg>
);
const GmailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
  </svg>
);
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────
interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  fiverr: string;
  upwork: string;
  gmail: string;
}
interface FormData {
  headline: string;
  description: string;
  whatsapp: string;
  cvUrl: string;
  socials: SocialLinks;
}
interface FormErrors {
  headline?: string;
  description?: string;
  whatsapp?: string;
  cvUrl?: string;
  image?: string;
  socials: Partial<SocialLinks>;
}

// ─── Validators ───────────────────────────────────────────────────────────────
const isValidUrl = (val: string) => {
  if (!val) return true; // optional
  try {
    new URL(val);
    return true;
  } catch {
    return false;
  }
};
const isValidEmail = (val: string) => {
  if (!val) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
};
const isValidWhatsApp = (val: string) => {
  if (!val) return true;
  return /^\d{10,15}$/.test(val);
};

// ─── Social fields config ─────────────────────────────────────────────────────
const socialFields = [
  {
    key: "github",
    label: "GitHub",
    placeholder: "https://github.com/username",
    Icon: GithubIcon,
    color: "text-white",
    bg: "bg-zinc-700",
    ring: "focus:ring-zinc-400/40",
    isEmail: false,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/username",
    Icon: LinkedinIcon,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    ring: "focus:ring-blue-500/40",
    isEmail: false,
  },
  {
    key: "twitter",
    label: "X (Twitter)",
    placeholder: "https://x.com/username",
    Icon: TwitterXIcon,
    color: "text-zinc-200",
    bg: "bg-zinc-700",
    ring: "focus:ring-zinc-400/40",
    isEmail: false,
  },
  {
    key: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/username",
    Icon: InstagramIcon,
    color: "text-pink-400",
    bg: "bg-pink-500/15",
    ring: "focus:ring-pink-500/40",
    isEmail: false,
  },
  {
    key: "fiverr",
    label: "Fiverr",
    placeholder: "https://fiverr.com/username",
    Icon: FiverrIcon,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    ring: "focus:ring-emerald-500/40",
    isEmail: false,
  },
  {
    key: "upwork",
    label: "Upwork",
    placeholder: "https://upwork.com/freelancers/username",
    Icon: UpworkIcon,
    color: "text-green-400",
    bg: "bg-green-500/15",
    ring: "focus:ring-green-500/40",
    isEmail: false,
  },
  {
    key: "gmail",
    label: "Gmail / Email",
    placeholder: "yourname@gmail.com",
    Icon: GmailIcon,
    color: "text-red-400",
    bg: "bg-red-500/15",
    ring: "focus:ring-red-500/40",
    isEmail: true,
  },
];

// ─── Error message component ──────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {msg}
    </p>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function UserPage() {
  const [form, setForm] = useState<FormData>({
    headline: "",
    description: "",
    whatsapp: "",
    cvUrl: "",
    socials: {
      github: "",
      linkedin: "",
      twitter: "",
      instagram: "",
      fiverr: "",
      upwork: "",
      gmail: "",
    },
  });
  const [errors, setErrors] = useState<FormErrors>({ socials: {} });
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = (data: FormData, img: string | null): FormErrors => {
    const e: FormErrors = { socials: {} };

    if (!data.headline.trim()) e.headline = "Headline is required.";
    else if (data.headline.trim().length < 5)
      e.headline = "Headline must be at least 5 characters.";
    else if (data.headline.length > 100)
      e.headline = "Headline must be under 100 characters.";

    if (!data.description.trim()) e.description = "Bio is required.";
    else if (data.description.trim().length < 20)
      e.description = "Bio must be at least 20 characters.";
    else if (data.description.length > 500)
      e.description = "Bio must be under 500 characters.";

    if (data.whatsapp && !isValidWhatsApp(data.whatsapp))
      e.whatsapp = "Enter digits only with country code, e.g. 923001234567";

    if (data.cvUrl && !isValidUrl(data.cvUrl))
      e.cvUrl = "Enter a valid URL (must start with https://).";

    if (!img) e.image = "Profile photo is required.";

    socialFields.forEach(({ key, isEmail }) => {
      const val = data.socials[key as keyof SocialLinks];
      if (isEmail) {
        if (!isValidEmail(val))
          e.socials[key as keyof SocialLinks] = "Enter a valid email address.";
      } else {
        if (!isValidUrl(val))
          e.socials[key as keyof SocialLinks] =
            "Enter a valid URL (e.g. https://...).";
      }
    });

    return e;
  };

  const hasErrors = (e: FormErrors) =>
    !!(
      e.headline ||
      e.description ||
      e.whatsapp ||
      e.cvUrl ||
      e.image ||
      Object.values(e.socials).some(Boolean)
    );

  const touch = (field: string) =>
    setTouched((prev) => new Set([...prev, field]));

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        image: "Only image files are allowed (JPG, PNG, WEBP).",
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be under 5MB." }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setErrors((prev) => ({ ...prev, image: undefined }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  };

  const setSocial = (key: string, val: string) => {
    setForm((f) => ({ ...f, socials: { ...f.socials, [key]: val } }));
    touch(`social_${key}`);
  };

  const handleSave = async () => {
    // Mark all fields touched on submit
    const allFields = new Set([
      "headline",
      "description",
      "whatsapp",
      "cvUrl",
      "image",
      ...socialFields.map((s) => `social_${s.key}`),
    ]);
    setTouched(allFields);

    const e = validate(form, imagePreview);
    setErrors(e);
    if (hasErrors(e)) return;

    setSaving(true);
    await new Promise((r) => setTimeout(r, 1400));
    // 👉 Replace with: await fetch("/api/user", { method: "POST", body: JSON.stringify({ ...form, image: imagePreview }) })
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Live re-validate on change
  const liveErrors = validate(form, imagePreview);
  const getErr = (field: string) =>
    touched.has(field)
      ? ((liveErrors as Record<string, unknown>)[field] as string | undefined)
      : undefined;
  const getSocialErr = (key: string) =>
    touched.has(`social_${key}`)
      ? liveErrors.socials[key as keyof SocialLinks]
      : undefined;

  const inputClass = (err?: string) =>
    `w-full rounded-xl bg-zinc-800/70 border px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 transition-all hover:border-zinc-600 ${
      err
        ? "border-red-500/60 focus:ring-red-500/30 focus:border-red-500/40"
        : "border-zinc-700/50 focus:ring-indigo-500/50 focus:border-indigo-500/30"
    }`;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* ── Page Header ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-600 mb-2">
              <span>Dashboard</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-zinc-400 font-medium">User Profile</span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <User2 className="h-5 w-5 text-white" />
              </div>
              User Profile
            </h1>
            <p className="text-sm text-zinc-500 mt-1 ml-12">
              Your identity on the public-facing portfolio site.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shrink-0 ${
              saved
                ? "bg-emerald-500/90 text-white shadow-emerald-500/20"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 shadow-indigo-500/25 hover:scale-105 active:scale-95"
            } disabled:opacity-60 disabled:cursor-not-allowed`}>
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
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* ── Row 1: Picture + Basic Info ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture */}
          <div
            className={`rounded-2xl border bg-zinc-900/60 p-6 flex flex-col items-center gap-5 transition-colors ${
              getErr("image") ? "border-red-500/40" : "border-zinc-800"
            }`}>
            <div className="self-start flex items-center gap-2">
              <Camera className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Photo
              </span>
              <span className="text-red-400 text-xs ml-1">*</span>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative w-40 h-40 rounded-full cursor-pointer group transition-all duration-300 ${
                isDragging
                  ? "ring-4 ring-indigo-400 ring-offset-4 ring-offset-zinc-900 scale-105"
                  : getErr("image")
                    ? "ring-2 ring-red-500/60 hover:ring-red-400/80"
                    : "ring-2 ring-zinc-700 hover:ring-indigo-500/70 hover:scale-[1.02]"
              }`}>
              {imagePreview ? (
                <>
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full rounded-full object-cover"
                    width={160}
                    height={160}
                  />
                  <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                    <Camera className="h-7 w-7 text-white" />
                    <span className="text-xs text-zinc-300">Change</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-zinc-800 to-zinc-700/60 flex flex-col items-center justify-center gap-2">
                  <ImagePlus
                    className={`h-9 w-9 transition-colors ${getErr("image") ? "text-red-400" : "text-zinc-500 group-hover:text-indigo-400"}`}
                  />
                  <span
                    className={`text-xs transition-colors ${getErr("image") ? "text-red-400" : "text-zinc-600 group-hover:text-zinc-400"}`}>
                    Upload
                  </span>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImageSelect(f);
                touch("image");
              }}
            />

            <div className="text-center space-y-1">
              <p className="text-xs text-zinc-400 font-medium">
                Click or drag & drop
              </p>
              <p className="text-xs text-zinc-600">JPG, PNG, WEBP · Max 5MB</p>
            </div>

            <FieldError msg={getErr("image")} />

            {imagePreview && (
              <button
                onClick={() => {
                  setImagePreview(null);
                  touch("image");
                }}
                className="flex items-center gap-1.5 text-xs text-red-400/80 hover:text-red-400 transition-colors">
                <Trash2 className="h-3.5 w-3.5" /> Remove photo
              </button>
            )}
          </div>

          {/* Headline + Description */}
          <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Basic Info
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                Headline <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.headline}
                onChange={(e) => {
                  setForm({ ...form, headline: e.target.value });
                  touch("headline");
                }}
                onBlur={() => touch("headline")}
                placeholder="e.g. Full-Stack Developer & Open Source Enthusiast"
                className={inputClass(getErr("headline"))}
              />
              <div className="flex items-start justify-between gap-2">
                {getErr("headline") ? (
                  <FieldError msg={getErr("headline")} />
                ) : (
                  <p className="text-xs text-zinc-600">
                    Shown below your name in the hero section.
                  </p>
                )}
                <span
                  className={`text-xs font-mono shrink-0 ${form.headline.length > 90 ? "text-amber-400" : "text-zinc-600"}`}>
                  {form.headline.length}/100
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                Description / Bio <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => {
                  setForm({ ...form, description: e.target.value });
                  touch("description");
                }}
                onBlur={() => touch("description")}
                rows={6}
                placeholder="Write a short bio about yourself — what you build, what you love, your journey as a developer..."
                className={`${inputClass(getErr("description"))} resize-none`}
              />
              <div className="flex items-start justify-between gap-2">
                {getErr("description") ? (
                  <FieldError msg={getErr("description")} />
                ) : (
                  <p className="text-xs text-zinc-600">
                    Keep it short, engaging, and authentic.
                  </p>
                )}
                <span
                  className={`text-xs font-mono shrink-0 ${form.description.length > 450 ? "text-amber-400" : "text-zinc-600"}`}>
                  {form.description.length}/500
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Social Links ─────────────────────────────────────────── */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Social Links
            </span>
            <span className="ml-auto text-xs text-zinc-600">
              All optional · URLs must start with https://
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {socialFields.map(
              ({ key, label, placeholder, Icon, color, bg, ring, isEmail }) => {
                const err = getSocialErr(key);
                const val = form.socials[key as keyof SocialLinks];
                return (
                  <div key={key} className="space-y-1.5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      <div
                        className={`h-5 w-5 rounded-md ${bg} flex items-center justify-center`}>
                        <Icon className={`h-3 w-3 ${color}`} />
                      </div>
                      {label}
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-md ${bg} flex items-center justify-center pointer-events-none`}>
                        <Icon className={`h-3 w-3 ${color}`} />
                      </div>
                      <input
                        type={isEmail ? "email" : "text"}
                        value={val}
                        onChange={(e) => setSocial(key, e.target.value)}
                        onBlur={() => touch(`social_${key}`)}
                        placeholder={placeholder}
                        className={`w-full rounded-xl bg-zinc-800/70 border pl-10 ${val ? "pr-9" : "pr-4"} py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 ${
                          err
                            ? "border-red-500/60 focus:ring-red-500/30"
                            : `border-zinc-700/50 ${ring} focus:border-transparent hover:border-zinc-600`
                        } transition-all`}
                      />
                      {val && !err && (
                        <a
                          href={isEmail ? `mailto:${val}` : val}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-indigo-400 transition-colors">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {err && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400">
                          <AlertCircle className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                    <FieldError msg={err} />
                  </div>
                );
              },
            )}
          </div>
        </div>

        {/* ── Row 3: WhatsApp + CV ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* WhatsApp */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
            <div className="flex items-center gap-2">
              <WhatsAppIcon className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                WhatsApp
              </span>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                WhatsApp Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400 pointer-events-none" />
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => {
                    setForm({ ...form, whatsapp: e.target.value });
                    touch("whatsapp");
                  }}
                  onBlur={() => touch("whatsapp")}
                  placeholder="923001234567"
                  className={`w-full rounded-xl bg-zinc-800/70 border pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 transition-all hover:border-zinc-600 ${
                    getErr("whatsapp")
                      ? "border-red-500/60 focus:ring-red-500/30"
                      : "border-zinc-700/50 focus:ring-emerald-500/40 focus:border-transparent"
                  }`}
                />
              </div>
              <FieldError msg={getErr("whatsapp")} />
              {!getErr("whatsapp") && (
                <p className="text-xs text-zinc-600">
                  Digits only with country code, e.g.{" "}
                  <span className="font-mono text-zinc-500">923001234567</span>
                </p>
              )}
            </div>
            {form.whatsapp && !getErr("whatsapp") && (
              <div className="pt-1">
                <p className="text-xs text-zinc-600 mb-2">
                  Preview on frontend:
                </p>
                <a
                  href={`https://wa.me/${form.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-semibold hover:bg-emerald-500/25 transition-all">
                  <WhatsAppIcon className="h-4 w-4" />
                  Chat on WhatsApp
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </a>
              </div>
            )}
          </div>

          {/* CV Upload */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Resume / CV
              </span>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                  Direct Link (Drive / Cloudinary / Any URL)
                </label>
                <input
                  type="url"
                  value={form.cvUrl}
                  onChange={(e) => {
                    setForm({ ...form, cvUrl: e.target.value });
                    touch("cvUrl");
                  }}
                  onBlur={() => touch("cvUrl")}
                  placeholder="https://drive.google.com/file/d/..."
                  className={inputClass(getErr("cvUrl"))}
                />
                <FieldError msg={getErr("cvUrl")} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                  Or Upload PDF
                </label>
                <div
                  onClick={() => cvInputRef.current?.click()}
                  className="flex items-center gap-3 rounded-xl border-2 border-dashed border-zinc-700 hover:border-amber-500/50 bg-zinc-800/20 hover:bg-amber-500/5 p-4 cursor-pointer transition-all group">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                    <Upload className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors truncate">
                      {cvFile ? cvFile.name : "Click to upload PDF"}
                    </p>
                    <p className="text-xs text-zinc-600">
                      PDF format · Max 10MB
                    </p>
                  </div>
                  {cvFile && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCvFile(null);
                      }}
                      className="ml-auto text-zinc-600 hover:text-red-400 transition-colors shrink-0">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <input
                  ref={cvInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    if (f.size > 10 * 1024 * 1024) {
                      alert("PDF must be under 10MB.");
                      return;
                    }
                    setCvFile(f);
                  }}
                />
              </div>

              {(form.cvUrl && !getErr("cvUrl")) || cvFile ? (
                <div className="pt-3 border-t border-zinc-800">
                  <p className="text-xs text-zinc-600 mb-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Button shown on your public portfolio:
                  </p>
                  <a
                    href={form.cvUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95">
                    <Download className="h-4 w-4" />
                    Download CV
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* ── Bottom Save ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between pb-6">
          {/* Error summary */}
          {touched.size > 0 && hasErrors(liveErrors) && (
            <p className="flex items-center gap-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Please fix the errors above before saving.
            </p>
          )}
          <div className="ml-auto">
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-xl ${
                saved
                  ? "bg-emerald-500 text-white shadow-emerald-500/20"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 shadow-indigo-500/25 hover:scale-105 active:scale-95"
              } disabled:opacity-60 disabled:cursor-not-allowed`}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : saved ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  All Changes Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save All Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
