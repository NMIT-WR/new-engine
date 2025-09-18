import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@new-engine/ui'],
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
      'node_modules/@zag-js',
      'node_modules/puppeteer',
    ],
  },
}

export default nextConfig
