import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'storage.googleapis.com',
      'avatars.githubusercontent.com',
    ],
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
 
module.exports = withBundleAnalyzer(nextConfig)

export default nextConfig;
