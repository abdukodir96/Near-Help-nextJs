/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3007',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'nearhelps.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.nearhelps.com',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
