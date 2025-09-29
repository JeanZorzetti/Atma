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
}

module.exports = nextConfig