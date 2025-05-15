// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Properly identify output file paths during build
  output: 'standalone',
  // Disable page optimization to prevent issues with route groups
  poweredByHeader: false,
  // Handle edge cases with route groups in Vercel deployments
  experimental: {
    // This helps with route group resolution issues
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Add a rewrite rule to handle NextAuth's _log endpoint
  async rewrites() {
    return [
      {
        source: '/api/auth/_log',
        destination: '/api/auth/dummy-log',
      },
    ];
  },
};

module.exports = nextConfig;
