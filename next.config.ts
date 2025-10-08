import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
  reactStrictMode: true,
  output: 'standalone', // Enable standalone output for Docker
};

export default nextConfig;

