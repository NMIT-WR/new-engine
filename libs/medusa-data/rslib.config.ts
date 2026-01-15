import { defineConfig } from '@rslib/core'

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: 'es2022',
      dts: true,
    },
  ],
  source: {
    entry: {
      index: './src/index.ts',
      'client/index': './src/client/index.ts',
      'server/index': './src/server/index.ts',
      'hooks/index': './src/hooks/index.ts',
      'providers/index': './src/providers/index.ts',
    },
  },
  output: {
    externals: [
      'react',
      'react/jsx-runtime',
      '@tanstack/react-query',
      '@medusajs/js-sdk',
      '@medusajs/types',
    ],
  },
})
