"use client";

// Inline SVG icons with correct brand colors — no dependency on broken SVG files
const techs: { name: string; color: string; icon: string }[] = [
  {
    name: "React",
    color: "#61DAFB",
    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="2.05" fill="#61DAFB"/><ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#61DAFB" stroke-width="1.2" fill="none"/><ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#61DAFB" stroke-width="1.2" fill="none" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#61DAFB" stroke-width="1.2" fill="none" transform="rotate(120 12 12)"/></svg>`,
  },
  {
    name: "Next.js",
    color: "#ffffff",
    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 14.5L9 8.5v7H7.5v-9h1.75l7.25 8.5z" fill="white"/></svg>`,
  },
  {
    name: "TypeScript",
    color: "#3178C6",
    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="3" fill="#3178C6"/><path d="M13.5 11.5H16v1.25h-2.5V16H12v-3.25H9.5V11.5H12V8h1.5v3.5zM8 11.5v1.25H5.5V16H4v-4.5H8z" fill="white"/><path d="M4 8h10v1.5H4z" fill="white"/></svg>`,
  },
  {
    name: "Tailwind CSS",
    color: "#38BDF8",
    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35C13.27 10.85 14.33 12 16.5 12c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C15.23 7.15 14.17 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35C8.27 16.85 9.33 18 11.5 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C10.23 13.15 9.17 12 7 12z" fill="#38BDF8"/></svg>`,
  },
  {
    name: "shadcn/ui",
    color: "#ffffff",
    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="7" height="7" rx="1" fill="none" stroke="white" stroke-width="1.5"/><rect x="14" y="3" width="7" height="7" rx="1" fill="white"/><rect x="14" y="14" width="7" height="7" rx="1" fill="none" stroke="white" stroke-width="1.5"/><rect x="3" y="14" width="7" height="7" rx="1" fill="white"/></svg>`,
  },
  {
    name: "Node.js",
    color: "#68A063",
    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L3 7v10l9 5 9-5V7L12 2zm0 2.3l6.7 3.7-6.7 3.7L5.3 8 12 4.3zM4.5 9.4l7 3.8v7.5L4.5 17V9.4zm8.5 11.3v-7.5l7-3.8V17l-7 3.7z" fill="#68A063"/></svg>`,
  },
  {
    name: "Express.js",
    color: "#ffffff",
    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 18.6c-.9.1-1.4-.5-1.9-1.1L18 12.7v5.4c0 .5-.1.9-.7.9H3.8c-.5 0-.8-.2-.8-.7V5.4c0-.5.3-.7.8-.7h13.5c.6 0 .7.4.7.9v5.4l4.1-5c.5-.6 1-.9 1.9-.9v1.1l-4.8 5.8 4.8 5.9V18.6z" fill="white"/></svg>`,
  },
  {
    name: "NestJS",
    color: "#E0234E",
    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.13 2.04c-.28-.1-.57.08-.65.36l-3.5 12.25-1.7-5.95c-.08-.28-.37-.44-.65-.36l-5.5 1.57c-.3.09-.47.4-.38.7.09.3.4.47.7.38l4.87-1.39 2.08 7.3c.08.28.37.44.65.36.27-.08.44-.35.38-.63l3.5-12.25 1.7 5.95c.08.28.37.44.65.36l5.5-1.57c.3-.09.47-.4.38-.7-.09-.3-.4-.47-.7-.38l-4.87 1.39-2.08-7.3c-.05-.19-.2-.34-.38-.39z" fill="#E0234E"/></svg>`,
  },
  {
    name: "FastAPI",
    color: "#009688",
    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#009688"/><path d="M12.5 6l-5 7h4.5l-.5 5 5-7h-4.5l.5-5z" fill="white"/></svg>`,
  },
  {
    name: "MongoDB",
    color: "#47A248",
    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8 2 5 6 5 10c0 5.25 6 12 7 12s7-6.75 7-12c0-4-3-8-7-8zm0 13.5c-.83 0-1.5-.67-1.5-1.5S11.17 12.5 12 12.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="#47A248"/><path d="M12 2v20" stroke="#47A248" stroke-width="1.2"/></svg>`,
  },
  {
    name: "PostgreSQL",
    color: "#336791",
    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="7" rx="8" ry="5" fill="none" stroke="#336791" stroke-width="1.5"/><path d="M4 7v6c0 2.76 3.58 5 8 5s8-2.24 8-5V7" stroke="#336791" stroke-width="1.5" fill="none"/><path d="M4 10c0 2.76 3.58 5 8 5s8-2.24 8-5" stroke="#336791" stroke-width="1.5" fill="none"/></svg>`,
  },
  {
    name: "Prisma",
    color: "#5A67D8",
    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 19.5l7-17 10 14.5-17 2.5z" fill="none" stroke="#5A67D8" stroke-width="1.5" stroke-linejoin="round"/><path d="M10.5 2.5L14 17" stroke="#5A67D8" stroke-width="1.5"/></svg>`,
  },
  {
    name: "Mongoose",
    color: "#880000",
    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3C7 3 4 7 4 12s3 9 8 9 8-4 8-9-3-9-8-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill="#880000"/><circle cx="12" cy="12" r="3" fill="#880000"/></svg>`,
  },
  {
    name: "Redis",
    color: "#DC382D",
    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3l9 4.5-9 4.5-9-4.5L12 3z" fill="#DC382D"/><path d="M3 12l9 4.5 9-4.5" stroke="#DC382D" stroke-width="1.5" fill="none"/><path d="M3 16.5l9 4.5 9-4.5" stroke="#DC382D" stroke-width="1.5" fill="none"/></svg>`,
  },
  {
    name: "Docker",
    color: "#2496ED",
    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="11" width="4" height="3" rx=".5" fill="#2496ED"/><rect x="7" y="11" width="4" height="3" rx=".5" fill="#2496ED"/><rect x="12" y="11" width="4" height="3" rx=".5" fill="#2496ED"/><rect x="7" y="7" width="4" height="3" rx=".5" fill="#2496ED"/><rect x="12" y="7" width="4" height="3" rx=".5" fill="#2496ED"/><path d="M22 12.5s-1-1.5-3.5-1-2 2-4 2H2.5S2 18 7 18h10c3 0 5-2.5 5-5.5z" fill="#2496ED" opacity=".5"/></svg>`,
  },
  {
    name: "AWS",
    color: "#FF9900",
    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 14.5c-2.5-.5-4-2.5-3.5-5S6 6 8 6.5" stroke="#FF9900" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M7 14.5h11c1.66 0 3-1.34 3-3s-1.34-3-3-3c0-2.21-1.79-4-4-4-1.86 0-3.43 1.28-3.87 3" stroke="#FF9900" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M6 18l2-2m8 2l-2-2m-4 2v-2" stroke="#FF9900" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  },
  {
    name: "Vercel",
    color: "#ffffff",
    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L23 21H1L12 3z" fill="white"/></svg>`,
  },
  {
    name: "LangChain",
    color: "#1C8C3C",
    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="12" r="3" fill="none" stroke="#1C8C3C" stroke-width="1.5"/><circle cx="17" cy="12" r="3" fill="none" stroke="#1C8C3C" stroke-width="1.5"/><path d="M10 12h4" stroke="#1C8C3C" stroke-width="1.5" stroke-linecap="round"/><circle cx="7" cy="7" r="2" fill="none" stroke="#1C8C3C" stroke-width="1.3"/><path d="M7 9v3" stroke="#1C8C3C" stroke-width="1.3"/></svg>`,
  },
  {
    name: "Git",
    color: "#F05032",
    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.6 11.2l-8.8-8.8c-.4-.4-1.1-.4-1.6 0L9.5 4.1l2 2c.5-.2 1.1-.1 1.5.3.4.4.5 1 .3 1.5l1.9 1.9c.5-.2 1.1-.1 1.5.3.6.6.6 1.6 0 2.2-.6.6-1.6.6-2.2 0-.4-.4-.5-1-.3-1.5L12.3 9v4.8c.1.1.3.2.4.3.6.6.6 1.6 0 2.2-.6.6-1.6.6-2.2 0-.6-.6-.6-1.6 0-2.2.2-.2.4-.3.6-.3V8.8c-.2-.1-.4-.2-.6-.3-.6-.6-.6-1.6 0-2.2l-2-2L2.4 9.9c-.4.4-.4 1.1 0 1.6l8.8 8.8c.4.4 1.1.4 1.6 0l8.8-8.8c.4-.5.4-1.2 0-1.3z" fill="#F05032"/></svg>`,
  },
  {
    name: "Figma",
    color: "#F24E1E",
    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="2" width="8" height="6" rx="3" fill="#F24E1E"/><rect x="8" y="9" width="8" height="6" rx="3" fill="#A259FF"/><rect x="8" y="16" width="4" height="6" rx="2" fill="#0ACF83"/><rect x="2" y="2" width="5" height="6" rx="2.5" fill="#FF7262"/><circle cx="14.5" cy="12" r="3" fill="#1ABCFE"/></svg>`,
  },
  {
    name: "Postman",
    color: "#FF6C37",
    icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#FF6C37"/><path d="M8 12h8M14 9l3 3-3 3" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
  },
];

export function TechStack() {
  const items = [...techs, ...techs, ...techs];

  return (
    <section id="tech" className="py-20 px-6 lg:px-16 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-end justify-between pb-5 border-b border-white/10 mb-14">
        <h2
          className="font-bold text-white leading-none tracking-[-0.03em]"
          style={{ fontSize: "clamp(40px,6vw,72px)" }}
        >
          Tech Stack
        </h2>
        <span className="text-[11px] tracking-[0.25em] uppercase text-[#555] mb-1">
          {techs.length} Technologies
        </span>
      </div>

      {/* Scrolling strip */}
      <div
        className="group relative overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
        }}
      >
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {items.map((tech, i) => (
            <TechItem key={i} tech={tech} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-100% / 3)); }
        }
        .animate-marquee {
          animation: marquee 32s linear infinite;
        }
      `}</style>
    </section>
  );
}

function TechItem({ tech }: { tech: typeof techs[0] }) {
  return (
    <div
      className="group/item flex items-center gap-3 px-5 py-3 mx-1.5 flex-shrink-0 cursor-default
                 border border-white/[0.08] bg-white/[0.02]
                 hover:bg-white/[0.05] transition-all duration-200"
      style={{ borderRadius: "8px" }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = tech.color + "55";
        el.style.boxShadow = `0 0 14px ${tech.color}22`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "rgba(255,255,255,0.08)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Inline SVG icon — always correct color, never broken */}
      <div
        className="w-5 h-5 flex-shrink-0"
        dangerouslySetInnerHTML={{ __html: tech.icon }}
      />

      {/* Name */}
      <span
        className="text-[13px] whitespace-nowrap font-medium tracking-wide text-[#666]
                   group-hover/item:text-white transition-colors duration-200"
      >
        {tech.name}
      </span>
    </div>
  );
}