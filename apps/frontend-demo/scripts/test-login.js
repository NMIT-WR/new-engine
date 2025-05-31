const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  try {
    // Go to login page
    console.log('1. Navigating to login page...')
    await page.goto('http://localhost:3000/auth/login', {
      waitUntil: 'networkidle2',
    })
    await page.waitForSelector('input[type="email"]', { timeout: 5000 })

    // Take initial screenshot
    await page.screenshot({ path: 'screenshots/test-login-1-login-page.png' })
    console.log('   ✓ Login page screenshot saved')

    // Fill in login form
    console.log('2. Filling login form...')
    await page.type('input[type="email"]', 'test@example.com')
    await page.type('input[type="password"]', 'password123')

    // Take screenshot after filling form
    await page.screenshot({ path: 'screenshots/test-login-2-filled-form.png' })
    console.log('   ✓ Filled form screenshot saved')

    // Click login button
    console.log('3. Submitting login form...')
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[type="submit"]'),
    ])

    // Take screenshot of result page
    await page.screenshot({ path: 'screenshots/test-login-3-after-login.png' })
    console.log('   ✓ After login screenshot saved')

    // Check results
    console.log('\n4. Checking results:')
    const currentUrl = page.url()
    console.log('   Current URL:', currentUrl)
    console.log(
      '   Redirected to home:',
      currentUrl === 'http://localhost:3000/' ? 'Yes ✓' : 'No ✗'
    )

    // Check for user email in header
    try {
      const headerText = await page.$eval('header', (el) => el.textContent)
      const hasEmail = headerText.includes('test@example.com')
      console.log('   User email in header:', hasEmail ? 'Yes ✓' : 'No ✗')

      // Try to find account/user element specifically
      const userElement = await page.$(
        'header button, header [aria-label*="account"], header [aria-label*="user"]'
      )
      if (userElement) {
        const userText = await page.evaluate(
          (el) => el.textContent,
          userElement
        )
        console.log('   User element text:', userText)
      }
    } catch (e) {
      console.log('   Could not check header for user info')
    }

    // Take a zoomed header screenshot
    const header = await page.$('header')
    if (header) {
      await header.screenshot({
        path: 'screenshots/test-login-4-header-detail.png',
      })
      console.log('   ✓ Header detail screenshot saved')
    }
  } catch (error) {
    console.error('Error during test:', error.message)
  } finally {
    await browser.close()
  }
})()
