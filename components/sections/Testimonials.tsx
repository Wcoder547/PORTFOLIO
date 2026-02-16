"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const testimonials = [
    {
    quote: "Yash has been an exceptional member of our teaching team at Impact A&C Leicester. He demonstrates a strong understanding of coding concepts and effectively adapts his teaching approach to suit students of all ages. His dedication, technical expertise, and calm attitude make him a valuable asset to our academy.",
    author: "Cristina",
    title: "Director @ Impact A&C",
    location: "Leicester, United Kingdom",
    avatar: "/images/impact_academies.png"
  },
  {
    quote: "I had the pleasure of managing Yash at Octane Apps, where he demonstrated exceptional skills and remarkable eagerness to learn. His technical proficiency in React and web development consistently exceeded expectations. Yash's problem-solving abilities were top-notch, and he tackled complex challenges with strategic thinking and innovative solutions.",
    author: "Ranjeet Ahire",
    title: "CEO @ Tridebits Technologies",
    location: "Nashik, India",
    avatar: "https://images.crunchbase.com/image/upload/c_thumb,h_170,w_170,f_auto,g_face,z_0.7,b_white,q_auto:eco,dpr_2/lg4yvoftidmmkouytzg"
  },
  {
    quote: "Yash put in tremendous effort as an intern at Anandlok Ayurveda and created an impressive website single-handedly using the appropriate technology stack. His dedication and technical skills were outstanding. We wish Yash the best of luck in his future endeavors.",
    author: "Dr. Viraj Gite",
    title: "CEO @ Anandlok Ayurveda Hospital",
    location: "Nagpur, India",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd8ykRstebGo9HXF-ZFiHGhj4l6YFpapozO8q5j-8ig&s"
  },
  {
    quote: "Thank you Mr. Yash Kapure. I really appreciate your work on our website. The website looks professional and user-friendly. Its very easy to navigate our services and products to our clients. Our clients had a very positive impact. I highly recommend Yash for web development projects.",
    author: "Dr. Manisha Sonawane",
    title: "CEO @ Dr. Manisha's Yoga Institute",
    location: "Pune, India",
    avatar: "https://www.drmanishasyogainstitute.com/img/Dr.Manisha.3b416061.jpeg"
  },
  
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20 text-center"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-white to-emerald-300 bg-clip-text text-transparent drop-shadow-2xl mb-6">
          Testimonials
        </h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          What clients and colleagues say about my work.
        </p>
        <div className="h-px mx-auto w-24 lg:w-32 bg-gradient-to-r from-emerald-400 via-white/60 to-transparent mt-6" />
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:gap-10">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.author}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 lg:p-10 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 overflow-hidden h-full"
          >
            {/* Quote */}
            <blockquote className="text-white/80 italic leading-relaxed text-lg lg:text-xl mb-8 flex-1">
              "{testimonial.quote}"
            </blockquote>

            {/* Author Info */}
            <div className="flex items-start gap-4 pb-6 border-t border-white/10 pt-6">
              <div className="shrink-0">
                <Image
                  src={testimonial.avatar}
                  alt={`${testimonial.author}, ${testimonial.title}`}
                  width={80}
                  height={80}
                  className="rounded-2xl border-4 border-white/20 shadow-2xl w-20 h-20 lg:w-24 lg:h-24 object-cover group-hover:scale-110 transition-transform duration-500"
                  priority={index < 2}
                />
              </div>
              
              <div className="min-w-0 flex-1">
                <h4 className="text-xl font-semibold text-white truncate group-hover:text-emerald-400 transition-colors mb-1">
                  {testimonial.author}
                </h4>
                <p className="text-emerald-300/90 text-sm font-medium mb-1">
                  {testimonial.title}
                </p>
                <p className="text-white/60 text-xs">
                  {testimonial.location}
                </p>
              </div>
            </div>

            {/* Stars */}
            <div className="flex gap-1 pt-2">
              {Array(5).fill(0).map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
                </svg>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* View More CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 flex justify-center"
      >
        <Link href="/testimonials" className="group">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 justify-center whitespace-nowrap rounded-full text-sm font-semibold border border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/50 px-8 py-4 transition-all duration-300 text-white shadow-xl hover:shadow-emerald-500/30"
          >
            View All Testimonials
            <svg className="size-4 group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}
