const puppeteer = require('puppeteer');
const path = require('path');

async function captureProductDetailMobileLight() {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    console.log('Capturing product-detail-mobile-light...');
    
    // Set mobile viewport
    await page.setViewport({ width: 375, height: 812 });
    
    // Navigate with shorter timeout
    await page.goto('http://localhost:3000/products/classic-cotton-t-shirt', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    // Wait for content
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take screenshot
    await page.screenshot({
      path: path.join('screenshots', 'ui-check', 'product-detail-mobile-light.png'),
      fullPage: false
    });
    
    console.log('✓ Saved: product-detail-mobile-light.png');
    await page.close();
  } catch (error) {
    console.error('Failed:', error.message);
  } finally {
    await browser.close();
  }
}

async function captureCartScreenshots() {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const breakpoints = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 }
  ];
  
  try {
    for (const breakpoint of breakpoints) {
      for (const theme of ['light', 'dark']) {
        const page = await browser.newPage();
        console.log(`Capturing cart-${breakpoint.name}-${theme}...`);
        
        // Set viewport
        await page.setViewport({ width: breakpoint.width, height: breakpoint.height });
        
        // First go to products page
        await page.goto('http://localhost:3000/products', { 
          waitUntil: 'domcontentloaded',
          timeout: 15000 
        });
        
        // Wait for products to load
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Try to add item to cart using different selectors
        const added = await page.evaluate(() => {
          // Look for add to cart buttons
          const buttons = Array.from(document.querySelectorAll('button'));
          const addButton = buttons.find(btn => {
            const text = btn.textContent?.toLowerCase() || '';
            const ariaLabel = btn.getAttribute('aria-label')?.toLowerCase() || '';
            return text.includes('add to cart') || ariaLabel.includes('add to cart');
          });
          
          if (addButton) {
            addButton.click();
            return true;
          }
          
          // Try clicking on product cards first, then add to cart
          const productCards = document.querySelectorAll('[class*="product-card"], a[href*="/products/"]');
          if (productCards.length > 0) {
            // Click on first product
            productCards[0].click();
            return false; // Need to navigate to product page
          }
          
          return false;
        });
        
        if (!added) {
          // Navigate to a specific product page
          await page.goto('http://localhost:3000/products/classic-cotton-t-shirt', { 
            waitUntil: 'domcontentloaded',
            timeout: 10000 
          });
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Try to add from product page
          await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const addButton = buttons.find(btn => {
              const text = btn.textContent?.toLowerCase() || '';
              return text.includes('add to cart');
            });
            if (addButton) addButton.click();
          });
        }
        
        // Wait for cart update
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Navigate to cart
        await page.goto('http://localhost:3000/cart', { 
          waitUntil: 'domcontentloaded',
          timeout: 10000 
        });
        
        // Wait for cart to load
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Set theme if dark
        if (theme === 'dark') {
          await page.evaluate(() => {
            // Look for theme toggle - it's a switch element
            const switches = Array.from(document.querySelectorAll('[role="switch"]'));
            if (switches.length > 0) {
              switches[0].click();
            }
          });
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Take screenshot
        const filename = `cart-${breakpoint.name}-${theme}.png`;
        await page.screenshot({
          path: path.join('screenshots', 'ui-check', filename),
          fullPage: false
        });
        
        console.log(`✓ Saved: ${filename}`);
        await page.close();
      }
    }
  } catch (error) {
    console.error('Failed:', error.message);
  } finally {
    await browser.close();
  }
}

async function fixDarkThemeScreenshots() {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  // Pages that need dark theme fixed
  const pagesToFix = [
    { name: 'homepage', path: '/', breakpoints: ['mobile', 'tablet', 'desktop'] },
    { name: 'products', path: '/products', breakpoints: ['mobile', 'tablet', 'desktop'] },
    { name: 'product-detail', path: '/products/classic-cotton-t-shirt', breakpoints: ['mobile', 'tablet', 'desktop'] }
  ];
  
  const viewportSizes = {
    mobile: { width: 375, height: 812 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 }
  };
  
  try {
    for (const pageConfig of pagesToFix) {
      for (const breakpoint of pageConfig.breakpoints) {
        const page = await browser.newPage();
        console.log(`Fixing ${pageConfig.name}-${breakpoint}-dark...`);
        
        // Set viewport
        await page.setViewport(viewportSizes[breakpoint]);
        
        // Navigate to page
        await page.goto(`http://localhost:3000${pageConfig.path}`, { 
          waitUntil: 'domcontentloaded',
          timeout: 15000 
        });
        
        // Wait for content
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Enable dark theme by clicking the switch
        const toggled = await page.evaluate(() => {
          // Find the switch element (role="switch")
          const switchEl = document.querySelector('[role="switch"]');
          if (switchEl) {
            switchEl.click();
            return true;
          }
          return false;
        });
        
        if (toggled) {
          // Wait for theme transition
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Take screenshot
          const filename = `${pageConfig.name}-${breakpoint}-dark.png`;
          await page.screenshot({
            path: path.join('screenshots', 'ui-check', filename),
            fullPage: false
          });
          
          console.log(`✓ Updated: ${filename}`);
        } else {
          console.log(`⚠ Could not find theme toggle for ${pageConfig.name}-${breakpoint}`);
        }
        
        await page.close();
      }
    }
  } catch (error) {
    console.error('Failed:', error.message);
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log('Capturing missing screenshots...\n');
  
  // Capture missing product detail mobile light
  await captureProductDetailMobileLight();
  
  console.log('\nCapturing cart screenshots...\n');
  
  // Capture all cart screenshots
  await captureCartScreenshots();
  
  console.log('\nFixing dark theme screenshots...\n');
  
  // Fix dark theme screenshots
  await fixDarkThemeScreenshots();
  
  console.log('\nDone!');
}

main().catch(console.error);