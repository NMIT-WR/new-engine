/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  // Removed 'output: export' to enable SSG with dynamic functions
  images: {
    domains: ['medusa-13d1-9000.prg1.zerops.app'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
  trailingSlash: true,
  // Optimize for serverless - exclude large binaries
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@esbuild',
      'node_modules/@rspack',
      'node_modules/webpack',
      'node_modules/rollup',
      'node_modules/terser',
      'node_modules/uglify-js',
    ],
  },
}

module.exports = nextConfig
