const puppeteer = require('puppeteer');
const path = require('path');

async function captureCartDesktopDark() {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    console.log('Capturing cart-desktop-dark...');
    
    // Set desktop viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // First add item to cart
    await page.goto('http://localhost:3000/products/classic-cotton-t-shirt', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add to cart
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const addButton = buttons.find(btn => 
        btn.textContent?.toLowerCase().includes('add to cart')
      );
      if (addButton) addButton.click();
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate to cart
    await page.goto('http://localhost:3000/cart', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Enable dark theme
    await page.evaluate(() => {
      const switchEl = document.querySelector('[role="switch"]');
      if (switchEl) switchEl.click();
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Take screenshot
    await page.screenshot({
      path: path.join('screenshots', 'ui-check', 'cart-desktop-dark.png'),
      fullPage: false
    });
    
    console.log('✓ Saved: cart-desktop-dark.png');
  } catch (error) {
    console.error('Failed:', error.message);
  } finally {
    await browser.close();
  }
}

captureCartDesktopDark();