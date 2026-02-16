"use client";

import Image from "next/image";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaMapPin, FaX, FaXTwitter } from 'react-icons/fa6';

export function Hero() {
  return (
    <section className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-16 pt-10 max-w-6xl mx-auto px-4 mt-10 ">
      {/* Profile Side - Slightly Bigger */}
      <div className="flex flex-col items-center lg:items-start ml-10">
        {/* Profile Image - Bigger */}
        <div className="relative w-48 h-48 mb-8 rounded-full ring-2 ring-gray-800 overflow-hidden bg-gray-900/50 shadow-2xl">
          <Image 
            src="/profile.png" 
            alt="Waseem Akram" 
            fill 
            className="object-cover rounded-full"
            priority
          />
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <FaMapPin className="w-4 h-4" />
          <span>Sargodha, Punjab, Pakistan</span>
        </div>

        {/* Social Icons - Horizontal */}
        <div className="flex w-full items-center gap-6 justify-center lg:justify-start">
          <a 
            href="https://github.com/yourusername" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 text-gray-200 hover:text-gray-400 transition-all duration-300 hover:scale-110"
            title="GitHub"
          >
            <FaGithub className="w-6 h-6 mx-auto" />
          </a>
          <a 
            href="https://linkedin.com/in/yourusername" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 text-blue-500 hover:text-blue-700 transition-all duration-300 hover:scale-110"
            title="LinkedIn"
          >
            <FaLinkedin className="w-6 h-6 mx-auto" />
          </a>
          <a 
            href="https://twitter.com/yourusername" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 text-gray-200 hover:text-gray-500 transition-all duration-300 hover:scale-110"
            title="Twitter"
          >
            <FaXTwitter className="w-6 h-6 mx-auto" />
          </a>
          <a 
            href="https://instagram.com/yourusername" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 text-pink-500 hover:text-pink-700 transition-all duration-300 hover:scale-110"
            title="Instagram"
          >
            <FaInstagram className="w-6 h-6 mx-auto" />
          </a>
        </div>
      </div>

      {/* Content Side - Updated with Download CV button */}
      <div className="flex-1 text-center lg:text-left">
        {/* Buttons Container - Schedule + Download CV */}
       <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 mb-6">
  {/* Schedule a call button */}
  <a 
    href="mailto:your.email@example.com"
    className="flex items-center border border-blue-700/50 text-blue-300 hover:bg-blue-900/30 transition-all duration-300 py-2 px-4 rounded-sm text-sm font-medium hover:scale-105 hover:shadow-lg"
  >
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
    <span>Schedule a call</span>
  </a>

  {/* Download CV button - PERFECT MATCH */}
  <a 
    href="/cv/Waseem Akram CV.pdf"
    download="Waseem-Akram-CV.pdf"
    className="flex items-center border border-emerald-600/50 text-emerald-300 hover:bg-emerald-900/30 transition-all duration-300 py-2 px-4 rounded-sm text-sm font-medium hover:scale-105 hover:shadow-lg"
    target="_blank" 
    rel="noopener noreferrer"
  >
    {/* Beautiful Document Icon */}
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 20h6v-2H7v2z"/>
    </svg>
    <span>Download CV</span>
  </a>
</div>


        {/* Name */}
        <h1 className="text-4xl lg:text-6xl font-bold mb-3 tracking-tight text-white">
          Waseem Akram
        </h1>

        {/* Title */}
        <p className="text-xl text-gray-400 mb-5 font-medium">
          Full-Stack Developer | Next.js, React, Node.js
        </p>

        {/* Description */}
        <p className="text-gray-300 leading-relaxed text-lg max-w-2xl">
          Self-taught Full-Stack Developer from Pakistan, specializing in modern web technologies and open-source development. 
          Passionate about building scalable applications with Next.js and contributing to the developer community through open-source projects.
        </p>
      </div>
    </section>
  );
}
