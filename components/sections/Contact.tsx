"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { FiArrowRight, FiChevronDown, FiSend, FiCheckCircle, FiAlertCircle, FiMail, FiMapPin, FiCircle } from "react-icons/fi";

const currencies = [
  { code: "USD", symbol: "$", flag: "🇺🇸", name: "US Dollar" },
  { code: "GBP", symbol: "£", flag: "🇬🇧", name: "British Pound" },
  { code: "EUR", symbol: "€", flag: "🇪🇺", name: "Euro" },
  { code: "PKR", symbol: "₨", flag: "🇵🇰", name: "Pakistani Rupee" },
];

type Status = "idle" | "sending" | "success" | "error";

const inputClass = `w-full px-4 py-3 bg-transparent border border-white/12 text-white text-[14px] placeholder:text-[#333]
  focus:outline-none focus:border-white/35 transition-colors duration-200 font-light`;

export function Contact() {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
      budget: formData.get("budget") as string,
      timeline: formData.get("timeline") as string,
      currency: selectedCurrency.code,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to send");
      setStatus("success");
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-28 px-6 lg:px-16 max-w-6xl mx-auto">

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <div className="pb-5 border-b border-white/10">
          <h2 className="text-[clamp(48px,7vw,88px)] font-bold text-white leading-none tracking-[-0.03em]">
            Contact
          </h2>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-16 lg:gap-24 items-start">

        {/* Left — info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <p className="text-[24px] lg:text-[28px] text-[#bbb] font-light leading-[1.7] tracking-[-0.01em]">
            Open to full-time, freelance, and contract —{" "}
            <span className="text-white">US, UK, and worldwide.</span>
          </p>

          <p className="text-[16px] text-[#666] leading-[1.85] font-light max-w-sm">
            I work with product teams and founders who need production-ready
            code and clear communication.
          </p>

          <div className="space-y-4 pt-2">
            <a
              href="mailto:malikwaseemshzad@gmail.com"
              className="flex items-center gap-4 text-[15px] text-[#777] hover:text-white transition-colors duration-200 group/mail"
            >
              <FiMail className="size-[18px] text-[#444] shrink-0" />
              <span className="group-hover/mail:underline underline-offset-4">malikwaseemshzad@gmail.com</span>
            </a>
            <div className="flex items-center gap-4 text-[15px] text-[#666]">
              <FiMapPin className="size-[18px] text-[#444] shrink-0" />
              <span>Sargodha, Pakistan</span>
            </div>
            <div className="flex items-center gap-4 text-[15px] text-[#666]">
              <FiCircle className="size-[18px] text-[#444] shrink-0 fill-white/40" />
              <span>Available for work</span>
            </div>
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {/* Feedback banners */}
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 px-4 py-3 border border-white/15 text-[#aaa] text-[13px] mb-6"
              style={{ borderRadius: "2px" }}
            >
              <FiCheckCircle className="size-4 shrink-0 text-white" />
              Message sent — I&apos;ll reply within 24 hours.
            </motion.div>
          )}
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 px-4 py-3 border border-white/10 text-[#888] text-[13px] mb-6"
              style={{ borderRadius: "2px" }}
            >
              <FiAlertCircle className="size-4 shrink-0" />
              {errorMsg || "Failed to send. Please try again."}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div className="space-y-2">
              <label className="text-[11px] tracking-[0.15em] uppercase text-[#555]">
                Name <span className="text-[#444]">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                required
                className={inputClass}
                style={{ borderRadius: "2px" }}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[11px] tracking-[0.15em] uppercase text-[#555]">
                Email <span className="text-[#444]">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@company.com"
                required
                className={inputClass}
                style={{ borderRadius: "2px" }}
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-[11px] tracking-[0.15em] uppercase text-[#555]">
                Project details <span className="text-[#444]">*</span>
              </label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Goal, scope, timeline, and how you'll measure success."
                className={`${inputClass} resize-y min-h-[120px]`}
                style={{ borderRadius: "2px" }}
              />
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <label className="text-[11px] tracking-[0.15em] uppercase text-[#555]">
                Estimated budget
              </label>
              <div
                className="flex border border-white/12 overflow-hidden focus-within:border-white/35 transition-colors duration-200"
                style={{ borderRadius: "2px" }}
              >
                {/* Currency selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="h-full px-4 bg-white/[0.04] hover:bg-white/[0.07] border-r border-white/10 flex items-center gap-2 transition-colors duration-200 min-w-[96px]"
                  >
                    <span className="text-base">{selectedCurrency.flag}</span>
                    <span className="text-[13px] text-[#888]">{selectedCurrency.code}</span>
                    <FiChevronDown className={`size-3 text-[#555] transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                  </button>
                  {showDropdown && (
                    <div
                      className="absolute top-full left-0 mt-1 w-44 bg-[#111] border border-white/12 shadow-xl z-50"
                      style={{ borderRadius: "2px" }}
                    >
                      {currencies.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => { setSelectedCurrency(c); setShowDropdown(false); }}
                          className="w-full px-4 py-2.5 text-left hover:bg-white/5 flex items-center gap-2.5 text-[13px] transition-colors"
                        >
                          <span>{c.flag}</span>
                          <span className="text-[#888]">{c.code}</span>
                          <span className="text-[#444] text-[11px]">{c.symbol}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="number"
                  name="budget"
                  min="0"
                  placeholder="Amount (optional)"
                  className="flex-1 px-4 py-3 bg-transparent text-white text-[14px] placeholder:text-[#333] focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <label className="text-[11px] tracking-[0.15em] uppercase text-[#555]">
                Timeline
              </label>
              <input
                type="text"
                name="timeline"
                placeholder="e.g. ASAP, 2 weeks, flexible"
                className={inputClass}
                style={{ borderRadius: "2px" }}
              />
            </div>

            {/* Submit */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={status === "sending" || status === "success"}
                className="inline-flex items-center gap-3 px-6 py-3 border border-white/25 hover:border-white/60 text-[13px] text-[#999] hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed group/btn"
                style={{ borderRadius: "2px" }}
              >
                {status === "sending" ? (
                  <><FiSend className="size-4 animate-pulse" /> Sending...</>
                ) : status === "success" ? (
                  <><FiCheckCircle className="size-4" /> Sent!</>
                ) : (
                  <>
                    Send message
                    <FiArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-[#333] mt-3 tracking-wide">
                No spam. Your details stay private.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}