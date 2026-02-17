"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const logos = [
  { src: "/tech/react.svg", name: "React" },
  { src: "/tech/nextjs.svg", name: "Next.js" },
  { src: "/tech/tailwind.svg", name: "Tailwind CSS" },
  { src: "/tech/node.svg", name: "Node.js" },
  { src: "/tech/mongodb.svg", name: "MongoDB" },
  { src: "/tech/typescript.svg", name: "TypeScript" },
  { src: "/tech/python.svg", name: "Python" },
  { src: "/tech/firebase.svg", name: "Firebase" },
  { src: "/tech/vercel.svg", name: "Vercel" },
  { src: "/tech/figma.svg", name: "Figma" },
  { src: "/tech/git.svg", name: "Git" },
  { src: "/tech/docker.svg", name: "Docker" },
  { src: "/tech/kubernetes.svg", name: "Kubernetes" },
  { src: "/tech/aws.svg", name: "AWS" },
  { src: "/tech/postgresql.svg", name: "PostgreSQL" },
];

export function TechStack() {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  return (
    <section
      id="tech"
      className="py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-white to-emerald-300 bg-clip-text text-transparent drop-shadow-2xl mb-6">
          Tech Arsenal
        </h2>
        <div className="h-px mx-auto w-24 lg:w-32 bg-gradient-to-r from-emerald-400 via-white/60 to-transparent" />
      </motion.div>

      <div className="relative">
        <div className="overflow-hidden rounded-3xl bg-white/5 border border-white/20 backdrop-blur-md shadow-2xl shadow-zinc-950/30 group">
          <div className="flex gap-10 [animation:skills-scroll_15s_linear_infinite] hover:[animation-play-state:paused] py-12 lg:py-16 px-12 lg:px-20 relative">
            {[...logos, ...logos, ...logos].map((logoObj, index) => (
              <div
                key={index}
                className="flex-shrink-0 cursor-pointer transition-all duration-300 group/logo relative hover:scale-110 p-4 bg-white/10 border border-white/20 hover:border-emerald-400/60 rounded-xl hover:shadow-emerald-500/40 hover:bg-white/20 hover:backdrop-blur-sm"
                onMouseEnter={() => setHoveredTech(logoObj.name)}
                onMouseLeave={() => setHoveredTech(null)}>
                <div className="w-16 h-16 lg:w-20 lg:h-20 relative">
                  <Image
                    src={logoObj.src}
                    alt={logoObj.name}
                    fill
                    sizes="80px"
                    className="object-contain filter drop-shadow-md hover:drop-shadow-lg hover:filter-none transition-all duration-400"
                    style={{ imageRendering: "crisp-edges" }}
                  />
                </div>

                
                <AnimatePresence>
                  {hoveredTech === logoObj.name && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/95 border border-white/70 rounded-lg px-3 py-1.5 shadow-2xl text-xs font-semibold text-zinc-900 whitespace-nowrap z-10 backdrop-blur-none select-none"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                      {logoObj.name}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes skills-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        img {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
      `}</style>
    </section>
  );
}
