/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  // Removed 'output: export' to enable SSG with dynamic functions
  images: {
    unoptimized: true,
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
