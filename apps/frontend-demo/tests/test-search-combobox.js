const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Set viewport
    await page.setViewport({ width: 1280, height: 720 });
    
    // 1. Navigate to search page
    console.log('1. Navigating to http://localhost:3000/search...');
    await page.goto('http://localhost:3000/search', { waitUntil: 'networkidle2' });
    console.log('✓ Page loaded');
    
    // Take initial screenshot
    await page.screenshot({ path: 'screenshots/search-initial.png' });
    console.log('✓ Initial screenshot taken');
    
    // 2. Find and click the search input
    console.log('\n2. Looking for search input...');
    const searchInput = await page.$('input[type="text"]');
    if (searchInput) {
      console.log('✓ Found search input');
      await searchInput.click();
      console.log('✓ Clicked on search input');
    } else {
      console.log('✗ Could not find search input');
    }
    
    // 3. Type "shirt" into the input
    console.log('\n3. Typing "shirt" into search input...');
    await page.type('input[type="text"]', 'shirt', { delay: 100 });
    console.log('✓ Typed "shirt"');
    
    // Wait a bit for dropdown to appear
    await page.waitForTimeout(500);
    
    // 4. Check if dropdown appears
    console.log('\n4. Checking for dropdown...');
    const dropdown = await page.$('[role="listbox"]');
    if (dropdown) {
      console.log('✓ Dropdown appeared');
      
      // Count dropdown items
      const items = await page.$$('[role="option"]');
      console.log(`✓ Found ${items.length} items in dropdown`);
      
      // Take screenshot with dropdown open
      await page.screenshot({ path: 'screenshots/search-dropdown-open.png' });
      console.log('✓ Screenshot with dropdown taken');
    } else {
      console.log('✗ No dropdown found');
      await page.screenshot({ path: 'screenshots/search-no-dropdown.png' });
    }
    
    // 5. Try to select first item from dropdown
    console.log('\n5. Trying to select first item from dropdown...');
    const firstOption = await page.$('[role="option"]:first-child');
    if (firstOption) {
      const optionText = await page.evaluate(el => el.textContent, firstOption);
      console.log(`✓ Found first option: "${optionText}"`);
      
      await firstOption.click();
      console.log('✓ Clicked first option');
      
      // Wait for any updates
      await page.waitForTimeout(300);
    } else {
      console.log('✗ No options found to click');
    }
    
    // 6. Check final input value
    console.log('\n6. Checking final input value...');
    const finalValue = await page.$eval('input[type="text"]', el => el.value);
    console.log(`✓ Final input value: "${finalValue}"`);
    
    // Take final screenshot
    await page.screenshot({ path: 'screenshots/search-final.png' });
    console.log('✓ Final screenshot taken');
    
    // Additional checks
    console.log('\n7. Additional checks:');
    
    // Check if dropdown is still visible
    const dropdownStillVisible = await page.$('[role="listbox"]');
    console.log(`Dropdown still visible: ${dropdownStillVisible ? 'Yes' : 'No'}`);
    
    // Check for any error messages
    const errorMessages = await page.$$('.text-error-text');
    console.log(`Error messages found: ${errorMessages.length}`);
    
  } catch (error) {
    console.error('Error during test:', error.message);
    await page.screenshot({ path: 'screenshots/search-error.png' });
  } finally {
    await browser.close();
    console.log('\nTest completed');
  }
})();