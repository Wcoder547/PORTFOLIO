"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import Image from "next/image";
import { useState } from "react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#articles", label: "Articles" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

const languages = [
  { flag: "🇬🇧", name: "English", native: "English", selected: true },
  { flag: "🇪🇸", name: "Español", native: "Spanish", selected: false },
  { flag: "🇫🇷", name: "Français", native: "French", selected: false },
  { flag: "🇩🇪", name: "Deutsch", native: "German", selected: false },
  { flag: "🇮🇹", name: "Italiano", native: "Italian", selected: false },
  { flag: "🇵🇹", name: "Português", native: "Portuguese", selected: false },
  { flag: "🇳🇱", name: "Nederlands", native: "Dutch", selected: false },
  { flag: "🇮🇳", name: "हिन्दी", native: "Hindi", selected: false },
  { flag: "🇨🇳", name: "中文", native: "Chinese", selected: false },
  { flag: "🇯🇵", name: "日本語", native: "Japanese", selected: false },
];

export function Navbar() {
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-zinc-900/60  backdrop-blur-xl px-8 py-4">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3 group/logo">
          <motion.div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="relative h-10 w-10 overflow-hidden rounded-xl cursor-pointer group/logo-hover shadow-lg hover:shadow-2xl hover:shadow-white/30 border border-white/20 hover:border-white/40 transition-all duration-500"
            whileHover={{
              scale: 1.1,
              rotate: [0, -5, 5, -3, 0],
              borderRadius: ["50%", "40%", "50%"],
            }}
            whileTap={{ scale: 0.95 }}>
            <Image
              src="/profile.png"
              alt="Profile"
              fill
              className="object-cover group/logo-hover:brightness-110 group/logo-hover:grayscale-0 transition-all duration-500"
              priority
            />

            <div className="absolute inset-0 opacity-0 group/logo-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute w-1 h-1 bg-white/50 rounded-full top-1 left-1 animate-ping" />
              <div className="absolute w-1.5 h-1.5 bg-white/30 rounded-full top-2 right-2 animate-ping delay-100" />
              <div className="absolute w-0.5 h-0.5 bg-white/40 rounded-full bottom-1 left-3 animate-bounce delay-200" />
            </div>
          </motion.div>

          <motion.div
            className="w-10 h-10 rounded-xl border-2 border-white/10 absolute -inset-1 opacity-0 group/logo-hover:opacity-100 group/logo-hover:animate-spin-slow bg-gradient-to-r from-white/20 to-transparent shadow-2xl shadow-white/10"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 360],
            }}
            transition={{
              scale: { duration: 2, repeat: Infinity },
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            }}
          />
        </div>

        <div className="hidden items-center gap-4 text-sm text-white/70 md:flex lg:gap-6">
          {links.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="relative px-3 py-2 text-xs lg:text-sm lg:px-4 transition-all duration-300 hover:text-white group whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              <span className="relative z-10">{link.label}</span>
              <span className="bg-white/10 absolute inset-0 -z-10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 origin-center" />
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-3 mr-4">
          <motion.button
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/40 transition-all duration-300 px-4 py-2.5 h-11 w-auto gap-2 rounded-xl shadow-lg hover:shadow-white/20 md:mr-0"
            aria-label="Change language"
            onClick={() => setLangOpen(!langOpen)}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.05 }}>
            <span className="shrink-0 text-xl" role="img" aria-hidden="true">
              {selectedLang?.flag || "🌐"}
            </span>
            <span className="font-bold text-sm">
              {selectedLang?.name || "English"}
            </span>
            <FiChevronDown
              className={`h-4 w-4 shrink-0 transition-transform duration-300 ${langOpen ? "rotate-180" : ""}`}
            />
          </motion.button>

          <AnimatePresence>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="bg-zinc-900/95 border border-white/10 absolute right-0 top-full z-50 mt-2 max-h-[calc(100vh-8rem)] w-56 overflow-hidden overflow-y-auto rounded-xl shadow-2xl shadow-zinc-950/50 backdrop-blur-xl">
                <ul className="py-1.5">
                  {languages.map((lang, index) => (
                    <motion.li
                      key={lang.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}>
                      <motion.button
                        className={`hover:bg-white/5 flex w-full items-center gap-2.5 px-4 py-3 text-left transition-all duration-300 rounded-lg text-sm font-medium ${
                          selectedLang?.name === lang.name
                            ? "bg-white/10 border border-white/30 shadow-white/20 shadow-md"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedLang(lang);
                          setLangOpen(false);
                        }}
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.02 }}>
                        <span
                          className="shrink-0 text-xl"
                          role="img"
                          aria-hidden="true">
                          {lang.flag}
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="text-white font-semibold">
                            {lang.name}
                          </span>
                          <span className="text-white/60 text-xs">
                            {lang.native}
                          </span>
                        </div>
                        {selectedLang?.name === lang.name && (
                          <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-auto h-4 w-4 shrink-0 text-white"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity }}>
                            <path d="M20 6 9 17l-5-5" />
                          </motion.svg>
                        )}
                      </motion.button>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
}
