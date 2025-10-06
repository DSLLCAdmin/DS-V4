/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
  },
  // Force static file serving
  trailingSlash: true,
  experimental: {
    forceSwcTransforms: true,
  },
  // Ensure proper static export
  distDir: 'out',
  // Domain configuration
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://dsllc.com' : '',
  basePath: '',
  // Canonical domain
  env: {
    CANONICAL_URL: 'https://dsllc.com',
  },
};

module.exports = nextConfig;
