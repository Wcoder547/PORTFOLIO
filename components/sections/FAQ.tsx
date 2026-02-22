"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

function FAQSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="border border-white/10 rounded-2xl bg-white/5 p-6 animate-pulse">
          <div className="h-5 bg-white/10 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}

export function FAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/faqs")
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setFaqs(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleFAQ = (index: number) =>
    setOpenIndex(openIndex === index ? null : index);

  return (
    <section
      id="faq"
      className="py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-white to-emerald-300 bg-clip-text text-transparent drop-shadow-2xl mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-white/70 text-sm md:text-base max-w-2xl mx-auto">
          Get answers to common questions about my services and expertise
        </p>
        <div className="h-px mx-auto w-24 lg:w-32 bg-gradient-to-r from-emerald-400 via-white/60 to-transparent mt-6" />
      </motion.div>

      <div className="mx-auto max-w-3xl space-y-4">
        {loading ? (
          <FAQSkeleton />
        ) : faqs.length === 0 ? (
          <p className="text-center text-white/50 py-16">
            No FAQs available yet.
          </p>
        ) : (
          faqs.map((faq, index) => (
            <motion.div
              key={faq._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
              className="border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm overflow-hidden hover:border-emerald-400/50 transition-all duration-300">
              <button
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-white/5">
                <h3
                  className="pr-4 text-lg font-semibold text-white"
                  id={`faq-question-${index}`}>
                  {faq.question}
                </h3>
                <FiChevronDown
                  className={`size-5 text-emerald-400 transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden">
                    <div className="px-6 pb-6 pt-2">
                      <p className="text-white/80 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
