import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', '@radix-ui/react-avatar'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.softwareone.com',
      },
    ],
  },
};

export default nextConfig;
