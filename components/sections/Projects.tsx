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

function ProjectSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4 animate-pulse">
      <div className="h-64 rounded-xl bg-white/10" />
      <div className="h-6 bg-white/10 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-white/10 rounded w-full" />
        <div className="h-4 bg-white/10 rounded w-5/6" />
      </div>
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-7 w-16 rounded-full bg-white/10" />
        ))}
      </div>
    </div>
  );
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
          `Expected JSON but got ${res.status} ${res.statusText}. ` +
            `Check that /api/projects/route.ts exists and MONGODB_URI is set.`,
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
    <section
      id="projects"
      className="py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-white to-emerald-300 bg-clip-text text-transparent drop-shadow-2xl mb-6">
          My Projects
        </h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Projects I worked on. Each containing its own case study.
        </p>
        <div className="h-px mx-auto w-24 lg:w-32 bg-gradient-to-r from-emerald-400 via-white/60 to-transparent mt-6" />
      </motion.div>

      {!loading && error && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <FiAlertCircle className="size-10 text-red-400" />
          <p className="text-red-300 text-sm max-w-md">{error}</p>
          <button
            onClick={fetchProjects}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-all border border-white/20">
            <FiRefreshCw className="size-4" /> Try again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:gap-10">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <ProjectSkeleton key={i} />)
          : projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 overflow-hidden">
                <div className="relative h-64 lg:h-72 rounded-xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                  {project.thumbnail?.url ? (
                    <Image
                      src={project.thumbnail.url}
                      alt={project.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center">
                      <span className="text-white/20 text-4xl font-black">
                        {project.title.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}

                  {project.featured && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/90 text-white backdrop-blur-sm">
                      Featured
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col mt-6">
                  <h3 className="text-xl lg:text-2xl font-semibold text-white mb-3 line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-white/70 mb-6 leading-relaxed text-sm lg:text-base line-clamp-3 flex-1">
                    {project.description}
                  </p>

                  {project.company && (
                    <p className="text-emerald-400/90 text-sm font-medium mb-4">
                      {project.company}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs lg:text-sm font-medium text-white/90 backdrop-blur-sm hover:bg-white/15 hover:border-white/40 transition-all duration-300">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {project.liveUrl && (
                      <Link
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn flex-1 lg:flex-none">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full lg:w-fit flex items-center gap-2 justify-center whitespace-nowrap rounded-full text-sm font-semibold border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/50 px-6 py-3 transition-all duration-300 text-white shadow-lg">
                          Preview
                          <FiExternalLink className="size-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </motion.button>
                      </Link>
                    )}

                    {project.githubUrl && (
                      <Link
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2 px-4 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm transition-all duration-300"
                          title="View source">
                          <FiGithub className="size-4" />
                        </motion.button>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
      </div>

      {!loading && !error && projects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex justify-center">
          <Link href="/projects" className="group">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 justify-center whitespace-nowrap rounded-full text-sm font-semibold border border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/50 px-8 py-4 transition-all duration-300 text-white shadow-xl hover:shadow-emerald-500/30">
              View More Projects
              <svg
                className="size-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      )}
    </section>
  );
}
