/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal configuration for testing
  experimental: {
    optimizeCss: false,
  },
  images: {
    domains: ['localhost'],
  },
  compress: true,
};

export default nextConfig;
