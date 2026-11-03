/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Remove 'appDir' from experimental block
    // These packages resolve their native/platform binary via a dynamic
    // require() that webpack can't statically bundle - keep them external
    // (resolved from node_modules at runtime) instead of webpacking them.
    serverComponentsExternalPackages: ['@ffmpeg-installer/ffmpeg', 'fluent-ffmpeg'],
    // Output file tracing still needs to know to actually include the
    // (now-external) ffmpeg binary in the webhook's serverless function.
    outputFileTracingIncludes: {
      '/api/webhooks/openrouter-video/route': ['./node_modules/@ffmpeg-installer/**/*'],
    },
  },
  images: {
    domains: [],
  },
};

module.exports = nextConfig;