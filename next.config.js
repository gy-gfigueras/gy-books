/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'api.gycoding.com',
      'lh3.googleusercontent.com',
      'assets.hardcover.app',
    ],
  },
};

module.exports = nextConfig;
