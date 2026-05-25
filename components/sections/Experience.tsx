"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Experience {
  _id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  techStack: string[];
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

  if (loading) {
    return (
      <section
        id="experience"
        className="py-28 px-6 lg:px-16 max-w-6xl mx-auto"
      >
        <div className="animate-pulse space-y-16">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="grid grid-cols-[200px_1fr] gap-12">
              <div className="h-4 w-32 bg-white/10 rounded mt-1" />
              <div className="space-y-4">
                <div className="h-6 w-56 bg-white/10 rounded" />
                <div className="h-4 w-40 bg-white/10 rounded" />
                <div className="h-4 w-full bg-white/10 rounded" />
                <div className="h-4 w-4/5 bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-28 px-6 lg:px-16 max-w-6xl mx-auto">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        className="mb-20"
      >
        <div className="flex items-end justify-between pb-5 border-b border-white/10">
          <h2 className="text-[clamp(48px,7vw,88px)] font-bold text-white leading-none tracking-[-0.03em]">
            Experience
          </h2>
          <span className="text-[11px] tracking-[0.25em] uppercase text-[#555] mb-2">
            {experiences.length} roles
          </span>
        </div>
      </motion.div>

      {/* Experience list */}
      <div className="space-y-0">
        {experiences.length === 0 ? (
          <p className="text-[#666] text-base">No experience entries yet.</p>
        ) : (
          experiences.map((exp, index) => (
            <motion.div
              key={exp._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 lg:gap-16 py-14 border-b border-white/8 group"
            >
              {/* Left — duration */}
              <div className="pt-1">
                <span
                  className="text-[12px] tracking-[0.1em] uppercase text-[#888]"
                  style={{ fontFamily: "monospace" }}
                >
                  {exp.duration}
                </span>
              </div>

              {/* Right — content */}
              <div className="space-y-5">
                {/* Role + Company */}
                <div>
                  <h3 className="text-[22px] font-semibold text-white tracking-[-0.02em] leading-snug">
                    {exp.role}
                  </h3>
                  <p className="text-[15px] text-[#aaa] mt-2 tracking-wide font-light">
                    {exp.company}
                  </p>
                </div>

                {/* Description */}
                <p className="text-[15px] text-[#999] leading-[1.85] max-w-2xl font-light">
                  {exp.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {exp.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] tracking-[0.08em] uppercase px-3 py-[6px] border border-white/12 text-[#888] hover:text-[#ccc] hover:border-white/25 transition-all duration-200"
                      style={{ borderRadius: "2px" }}
                    >
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
