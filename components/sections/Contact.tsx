"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FiArrowRight, FiChevronDown, FiMail, FiSend } from "react-icons/fi";

const currencies = [
  { code: "USD", symbol: "$", flag: "🇺🇸", name: "US Dollar" },
  { code: "GBP", symbol: "£", flag: "🇬🇧", name: "British Pound" },
  { code: "EUR", symbol: "€", flag: "🇪🇺", name: "Euro" },
  { code: "PKR", symbol: "₨", flag: "🇵🇰", name: "Pakistani Rupee" },
];

export function Contact() {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Add your form submission logic here
    // Example: send to API endpoint, email service, etc.

    setTimeout(() => {
      alert("Message sent! I'll get back to you soon.");
      setIsSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <section
      id="contact"
      className="py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        {/* Header */}
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
              href="mailto:yashkapure06@gmail.com"
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
            Remote or onsite.
          </p>
          <p className="text-white/60 text-sm leading-relaxed max-w-xl">
            I work with product teams and founders who need production-ready
            code and clear communication. A few details below help me respond
            with something useful - goal, timeline, and scope go a long way.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="w-full space-y-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
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

          <div>
            <label
              htmlFor="contact-message"
              className="text-sm font-medium text-white mb-2 block">
              Project details <span className="text-red-400">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="Goal, timeline, scope, and how you'll measure success (a few sentences is enough)."
              required
              rows={6}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all resize-y min-h-[8rem]"
            />
          </div>

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
                    className={`size-4 text-white/60 transition-transform ${
                      showCurrencyDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showCurrencyDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-zinc-900 border border-white/20 rounded-lg shadow-2xl z-50">
                    {currencies.map((currency) => (
                      <button
                        key={currency.code}
                        type="button"
                        onClick={() => {
                          setSelectedCurrency(currency);
                          setShowCurrencyDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center gap-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg">
                        <span className="text-lg">{currency.flag}</span>
                        <span className="font-medium text-white">
                          {currency.code}
                        </span>
                        <span className="text-white/60 text-xs">
                          ({currency.symbol})
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
                className="flex-1 px-4 py-3 bg-transparent text-white placeholder:text-white/40 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          </div>

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

          <div className="flex flex-col items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold rounded-full shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
              {isSubmitting ? (
                <>
                  <FiSend className="size-4 animate-pulse" />
                  Sending...
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
