import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // deviceSizes: [320, 480, 640, 768, 1024],
    // imageSizes: [16, 32, 48, 64, 96, 128],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
