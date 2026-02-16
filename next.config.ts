import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // next.config.js - Add this to fix the external image error
  /** @type {import('next').NextConfig} */

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.crunchbase.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.drmanishasyogainstitute.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.elyraoverseas.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
