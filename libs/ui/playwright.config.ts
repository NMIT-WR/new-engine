import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const baseUrl = new URL(
  process.env.TEST_BASE_URL ?? 'http://127.0.0.1:6006',
)
const storybookUrl = `${baseUrl.protocol}//${baseUrl.host}`
const staticDir = path.join(__dirname, 'storybook-static')

export default defineConfig({
  testDir: './test',
  reporter: 'html',
  use: {
    baseURL: storybookUrl,
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
  webServer: {
    command: `npx http-server -p ${baseUrl.port || 6006}`,
    url: storybookUrl,
    cwd: staticDir,
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
