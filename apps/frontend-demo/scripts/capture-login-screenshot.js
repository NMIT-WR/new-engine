const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()

  // Set viewport to desktop size
  await page.setViewport({ width: 1920, height: 1080 })

  console.log('Navigating to login page...')
  await page.goto('http://localhost:3000/auth/login', {
    waitUntil: 'networkidle2',
  })

  // Wait for the form to be visible
  await page.waitForSelector('form', { timeout: 5000 })

  console.log('Capturing screenshot...')
  await page.screenshot({
    path: 'screenshots/ui-check/auth-login-current.png',
    fullPage: false,
    type: 'png',
  })

  console.log('Screenshot saved to screenshots/ui-check/auth-login-current.png')

  await browser.close()
})()
