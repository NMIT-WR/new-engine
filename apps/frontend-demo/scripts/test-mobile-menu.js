const puppeteer = require('puppeteer');

async function testMobileMenu() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set mobile viewport
    await page.setViewport({
      width: 375,
      height: 667,
      isMobile: true,
      hasTouch: true
    });
    
    console.log('Navigating to homepage...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Take screenshot of initial mobile layout
    console.log('Taking screenshot of initial mobile layout...');
    await page.screenshot({ 
      path: 'screenshots/mobile-menu-test-1-initial.png',
      fullPage: false 
    });
    
    // Find and click the mobile menu button
    console.log('Looking for mobile menu button...');
    const menuButton = await page.$('button[class*="mobileMenuButton"]');
    
    if (menuButton) {
      console.log('Found mobile menu button, clicking...');
      await menuButton.click();
      
      // Wait for menu to animate in
      await page.waitForTimeout(500);
      
      // Take screenshot of opened menu
      console.log('Taking screenshot of opened menu...');
      await page.screenshot({ 
        path: 'screenshots/mobile-menu-test-2-opened.png',
        fullPage: false 
      });
      
      // Try to find overlay and click it
      console.log('Testing overlay close...');
      const overlay = await page.$('[class*="overlay"]');
      if (overlay) {
        await overlay.click();
        await page.waitForTimeout(500);
        
        console.log('Taking screenshot after overlay click...');
        await page.screenshot({ 
          path: 'screenshots/mobile-menu-test-3-after-overlay-click.png',
          fullPage: false 
        });
      }
      
      // Reopen menu to test close button
      await menuButton.click();
      await page.waitForTimeout(500);
      
      // Try to find close button
      console.log('Testing close button...');
      const closeButton = await page.$('[class*="closeButton"]');
      if (closeButton) {
        await closeButton.click();
        await page.waitForTimeout(500);
        
        console.log('Taking screenshot after close button click...');
        await page.screenshot({ 
          path: 'screenshots/mobile-menu-test-4-after-close.png',
          fullPage: false 
        });
      }
      
      // Check for any layout issues
      console.log('Checking for layout issues...');
      
      // Open menu again for final check
      await menuButton.click();
      await page.waitForTimeout(500);
      
      // Check if menu content is visible
      const menuContent = await page.$('[class*="mobileMenu"]');
      if (menuContent) {
        const isVisible = await menuContent.isIntersectingViewport();
        console.log('Menu content visible:', isVisible);
        
        // Check for overlapping elements
        const boundingBox = await menuContent.boundingBox();
        console.log('Menu bounding box:', boundingBox);
      }
      
    } else {
      console.log('Mobile menu button not found!');
    }
    
    console.log('Test completed!');
    
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    await browser.close();
  }
}

testMobileMenu();