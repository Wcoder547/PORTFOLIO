"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaMapPin,
  FaXTwitter,
} from "react-icons/fa6";
import { useUserProfile } from "../hooks/useUserProfile";

export function Hero() {
  const { user, loading } = useUserProfile();

  if (loading) {
    return (
      <section className="min-h-[90vh] flex items-center justify-center px-6">
        <div className="w-full max-w-6xl mx-auto animate-pulse">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Avatar skeleton */}
            <div className="flex flex-col items-center gap-5 flex-shrink-0">
              <div className="w-44 h-44 md:w-56 md:h-56 rounded-full bg-white/10" />
              <div className="h-4 w-36 bg-white/10 rounded-full" />
              <div className="flex gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/10" />
                ))}
              </div>
            </div>
            {/* Text skeleton */}
            <div className="flex-1 space-y-5 w-full">
              <div className="flex gap-3">
                <div className="h-10 w-40 bg-white/10 rounded-full" />
                <div className="h-10 w-36 bg-white/10 rounded-full" />
              </div>
              <div className="h-14 w-3/4 bg-white/10 rounded-xl" />
              <div className="h-6 w-2/3 bg-white/10 rounded-lg" />
              <div className="space-y-3 pt-2">
                <div className="h-4 w-full bg-white/10 rounded" />
                <div className="h-4 w-5/6 bg-white/10 rounded" />
                <div className="h-4 w-4/6 bg-white/10 rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const scheduleHref = user?.whatsapp
    ? `https://wa.me/${user.whatsapp}`
    : user?.socials?.gmail
      ? `mailto:${user.socials.gmail}`
      : "#contact";

  const socials = [
    {
      href: user?.socials?.github,
      icon: FaGithub,
      label: "GitHub",
      color: "hover:text-white hover:border-white/40 hover:bg-white/10",
    },
    {
      href: user?.socials?.linkedin,
      icon: FaLinkedin,
      label: "LinkedIn",
      color:
        "hover:text-blue-400 hover:border-blue-400/40 hover:bg-blue-500/10",
    },
    {
      href: user?.socials?.twitter,
      icon: FaXTwitter,
      label: "Twitter / X",
      color: "hover:text-white hover:border-white/40 hover:bg-white/10",
    },
    {
      href: user?.socials?.instagram,
      icon: FaInstagram,
      label: "Instagram",
      color:
        "hover:text-pink-400 hover:border-pink-400/40 hover:bg-pink-500/10",
    },
  ].filter((s) => !!s.href);

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background glow blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full bg-teal-400/8 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[20rem] bg-emerald-900/10 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">
          {/* ── Left column: avatar + location + socials ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center lg:items-start flex-shrink-0 gap-6">
            {/* Avatar with animated ring */}
            <div className="relative group">
              {/* Rotating gradient ring */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-300 to-white/10 opacity-70 blur-sm group-hover:opacity-100 transition-opacity duration-500 animate-[spin_6s_linear_infinite]" />
              <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full ring-2 ring-white/10 overflow-hidden bg-zinc-900 shadow-2xl shadow-black/60">
                <Image
                  src={user?.image?.url ?? "/profile.png"}
                  alt={user?.name ?? "Waseem Akram"}
                  width={448}
                  height={448}
                  className="object-cover w-full h-full scale-105 group-hover:scale-100 transition-transform duration-700"
                  priority
                />
              </div>
              {/* Online indicator */}
              <span className="absolute bottom-3 right-3 w-4 h-4 rounded-full bg-emerald-400 border-2 border-zinc-950 shadow-lg shadow-emerald-500/50 animate-pulse" />
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-white/50 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <FaMapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sargodha, Punjab, Pakistan</span>
            </div>

            {/* Social icons */}
            {socials.length > 0 && (
              <div className="flex items-center gap-3">
                {socials.map(({ href, icon: Icon, label, color }) => (
                  <motion.a
                    key={label}
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-11 h-11 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 backdrop-blur-sm transition-all duration-300 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Right column: text content ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="flex-1 text-center lg:text-left min-w-0">
            {/* CTA buttons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
              <motion.a
                href={scheduleHref}
                target={user?.whatsapp ? "_blank" : undefined}
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400/60 text-sm font-medium transition-all duration-300 backdrop-blur-sm shadow-lg shadow-blue-900/20">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Schedule a call
              </motion.a>

              {user?.cvUrl && (
                <motion.a
                  href={user.cvUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400/60 text-sm font-medium transition-all duration-300 backdrop-blur-sm shadow-lg shadow-emerald-900/20">
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 20h6v-2H7v2z"
                    />
                  </svg>
                  Download CV
                </motion.a>
              )}
            </div>

            {/* Name */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-4">
              <span className="bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                {user?.name ?? "Waseem Akram"}
              </span>
            </h1>

            {/* Headline with accent bar */}
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <p className="text-base md:text-lg text-emerald-300/90 font-semibold tracking-wide uppercase">
                {user?.headline ??
                  "Full-Stack Developer · Next.js · React · Node.js"}
              </p>
            </div>

            {/* Description */}
            <p className="text-white/60 leading-relaxed text-base md:text-lg max-w-2xl mx-auto lg:mx-0">
              {user?.description ??
                "Self-taught Full-Stack Developer from Pakistan, specializing in modern web technologies and open-source development. Passionate about building scalable applications with Next.js and contributing to the developer community."}
            </p>

            {/* Stats row */}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
