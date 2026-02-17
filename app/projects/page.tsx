"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiGithub, FiExternalLink, FiChevronRight } from "react-icons/fi";

const projects = [
  {
    title: "Calm Llama - AI Chatbot",
    description:
      "A modern web platform that enables users to discover and book premium wellness experiences such as saunas, yoga, massages, and float tanks. Features include real-time availability, secure payments, and instant booking confirmations. Worked as a Full Stack Freelance developer @ ToraTec AI, Dublin, Ireland",
    image: "/images/calmllama.jpg",
    tags: [
      "TypeScript",
      "Stripe Payment Gateway",
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "Shadcn UI",
      "Node.js",
      "Express",
      "UI/UX Developer",
      "Supabase",
      "AI",
      "n8n",
      "Google Maps API",
    ],
    github: "https://github.com/Yashkapure06",
    live: "https://calmllama.life/",
  },
  {
    title: "Mini Otio - AI Research Assistant",
    description:
      "A modern AI-powered research assistant that combines real-time web search with intelligent response generation. Users can ask research questions and receive comprehensive, streamed responses with multiple formatting options (step-by-step, bullet points, ELI5). Features include bookmark management, conversation export, and a sleek chat interface with real-time streaming capabilities.",
    image: "/images/mini-otio.jpg",
    tags: [
      "AI Agent",
      "Next.js 15",
      "TypeScript",
      "Shadcn UI",
      "React.js",
      "Tailwind CSS",
      "Zustand",
      "Zod",
      "OpenRouter API",
      "Exa.ai",
      "AI SDK",
    ],
    github: "https://github.com/Yashkapure06/mini-otio",
    live: "https://mini-otio.vercel.app/",
  },
  {
    title: "EC2 Cloud Cost Analyzer",
    description:
      "AWS EC2 Cloud Cost Analyzer is a tool that helps you analyze the cost of your AWS EC2 instances. It is a web application that allows you to view the cost of your AWS EC2 instances and compare them with the cost of other AWS EC2 instances.",
    image: "/images/ec2.jpg",
    tags: [
      "TypeScript",
      "React.js",
      "Next.js",
      "Shadcn UI",
      "Tailwind CSS",
      "AWS",
      "AWS EC2",
      "AWS API Gateway",
      "AWS CloudWatch",
    ],
    github: "https://github.com/Yashkapure06/ec2-observe",
    live: "https://ec2-observe.vercel.app/",
  },
  {
    title: "Online Interview Assessment System (OIAS)",
    description:
      "A fully Functional Online Interview Assessment System for Students and Professionals. This comprehensive platform enables real-time video interviews, automated assessments, and seamless communication between interviewers and candidates.",
    image: "/images/final-year.png",
    tags: [
      "React.js",
      "Tailwind CSS",
      "Node.js",
      "Socket.io",
      "MongoDB",
      "Heroku",
      "Node Mailer",
      "Express.js",
      "Firebase",
      "Google OAuth",
    ],
    github: "https://github.com/Yashkapure06",
    live: "https://calendly.com/yashkapure06/book-a-call-at-the-earliest?month=2024-10",
  },
  {
    title: "Dragon Sino Group",
    description:
      "Worked as a Full Stack developer at Dragon Sino Group. Created a fully functional MERN Stack Web Application with responsive behavior, smooth touch UI, and API Integration. This is a Chinese Company, working in the United Kingdom.",
    image: "/images/17.png",
    tags: [
      "TypeScript",
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "MongoDB",
    ],
    github: "https://github.com/Yashkapure06",
    live: "https://www.dragonsino.com/",
  },
  {
    title: "Netflix Clone using ReactJs",
    description:
      "I created a Netflix clone using ReactJs and Sass. This is a clone of Netflix website. And played a lot with Api.",
    image: "/images/10.png",
    tags: ["React JS", "SCSS", "CSS", "API"],
    github: "https://github.com/Yashkapure06/netflix-clone",
    live: "https://free-netflix-clone.vercel.app/",
  },
  {
    title: "Shangrila Petition Platform",
    description:
      "A fully Functional MERN Stack Web Application. Having responsive behaviour, smooth touch UI with API Integration. With Admin and Petitioner Panel, along with new features such as Login in with QR Code, Signing In, Setting Global Threshold.",
    image: "/images/shangrila-petition.png",
    tags: [
      "React.js",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "MongoDB",
    ],
    github: "https://github.com/Yashkapure06/Shangri-La-Petition-Platform",
    live: "https://github.com/Yashkapure06/Shangri-La-Petition-Platform",
  },
  {
    title: "Earthly Internship",
    description:
      "Worked as an Intern at Earthly. A simple frontend project for Earthly.",
    image: "/images/earthly.jpg",
    tags: ["jQuery", "CSS3", "JavaScript", "HTML5"],
    github: "https://github.com/Yashkapure06",
    live: "https://earthly-internship.netlify.app/",
  },
  {
    title: "The Kolorado Paints",
    description:
      "A fully Functional Next.js Based Frontend along with MERN Dashboard. Having responsive behaviour, smooth touch UI with API Integration. This project is for Artistic Content.",
    image: "/images/15.png",
    tags: ["Next.js", "CSS3", "React.js", "MUI", "SEO"],
    github: "https://github.com/Yashkapure06",
    live: "https://thekoloradopaints.com/",
  },
  {
    title: "TechnoKraft",
    description:
      "A fully Functional Next.js Based Frontend along with MERN Dashboard. Having responsive behaviour, smooth touch UI with API Integration. This project is for Educational Content Provider",
    image: "/images/13.png",
    tags: ["Next.js", "CSS3", "React.js", "MUI", "SEO"],
    github: "https://github.com/Yashkapure06",
    live: "https://tts.net.in/",
  },
  {
    title: "BEST GST Course",
    description:
      "A fully Functional Next.js Based Frontend along with MERN Dashboard. Having responsive behaviour, smooth touch UI with API Integration. This project also contains Payment Gateway Integration using Easebuzz. This is a GST Course Selling website.",
    image: "/images/16.png",
    tags: [
      "Payment Gateway",
      "Next.js",
      "Tailwind CSS",
      "React.js",
      "MUI",
      "SEO",
    ],
    github: "https://github.com/Yashkapure06",
    live: "https://www.bestgstcourse.com/",
  },
  {
    title: "Affinix Digital",
    description:
      "A fully Functional Next.js Based Frontend along with MERN Dashboard. Having responsive behaviour, smooth touch UI with API Integration. This project is for Best Digital Marketing Agency",
    image: "/images/12.png",
    tags: ["Next.js", "Tailwind CSS", "React.js", "MUI", "SEO"],
    github: "https://github.com/Yashkapure06",
    live: "https://affinixdigital.com/",
  },
  {
    title: "Octane Apps",
    description:
      "A fully Functional Next.js Based Frontend along with MERN Dashboard. Having responsive behaviour, smooth touch UI with API Integration.",
    image: "/images/14.png",
    tags: ["Next.js", "SCSS", "CSS", "React.js", "MUI", "SEO"],
    github: "https://github.com/Yashkapure06",
    live: "https://octaneapps.com/",
  },
  {
    title: "Dr. Manisha's Yoga Institute",
    description:
      "Created a MEVN Stack Web Application. Gave more than 180+ hours on this project. The project also includes admin panel along with CRUD Functionalities. Blogging System using Firebase.",
    image: "/images/main.png",
    tags: [
      "Vue.js",
      "Tailwind CSS",
      "Vuex",
      "MongoDB",
      "Node-Express",
      "Firebase",
      "SEO",
    ],
    github: "https://github.com/Yashkapure06",
    live: "https://www.drmanishasyogainstitute.com/",
  },
  {
    title: "Anandlok Ayurveda",
    description:
      "Using ReactJs, Next.js, and Material-UI, I worked as an Intern for Anandlok Ayurveda & Panchakrma Hospital and created a website for Ayurveda & Panchakarma practitioners to share their knowledge and experience with others.",
    image: "/images/1.png",
    tags: ["Next.js", "React.Js", "CSS", "Material-UI"],
    github: "https://github.com/Yashkapure06",
    live: "https://www.anandlokayurveda.com/",
  },
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen py-16 px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-white/60 mb-8"
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            className="hover:text-emerald-400 transition-colors"
          >
            Home
          </Link>
          <FiChevronRight className="size-4" />
          <span className="text-white font-medium">Projects</span>
        </motion.nav>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all hover:scale-105"
          >
            <FiArrowLeft className="size-4" />
            Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-white to-emerald-300 bg-clip-text text-transparent drop-shadow-2xl mb-6">
            My Projects
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Projects I worked on. Each of them containing its own case study.
          </p>
          <div className="h-px mx-auto w-24 lg:w-32 bg-gradient-to-r from-emerald-400 via-white/60 to-transparent mt-6" />
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Title */}
                <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 5).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 hover:bg-emerald-500/20 hover:border-emerald-400/50 transition-all"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 5 && (
                    <span className="text-xs px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/60">
                      +{project.tags.length - 5} more
                    </span>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all hover:scale-105"
                  >
                    <FiGithub className="size-4" />
                    GitHub
                  </a>
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-semibold shadow-lg hover:shadow-emerald-500/50 transition-all hover:scale-105"
                  >
                    <FiExternalLink className="size-4" />
                    Live Visit
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
