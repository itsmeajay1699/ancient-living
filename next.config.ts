import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/static/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dnxpltrja/image/upload/**',
      },
      {
        protocol: 'https',
        hostname: 'medusa-backend-qjok.onrender.com',
        port: '',
        pathname: '/static/**',
      },
      { protocol: 'https', hostname: 'vizitorv2.s3.us-east-1.amazonaws.com', pathname: '/**' },
    ],
  },
  // Disable TypeScript and ESLint errors for deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
