"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowLeft,
  FiGithub,
  FiExternalLink,
  FiChevronRight,
} from "react-icons/fi";

// ── Types matched to your ProjectModel ──────────────────────────────────────
interface CloudinaryAsset {
  public_id: string;
  url: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  thumbnail?: CloudinaryAsset;
  images?: CloudinaryAsset[];
  techStack: string[];
  category: string;
  status: string;
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
  company?: string;
  order: number;
  isVisible: boolean;
}

// ── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-white/10" />
      <div className="p-6 space-y-4">
        <div className="h-5 bg-white/10 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-3 bg-white/10 rounded w-full" />
          <div className="h-3 bg-white/10 rounded w-5/6" />
          <div className="h-3 bg-white/10 rounded w-4/6" />
        </div>
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-6 w-16 bg-white/10 rounded-full" />
          ))}
        </div>
        <div className="flex gap-3 pt-2">
          <div className="flex-1 h-10 bg-white/10 rounded-full" />
          <div className="flex-1 h-10 bg-white/10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/admin/api-projects");

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const json = await res.json();

        // your apiResponse wraps data — adjust key if needed (data / result / projects)
        const raw: Project[] = json.data ?? json;

        // only show visible projects, already sorted by order from backend
        setProjects(raw.filter((p) => p.isVisible));
      } catch (err: any) {
        setError(err.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

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
          <span className="text-white font-medium">Projects</span>
        </motion.nav>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all hover:scale-105">
            <FiArrowLeft className="size-4" />
            Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-white to-emerald-300 bg-clip-text text-transparent drop-shadow-2xl mb-6">
            My Projects
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Projects I worked on. Each of them containing its own case study.
          </p>
          <div className="h-px mx-auto w-24 lg:w-32 bg-gradient-to-r from-emerald-400 via-white/60 to-transparent mt-6" />
        </motion.div>

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <p className="text-red-400 text-lg font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm transition-all">
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
            <p className="text-white/50 text-lg">No projects found.</p>
            <p className="text-white/30 text-sm">
              Add projects from the admin panel.
            </p>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
            : projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.08 }}
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300">
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden bg-white/5">
                    {project.thumbnail?.url ? (
                      <Image
                        src={project.thumbnail.url}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      // Fallback placeholder when no thumbnail
                      <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">
                        No Image
                      </div>
                    )}

                    {/* Featured Badge */}
                    {project.featured && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/90 text-white shadow-lg">
                        Featured
                      </span>
                    )}

                    {/* Company Badge */}
                    {project.company && (
                      <span className="absolute bottom-3 left-3 text-[10px] px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white/80 border border-white/10">
                        {project.company}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Title */}
                    <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.slice(0, 5).map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 hover:bg-emerald-500/20 hover:border-emerald-400/50 transition-all">
                          {tag}
                        </span>
                      ))}
                      {project.techStack.length > 5 && (
                        <span className="text-xs px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/60">
                          +{project.techStack.length - 5} more
                        </span>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all hover:scale-105">
                          <FiGithub className="size-4" />
                          GitHub
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-semibold shadow-lg hover:shadow-emerald-500/50 transition-all hover:scale-105`}>
                          <FiExternalLink className="size-4" />
                          Live Visit
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </main>
  );
}
