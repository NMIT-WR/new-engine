const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testThemeToggle() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('Opening http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  // Create screenshots directory if it doesn't exist
  const screenshotsDir = path.join(__dirname, '../screenshots/theme-test');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  
  // Test 1: Check initial theme state
  console.log('\n1. Checking initial theme state...');
  const initialTheme = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });
  console.log(`Initial theme: ${initialTheme}`);
  
  // Take screenshot of initial state
  await page.screenshot({ 
    path: path.join(screenshotsDir, `1-initial-${initialTheme}.png`),
    fullPage: true 
  });
  
  // Test 2: Check theme toggle position
  console.log('\n2. Checking theme toggle switch position...');
  const toggleState = await page.evaluate(() => {
    // The switch is rendered as a span with data attributes
    const toggle = document.querySelector('span[data-state]');
    if (!toggle) return 'Toggle not found';
    return {
      dataState: toggle.getAttribute('data-state'),
      parentLabel: toggle.closest('label') ? 'Has parent label' : 'No parent label'
    };
  });
  console.log('Toggle state:', toggleState);
  
  // Test 3: Click the toggle multiple times
  console.log('\n3. Testing toggle clicks...');
  
  for (let i = 1; i <= 4; i++) {
    console.log(`\nClick ${i}:`);
    
    // Click the toggle - click the parent label which contains the switch
    await page.click('label:has(span[data-state])');
    await page.waitForTimeout(500); // Wait for transition
    
    // Check new theme
    const currentTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    });
    
    // Check toggle state
    const currentToggleState = await page.evaluate(() => {
      const toggle = document.querySelector('span[data-state]');
      return {
        dataState: toggle.getAttribute('data-state')
      };
    });
    
    console.log(`Theme after click: ${currentTheme}`);
    console.log('Toggle state:', currentToggleState);
    
    // Take screenshot
    await page.screenshot({ 
      path: path.join(screenshotsDir, `3-click-${i}-${currentTheme}.png`),
      fullPage: false 
    });
  }
  
  // Test 4: Check localStorage
  console.log('\n4. Checking localStorage...');
  const localStorage = await page.evaluate(() => {
    return {
      theme: window.localStorage.getItem('theme'),
      allKeys: Object.keys(window.localStorage)
    };
  });
  console.log('localStorage:', localStorage);
  
  // Test 5: Refresh and check persistence
  console.log('\n5. Testing theme persistence after refresh...');
  const themeBeforeRefresh = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });
  
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForTimeout(1000);
  
  const themeAfterRefresh = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });
  
  console.log(`Theme before refresh: ${themeBeforeRefresh}`);
  console.log(`Theme after refresh: ${themeAfterRefresh}`);
  console.log(`Persistence: ${themeBeforeRefresh === themeAfterRefresh ? 'SUCCESS' : 'FAILED'}`);
  
  await page.screenshot({ 
    path: path.join(screenshotsDir, `5-after-refresh-${themeAfterRefresh}.png`),
    fullPage: true 
  });
  
  // Test 6: Check console errors
  console.log('\n6. Checking for console errors...');
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // Do a few more clicks to trigger any potential errors
  await page.click('label:has(span[data-state])');
  await page.waitForTimeout(500);
  await page.click('label:has(span[data-state])');
  await page.waitForTimeout(500);
  
  if (consoleErrors.length > 0) {
    console.log('Console errors found:');
    consoleErrors.forEach(err => console.log(`  - ${err}`));
  } else {
    console.log('No console errors detected.');
  }
  
  // Test 7: Visual consistency check
  console.log('\n7. Checking visual consistency...');
  
  // Set to light theme
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    window.localStorage.setItem('theme', 'light');
  });
  await page.waitForTimeout(500);
  
  const lightThemeColors = await page.evaluate(() => {
    const computedStyle = window.getComputedStyle(document.documentElement);
    return {
      background: computedStyle.getPropertyValue('--color-bg-canvas'),
      text: computedStyle.getPropertyValue('--color-fg-primary'),
      bgActual: window.getComputedStyle(document.body).backgroundColor
    };
  });
  
  // Set to dark theme
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    window.localStorage.setItem('theme', 'dark');
  });
  await page.waitForTimeout(500);
  
  const darkThemeColors = await page.evaluate(() => {
    const computedStyle = window.getComputedStyle(document.documentElement);
    return {
      background: computedStyle.getPropertyValue('--color-bg-canvas'),
      text: computedStyle.getPropertyValue('--color-fg-primary'),
      bgActual: window.getComputedStyle(document.body).backgroundColor
    };
  });
  
  console.log('Light theme colors:', lightThemeColors);
  console.log('Dark theme colors:', darkThemeColors);
  
  // Final screenshots
  await page.screenshot({ 
    path: path.join(screenshotsDir, '7-final-dark.png'),
    fullPage: true 
  });
  
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
  });
  await page.waitForTimeout(500);
  
  await page.screenshot({ 
    path: path.join(screenshotsDir, '7-final-light.png'),
    fullPage: true 
  });
  
  console.log('\n✅ Theme toggle testing complete!');
  console.log(`Screenshots saved to: ${screenshotsDir}`);
  
  await browser.close();
}

testThemeToggle().catch(console.error);