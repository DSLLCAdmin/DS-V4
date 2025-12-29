/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed output: 'export' to enable API routes
  // eslint config removed - use next lint command instead (Next.js 16+)
  images: { 
    unoptimized: true,
  },
  // Enable API routes for Netlify serverless functions
  trailingSlash: true,
  // experimental.forceSwcTransforms removed - not supported in Next.js 16 with Turbopack
  // Domain configuration - REMOVED assetPrefix to fix CSS loading
  basePath: '',
  // Canonical domain
  env: {
    CANONICAL_URL: 'https://dsllc.com',
  },
};

module.exports = nextConfig;
