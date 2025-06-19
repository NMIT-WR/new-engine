const checkEnvVariables = require('./check-env-variables')

checkEnvVariables()

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'storage-prg1.zerops.io',
      },
      {
        protocol: 'http',
        hostname: 'medusa-minio',
        port: '9004',
      },
      {
        protocol: 'https',
        hostname: 'bevgyjm5apuichhj.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'medusa-public-images.s3.eu-west-1.amazonaws.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'pub-adde8a563e2c43f7b6bc296d81c86358.r2.dev',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
  },
}

module.exports = nextConfig
