import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isCI = Boolean(process.env.CI)
const storybookUrl = process.env.STORYBOOK_URL ?? 'http://127.0.0.1:6006'
const staticDir = path.join(__dirname, 'storybook-static')
const hasStaticBuild = fs.existsSync(path.join(staticDir, 'iframe.html'))

export default defineConfig({
  testDir: path.join(__dirname, 'tests'),
  outputDir: path.join(__dirname, 'test-results'),
  timeout: 60_000,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },
  reporter: isCI
    ? [
        ['list'],
        [
          'html',
          {
            open: 'never',
            outputFolder: path.join(__dirname, 'playwright-report'),
          },
        ],
      ]
    : [
        ['list'],
        [
          'html',
          {
            open: 'on-failure',
            outputFolder: path.join(__dirname, 'playwright-report'),
          },
        ],
      ],
  use: {
    baseURL: storybookUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  snapshotPathTemplate:
    '{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}',
  webServer: process.env.STORYBOOK_URL
    ? undefined
    : hasStaticBuild
      ? {
          command: 'python3 -m http.server 6006',
          url: storybookUrl,
          cwd: staticDir,
          reuseExistingServer: !isCI,
          timeout: 120_000,
        }
      : {
          command: 'pnpm exec storybook dev --quiet --port 6006',
          url: storybookUrl,
          cwd: __dirname,
          reuseExistingServer: !isCI,
          timeout: 120_000,
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
})
