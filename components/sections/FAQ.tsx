"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const faqs = [
  {
    question: "What services do you offer?",
    answer:
      "I offer: Frontend Development (React, Next.js, Vue, payments); Full Stack Development (MERN, MEVN, auth, real-time); Database & Backend; Performance & Frontend Optimization; Frontend Architecture & System Design; Product-Focused UI Engineering; and SEO, AEO, GEO & Production Readiness- metadata, structured data, analytics, and monitoring so your site is discoverable, citable by AI, and issues get caught early.",
  },
  {
    question: "How much experience do you have?",
    answer:
      "I have 4+ years of real-world experience in web development, working with various technologies including React.js, Next.js, Node.js, MongoDB, Express.js, and Vue.js.",
  },
  {
    question: "What is your hourly rate?",
    answer:
      "My freelance rate is $25-57/hour, though this may vary depending on the project scope and requirements. I'm flexible with working hours, hourly rate, fixed rate, payment terms and available for both short-term and long-term projects.",
  },
  {
    question: "Do you work remotely?",
    answer:
      "Yes. I work remotely with teams worldwide, including the US, UK, and Europe. I'm used to overlapping with US hours and async communication. Based in the UK; available for remote projects and flexible on time zones.",
  },
  {
    question: "Do you work with US-based clients?",
    answer:
      "Yes. I actively work with US clients - startups, product teams, and agencies. I work remotely with flexible hours to overlap with US time zones, communicate clearly in English, and charge in USD. If you're in the US and need a reliable frontend or full-stack developer, get in touch via the contact form or email.",
  },
  {
    question: "What technologies do you specialize in?",
    answer:
      "I specialize in React.js, Next.js, Node.js, TypeScript, JavaScript, MERN/MEVN stack, Tailwind CSS, ShadCN UI, MongoDB, Supabase, Express.js, Vue.js, and various other modern web technologies.",
  },
  {
    question: "Can you help with existing projects?",
    answer:
      "Absolutely! I can help with maintaining, updating, and enhancing existing web applications. I have experience working with legacy codebases and can help modernize older applications.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
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
        ))}
      </div>
    </section>
  );
}
