"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

const projects = [
  {
    title: "Calm Llama - AI Chatbot",
    description: "A modern web platform that enables users to discover and book premium wellness experiences such as saunas, yoga, massages, and float tanks. Features include real-time availability, secure payments, and instant booking confirmations.",
    image: "/images/calmllama.jpg",
    tech: ["TypeScript", "Stripe", "React.js", "Next.js", "Tailwind", "Shadcn UI", "Node.js", "Supabase", "AI"],
    link: "https://calmllama.life",
    company: "ToraTec AI, Dublin"
  },
  {
    title: "Mini Otio - AI Research Assistant",
    description: "AI-powered research assistant with real-time web search and intelligent response generation. Features bookmark management, conversation export, and real-time streaming.",
    image: "/images/mini-otio.jpg",
    tech: ["Next.js 15", "TypeScript", "Shadcn UI", "AI SDK", "OpenRouter", "Exa.ai"],
    link: "https://mini-otio.vercel.app"
  },
  {
    title: "EC2 Cloud Cost Analyzer",
    description: "AWS EC2 cost analysis tool comparing instance costs with real-time pricing data.",
    image: "/images/ec2.jpg",
    tech: ["TypeScript", "React.js", "Next.js", "Shadcn UI", "AWS EC2", "CloudWatch"],
    link: "https://ec2-observe.vercel.app"
  },
  {
    title: "Online Interview Assessment System (OIAS)",
    description: "Real-time video interview platform with automated assessments for students and professionals.",
    image: "/images/final-year.png",
    tech: ["React.js", "Tailwind", "Node.js", "Socket.io", "MongoDB", "Firebase"],
    link: "https://calendly.com/yashkapure06/book-a-call-at-the-earliest?month=2024-10"
  }
];

export function Projects() {
  return (
    <section id="projects" className="py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20 text-center"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-white to-emerald-300 bg-clip-text text-transparent drop-shadow-2xl mb-6">
          My Projects
        </h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Projects I worked on. Each containing its own case study.
        </p>
        <div className="h-px mx-auto w-24 lg:w-32 bg-gradient-to-r from-emerald-400 via-white/60 to-transparent mt-6" />
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:gap-10">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 overflow-hidden"
          >
            {/* Image */}
            <div className="relative h-64 lg:h-72 rounded-xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col mt-6">
              <h3 className="text-xl lg:text-2xl font-semibold text-white mb-3 line-clamp-2">
                {project.title}
              </h3>
              
              <p className="text-white/70 mb-6 leading-relaxed text-sm lg:text-base line-clamp-3 flex-1">
                {project.description}
              </p>

              {/* Company */}
              {project.company && (
                <p className="text-emerald-400/90 text-sm font-medium mb-4">
                  {project.company}
                </p>
              )}

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs lg:text-sm font-medium text-white/90 backdrop-blur-sm hover:bg-white/15 hover:border-white/40 transition-all duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA Button */}
              <Link href={project.link} target="_blank" rel="noopener noreferrer" className="group/btn">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full lg:w-fit flex items-center gap-2 justify-center whitespace-nowrap rounded-full text-sm font-semibold border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/50 hover:shadow-emerald-500/30 px-6 py-3 transition-all duration-300 text-white shadow-lg"
                >
                  Preview
                  <FiExternalLink className="size-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View More CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 flex justify-center"
      >
        <Link href="/projects" className="group">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 justify-center whitespace-nowrap rounded-full text-sm font-semibold border border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/50 px-8 py-4 transition-all duration-300 text-white shadow-xl hover:shadow-emerald-500/30"
          >
            View More Projects
            <svg className="size-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}
