// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Properly identify output file paths during build
  output: 'standalone',
  // External packages for server components
  serverExternalPackages: [],
};

module.exports = nextConfig;
