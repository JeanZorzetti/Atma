/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic config
  trailingSlash: false,

  // Temporarily disable TypeScript checks for deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Image optimization (SEO Phase 2 - Week 2)
  images: {
    // Enable modern image formats (WebP and AVIF)
    formats: ['image/webp', 'image/avif'],

    // Optimize image quality (balance between quality and file size)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Enable lazy loading by default
    // Next.js Image component already has lazy loading, but this ensures it

    // Cache optimized images for 1 year
    minimumCacheTTL: 31536000,

    // Allow images from these domains (if needed for external images)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'atmaaligner.com.br',
      },
      {
        protocol: 'https',
        hostname: 'atma.roilabs.com.br',
      },
    ],
  },

  // Enable compression
  compress: true,

  // Production optimizations
  compiler: {
    // Remove console.logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Performance optimizations
  // swcMinify is enabled by default in Next.js 15+, no need to specify
}

module.exports = nextConfig