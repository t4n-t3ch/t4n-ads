/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // @ffmpeg-installer/ffmpeg resolves its platform binary with a dynamic require()
    // that webpack can't statically bundle - let Node resolve it at runtime instead.
    serverComponentsExternalPackages: ['@ffmpeg-installer/ffmpeg'],
  },
  images: {
    domains: [],
  },
};

module.exports = nextConfig;