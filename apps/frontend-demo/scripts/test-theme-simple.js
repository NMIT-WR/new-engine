const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

async function testThemeToggle() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080 })

  console.log('Opening http://localhost:3000...')
  try {
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle0',
      timeout: 30000,
    })
  } catch (error) {
    console.error('Failed to load page:', error.message)
    await browser.close()
    return
  }

  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, '../screenshots/theme-test')
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true })
  }

  console.log('\n1. Looking for theme toggle...')

  // Try different selectors
  const selectors = [
    'label:has(span[data-state])',
    'span[data-state]',
    'label:has(input[type="checkbox"])',
    '.w-8', // The class from theme toggle
    '[data-state="checked"]',
    '[data-state="unchecked"]',
  ]

  for (const selector of selectors) {
    const exists = await page.evaluate((sel) => {
      return document.querySelector(sel) !== null
    }, selector)
    console.log(`Selector "${selector}": ${exists ? 'FOUND' : 'not found'}`)
  }

  // Get all elements with data-state attribute
  const dataStateElements = await page.evaluate(() => {
    const elements = document.querySelectorAll('[data-state]')
    return Array.from(elements).map((el) => ({
      tagName: el.tagName,
      className: el.className,
      dataState: el.getAttribute('data-state'),
      text: el.textContent?.trim(),
    }))
  })

  console.log('\nElements with data-state:', dataStateElements)

  // Check initial theme
  const initialTheme = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
  })
  console.log(`\nInitial theme: ${initialTheme}`)

  // Take screenshot
  await page.screenshot({
    path: path.join(screenshotsDir, `initial-${initialTheme}.png`),
    fullPage: false,
  })

  // Try to find and click the toggle
  console.log('\n2. Attempting to click theme toggle...')

  try {
    // Wait for any element that might be the toggle
    await page.waitForSelector('.w-8', { timeout: 5000 })

    // Click the element
    await page.click('.w-8')
    console.log('Clicked .w-8 selector')

    await page.waitForTimeout(1000)

    // Check theme after click
    const themeAfterClick = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light'
    })

    console.log(`Theme after click: ${themeAfterClick}`)
    console.log(
      `Theme changed: ${initialTheme !== themeAfterClick ? 'YES' : 'NO'}`
    )

    // Take screenshot after click
    await page.screenshot({
      path: path.join(screenshotsDir, `after-click-${themeAfterClick}.png`),
      fullPage: false,
    })
  } catch (error) {
    console.error('Failed to click toggle:', error.message)
  }

  // Check localStorage
  const localStorage = await page.evaluate(() => {
    return Object.keys(window.localStorage).reduce((acc, key) => {
      acc[key] = window.localStorage.getItem(key)
      return acc
    }, {})
  })
  console.log('\nlocalStorage:', localStorage)

  console.log('\n✅ Test complete!')
  await browser.close()
}

testThemeToggle().catch(console.error)
