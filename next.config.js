/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed output: 'export' to support API routes
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
  // Add CORS headers for local development
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
