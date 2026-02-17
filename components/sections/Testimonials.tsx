"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { FiArrowLeft, FiArrowRight, FiStar } from "react-icons/fi";

const testimonials = [
  {
    quote:
      "I have worked with Yash, throughout two separate projects during which he was part of the ToraTech AI team. Yash has always shown tremendous initiative to get work done and work around problems. I was impressed with his back end skills, as well as having a great eye for UX and UI. I would recommend Yash to any company looking for efficient development.",
    author: "Lucca Allen",
    title: "Co-Founder @ ToraTech AI",
    location: "Dublin, Ireland",
    avatar: "/images/lucca_allen.jpg",
  },
  {
    quote:
      "I had the opportunity to work with Yash and was pleased to see his enthusiasm from the very start. He approached his tasks with a positive attitude and showed a clear willingness to learn. Throughout our time working together, he was receptive to feedback and made efforts to improve. His openness to guidance was a valuable part of the collaboration.",
    author: "Daniela Vélez",
    title: "Global Marketing Director @ Dragon Sino Group",
    location: "Coventry, United Kingdom",
    avatar: "/images/daniela.jfif",
  },
  {
    quote:
      "Yash has been an exceptional member of our teaching team at Impact A&C Leicester. He demonstrates a strong understanding of coding concepts and adapts his teaching approach to suit students of all ages. His dedication, technical expertise, and calm attitude make him a valuable asset to our academy.",
    author: "Cristina",
    title: "Director @ Impact A&C",
    location: "Leicester, United Kingdom",
    avatar: "/images/impact_academies.png",
  },
  {
    quote:
      "Yash put in tremendous effort as an intern at Anandlok Ayurveda and created an impressive website single-handedly using the appropriate technology stack. His dedication and technical skills were outstanding. We wish Yash the best of luck in his future endeavors.",
    author: "Dr. Viraj Gite",
    title: "CEO @ Anandlok Ayurveda Hospital",
    location: "Nagpur, India",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd8ykRstebGo9HXF-ZFiHGhj4l6YF_papozO8q5j-8ig&s",
  },
  {
    quote:
      "Thank you Mr. Yash Kapure. I really appreciate your work on our website. The website looks professional and user-friendly. It's very easy to navigate our services and products to our clients. Our clients had a very positive impact. I highly recommend Yash for web development projects.",
    author: "Dr. Manisha Sonawane",
    title: "CEO @ Dr. Manisha's Yoga Institute",
    location: "Pune, India",
    avatar:
      "https://www.drmanishasyogainstitute.com/img/Dr.Manisha.3b416061.jpeg",
  },
  {
    quote:
      "Mr. Yash delivered our website to a truly professional standard - polished, modern, and built with up-to-date technology. What stood out was his enthusiasm and positive attitude throughout the project; we felt we were in safe, capable hands. It's rare to find someone so committed and trustworthy.",
    author: "Surekha",
    title: "Director @ Elyra Overseas",
    location: "Pune, India",
    avatar:
      "https://www.elyraoverseas.com/assets/logo/Elyra%20overseas-globe.png",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const total = testimonials.length;

  const next = () => setCurrent((prev) => (prev + 1) % total);
  const prev = () => setCurrent((prev) => (prev - 1 + total) % total);
  const goTo = (index: number) => setCurrent(index);

  return (
    <section
      id="testimonials"
      className="py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-white to-emerald-300 bg-clip-text text-transparent drop-shadow-2xl mb-4">
          Client Testimonials
        </h2>
        <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto">
          Real words from founders, directors, and teams I have worked with.
        </p>
        <div className="h-px mx-auto w-24 lg:w-32 bg-gradient-to-r from-emerald-400 via-white/60 to-transparent mt-6" />
      </motion.div>

      <div
        className="relative mx-auto w-full max-w-sm px-2 sm:max-w-sm sm:px-4 md:max-w-3xl lg:max-w-4xl"
        role="region"
        aria-label="Testimonials carousel">
        <div
          className="w-full overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 bg-black/10 border border-white/10"
          tabIndex={0}
          aria-roledescription="carousel"
          aria-live="polite">
          <div
            id="testimonials-track"
            className="flex duration-500 ease-out transition-transform"
            style={{ transform: `translateX(-${current * 100}%)` }}>
            {testimonials.map((t, index) => (
              <div
                key={t.author + index}
                className="w-full shrink-0 px-2 sm:px-4 md:px-6"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${total}`}>
                <div className="bg-zinc-950/80 text-white group min-h-[320px] rounded-2xl border border-white/10 p-5 shadow-sm transition-all hover:shadow-xl sm:min-h-[340px] sm:p-6 md:min-h-[320px] md:p-8 lg:p-10">
                  <div className="mb-6 flex justify-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar
                        key={i}
                        className="size-4 sm:size-5 md:size-6 fill-yellow-400 text-yellow-400 drop-shadow"
                      />
                    ))}
                    <span className="sr-only">5 out of 5</span>
                  </div>

                  <blockquote className="mb-6 break-words text-center text-sm italic leading-relaxed sm:mb-8 sm:text-sm md:text-lg lg:text-xl text-white/80">
                    “{t.quote}”
                  </blockquote>

                  <div className="flex flex-col items-center">
                    <Image
                      alt={t.author}
                      src={t.avatar}
                      width={80}
                      height={80}
                      className="mb-4 size-12 sm:size-16 md:size-20 rounded-full border-4 border-white/20 object-cover"
                    />
                    <div className="text-center">
                      <div className="text-base sm:text-lg md:text-xl font-semibold text-white">
                        {t.author}
                      </div>
                      <div className="text-xs sm:text-sm text-white/70">
                        {t.title}
                      </div>
                      <div className="text-xs sm:text-sm text-white/60">
                        {t.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={prev}
          aria-label="Previous testimonial"
          aria-controls="testimonials-track"
          className="bg-black/70 hover:bg-black/90 focus-visible:ring-emerald-400 absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full p-1.5 shadow-lg transition-all hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 sm:inline-flex sm:p-2 md:p-3">
          <FiArrowLeft className="size-4 sm:size-5 md:size-6" />
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Next testimonial"
          aria-controls="testimonials-track"
          className="bg-black/70 hover:bg-black/90 focus-visible:ring-emerald-400 absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full p-1.5 shadow-lg transition-all hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 sm:inline-flex sm:p-2 md:p-3">
          <FiArrowRight className="size-4 sm:size-5 md:size-6" />
        </button>

        <div className="mt-8 flex justify-center gap-2 px-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              aria-current={current === index}
              className={`size-2.5 sm:size-3 md:size-3.5 lg:size-4 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                current === index
                  ? "bg-emerald-400"
                  : "bg-zinc-600 hover:bg-zinc-500"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
