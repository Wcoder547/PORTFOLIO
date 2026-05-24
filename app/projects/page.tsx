"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowLeft,
  FiGithub,
  FiExternalLink,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

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

function SkeletonRow() {
  return (
    <div className="py-12 border-b border-white/5 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start">
        <div className="space-y-4 order-2 lg:order-1">
          <div className="h-3 w-10 bg-white/6 rounded" />
          <div className="h-7 w-2/3 bg-white/8 rounded" />
          <div className="h-4 w-full bg-white/5 rounded" />
          <div className="h-4 w-5/6 bg-white/5 rounded" />
          <div className="flex gap-2 pt-1">
            {[...Array(4)].map((_, i) => <div key={i} className="h-6 w-16 bg-white/6 rounded" />)}
          </div>
        </div>
        <div className="order-1 lg:order-2 h-56 bg-white/5" style={{ borderRadius: "2px" }} />
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/api-projects");
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      const raw: Project[] = json.data ?? json;
      setProjects(raw.filter((p) => p.isVisible));
    } catch (err: any) {
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  return (
    <main className="min-h-screen py-16 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto">

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[13px] text-[#555] hover:text-white transition-colors duration-200 group"
          >
            <FiArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform duration-200" strokeWidth={1.5} />
            Back to home
          </Link>
        </motion.div>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-20"
        >
          <div className="flex items-end justify-between pb-5 border-b border-white/10">
            <h1 className="text-[clamp(48px,7vw,88px)] font-bold text-white leading-none tracking-[-0.03em]">
              Projects
            </h1>
            {!loading && (
              <span className="text-[11px] tracking-[0.25em] uppercase text-[#555] mb-2 font-mono">
                {projects.length} works
              </span>
            )}
          </div>
        </motion.div>

        {/* Error state */}
        {!loading && error && (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <FiAlertCircle className="size-8 text-[#555]" strokeWidth={1.5} />
            <p className="text-[#555] text-sm max-w-md">{error}</p>
            <button
              onClick={fetchProjects}
              className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-[#888] hover:text-white hover:border-white/25 text-[13px] transition-all duration-200"
              style={{ borderRadius: "2px" }}
            >
              <FiRefreshCw className="size-4" strokeWidth={1.5} />
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-2">
            <p className="text-[#444] text-[15px]">No projects found.</p>
            <p className="text-[#333] text-[13px]">Add projects from the admin panel.</p>
          </div>
        )}

        {/* Skeleton */}
        {loading && (
          <div className="space-y-0">
            {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
          </div>
        )}

        {/* Project list */}
        {!loading && !error && projects.length > 0 && (
          <div className="space-y-0">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.07 }}
                className="group grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-16 py-14 border-b border-white/8 items-start"
              >
                {/* Left — text */}
                <div className="space-y-5 order-2 lg:order-1">
                  {/* Index + badges */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[12px] text-[#444] font-mono tracking-widest">
                      _{String(index + 1).padStart(2, "0")}
                    </span>
                    {project.featured && (
                      <span
                        className="text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 border border-white/15 text-[#888]"
                        style={{ borderRadius: "2px" }}
                      >
                        Featured
                      </span>
                    )}
                    {project.company && (
                      <span
                        className="text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 border border-white/8 text-[#555]"
                        style={{ borderRadius: "2px" }}
                      >
                        {project.company}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-[22px] lg:text-[28px] font-semibold text-white tracking-[-0.02em] leading-snug">
                    {project.title}
                  </h2>

                  {/* Description */}
                  <p className="text-[15px] text-[#888] leading-[1.85] font-light max-w-lg">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.techStack.slice(0, 7).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] tracking-[0.07em] uppercase px-3 py-[6px] border border-white/10 text-[#777] hover:text-[#bbb] hover:border-white/22 transition-all duration-200"
                        style={{ borderRadius: "2px" }}
                      >
                        {tag}
                      </span>
                    ))}
                    {project.techStack.length > 7 && (
                      <span
                        className="text-[11px] tracking-[0.07em] uppercase px-3 py-[6px] border border-white/6 text-[#444]"
                        style={{ borderRadius: "2px" }}
                      >
                        +{project.techStack.length - 7}
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-5 pt-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[13px] text-[#999] hover:text-white transition-colors duration-200 group/link"
                      >
                        <FiExternalLink className="size-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200" strokeWidth={1.5} />
                        Live preview
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[13px] text-[#666] hover:text-[#aaa] transition-colors duration-200"
                      >
                        <FiGithub className="size-4" strokeWidth={1.5} />
                        Source
                      </a>
                    )}
                  </div>
                </div>

                {/* Right — thumbnail */}
                <div className="order-1 lg:order-2 overflow-hidden" style={{ borderRadius: "2px" }}>
                  {project.thumbnail?.url ? (
                    <div className="relative h-56 lg:h-64 overflow-hidden">
                      <Image
                        src={project.thumbnail.url}
                        alt={project.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 400px"
                        className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
                      />
                    </div>
                  ) : (
                    <div
                      className="h-56 lg:h-64 border border-white/8 bg-white/[0.03] flex items-center justify-center"
                    >
                      <span className="text-[42px] font-bold text-[#222] tracking-[-0.03em]">
                        {project.title.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}