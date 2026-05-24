"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

export function FAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/faqs")
      .then((r) => r.json())
      .then((json) => { if (json.data) setFaqs(json.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="py-28 px-6 lg:px-16 max-w-6xl mx-auto">

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        className="mb-20"
      >
        <div className="flex items-end justify-between pb-5 border-b border-white/10">
          <h2 className="text-[clamp(48px,7vw,88px)] font-bold text-white leading-none tracking-[-0.03em]">
            FAQ
          </h2>
          {!loading && faqs.length > 0 && (
            <span className="text-[11px] tracking-[0.25em] uppercase text-[#555] mb-2">
              {faqs.length} questions
            </span>
          )}
        </div>
      </motion.div>

      {/* Skeleton */}
      {loading && (
        <div className="space-y-0 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="py-6 border-b border-white/5">
              <div className="h-5 bg-white/5 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && faqs.length === 0 && (
        <p className="text-[#444] text-base">No FAQs available yet.</p>
      )}

      {/* FAQ list */}
      {!loading && faqs.length > 0 && (
        <div className="space-y-0 max-w-3xl">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: index * 0.06 }}
              className="border-b border-white/8"
            >
              <button
                onClick={() => toggle(index)}
                aria-expanded={openIndex === index}
                className="flex w-full items-start justify-between gap-8 py-7 text-left group"
              >
                {/* Number + question */}
                <div className="flex items-start gap-6">
                  <span className="text-[12px] text-[#333] font-mono tracking-widest pt-1 shrink-0">
                    _{String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[17px] lg:text-[19px] font-medium text-[#bbb] group-hover:text-white transition-colors duration-200 leading-snug tracking-[-0.01em]">
                    {faq.question}
                  </h3>
                </div>

                {/* Icon */}
                <div
                  className="w-7 h-7 border border-white/12 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-white/25 transition-colors duration-200"
                  style={{ borderRadius: "2px" }}
                >
                  {openIndex === index
                    ? <FiMinus className="size-3.5 text-[#888]" />
                    : <FiPlus className="size-3.5 text-[#555]" />
                  }
                </div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="text-[15px] text-[#777] leading-[1.85] font-light pb-8 pl-[3.25rem] max-w-2xl">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}