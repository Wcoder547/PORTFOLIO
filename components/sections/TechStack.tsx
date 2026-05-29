"use client";
import Image from "next/image";

const categories = [
  {
    label: "Frontend",
    techs: [
      { src: "/tech/react.svg", name: "React" },
      { src: "/tech/nextjs.svg", name: "Next.js" },
      { src: "/tech/typescript.svg", name: "TypeScript" },
      { src: "/tech/tailwind.svg", name: "Tailwind CSS" },
      { src: "/tech/shadcn-ui.svg", name: "shadcn/ui" },
    ],
  },
  {
    label: "Backend",
    techs: [
      { src: "/tech/node.svg", name: "Node.js" },
      { src: "/tech/Express.svg", name: "Express.js" },
      { src: "/tech/nestjs-svgrepo-com.svg", name: "NestJS" },
      { src: "/tech/FastAPI.svg", name: "FastAPI" },
    ],
  },
  {
    label: "Database",
    techs: [
      { src: "/tech/mongodb.svg", name: "MongoDB" },
      { src: "/tech/postgresql.svg", name: "PostgreSQL" },
      { src: "/tech/prisma-svgrepo-com.svg", name: "Prisma" },
      { src: "/tech/Mongoose.js.svg", name: "Mongoose" },
      { src: "/tech/redis-logo-svgrepo-com.svg", name: "Redis" },
    ],
  },
  {
    label: "DevOps",
    techs: [
      { src: "/tech/docker.svg", name: "Docker" },
      { src: "/tech/aws.svg", name: "AWS" },
      { src: "/tech/vercel.svg", name: "Vercel" },
    ],
  },
  {
    label: "AI / ML",
    techs: [
      { src: "/tech/Langchain–Streamline-Simple...ns.svg", name: "LangChain" },
    ],
  },
  {
    label: "Tools",
    techs: [
      { src: "/tech/git.svg", name: "Git" },
      { src: "/tech/figma.svg", name: "Figma" },
      { src: "/tech/postman-icon-svgrepo-com.svg", name: "Postman" },
    ],
  },
];
const totalTechs = categories.reduce((sum, c) => sum + c.techs.length, 0);

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
            {totalTechs} technologies
          </span>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-14">
        {categories.map((cat) => (
          <div key={cat.label}>
            {/* Category label */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[11px] tracking-[0.25em] uppercase text-[#555] font-mono">
                {cat.label}
              </span>
              <span className="flex-1 h-px bg-white/[0.06]" />
            </div>

            {/* Tech cards */}
            <div className="flex flex-wrap gap-3">
              {cat.techs.map((tech) => (
                <LogoCard key={tech.name} logo={tech} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LogoCard({ logo }: { logo: { src: string; name: string } }) {
  return (
    <div className="group/logo cursor-default">
      <div
        className="flex items-center gap-3 px-4 py-3 border border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.08] transition-all duration-300"
        style={{ borderRadius: "2px" }}
      >
        {/* Icon */}
        <div className="w-5 h-5 relative opacity-70 group-hover/logo:opacity-100 transition-opacity duration-300 flex-shrink-0">
          <Image
            src={logo.src}
            alt={logo.name}
            fill
            sizes="20px"
            className="object-contain"
          />
        </div>
        {/* Label */}
        <span className="text-[12px] tracking-[0.05em] font-medium text-[#777] group-hover/logo:text-[#ccc] transition-colors duration-300 whitespace-nowrap">
          {logo.name}
        </span>
      </div>
    </div>
  );
}