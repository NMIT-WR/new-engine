/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  output: 'export',
  images: {
    unoptimized: true
  },
  trailingSlash: true
}

module.exports = nextConfig
