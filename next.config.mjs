/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuración de source maps deshabilitada para producción
  productionBrowserSourceMaps: false,
  // External packages para evitar problemas con MongoDB en servidor
  serverExternalPackages: ['mongodb'],
  images: {
    domains: [
      'api.gycoding.com',
      'localhost',
      'lh3.googleusercontent.com',
      'assets.hardcover.app',
      'raw.githubusercontent.com',
    ],
  },
  // Optimizaciones para producción
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
