"use strict"
// CommonJS Playwright config for Nx plugin compatibility
const os = require("os")
const path = require("path")
const { defineConfig, devices } = require("@playwright/test")

const baseUrl = new URL(process.env.TEST_BASE_URL ?? "http://127.0.0.1:6006")
const storybookUrl = `${baseUrl.protocol}//${baseUrl.host}`
const staticDir = path.join(__dirname, "storybook-static")
const workersEnv = process.env.PLAYWRIGHT_WORKERS
// Recommend using (CPU cores - 1) when PLAYWRIGHT_WORKERS is not specified.
// This provides concurrency while leaving one core free for system/background tasks.
const cpuCount = typeof os.cpus === "function" ? os.cpus().length : 2
const recommendedWorkers = Math.max(1, cpuCount - 1)
const workersValue = workersEnv ? Number(workersEnv) : recommendedWorkers

module.exports = defineConfig({
  testDir: "./test",
  reporter: "html",
  fullyParallel: true,
  workers: Number.isFinite(workersValue) ? workersValue : undefined,
  use: {
    baseURL: storybookUrl,
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["iPhone 15"],
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
