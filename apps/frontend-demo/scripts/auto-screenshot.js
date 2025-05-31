#!/usr/bin/env node

const { chromium } = require('@playwright/test')
const fs = require('fs')
const path = require('path')

const routes = [
  '/',
  '/products',
  '/products/t-shirt',
  '/cart',
  '/search',
  '/auth/login',
  '/auth/register',
]

async function captureScreenshots() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  // Set viewport for consistent screenshots
  await page.setViewportSize({ width: 1280, height: 720 })

  const screenshotDir = path.join(__dirname, '../screenshots/auto')

  // Create directory if it doesn't exist
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true })
  }

  for (const route of routes) {
    try {
      await page.goto(`http://localhost:3000${route}`, {
        waitUntil: 'networkidle',
        timeout: 30000,
      })

      // Wait for any animations to complete
      await page.waitForTimeout(1000)

      const filename =
        route === '/' ? 'home' : route.replace(/\//g, '-').substring(1)
      const filepath = path.join(screenshotDir, `${filename}.png`)

      await page.screenshot({
        path: filepath,
        fullPage: true,
      })

      console.log(`✓ Captured ${route} -> ${filename}.png`)
    } catch (error) {
      console.error(`✗ Failed to capture ${route}:`, error.message)
    }
  }

  await browser.close()
  console.log('\nScreenshots saved to:', screenshotDir)
}

// Run the script
captureScreenshots().catch(console.error)
