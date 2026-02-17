"use client";

import { motion } from "framer-motion";
import { FiCalendar, FiHome } from "react-icons/fi";

const experiences = [
  {
    company: "DevelopersHub Corporation",
    role: "Full-Stack Developer",
    duration: "2023 - Present",
    description:
      "Developed full-stack e-commerce backend projects with Next.js, Node.js, MongoDB. Built Android apps using Kotlin with Room, Material Components, Firebase. Integrated AI/ML using Python and JavaScript.",
    techStack: [
      "Next.js",
      "Kotlin",
      "MongoDB",
      "Python",
      "Firebase",
      "Node.js",
    ],
  },
  {
    company: "Freelance Projects",
    role: "Full-Stack & AI Developer",
    duration: "2022 - 2023",
    description:
      "Created social media follower platforms, coin reward systems, AI-powered tools. Managed cloud deployments with MongoDB Atlas and implemented scalable backend APIs.",
    techStack: ["React", "Node.js", "AI/ML", "Cloud", "APIs"],
  },
  {
    company: "Personal Projects & Open Source",
    role: "Self-Taught Developer",
    duration: "2021 - Present",
    description:
      "Built YouTube coding tutorials, agentic AI experiments, cross-platform apps. Continuous learning in Next.js patterns, TDD, and advanced React.",
    techStack: ["YouTube", "Open Source", "Agentic AI", "TDD"],
  },
];

export function Experience() {
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
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.company}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-8 [&:not(:last-child)]:pb-12 lg:pl-12">
            {/* left line  */}
            <div className="absolute left-3 top-2.5 h-full w-[2px] bg-gradient-to-b from-emerald-400/50 via-white/20 to-transparent group-first:top-6 group-first:h-[calc(100%-24px)]" />
            {/* circle   */}
            <div className="border-emerald-500/80 bg-white/90 absolute left-[2px] top-0 size-3 rounded-full border-2 shadow-md" />

            <div
              className="space-y-3 opacity-0 animate-in slide-in-from-left-4 duration-500"
              style={{ opacity: 1 }}>
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
        ))}
      </div>
    </section>
  );
}
