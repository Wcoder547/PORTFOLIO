import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
        hostname: "res.cloudinary.com",
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
  experimental: {
    esmExternals: "loose", // Handles ESM issues with MongoDB/Mongoose
  },
  serverExternalPackages: ["mongoose"], // Excludes Mongoose from client bundles (stable in Next.js 15+)
  webpack: (config) => {
    config.experiments = {
      topLevelAwait: true, // Supports async in server components
    };
    return config;
  },
};

export default nextConfig;
