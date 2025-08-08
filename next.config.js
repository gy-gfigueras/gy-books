/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'api.gycoding.com',
      'lh3.googleusercontent.com',
      'assets.hardcover.app',
      'raw.githubusercontent.com',
    ],
  },
};

module.exports = nextConfig;
