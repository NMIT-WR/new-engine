/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  experimental: {
    optimizePackageImports: ['ui'],
  },
}

module.exports = nextConfig
