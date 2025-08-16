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
  // Настройки для статической сборки
  output: 'standalone',
  // Игнорируем ошибки во время сборки для API routes
  onDemandEntries: {
    // Период (в мс), в течение которого страница будет храниться в буфере
    maxInactiveAge: 25 * 1000,
    // Количество страниц, которые должны храниться одновременно
    pagesBufferLength: 2,
  },
  // Настройки для API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 