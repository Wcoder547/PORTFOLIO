"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  FiArrowRight,
  FiChevronDown,
  FiMail,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

const currencies = [
  { code: "USD", symbol: "$", flag: "🇺🇸", name: "US Dollar" },
  { code: "GBP", symbol: "£", flag: "🇬🇧", name: "British Pound" },
  { code: "EUR", symbol: "€", flag: "🇪🇺", name: "Euro" },
  { code: "PKR", symbol: "₨", flag: "🇵🇰", name: "Pakistani Rupee" },
];

type Status = "idle" | "sending" | "success" | "error";

export function Contact() {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
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
    <section
      id="contact"
      className="py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-white to-emerald-300 bg-clip-text text-transparent drop-shadow-2xl mb-4">
            Get In Touch
          </h2>
          <p className="text-white/70 text-sm md:text-base mt-4">
            Please contact me directly at{" "}
            <a
              href="mailto:malikwaseemshzad@gmail.com"
              className="inline-flex items-center text-emerald-400 hover:text-emerald-300 underline underline-offset-4 font-medium transition-colors">
              <FiMail className="mr-1.5 size-4" />
              malikwaseemshzad@gmail.com
            </a>
            or through this form.
          </p>
          <div className="h-px mx-auto w-24 lg:w-32 bg-gradient-to-r from-emerald-400 via-white/60 to-transparent mt-6" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-3 text-center">
          <p className="text-white/60 text-sm leading-relaxed">
            Open to full-time, freelance, and contract - US, UK, and worldwide.
          </p>
          <p className="text-white/60 text-sm leading-relaxed max-w-xl">
            I work with product teams and founders who need production-ready
            code and clear communication.
          </p>
        </motion.div>

        {/* Success Banner */}
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mb-6 flex items-center gap-3 px-5 py-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
            <FiCheckCircle className="size-5 shrink-0" />
            <p className="text-sm font-medium">
              Message sent! I&apos;ll get back to you within 24 hours.
            </p>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mb-6 flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300">
            <FiAlertCircle className="size-5 shrink-0" />
            <p className="text-sm font-medium">
              {errorMsg || "Failed to send. Please try again."}
            </p>
          </motion.div>
        )}

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="w-full space-y-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
          {/* Name */}
          <div>
            <label
              htmlFor="contact-name"
              className="text-sm font-medium text-white mb-2 block">
              Your name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="contact-name"
              name="name"
              placeholder="Full name"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="contact-email"
              className="text-sm font-medium text-white mb-2 block">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              id="contact-email"
              name="email"
              placeholder="you@company.com"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="contact-message"
              className="text-sm font-medium text-white mb-2 block">
              Project details <span className="text-red-400">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={6}
              placeholder="Goal, timeline, scope, and how you'll measure success."
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all resize-y min-h-[8rem]"
            />
          </div>

          {/* Budget */}
          <div>
            <label
              htmlFor="contact-budget"
              className="text-sm font-medium text-white mb-2 block">
              Estimated budget (helps align expectations)
            </label>
            <div className="flex items-stretch rounded-lg border border-white/20 bg-white/5 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  className="h-full px-4 bg-white/10 hover:bg-white/15 transition-colors flex items-center gap-2 min-w-[8rem] border-r border-white/20">
                  <span className="text-lg">{selectedCurrency.flag}</span>
                  <span className="font-medium text-white text-sm">
                    {selectedCurrency.code}
                  </span>
                  <span className="text-white/60 text-xs">
                    ({selectedCurrency.symbol})
                  </span>
                  <FiChevronDown
                    className={`size-4 text-white/60 transition-transform ${showCurrencyDropdown ? "rotate-180" : ""}`}
                  />
                </button>
                {showCurrencyDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-zinc-900 border border-white/20 rounded-lg shadow-2xl z-50">
                    {currencies.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setSelectedCurrency(c);
                          setShowCurrencyDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center gap-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg">
                        <span className="text-lg">{c.flag}</span>
                        <span className="font-medium text-white">{c.code}</span>
                        <span className="text-white/60 text-xs">
                          ({c.symbol})
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="number"
                id="contact-budget"
                name="budget"
                min="0"
                step="1"
                placeholder="Amount (optional)"
                className="flex-1 px-4 py-3 bg-transparent text-white placeholder:text-white/40 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* Timeline */}
          <div>
            <label
              htmlFor="contact-timeline"
              className="text-sm font-medium text-white mb-2 block">
              Timeline
            </label>
            <input
              type="text"
              id="contact-timeline"
              name="timeline"
              placeholder="e.g. ASAP, 2 weeks, 1 month, flexible"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Submit */}
          <div className="flex flex-col items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={status === "sending" || status === "success"}
              className="group flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold rounded-full shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
              {status === "sending" ? (
                <>
                  <FiSend className="size-4 animate-pulse" /> Sending...
                </>
              ) : status === "success" ? (
                <>
                  <FiCheckCircle className="size-4" /> Sent!
                </>
              ) : (
                <>
                  Send project details
                  <FiArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="text-white/50 text-xs text-center">
              No spam. Your details stay private.
            </p>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
