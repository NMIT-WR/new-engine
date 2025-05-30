const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport for consistent screenshots
  await page.setViewport({ width: 1280, height: 800 });
  
  try {
    // 1. Navigate to products page
    console.log('Navigating to http://localhost:3000/products...');
    await page.goto('http://localhost:3000/products', { waitUntil: 'networkidle2' });
    
    // 2. Take initial screenshot
    await page.screenshot({ path: 'screenshots/products-initial.png', fullPage: true });
    console.log('Initial screenshot saved: screenshots/products-initial.png');
    
    // Count initial products
    const initialCount = await page.$$eval('[data-testid="product-card"]', cards => cards.length);
    console.log(`Initial product count: ${initialCount}`);
    
    // 3. Click Summer Collection checkbox
    console.log('Clicking Summer Collection checkbox...');
    await page.click('#category-summer-collection');
    
    // 4. Wait for update and screenshot
    await page.waitForTimeout(500); // Give time for filter to apply
    await page.screenshot({ path: 'screenshots/products-summer-filtered.png', fullPage: true });
    console.log('Summer filtered screenshot saved: screenshots/products-summer-filtered.png');
    
    // 5. Count visible products after summer filter
    const summerCount = await page.$$eval('[data-testid="product-card"]', cards => cards.length);
    console.log(`Summer Collection product count: ${summerCount}`);
    
    // 6. Uncheck Summer and check Winter
    console.log('Unchecking Summer Collection...');
    await page.click('#category-summer-collection');
    await page.waitForTimeout(300);
    
    console.log('Checking Winter Collection checkbox...');
    await page.click('#category-winter-collection');
    
    // 7. Wait and screenshot
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/products-winter-filtered.png', fullPage: true });
    console.log('Winter filtered screenshot saved: screenshots/products-winter-filtered.png');
    
    // 8. Count winter products
    const winterCount = await page.$$eval('[data-testid="product-card"]', cards => cards.length);
    console.log(`Winter Collection product count: ${winterCount}`);
    
    // Final summary
    console.log('\n=== SUMMARY ===');
    console.log(`All products: ${initialCount}`);
    console.log(`Summer Collection: ${summerCount}`);
    console.log(`Winter Collection: ${winterCount}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();