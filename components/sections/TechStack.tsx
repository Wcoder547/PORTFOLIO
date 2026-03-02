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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-white to-emerald-300 bg-clip-text text-transparent drop-shadow-2xl mb-4">
          Tech Arsenal
        </h2>
        <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto mb-6">
          Tools & technologies I use to bring ideas to life
        </p>
        <div className="h-px mx-auto w-24 lg:w-32 bg-gradient-to-r from-emerald-400 via-white/60 to-transparent" />
      </motion.div>

      {/* Scrolling row 1 — left to right */}
      <div className="relative space-y-5">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-32 bg-gradient-to-r from-black/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-32 bg-gradient-to-l from-black/80 to-transparent z-10" />

        {/* Row 1 */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
          <div className="flex gap-4 [animation:scroll-left_18s_linear_infinite] hover:[animation-play-state:paused] py-4 px-4">
            {[...logos, ...logos, ...logos].map((logo, i) => (
              <LogoCard
                key={`r1-${i}`}
                logo={logo}
                isHovered={hoveredTech === `r1-${logo.name}-${i}`}
                onEnter={() => setHoveredTech(`r1-${logo.name}-${i}`)}
                onLeave={() => setHoveredTech(null)}
              />
            ))}
          </div>
        </div>

        {/* Row 2 — reverse direction, offset start */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
          <div className="flex gap-4 [animation:scroll-right_22s_linear_infinite] hover:[animation-play-state:paused] py-4 px-4">
            {[
              ...[...logos].reverse(),
              ...[...logos].reverse(),
              ...[...logos].reverse(),
            ].map((logo, i) => (
              <LogoCard
                key={`r2-${i}`}
                logo={logo}
                isHovered={hoveredTech === `r2-${logo.name}-${i}`}
                onEnter={() => setHoveredTech(`r2-${logo.name}-${i}`)}
                onLeave={() => setHoveredTech(null)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tech count badge */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-white/30 text-xs mt-8 tracking-widest uppercase">
        {logos.length} technologies &amp; counting
      </motion.p>

      <style jsx global>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        @keyframes scroll-right {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
}

function LogoCard({
  logo,
  isHovered,
  onEnter,
  onLeave,
}: {
  logo: { src: string; name: string };
  isHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      className="flex-shrink-0 relative cursor-pointer group/logo"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}>
      <div
        className={`
          flex flex-col items-center gap-2.5 px-4 py-4 md:px-5 md:py-5 rounded-xl border transition-all duration-300
          ${
            isHovered
              ? "border-emerald-400/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/20 scale-110"
              : "border-white/10 bg-white/5 hover:border-white/20"
          }
        `}>
        {/* Logo */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 relative">
          <Image
            src={logo.src}
            alt={logo.name}
            fill
            sizes="56px"
            className="object-contain drop-shadow-md"
            style={{ imageRendering: "crisp-edges" }}
          />
        </div>
        {/* Always-visible label */}
        <span className="text-[10px] sm:text-xs font-medium text-white/60 group-hover/logo:text-emerald-300 transition-colors whitespace-nowrap">
          {logo.name}
        </span>
      </div>

      {/* Hover tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-zinc-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap z-20 pointer-events-none">
            {logo.name}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
