const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')

const pages = [
  { name: 'homepage', path: '/' },
  { name: 'products', path: '/products' },
  { name: 'product-detail', path: '/products/classic-cotton-t-shirt' },
  { name: 'cart', path: '/cart' },
]

const breakpoints = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 },
]

async function captureScreenshot(browser, pageConfig, breakpoint, theme) {
  const page = await browser.newPage()

  try {
    console.log(`Capturing ${pageConfig.name}-${breakpoint.name}-${theme}...`)

    // Set viewport
    await page.setViewport({
      width: breakpoint.width,
      height: breakpoint.height,
    })

    // Special handling for cart page - add an item first
    if (pageConfig.name === 'cart') {
      await page.goto('http://localhost:3000/products', {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      })
      await page.waitForSelector('.product-grid button', { timeout: 5000 })
      const addToCartButtons = await page.$$('.product-grid button')
      if (addToCartButtons.length > 0) {
        await addToCartButtons[0].click()
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    // Navigate to the page
    await page.goto(`http://localhost:3000${pageConfig.path}`, {
      waitUntil: 'domcontentloaded',
      timeout: 10000,
    })

    // Wait for content to load
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Set theme if dark
    if (theme === 'dark') {
      try {
        // Look for theme toggle in header
        const themeToggleFound = await page.evaluate(() => {
          // Try to find theme toggle button
          const buttons = Array.from(document.querySelectorAll('header button'))
          const themeButton = buttons.find((btn) => {
            const svg = btn.querySelector('svg')
            const ariaLabel = btn.getAttribute('aria-label')
            const title = btn.getAttribute('title')
            return (
              (ariaLabel && ariaLabel.toLowerCase().includes('theme')) ||
              (title && title.toLowerCase().includes('theme')) ||
              (svg &&
                (svg.innerHTML.includes('sun') ||
                  svg.innerHTML.includes('moon')))
            )
          })

          if (themeButton) {
            themeButton.click()
            return true
          }
          return false
        })

        if (themeToggleFound) {
          // Wait for theme transition
          await new Promise((resolve) => setTimeout(resolve, 1000))
        } else {
          console.log(
            `  Warning: Could not find theme toggle for ${pageConfig.name}-${breakpoint.name}`
          )
        }
      } catch (error) {
        console.log(
          `  Warning: Theme toggle failed for ${pageConfig.name}-${breakpoint.name}:`,
          error.message
        )
      }
    }

    // Scroll to top
    await page.evaluate(() => window.scrollTo(0, 0))
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Take screenshot
    const filename = `${pageConfig.name}-${breakpoint.name}-${theme}.png`
    const filepath = path.join('screenshots', 'ui-check', filename)

    await page.screenshot({
      path: filepath,
      fullPage: false,
    })

    console.log(`  ✓ Saved: ${filename}`)
  } catch (error) {
    console.error(
      `  ✗ Failed ${pageConfig.name}-${breakpoint.name}-${theme}:`,
      error.message
    )
  } finally {
    await page.close()
  }
}

async function captureAllScreenshots() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  console.log('Starting screenshot capture...\n')

  const results = {
    success: [],
    failed: [],
  }

  for (const pageConfig of pages) {
    for (const breakpoint of breakpoints) {
      for (const theme of ['light', 'dark']) {
        try {
          await captureScreenshot(browser, pageConfig, breakpoint, theme)
          results.success.push(`${pageConfig.name}-${breakpoint.name}-${theme}`)
        } catch (error) {
          results.failed.push(
            `${pageConfig.name}-${breakpoint.name}-${theme}: ${error.message}`
          )
        }
      }
    }
  }

  await browser.close()

  // Summary
  console.log('\n=== SUMMARY ===')
  console.log(`Total screenshots: ${pages.length * breakpoints.length * 2}`)
  console.log(`Successful: ${results.success.length}`)
  console.log(`Failed: ${results.failed.length}`)

  if (results.failed.length > 0) {
    console.log('\nFailed screenshots:')
    results.failed.forEach((f) => console.log(`  - ${f}`))
  }

  // Check what was actually captured
  const capturedFiles = fs
    .readdirSync(path.join('screenshots', 'ui-check'))
    .filter((f) => f.endsWith('.png'))
  console.log(`\nFiles in screenshots/ui-check: ${capturedFiles.length}`)
}

captureAllScreenshots().catch(console.error)
