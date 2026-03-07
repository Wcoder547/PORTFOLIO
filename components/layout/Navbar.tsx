"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const links = [
  { href: "#hero", label: "Home" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#articles", label: "Articles" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollToContact = () => {
    setMobileMenuOpen(false);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-zinc-900/60 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
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

        <div className="flex items-center gap-3">
          {/* ── HIRE ME BUTTON (desktop only) ── */}
          <motion.button
            onClick={scrollToContact}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="hidden md:flex relative items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-900 text-sm font-semibold transition-colors duration-200 overflow-hidden group">
            {/* Shimmer on hover */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-900 opacity-40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-zinc-900" />
            </span>
            <span className="relative">Hire Me</span>
          </motion.button>

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

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden overflow-hidden border-t border-white/5 bg-zinc-900/98 backdrop-blur-xl">
            <div className="px-4 py-3 flex flex-col gap-1">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="px-4 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200 font-medium">
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
