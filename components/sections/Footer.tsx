"use client";
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiInstagram } from "react-icons/fi";
import { useUserProfile } from "../hooks/useUserProfile";

const quickLinks = [
  { name: "Experience", href: "#experience" },
  { name: "Projects",   href: "#projects" },
  { name: "Articles",   href: "#articles" },
  { name: "Tech Stack", href: "#tech" },
  { name: "FAQ",        href: "#faq" },
  { name: "Contact",    href: "#contact" },
];

export function Footer() {
  const { user, loading } = useUserProfile();
  const year = new Date().getFullYear();

  const socials = [
    { name: "GitHub",    icon: FiGithub,    href: user?.socials?.github   ?? null },
    { name: "LinkedIn",  icon: FiLinkedin,  href: user?.socials?.linkedin ?? null },
    { name: "Twitter",   icon: FiTwitter,   href: user?.socials?.twitter  ?? null },
    { name: "Instagram", icon: FiInstagram, href: user?.socials?.instagram ?? null },
    { name: "Email",     icon: FiMail,      href: user?.socials?.gmail ? `mailto:${user.socials.gmail}` : null },
  ].filter((s) => Boolean(s.href)) as { name: string; icon: React.ElementType; href: string }[];

  return (
    <footer className="mt-24 border-t border-white/8">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16">

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-12 md:gap-20 mb-16">

          {/* Brand */}
          <div className="space-y-4 max-w-sm">
            <p className="text-[28px] font-bold text-white tracking-[-0.02em]">
              Waseem Akram
            </p>
            <p className="text-[14px] text-[#555] leading-[1.85] font-light">
              {loading ? (
                <span className="block space-y-2 animate-pulse">
                  <span className="block h-3 bg-white/5 rounded w-full" />
                  <span className="block h-3 bg-white/5 rounded w-4/5" />
                </span>
              ) : (
                user?.description ?? "Full-Stack Developer from Pakistan — building fast, scalable web apps from idea to deployment."
              )}
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#444]">Navigation</p>
            <nav className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-[14px] text-[#666] hover:text-white transition-colors duration-200 w-fit"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#444]">Connect</p>
            <div className="flex flex-col gap-2.5">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-5 w-20 bg-white/5 rounded animate-pulse" />
                  ))
                : socials.map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.name}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-[14px] text-[#666] hover:text-white transition-colors duration-200 group/s w-fit"
                      >
                        <Icon className="size-[15px] text-[#444] group-hover/s:text-white transition-colors duration-200" />
                        {s.name}
                      </a>
                    );
                  })}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8 border-t border-white/8">
          <p className="text-[13px] text-[#444]">
            © {year} Waseem Akram. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="text-[13px] text-[#444] hover:text-[#888] transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="/terms" className="text-[13px] text-[#444] hover:text-[#888] transition-colors duration-200">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}