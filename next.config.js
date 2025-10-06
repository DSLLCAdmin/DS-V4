/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed output: 'export' to enable API routes
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
  },
  // Enable API routes for Netlify serverless functions
  trailingSlash: true,
  experimental: {
    forceSwcTransforms: true,
  },
  // Domain configuration - REMOVED assetPrefix to fix CSS loading
  basePath: '',
  // Canonical domain
  env: {
    CANONICAL_URL: 'https://dsllc.com',
  },
};

module.exports = nextConfig;
