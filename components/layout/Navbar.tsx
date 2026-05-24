"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const links = [
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#articles", label: "Articles" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileMenuOpen(false); };
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll);
    return () => { window.removeEventListener("resize", onResize); window.removeEventListener("scroll", onScroll); };
  }, []);

  const scrollToContact = () => {
    setMobileMenuOpen(false);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? "border-b border-white/10 bg-[#0d0d0d]/95 backdrop-blur-md" : "bg-transparent"}`}>
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 lg:px-8 py-5">

        <motion.div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="cursor-pointer select-none"
          whileTap={{ scale: 0.96 }}
        >
          <span className="font-mono text-sm font-bold text-white">
            <span className="text-[#444]">[</span>
            WA
            <span className="text-[#444]">]</span>
          </span>
        </motion.div>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs tracking-[0.08em] uppercase text-[#999] hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            onClick={scrollToContact}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="hidden md:flex items-center gap-2 text-xs tracking-[0.08em] uppercase font-medium px-5 py-2.5 border border-white text-white hover:bg-white hover:text-[#0d0d0d] transition-all duration-200 rounded-sm"
          >
            Hire me
          </motion.button>

          <button
            onClick={() => setMobileMenuOpen((p) => !p)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <motion.span animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="block w-5 h-px bg-white origin-center" />
            <motion.span animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }} className="block w-5 h-px bg-white" />
            <motion.span animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="block w-5 h-px bg-white origin-center" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-white/5 bg-[#0d0d0d]"
          >
            <div className="flex flex-col px-6 py-4 gap-1">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="py-3 text-xs tracking-[0.08em] uppercase text-[#999] hover:text-white border-b border-white/5 last:border-none transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.button
                onClick={scrollToContact}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: links.length * 0.05 }}
                className="mt-4 w-full py-3 border border-white text-white text-xs tracking-[0.08em] uppercase font-medium rounded-sm"
              >
                Hire me
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}