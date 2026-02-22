"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiCalendar, FiHome } from "react-icons/fi";

interface Experience {
  _id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  techStack: string[];
}

function ExperienceSkeleton() {
  return (
    <div className="space-y-10">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="pl-8 lg:pl-12 space-y-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-white/10" />
            <div className="h-5 w-48 bg-white/10 rounded" />
          </div>
          <div className="h-4 w-36 bg-white/10 rounded" />
          <div className="h-4 w-full bg-white/10 rounded" />
          <div className="h-4 w-5/6 bg-white/10 rounded" />
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="h-7 w-16 rounded-full bg-white/10" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/experience")
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setExperiences(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="experience"
      className="py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="mb-20 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-white to-emerald-300 bg-clip-text text-transparent drop-shadow-2xl mb-6">
          My Experience
        </h2>
        <div className="h-px mx-auto w-24 lg:w-32 bg-gradient-to-r from-emerald-400 via-white/60 to-transparent" />
      </motion.div>

      <div className="max-w-3xl">
        {loading ? (
          <ExperienceSkeleton />
        ) : experiences.length === 0 ? (
          <p className="text-center text-white/50 py-16">
            No experience entries yet.
          </p>
        ) : (
          experiences.map((exp, index) => (
            <motion.div
              key={exp._id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 [&:not(:last-child)]:pb-12 lg:pl-12">
              {/* Left line */}
              <div className="absolute left-3 top-2.5 h-full w-[2px] bg-gradient-to-b from-emerald-400/50 via-white/20 to-transparent" />
              {/* Circle */}
              <div className="border-emerald-500/80 bg-white/90 absolute left-[2px] top-0 size-3 rounded-full border-2 shadow-md" />

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/40 backdrop-blur-sm shadow-lg">
                    <FiHome className="size-5 text-emerald-400" />
                  </div>
                  <span className="text-xl font-semibold text-white">
                    {exp.company}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg lg:text-xl font-semibold text-white">
                    {exp.role}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-sm text-white/70">
                    <FiCalendar className="size-4" />
                    <span>{exp.duration}</span>
                  </div>
                </div>

                <p className="text-white/80 leading-relaxed max-w-2xl">
                  {exp.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {exp.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm hover:bg-white/10 hover:border-white/30 transition-all duration-200">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
