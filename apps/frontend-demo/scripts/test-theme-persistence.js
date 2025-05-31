const puppeteer = require('puppeteer')

async function testThemePersistence() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080 })

  console.log('1. Opening page in light mode...')
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })

  // Check initial state
  const initialState = await page.evaluate(() => {
    const htmlClasses = document.documentElement.className
    const localStorage = window.localStorage.getItem('theme')
    const switchChecked = document.querySelector(
      'input[type="checkbox"]'
    )?.checked
    return { htmlClasses, localStorage, switchChecked }
  })
  console.log('Initial state:', initialState)

  console.log('\n2. Switching to dark mode...')
  await page.click('label input[type="checkbox"]')
  await new Promise((resolve) => setTimeout(resolve, 500))

  const darkState = await page.evaluate(() => {
    const htmlClasses = document.documentElement.className
    const localStorage = window.localStorage.getItem('theme')
    const switchChecked = document.querySelector(
      'input[type="checkbox"]'
    )?.checked
    return { htmlClasses, localStorage, switchChecked }
  })
  console.log('Dark mode state:', darkState)

  console.log('\n3. Refreshing page...')
  await page.reload({ waitUntil: 'networkidle0' })
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const afterRefreshState = await page.evaluate(() => {
    const htmlClasses = document.documentElement.className
    const localStorage = window.localStorage.getItem('theme')
    const switchChecked = document.querySelector(
      'input[type="checkbox"]'
    )?.checked
    return { htmlClasses, localStorage, switchChecked }
  })
  console.log('After refresh state:', afterRefreshState)

  // Check if theme persisted correctly
  const themePersisted =
    afterRefreshState.htmlClasses.includes('dark') &&
    afterRefreshState.localStorage === 'dark'
  const switchCorrect = afterRefreshState.switchChecked === true

  console.log('\n=== RESULTS ===')
  console.log(`Theme persisted: ${themePersisted ? '✅' : '❌'}`)
  console.log(`Switch position correct: ${switchCorrect ? '✅' : '❌'}`)

  if (!switchCorrect) {
    console.log('\n⚠️  Switch is in wrong position after refresh!')
    console.log('Expected: checked (for dark mode)')
    console.log(
      'Actual:',
      afterRefreshState.switchChecked ? 'checked' : 'unchecked'
    )
  }

  await browser.close()
}

testThemePersistence().catch(console.error)
