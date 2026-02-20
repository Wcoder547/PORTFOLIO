import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Bypasses optimizer for all images (local + remote); ideal for dev
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
