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
};

module.exports = nextConfig;
