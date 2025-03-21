import { defineConfig, devices } from "@playwright/test";
import { nxE2EPreset } from "@nx/playwright/preset";
// @ts-expect-error
import { workspaceRoot } from "@nx/devkit";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require('@dotenvx/dotenvx').config()

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: "./e2e" }),
  reporter: [ ['html', { open: 'never' }] ],
  fullyParallel: true,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },
  retries: 3,
  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  //   cwd: workspaceRoot,
  // },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    // Uncomment for mobile browsers support
    /* {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    }, */

    // Uncomment for branded browsers
    /* {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    } */
  ],
});
