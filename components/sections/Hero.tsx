"use client";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaInstagram, FaXTwitter, FaWhatsapp } from "react-icons/fa6";
import { useUserProfile } from "../hooks/useUserProfile";
import type { Transition } from "framer-motion";


const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut", delay } as Transition,
});
export function Hero() {
  const { user, loading } = useUserProfile();

  const scheduleHref = user?.whatsapp
    ? `https://wa.me/${user.whatsapp}`
    : user?.socials?.gmail
      ? `mailto:${user.socials.gmail}`
      : "#contact";

  const socials = [
    { href: user?.socials?.github, icon: FaGithub, label: "GitHub" },
    { href: user?.socials?.linkedin, icon: FaLinkedin, label: "LinkedIn" },
    { href: user?.socials?.twitter, icon: FaXTwitter, label: "Twitter" },
    { href: user?.socials?.instagram, icon: FaInstagram, label: "Instagram" },
  ].filter((s) => !!s.href);

  if (loading) {
    return (
      <section className="min-h-[85vh] flex items-center px-6">
        <div className="w-full max-w-5xl mx-auto animate-pulse space-y-6">
          <div className="h-2 w-28 bg-white/5 rounded" />
          <div className="h-20 w-3/4 bg-white/5 rounded" />
          <div className="h-4 w-96 bg-white/5 rounded" />
        </div>
      </section>
    );
  }

  return (
    <section id="hero" className="min-h-[85vh] flex items-center px-6 lg:px-8">
      <div className="w-full max-w-5xl mx-auto py-20 lg:py-28">

        {/* Top tag */}
        <motion.div {...fadeUp(0)} className="mb-8">
          <span className="text-[11px] tracking-[0.2em] uppercase text-[#888]">
            Full-Stack Developer · Pakistan
          </span>
        </motion.div>

        {/* Big name */}
        <motion.div {...fadeUp(0.08)}>
          <h1
            className="font-black tracking-[-0.04em] leading-[0.9] uppercase"
            style={{ fontSize: "clamp(56px, 10vw, 120px)" }}
          >
            <span className="text-white block">WASEEM</span>
            <span className="text-[#555] block">AKRAM</span>
          </h1>
        </motion.div>

        {/* Headline from backend */}
        <motion.div {...fadeUp(0.16)} className="flex items-center gap-4 mt-8 mb-5">
          <div className="h-px w-8 bg-white/20 shrink-0" />
          <p className="text-[13px] font-light tracking-[0.06em] text-[#bbb]">
            {user?.headline ?? "Software Engineer | Full-Stack Developer"}
          </p>
        </motion.div>

        {/* Description from backend */}
        <motion.p
          {...fadeUp(0.22)}
          className="text-[15px] font-light text-[#888] leading-[1.8] max-w-lg mb-10"
          style={{ letterSpacing: "0.01em" }}
        >
          {user?.description ??
            "Full-Stack Developer from Pakistan — I build fast, scalable web apps from idea to deployment."}
        </motion.p>

        {/* CTAs + Socials row */}
        <motion.div {...fadeUp(0.28)} className="flex flex-wrap items-center gap-6">
          <a
            href={scheduleHref}
            target={user?.whatsapp ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="text-[11px] tracking-[0.12em] uppercase font-semibold px-7 py-3 bg-white text-[#0d0d0d] hover:bg-white/90 transition-all duration-200 rounded-sm flex items-center gap-2"
          >
            <FaWhatsapp className="w-4 h-4 shrink-0" />
            Get in touch
          </a>
          {user?.cvUrl && (
            <a
              href={user.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] tracking-[0.12em] uppercase text-[#888] border border-[#2a2a2a] px-7 py-3 hover:border-white/20 hover:text-[#bbb] transition-all duration-200 rounded-sm flex items-center gap-2"
            >
              Download CV
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          )}

        </motion.div>

      </div>

      {/* Vertical socials — fixed right side */}
      {socials.length > 0 && (
        <div className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-6">
          {socials.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href!}
              target="_blank"
              rel="noopener noreferrer"
              title={label}
              className="text-[#777] hover:text-white transition-colors duration-200"
            >
              <Icon className="w-[20px] h-[20px]" />
            </a>
          ))}
          <div className="w-px h-16 bg-white/10 mt-2" />
        </div>
      )}
    </section>
  );
}