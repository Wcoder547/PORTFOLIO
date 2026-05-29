"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FiExternalLink,
  FiGithub,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

interface Project {
  _id: string;
  title: string;
  description: string;
  thumbnail?: { public_id?: string; url: string };
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  company?: string;
  featured: boolean;
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/api-projects");
      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error(
          `Expected JSON but got ${res.status} ${res.statusText}.`,
        );
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to fetch");
      setProjects(json.data ?? []);
    } catch (err: unknown) {
      console.error("[Projects fetch]", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-28 px-6 lg:px-16 max-w-6xl mx-auto">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        className="mb-20"
      >
        <div className="flex items-end justify-between pb-5 border-b border-white/10">
          <h2 className="text-[clamp(48px,7vw,88px)] font-bold text-white leading-none tracking-[-0.03em]">
            Projects
          </h2>
          {!loading && (
            <span className="text-[11px] tracking-[0.25em] uppercase text-[#555] mb-2">
              {projects.length} works
            </span>
          )}
        </div>
      </motion.div>

      {/* Error state */}
      {!loading && error && (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <FiAlertCircle className="size-8 text-[#666]" />
          <p className="text-[#555] text-sm max-w-md">{error}</p>
          <button
            onClick={fetchProjects}
            className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-[#888] hover:text-white hover:border-white/25 text-sm transition-all duration-200"
            style={{ borderRadius: "2px" }}
          >
            <FiRefreshCw className="size-4" /> Try again
          </button>
        </div>
      )}

      {/* Skeleton */}
      {loading && (
        <div className="space-y-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="py-10 border-b border-white/5 animate-pulse"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">
                <div className="space-y-4">
                  <div className="h-4 w-12 bg-white/8 rounded" />
                  <div className="h-8 w-3/4 bg-white/8 rounded" />
                  <div className="h-4 w-full bg-white/5 rounded" />
                  <div className="h-4 w-5/6 bg-white/5 rounded" />
                </div>
                <div className="h-56 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project list */}
      {!loading && !error && (
        <div className="space-y-0">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: index * 0.07 }}
              className="group grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-16 py-14 border-b border-white/8 items-start"
            >
              {/* Left — text */}
              <div className="space-y-5 order-2 lg:order-1">
                {/* Index + featured */}
                <div className="flex items-center gap-4">
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
                </div>

                {/* Title */}
                <h3 className="text-[22px] lg:text-[26px] font-semibold text-white tracking-[-0.02em] leading-snug">
                  {project.title}
                </h3>

                {/* Company */}
                {project.company && (
                  <p className="text-[14px] text-[#888] font-light tracking-wide">
                    {project.company}
                  </p>
                )}

                {/* Description */}
                <p className="text-[15px] text-[#888] leading-[1.85] font-light max-w-lg">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {project.techStack.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] tracking-[0.07em] uppercase px-3 py-[6px] border border-white/10 text-[#777] hover:text-[#bbb] hover:border-white/22 transition-all duration-200"
                      style={{ borderRadius: "2px" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-4 pt-2">
                  {project.liveUrl && (
                    <Link
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 border border-white/15 text-[12px] tracking-[0.06em] uppercase text-[#999] hover:text-white hover:border-white/30 transition-all duration-200 group/link"
                      style={{ borderRadius: "2px" }}
                    >
                      <FiExternalLink className="size-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200" />
                      Live Preview
                    </Link>
                  )}
                  {project.githubUrl && (
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 border border-white/15 text-[12px] tracking-[0.06em] uppercase text-[#666] hover:text-[#bbb] hover:border-white/30 transition-all duration-200"
                      style={{ borderRadius: "2px" }}
                    >
                      <FiGithub className="size-3.5" />
                      GitHub
                    </Link>
                  )}
                </div>
              </div>

              
              <div className="order-1 lg:order-2 rounded-[10px] overflow-hidden">
                {project.thumbnail?.url ? (
                  <Link
                    href={project.liveUrl || project.githubUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block cursor-pointer"
                  >
                    <div className="relative w-full h-56 lg:h-64 overflow-hidden rounded-[10px] bg-white/[0.03]">
                      <Image
                        src={project.thumbnail.url}
                        alt={project.title}
                        fill
                        unoptimized
                        className="object-contain opacity-80 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
                      />
                    </div>
                  </Link>
                ) : (
                  <div className="h-56 lg:h-64 border border-white/8 bg-white/[0.03] flex items-center justify-center rounded-[10px]">
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

      {/* View more */}
      {!loading && !error && projects.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-3 px-6 py-3 border border-white/25 hover:border-white/60 text-[13px] text-[#999] hover:text-white transition-all duration-200 group/more"
            style={{ borderRadius: "2px" }}
          >
            View all projects
            <svg
              className="size-4 group-hover/more:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>
      )}
    </section>
  );
}
