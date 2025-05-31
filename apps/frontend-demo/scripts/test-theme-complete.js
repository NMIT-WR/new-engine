const puppeteer = require('puppeteer');

async function testThemeComplete() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('=== THEME TOGGLE COMPLETE TEST ===\n');
  
  // Test 1: Initial load with no localStorage
  console.log('Test 1: Initial load (clean state)');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload({ waitUntil: 'networkidle0' });
  
  let state = await page.evaluate(() => {
    const htmlClasses = document.documentElement.className;
    const localStorage = window.localStorage.getItem('theme');
    const switchChecked = document.querySelector('input[type="checkbox"]')?.checked;
    return { htmlClasses, localStorage, switchChecked };
  });
  console.log('Result:', state);
  console.log(`✓ Clean start: ${!state.localStorage && state.htmlClasses.includes('light') && !state.switchChecked ? '✅' : '❌'}`);
  
  // Test 2: Switch to dark mode
  console.log('\nTest 2: Switch to dark mode');
  await page.click('label input[type="checkbox"]');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  state = await page.evaluate(() => {
    const htmlClasses = document.documentElement.className;
    const localStorage = window.localStorage.getItem('theme');
    const switchChecked = document.querySelector('input[type="checkbox"]')?.checked;
    return { htmlClasses, localStorage, switchChecked };
  });
  console.log('Result:', state);
  console.log(`✓ Dark mode active: ${state.htmlClasses.includes('dark') && state.localStorage === 'dark' && state.switchChecked ? '✅' : '❌'}`);
  
  // Test 3: Refresh in dark mode
  console.log('\nTest 3: Refresh while in dark mode');
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  state = await page.evaluate(() => {
    const htmlClasses = document.documentElement.className;
    const localStorage = window.localStorage.getItem('theme');
    const switchChecked = document.querySelector('input[type="checkbox"]')?.checked;
    return { htmlClasses, localStorage, switchChecked };
  });
  console.log('Result:', state);
  console.log(`✓ Dark mode persisted: ${state.htmlClasses.includes('dark') && state.localStorage === 'dark' && state.switchChecked ? '✅' : '❌'}`);
  
  // Test 4: Switch back to light mode
  console.log('\nTest 4: Switch back to light mode');
  await page.click('label input[type="checkbox"]');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  state = await page.evaluate(() => {
    const htmlClasses = document.documentElement.className;
    const localStorage = window.localStorage.getItem('theme');
    const switchChecked = document.querySelector('input[type="checkbox"]')?.checked;
    return { htmlClasses, localStorage, switchChecked };
  });
  console.log('Result:', state);
  console.log(`✓ Light mode active: ${state.htmlClasses.includes('light') && state.localStorage === 'light' && !state.switchChecked ? '✅' : '❌'}`);
  
  // Test 5: Refresh in light mode
  console.log('\nTest 5: Refresh while in light mode');
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  state = await page.evaluate(() => {
    const htmlClasses = document.documentElement.className;
    const localStorage = window.localStorage.getItem('theme');
    const switchChecked = document.querySelector('input[type="checkbox"]')?.checked;
    return { htmlClasses, localStorage, switchChecked };
  });
  console.log('Result:', state);
  console.log(`✓ Light mode persisted: ${state.htmlClasses.includes('light') && state.localStorage === 'light' && !state.switchChecked ? '✅' : '❌'}`);
  
  // Test 6: Multiple rapid clicks
  console.log('\nTest 6: Rapid toggle clicks');
  for (let i = 0; i < 5; i++) {
    await page.click('label input[type="checkbox"]');
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  state = await page.evaluate(() => {
    const htmlClasses = document.documentElement.className;
    const localStorage = window.localStorage.getItem('theme');
    const switchChecked = document.querySelector('input[type="checkbox"]')?.checked;
    return { htmlClasses, localStorage, switchChecked };
  });
  console.log('Result after 5 clicks:', state);
  console.log(`✓ State consistent: ${(state.htmlClasses.includes('dark') === state.switchChecked) ? '✅' : '❌'}`);
  
  console.log('\n=== ALL TESTS COMPLETE ===');
  
  await browser.close();
}

testThemeComplete().catch(console.error);