import { defineConfig, devices } from '@playwright/test'

const BASE_URL = process.env.TEST_BASE_URL ?? 'http://localhost:6006'

export default defineConfig({
  testDir: './test',
  reporter: process.env.CI ? 'html' : 'dot',
  use: {
    baseURL: BASE_URL,
  },
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 15'],
      },
    },
  ],
  webServer: process.env.CI
    ? undefined
    : {
        command: 'pnpm exec storybook dev --quiet --port 6006',
        url: BASE_URL,
        reuseExistingServer: true,
      },
})
