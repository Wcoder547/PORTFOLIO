"use client";

import { motion } from "framer-motion";
import {
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiMail,
  FiExternalLink,
} from "react-icons/fi";
import { SiUpwork, SiFiverr } from "react-icons/si";
import { useUserProfile } from "../hooks/useUserProfile";

const quickLinks = [
  { name: "Experience", href: "#experience" },
  { name: "Tech Stack", href: "#tech" },
  { name: "FAQ", href: "#faq" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Contact", href: "#contact" },
];

export function Footer() {
  const { user, loading } = useUserProfile();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "GitHub",
      icon: FiGithub,
      href: user?.socials?.github ?? null,
      color: "hover:text-gray-300",
    },
    {
      name: "LinkedIn",
      icon: FiLinkedin,
      href: user?.socials?.linkedin ?? null,
      color: "hover:text-blue-400",
    },
    {
      name: "Twitter",
      icon: FiTwitter,
      href: user?.socials?.twitter ?? null,
      color: "hover:text-sky-400",
    },
    {
      name: "Email",
      icon: FiMail,
      href: user?.socials?.gmail ? `mailto:${user.socials.gmail}` : null,
      color: "hover:text-emerald-400",
    },
    {
      name: "Upwork",
      icon: SiUpwork,
      href: user?.socials?.upwork ?? null,
      color: "hover:text-green-500",
    },
    {
      name: "Fiverr",
      icon: SiFiverr,
      href: user?.socials?.fiverr ?? null,
      color: "hover:text-green-400",
    },
  ].filter((s) => Boolean(s.href)) as {
    name: string;
    icon: React.ElementType;
    href: string;
    color: string;
  }[];

  return (
    <footer className="relative mt-24 border-t border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* ── Brand ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4">
            <h3 className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {loading ? (
                <span className="inline-block h-7 w-40 bg-white/10 rounded animate-pulse" />
              ) : (
                (user?.name ?? "Waseem Akram")
              )}
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              {loading ? (
                <span className="block space-y-2 animate-pulse">
                  <span className="block h-3 bg-white/10 rounded w-full" />
                  <span className="block h-3 bg-white/10 rounded w-4/5" />
                  <span className="block h-3 bg-white/10 rounded w-3/5" />
                </span>
              ) : (
                (user?.description ??
                "Full-Stack Developer specializing in React, Next.js, and modern web technologies. Building production-ready applications for clients worldwide.")
              )}
            </p>
          </motion.div>

          {/* ── Quick Links ───────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <nav className="flex flex-col space-y-2">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white/60 hover:text-emerald-400 text-sm transition-colors inline-flex items-center gap-1 group w-fit">
                  <span>{link.name}</span>
                  <FiExternalLink className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </nav>
          </motion.div>

          {/* ── Connect ───────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex flex-wrap gap-3">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-11 w-11 rounded-xl bg-white/10 animate-pulse"
                    />
                  ))
                : socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                        className={`group relative p-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-400/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/20 ${social.color}`}>
                        <Icon className="size-5 text-white/70 group-hover:text-current transition-colors" />
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg border border-white/20">
                          {social.name}
                        </span>
                      </a>
                    );
                  })}
            </div>
            <p className="text-white/50 text-xs mt-4">
              Available for freelance projects and full-time opportunities
            </p>
          </motion.div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
          <p className="text-center md:text-left">
            © {currentYear}{" "}
            <a
              href={user?.socials?.github ?? "https://github.com/Wcoder547"}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white/80 hover:text-emerald-400 underline underline-offset-4 transition-colors">
              {user?.name ?? "Waseem Akram"}
            </a>
            . All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-xs">
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </a>
            <span className="text-white/30">•</span>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
      </div>
    </footer>
  );
}
