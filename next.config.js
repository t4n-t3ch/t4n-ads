/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Remove 'appDir' from experimental block
  },
  images: {
    domains: [],
  },
};

module.exports = nextConfig;