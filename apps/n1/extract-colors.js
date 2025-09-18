const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

async function extractColors() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080 })

  console.log('Navigating to n1shop.cz...')
  await page.goto('https://www.n1shop.cz', {
    waitUntil: 'networkidle2',
    timeout: 30000,
  })

  // Wait for key elements to load
  await page.waitForSelector('header', { timeout: 10000 }).catch(() => {})
  await page
    .waitForSelector('.product-item', { timeout: 10000 })
    .catch(() => {})

  // Create screenshots directory
  const screenshotDir = path.join(__dirname, 'screenshots')
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir)
  }

  // Take screenshots
  console.log('Taking screenshots...')
  await page.screenshot({
    path: path.join(screenshotDir, 'homepage-full.png'),
    fullPage: true,
  })
  await page.screenshot({
    path: path.join(screenshotDir, 'homepage-viewport.png'),
  })

  // Scroll to products section
  await page.evaluate(() => {
    const products = document.querySelector(
      '.product-grid, .products, [class*="product"]'
    )
    if (products) products.scrollIntoView()
  })
  await new Promise((r) => setTimeout(r, 1000))
  await page.screenshot({
    path: path.join(screenshotDir, 'products-section.png'),
  })

  // Extract color values
  console.log('Extracting colors...')
  const colors = await page.evaluate(() => {
    const getColor = (
      selector,
      property = 'backgroundColor',
      pseudoElement = null
    ) => {
      try {
        const elements = document.querySelectorAll(selector)
        if (elements.length === 0) return null

        // Try multiple elements if first doesn't have the property
        for (const el of elements) {
          const style = pseudoElement
            ? window.getComputedStyle(el, pseudoElement)
            : window.getComputedStyle(el)
          const value = style[property]
          if (
            value &&
            value !== 'rgba(0, 0, 0, 0)' &&
            value !== 'transparent'
          ) {
            return value
          }
        }
        return null
      } catch (e) {
        return null
      }
    }

    const getMultipleColors = (selector, properties) => {
      try {
        const el = document.querySelector(selector)
        if (!el) return {}
        const style = window.getComputedStyle(el)
        const result = {}
        properties.forEach((prop) => {
          result[prop] = style[prop]
        })
        return result
      } catch (e) {
        return {}
      }
    }

    // Get logo/brand colors
    const logoColors = []
    const logoElements = document.querySelectorAll(
      '.logo, [class*="logo"], header img, .header-logo'
    )
    logoElements.forEach((el) => {
      const bgColor = window.getComputedStyle(el).backgroundColor
      const color = window.getComputedStyle(el).color
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') logoColors.push(bgColor)
      if (color && color !== 'rgba(0, 0, 0, 0)') logoColors.push(color)
    })

    // Get button colors from actual buttons
    const buttonSelectors = [
      '.btn-add-to-cart',
      '[class*="add-to-cart"]',
      '.btn-primary',
      '.btn',
      'button[type="submit"]',
      '.button',
      '[class*="button"]',
    ]

    let primaryButtonColors = {}
    for (const selector of buttonSelectors) {
      const buttons = document.querySelectorAll(selector)
      if (buttons.length > 0) {
        const style = window.getComputedStyle(buttons[0])
        primaryButtonColors = {
          background: style.backgroundColor,
          text: style.color,
          border: style.borderColor,
        }

        // Try to get hover state if possible
        buttons[0].classList.add('hover')
        const hoverStyle = window.getComputedStyle(buttons[0])
        primaryButtonColors.hoverBackground = hoverStyle.backgroundColor
        buttons[0].classList.remove('hover')

        if (primaryButtonColors.background !== 'rgba(0, 0, 0, 0)') break
      }
    }

    // Get product card colors
    const productCardSelectors = [
      '.product-item',
      '.product-card',
      '[class*="product-item"]',
      '.item',
    ]
    let productCard = null
    for (const selector of productCardSelectors) {
      const cards = document.querySelectorAll(selector)
      if (cards.length > 0) {
        productCard = cards[0]
        break
      }
    }

    const productColors = {}
    if (productCard) {
      const cardStyle = window.getComputedStyle(productCard)
      productColors.background = cardStyle.backgroundColor
      productColors.border = cardStyle.borderColor

      // Product title
      const title = productCard.querySelector(
        'h2, h3, h4, .title, .product-title, [class*="title"]'
      )
      if (title) {
        productColors.titleColor = window.getComputedStyle(title).color
      }

      // Price
      const price = productCard.querySelector('.price, [class*="price"]')
      if (price) {
        productColors.priceColor = window.getComputedStyle(price).color
      }

      // Sale price
      const salePrice = productCard.querySelector(
        '.sale-price, .discount-price, [class*="sale"], [class*="discount"]'
      )
      if (salePrice) {
        productColors.salePriceColor = window.getComputedStyle(salePrice).color
      }
    }

    // Get header colors
    const header = document.querySelector('header, .header, [class*="header"]')
    let headerColors = {}
    if (header) {
      const headerStyle = window.getComputedStyle(header)
      headerColors = {
        background: headerStyle.backgroundColor,
        text: headerStyle.color,
        borderBottom: headerStyle.borderBottomColor,
      }
    }

    // Get navigation colors
    const navLinks = document.querySelectorAll(
      'nav a, .nav a, .navigation a, header a'
    )
    const navColors = { links: [] }
    navLinks.forEach((link, i) => {
      if (i < 3) {
        // Just get first few
        const style = window.getComputedStyle(link)
        navColors.links.push({
          color: style.color,
          background: style.backgroundColor,
        })
      }
    })

    // Get search bar colors
    const searchInput = document.querySelector(
      'input[type="search"], .search-input, [class*="search"] input'
    )
    let searchColors = {}
    if (searchInput) {
      const searchStyle = window.getComputedStyle(searchInput)
      searchColors = {
        background: searchStyle.backgroundColor,
        text: searchStyle.color,
        border: searchStyle.borderColor,
        placeholder: searchStyle.color, // Placeholder is harder to get
      }
    }

    // Get footer colors
    const footer = document.querySelector('footer, .footer')
    let footerColors = {}
    if (footer) {
      const footerStyle = window.getComputedStyle(footer)
      footerColors = {
        background: footerStyle.backgroundColor,
        text: footerStyle.color,
      }
    }

    // Get body/page background
    const bodyStyle = window.getComputedStyle(document.body)
    const htmlStyle = window.getComputedStyle(document.documentElement)

    // Get any yellow/lime colors from the page
    const allElements = document.querySelectorAll('*')
    const yellowColors = new Set()
    allElements.forEach((el) => {
      const style = window.getComputedStyle(el)
      const bg = style.backgroundColor
      const color = style.color

      // Check if color looks yellowish/lime (very rough check)
      if (bg && bg.includes('rgb')) {
        const match = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
        if (match) {
          const [_, r, g, b] = match
          if (
            Number.parseInt(r) > 200 &&
            Number.parseInt(g) > 200 &&
            Number.parseInt(b) < 100
          ) {
            yellowColors.add(bg)
          }
        }
      }
      if (color && color.includes('rgb')) {
        const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
        if (match) {
          const [_, r, g, b] = match
          if (
            Number.parseInt(r) > 200 &&
            Number.parseInt(g) > 200 &&
            Number.parseInt(b) < 100
          ) {
            yellowColors.add(color)
          }
        }
      }
    })

    // Look for badge colors
    const badges = document.querySelectorAll(
      '.badge, .label, [class*="badge"], [class*="label"], .tag'
    )
    const badgeColors = []
    badges.forEach((badge, i) => {
      if (i < 3) {
        const style = window.getComputedStyle(badge)
        badgeColors.push({
          background: style.backgroundColor,
          text: style.color,
        })
      }
    })

    return {
      brand: {
        logo: logoColors,
        yellowLimeColors: Array.from(yellowColors),
      },
      header: headerColors,
      navigation: navColors,
      search: searchColors,
      buttons: {
        primary: primaryButtonColors,
        allButtons: getColor('button, .button, .btn', 'backgroundColor'),
      },
      productCard: productColors,
      text: {
        body: bodyStyle.color,
        headings: getColor('h1, h2, h3', 'color'),
        links: getColor('a', 'color'),
        muted: getColor(
          '.text-muted, .text-secondary, [class*="muted"]',
          'color'
        ),
      },
      backgrounds: {
        body: bodyStyle.backgroundColor,
        html: htmlStyle.backgroundColor,
        main: getColor('main, .main, [class*="main"]', 'backgroundColor'),
        section: getColor('section, .section', 'backgroundColor'),
      },
      footer: footerColors,
      badges: badgeColors,
      // Get some specific selectors they might use
      specific: {
        addToCart: getMultipleColors('.add-to-cart, [class*="add-to-cart"]', [
          'backgroundColor',
          'color',
          'borderColor',
        ]),
        productTitle: getColor('.product-title, .product-name', 'color'),
        price: getColor('.price, [class*="price"]', 'color'),
        oldPrice: getColor('.old-price, .original-price', 'color'),
        inStock: getColor('.in-stock, [class*="stock"]', 'color'),
        outOfStock: getColor('.out-of-stock, [class*="out-of-stock"]', 'color'),
      },
    }
  })

  // Try to get more specific elements by looking for Czech text
  const czechElements = await page.evaluate(() => {
    const results = {}

    // Look for "Přidat do košíku" button
    const addToCartButtons = Array.from(
      document.querySelectorAll('button, a, [role="button"]')
    ).filter((el) => el.textContent.toLowerCase().includes('košík'))

    if (addToCartButtons.length > 0) {
      const style = window.getComputedStyle(addToCartButtons[0])
      results.addToCartButton = {
        background: style.backgroundColor,
        text: style.color,
        border: style.borderColor,
      }
    }

    // Look for "Skladem" text
    const inStockElements = Array.from(document.querySelectorAll('*')).filter(
      (el) => el.textContent.toLowerCase().includes('skladem')
    )

    if (inStockElements.length > 0) {
      const style = window.getComputedStyle(inStockElements[0])
      results.inStock = {
        background: style.backgroundColor,
        text: style.color,
      }
    }

    return results
  })

  // Combine results
  const finalColors = { ...colors, czechSpecific: czechElements }

  // Save colors to file
  console.log('Saving color data...')
  fs.writeFileSync(
    path.join(__dirname, 'extracted-colors.json'),
    JSON.stringify(finalColors, null, 2)
  )

  // Try to screenshot specific elements
  try {
    const button = await page.$('.add-to-cart, [class*="add-to-cart"], button')
    if (button) {
      await button.screenshot({ path: path.join(screenshotDir, 'button.png') })
    }
  } catch (e) {}

  try {
    const productCard = await page.$('.product-item, .product-card')
    if (productCard) {
      await productCard.screenshot({
        path: path.join(screenshotDir, 'product-card.png'),
      })
    }
  } catch (e) {}

  try {
    const header = await page.$('header')
    if (header) {
      await header.screenshot({ path: path.join(screenshotDir, 'header.png') })
    }
  } catch (e) {}

  await browser.close()

  console.log('\nExtraction complete!')
  console.log('Colors saved to: extracted-colors.json')
  console.log('Screenshots saved to: screenshots/')

  return finalColors
}

extractColors()
  .then((colors) => {
    console.log('\n=== KEY COLORS FOUND ===\n')
    console.log('Brand/Logo colors:', colors.brand)
    console.log('\nButton colors:', colors.buttons)
    console.log('\nHeader:', colors.header)
    console.log('\nProduct card:', colors.productCard)
    console.log('\nCzech specific elements:', colors.czechSpecific)
  })
  .catch((error) => {
    console.error('Error:', error)
  })
