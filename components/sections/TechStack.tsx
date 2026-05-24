"use client";
import Image from "next/image";

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
  return (
    <section id="tech" className="py-28 px-6 lg:px-16 max-w-6xl mx-auto">

      {/* Section header */}
      <div className="mb-20">
        <div className="flex items-end justify-between pb-5 border-b border-white/10">
          <h2 className="text-[clamp(48px,7vw,88px)] font-bold text-white leading-none tracking-[-0.03em]">
            Tech Stack
          </h2>
          <span className="text-[11px] tracking-[0.25em] uppercase text-[#666] mb-2">
            {logos.length} technologies
          </span>
        </div>
      </div>

      {/* Marquee rows */}
      <div className="space-y-5">

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0d0d0d] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0d0d0d] to-transparent z-10" />
          <div className="flex gap-4 [animation:scroll-left_20s_linear_infinite] hover:[animation-play-state:paused]">
            {[...logos, ...logos, ...logos].map((logo, i) => (
              <LogoCard key={`r1-${i}`} logo={logo} />
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0d0d0d] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0d0d0d] to-transparent z-10" />
          <div className="flex gap-4 [animation:scroll-right_26s_linear_infinite] hover:[animation-play-state:paused]">
            {[...[...logos].reverse(), ...[...logos].reverse(), ...[...logos].reverse()].map(
              (logo, i) => (
                <LogoCard key={`r2-${i}`} logo={logo} />
              )
            )}
          </div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes scroll-right {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}

function LogoCard({ logo }: { logo: { src: string; name: string } }) {
  return (
    <div className="flex-shrink-0 group/logo cursor-default">
      <div
        className="flex flex-col items-center gap-4 px-7 py-6 border border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.08] transition-all duration-300"
        style={{ borderRadius: "2px", minWidth: "110px" }}
      >
        {/* Icon */}
        <div className="w-12 h-12 relative opacity-80 group-hover/logo:opacity-100 transition-opacity duration-300">
          <Image
            src={logo.src}
            alt={logo.name}
            fill
            sizes="48px"
            className="object-contain"
          />
        </div>
        {/* Label */}
        <span className="text-[12px] tracking-[0.06em] uppercase font-medium text-[#777] group-hover/logo:text-[#ccc] transition-colors duration-300 whitespace-nowrap">
          {logo.name}
        </span>
      </div>
    </div>
  );
}