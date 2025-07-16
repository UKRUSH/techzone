/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal configuration for testing
  experimental: {
    optimizeCss: false,
  },
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
};

export default nextConfig;
