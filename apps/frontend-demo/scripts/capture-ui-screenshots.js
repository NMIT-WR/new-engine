const puppeteer = require('puppeteer');
const path = require('path');

const pages = [
  { name: 'homepage', path: '/' },
  { name: 'products', path: '/products' },
  { name: 'product-detail', path: '/products/classic-cotton-t-shirt' },
  { name: 'cart', path: '/cart' }
];

const breakpoints = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 }
];

const themes = ['light', 'dark'];

async function captureScreenshots() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Starting screenshot capture...');
  
  for (const pageConfig of pages) {
    console.log(`\nCapturing ${pageConfig.name} page...`);
    
    // Special handling for cart page - add an item first
    if (pageConfig.name === 'cart') {
      await page.goto('http://localhost:3000/products', { waitUntil: 'networkidle2' });
      await page.waitForSelector('button[aria-label="Add to cart"]', { timeout: 5000 });
      await page.click('button[aria-label="Add to cart"]');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    for (const breakpoint of breakpoints) {
      console.log(`  Setting viewport to ${breakpoint.name} (${breakpoint.width}x${breakpoint.height})`);
      await page.setViewport({ width: breakpoint.width, height: breakpoint.height });
      
      for (const theme of themes) {
        console.log(`    Capturing ${theme} theme...`);
        
        // Navigate to the page
        await page.goto(`http://localhost:3000${pageConfig.path}`, { waitUntil: 'networkidle2' });
        
        // Wait for content to load
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Set theme
        if (theme === 'dark') {
          // Find and click the theme toggle button
          try {
            // Try multiple selectors for the theme toggle
            const themeToggleSelectors = [
              'button[aria-label="Toggle theme"]',
              'button[title="Toggle theme"]',
              '[data-testid="theme-toggle"]',
              'button svg[class*="sun"], button svg[class*="moon"]',
              'button:has(svg[class*="sun"]), button:has(svg[class*="moon"])'
            ];
            
            let clicked = false;
            for (const selector of themeToggleSelectors) {
              try {
                await page.waitForSelector(selector, { timeout: 2000 });
                await page.click(selector);
                clicked = true;
                break;
              } catch (e) {
                // Try next selector
              }
            }
            
            if (!clicked) {
              console.log('      Warning: Could not find theme toggle button');
            } else {
              // Wait for theme transition
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          } catch (error) {
            console.log('      Warning: Theme toggle failed:', error.message);
          }
        }
        
        // Handle any popups or banners
        try {
          await page.evaluate(() => {
            // Close any modals or popups
            const closeButtons = document.querySelectorAll('[aria-label*="Close"], [aria-label*="close"], button[class*="close"]');
            closeButtons.forEach(btn => btn.click());
          });
        } catch (e) {
          // No popups to close
        }
        
        // Scroll to top for consistent screenshots
        await page.evaluate(() => window.scrollTo(0, 0));
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Take screenshot
        const filename = `${pageConfig.name}-${breakpoint.name}-${theme}.png`;
        const filepath = path.join('screenshots', 'ui-check', filename);
        
        await page.screenshot({
          path: filepath,
          fullPage: false // Only capture viewport
        });
        
        console.log(`      Saved: ${filename}`);
      }
    }
  }
  
  await browser.close();
  console.log('\nAll screenshots captured successfully!');
}

captureScreenshots().catch(console.error);