/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['images.unsplash.com', 'cdn.icon-icons.com'],
  },
  experimental: {
    typedRoutes: true,
  },
}

module.exports = nextConfig 