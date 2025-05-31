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

  // Set up console logging
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log('Console Error:', msg.text())
    }
  })

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
  const screenshotsDir = path.join(__dirname, '../screenshots/theme-test-final')
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true })
  }

  console.log('\n1. Checking initial theme state...')
  const initialTheme = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
  })
  console.log(`Initial theme: ${initialTheme}`)

  // Take initial screenshot
  await page.screenshot({
    path: path.join(screenshotsDir, `1-initial-${initialTheme}.png`),
    fullPage: false,
  })

  // Wait for theme toggle to be visible
  console.log('\n2. Looking for theme toggle...')

  try {
    // Wait for the switch component - it should have a label with the switch inside
    await page.waitForSelector('label input[type="checkbox"]', {
      timeout: 5000,
    })
    console.log('Found checkbox input')
  } catch {
    console.log('Checkbox not found, looking for other selectors...')
  }

  // Check what's actually rendered
  const themeToggleInfo = await page.evaluate(() => {
    // Look for the theme toggle component
    const labels = Array.from(document.querySelectorAll('label'))
    const switchLabel = labels.find((label) => {
      const input = label.querySelector('input[type="checkbox"]')
      const spans = label.querySelectorAll('span')
      return input && spans.length > 0
    })

    if (switchLabel) {
      const input = switchLabel.querySelector('input[type="checkbox"]')
      const spans = Array.from(switchLabel.querySelectorAll('span'))
      return {
        found: true,
        inputChecked: input?.checked,
        inputType: input?.type,
        spanCount: spans.length,
        spans: spans.map((s) => ({
          className: s.className,
          dataState: s.getAttribute('data-state'),
          style: s.style.cssText,
        })),
      }
    }

    // Also check for theme toggle by looking for sun/moon icons
    const sunIcon = document.querySelector('[class*="icon-"][class*="sunny"]')
    const moonIcon = document.querySelector('[class*="icon-"][class*="moon"]')

    return {
      found: false,
      hasSunIcon: !!sunIcon,
      hasMoonIcon: !!moonIcon,
      sunIconClass: sunIcon?.className,
      moonIconClass: moonIcon?.className,
    }
  })

  console.log('Theme toggle info:', JSON.stringify(themeToggleInfo, null, 2))

  // Try clicking the theme toggle
  console.log('\n3. Testing theme toggle clicks...')

  const clickResults = []

  for (let i = 1; i <= 3; i++) {
    console.log(`\nClick ${i}:`)

    try {
      // Try different click strategies
      const clicked = await page.evaluate(() => {
        // Strategy 1: Click the checkbox directly
        const checkbox = document.querySelector('label input[type="checkbox"]')
        if (checkbox) {
          checkbox.click()
          return 'checkbox'
        }

        // Strategy 2: Click the label containing the checkbox
        const labels = Array.from(document.querySelectorAll('label'))
        const switchLabel = labels.find((label) =>
          label.querySelector('input[type="checkbox"]')
        )
        if (switchLabel) {
          switchLabel.click()
          return 'label'
        }

        // Strategy 3: Click between sun and moon icons
        const sunIcon = document.querySelector(
          '[class*="icon-"][class*="sunny"]'
        )
        const moonIcon = document.querySelector(
          '[class*="icon-"][class*="moon"]'
        )
        if (sunIcon && moonIcon) {
          // Find common parent
          let parent = sunIcon.parentElement
          while (parent && !parent.contains(moonIcon)) {
            parent = parent.parentElement
          }
          if (parent) {
            parent.click()
            return 'icon-parent'
          }
        }

        return 'not-clicked'
      })

      console.log(`Click method: ${clicked}`)

      // Wait for any transitions
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Check current theme
      const currentTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark')
          ? 'dark'
          : 'light'
      })

      // Check localStorage
      const storedTheme = await page.evaluate(() => {
        return localStorage.getItem('theme')
      })

      clickResults.push({
        click: i,
        method: clicked,
        theme: currentTheme,
        stored: storedTheme,
      })

      console.log(`Current theme: ${currentTheme}`)
      console.log(`Stored theme: ${storedTheme}`)

      // Take screenshot
      await page.screenshot({
        path: path.join(screenshotsDir, `3-click-${i}-${currentTheme}.png`),
        fullPage: false,
      })
    } catch (error) {
      console.error(`Error during click ${i}:`, error.message)
    }
  }

  // Test persistence
  console.log('\n4. Testing theme persistence...')

  const themeBeforeRefresh = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
  })

  await page.reload({ waitUntil: 'networkidle0' })

  const themeAfterRefresh = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
  })

  console.log(`Theme before refresh: ${themeBeforeRefresh}`)
  console.log(`Theme after refresh: ${themeAfterRefresh}`)
  console.log(
    `Persistence: ${themeBeforeRefresh === themeAfterRefresh ? '✅ WORKING' : '❌ NOT WORKING'}`
  )

  await page.screenshot({
    path: path.join(screenshotsDir, `4-after-refresh-${themeAfterRefresh}.png`),
    fullPage: false,
  })

  // Summary
  console.log('\n=== SUMMARY ===')
  console.log('Click results:', clickResults)

  // Check if theme actually toggles
  const themes = clickResults.map((r) => r.theme)
  const uniqueThemes = [...new Set(themes)]
  console.log(
    `\nTheme toggle functionality: ${uniqueThemes.length > 1 ? '✅ WORKING' : '❌ NOT WORKING'}`
  )
  console.log(`Themes observed: ${uniqueThemes.join(', ')}`)

  // Check localStorage
  const hasLocalStorage = clickResults.some((r) => r.stored !== null)
  console.log(
    `LocalStorage persistence: ${hasLocalStorage ? '✅ WORKING' : '❌ NOT WORKING'}`
  )

  console.log(`\nScreenshots saved to: ${screenshotsDir}`)

  await browser.close()
}

testThemeToggle().catch(console.error)
