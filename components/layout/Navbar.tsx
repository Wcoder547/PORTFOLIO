"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  FiCode,
  FiX,
  FiSend,
  FiGithub,
  FiLinkedin,
  FiZap,
  FiClock,
  FiStar,
  FiMenu,
} from "react-icons/fi";

const links = [
  { href: "#hero", label: "Home" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#articles", label: "Articles" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

const STATS = [
  { icon: FiCode, label: "Projects", value: "20+" },
  { icon: FiStar, label: "Clients", value: "15+" },
  { icon: FiClock, label: "Response", value: "< 2h" },
  { icon: FiZap, label: "Yrs Exp", value: "3+" },
];

const SERVICES = [
  "Custom Web App",
  "AI Integration",
  "Product Design",
  "Secure User System",
  "Launch & Monitoring",
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeService, setActive] = useState<string | null>(null);
  const [time, setTime] = useState("");
  const [msgSent, setMsgSent] = useState(false);

  useEffect(() => {
    const tick = () => {
      const t = new Date().toLocaleTimeString("en-US", {
        timeZone: "Asia/Karachi",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setTime(t);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Close mobile menu on resize to md+
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleQuickContact = () => {
    setMsgSent(true);
    setTimeout(() => {
      setMsgSent(false);
      setOpen(false);
      setMobileMenuOpen(false);
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 1800);
  };

  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-zinc-900/60 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* ── Logo ── */}
        <motion.div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="relative cursor-pointer select-none z-50"
          whileHover="hover"
          whileTap={{ scale: 0.95 }}
          initial="idle">
          <motion.div
            variants={{
              idle: { boxShadow: "0 0 0px 0px rgba(52,211,153,0)" },
              hover: { boxShadow: "0 0 16px 2px rgba(52,211,153,0.25)" },
            }}
            className="flex items-center gap-0.5 px-2.5 py-1.5 sm:px-3 rounded-lg border border-white/10 bg-zinc-900 hover:border-emerald-500/40 hover:bg-zinc-800/80 transition-all duration-300">
            <motion.span
              variants={{
                idle: { x: 0, opacity: 0.4 },
                hover: { x: -2, opacity: 1 },
              }}
              transition={{ duration: 0.2 }}
              className="text-emerald-400 font-mono font-bold text-sm">
              &lt;
            </motion.span>
            <motion.span
              variants={{
                idle: { letterSpacing: "0em" },
                hover: { letterSpacing: "0.05em" },
              }}
              transition={{ duration: 0.2 }}
              className="font-black text-sm text-white font-mono tracking-tight">
              WA
            </motion.span>
            <motion.span
              variants={{
                idle: { x: 0, opacity: 0.4 },
                hover: { x: 2, opacity: 1 },
              }}
              transition={{ duration: 0.2 }}
              className="text-emerald-400 font-mono font-bold text-sm">
              /&gt;
            </motion.span>
            <motion.span
              variants={{
                idle: { opacity: 0, width: 0 },
                hover: { opacity: 1, width: "auto" },
              }}
              transition={{ duration: 0.15 }}
              className="ml-0.5 inline-block w-1.5 h-4 bg-emerald-400 rounded-sm animate-pulse overflow-hidden"
            />
          </motion.div>
        </motion.div>

        {/* ── Desktop Nav Links ── */}
        <div className="hidden items-center gap-1 text-sm text-white/70 md:flex lg:gap-2">
          {links.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="relative px-2.5 py-2 text-xs lg:text-sm lg:px-3 xl:px-4 transition-all duration-300 hover:text-white group whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              <span className="relative z-10">{link.label}</span>
              <span className="bg-white/10 absolute inset-0 -z-10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 origin-center" />
            </motion.a>
          ))}
        </div>

        {/* ── Right Side: CTA + Hamburger ── */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* CTA Button — hidden on very small screens, shown from sm */}
          <div className="relative hidden sm:block">
            <motion.button
              onClick={() => setOpen((p) => !p)}
              className="group relative flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all duration-300 overflow-hidden"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}>
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap">
                <span className="hidden lg:inline">
                  Let&apos;s Build Together
                </span>
                <span className="inline lg:hidden">Let&apos;s Build</span>
              </span>
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent" />
            </motion.button>

            {/* ── Desktop Popup Panel ── */}
            <AnimatePresence>
              {open && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute right-0 top-full mt-3 z-50 w-72 sm:w-80 rounded-2xl border border-white/10 bg-zinc-900/98 backdrop-blur-xl shadow-2xl shadow-zinc-950/60 overflow-hidden">
                    <PopupContent
                      time={time}
                      activeService={activeService}
                      setActive={setActive}
                      msgSent={msgSent}
                      handleQuickContact={handleQuickContact}
                      onClose={() => setOpen(false)}
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* ── Mobile Hamburger ── */}
          <motion.button
            onClick={() => setMobileMenuOpen((p) => !p)}
            className="md:hidden relative z-50 p-2 rounded-lg border border-white/10 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 hover:text-white transition-all"
            whileTap={{ scale: 0.92 }}
            aria-label="Toggle mobile menu">
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}>
                  <FiX className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}>
                  <FiMenu className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* ── Mobile Menu Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden overflow-hidden border-t border-white/5 bg-zinc-900/98 backdrop-blur-xl">
            {/* Nav links */}
            <div className="px-4 py-3 flex flex-col gap-1">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={handleNavLinkClick}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="px-4 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200 font-medium">
                  {link.label}
                </motion.a>
              ))}
            </div>

            {/* CTA section in mobile */}
            <div className="px-4 pb-4">
              <div className="rounded-2xl border border-white/10 overflow-hidden">
                <PopupContent
                  time={time}
                  activeService={activeService}
                  setActive={setActive}
                  msgSent={msgSent}
                  handleQuickContact={handleQuickContact}
                  onClose={() => setMobileMenuOpen(false)}
                  hideBorder
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ── Extracted shared popup content ── */
interface PopupContentProps {
  time: string;
  activeService: string | null;
  setActive: (s: string | null) => void;
  msgSent: boolean;
  handleQuickContact: () => void;
  onClose: () => void;
  hideBorder?: boolean;
}

