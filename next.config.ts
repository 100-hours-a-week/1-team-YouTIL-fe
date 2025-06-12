import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'storage.googleapis.com',
      'avatars.githubusercontent.com',
    ],
  },
};

export default nextConfig;
