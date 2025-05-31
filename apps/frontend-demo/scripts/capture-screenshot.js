const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000/auth/login', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'screenshots/ui-check/auth-login-current.png' });
  await browser.close();
  console.log('Screenshot saved to screenshots/ui-check/auth-login-current.png');
})();