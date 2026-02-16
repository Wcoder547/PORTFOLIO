'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Experience } from '@/components/sections/Experience';
import { TechStack } from '@/components/sections/TechStack';
import { Projects } from '@/components/sections/Projects';
import {Testimonials } from '@/components/sections/Testimonials';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Experience />
      <TechStack />
      <Projects />
      <Testimonials />
      {/* Projects, Articles, etc. next */}
    </main>
  );
}