function PopupContent({
  time,
  activeService,
  setActive,
  msgSent,
  handleQuickContact,
  onClose,
  hideBorder,
}: PopupContentProps) {
  return (
    <>
      {/* Header */}
      <div
        className={`relative p-4 pb-3 ${!hideBorder ? "border-b border-white/5" : ""}`}>
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/20">
              <Image
                src="/profile.png"
                alt="Waseem"
                width={44}
                height={44}
                className="object-cover"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-zinc-900" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm">Waseem Akram</p>
            <p className="text-zinc-400 text-xs">
              Full-Stack Developer · Pakistan
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <FiClock className="h-3 w-3 text-zinc-500" />
              <span className="text-zinc-500 text-[11px]">🇵🇰 {time} PKT</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-zinc-200 transition-all">
            <FiX className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-px bg-white/5 border-b border-white/5">
        {STATS.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center py-3 bg-zinc-900/80">
            <Icon className="h-3.5 w-3.5 text-emerald-400 mb-1" />
            <span className="text-white font-bold text-sm leading-none">
              {value}
            </span>
            <span className="text-zinc-500 text-[10px] mt-0.5 text-center leading-tight">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Services */}
      <div className="p-4 border-b border-white/5">
        <p className="text-zinc-500 text-[11px] font-semibold uppercase tracking-wider mb-2.5">
          What do you need?
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SERVICES.map((s) => (
            <motion.button
              key={s}
              onClick={() => setActive(activeService === s ? null : s)}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                activeService === s
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                  : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
              }`}>
              {s}
            </motion.button>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="p-4 space-y-2">
        <motion.button
          onClick={handleQuickContact}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-sm relative overflow-hidden group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}>
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <AnimatePresence mode="wait">
            {msgSent ? (
              <motion.span
                key="sent"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2">
                Opening contact...
              </motion.span>
            ) : (
              <motion.span
                key="send"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2">
                <FiSend className="h-4 w-4" />
                Start a Project
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <div className="flex gap-2">
          <a
            href="https://github.com/Wcoder547"
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-medium transition-all">
            <FiGithub className="h-3.5 w-3.5" /> GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/wasim-akram-dev/"
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-blue-500/20 hover:border-blue-500/30 text-zinc-400 hover:text-blue-400 text-xs font-medium transition-all">
            <FiLinkedin className="h-3.5 w-3.5" /> LinkedIn
          </a>
          <a
            href="mailto:malikwaseemshzad@gmail.com"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-500/20 hover:border-emerald-500/30 text-zinc-400 hover:text-emerald-400 text-xs font-medium transition-all">
            ✉️ Email
          </a>
        </div>
      </div>
    </>
  );
}
