import puppeteer from 'puppeteer';

const url    = process.argv[2] || 'http://localhost:3000/';
const widths = [375, 390, 768, 1024, 1280, 1440];

const browser = await puppeteer.launch({ headless: 'new' });
try {
  for (const w of widths) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    const result = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
      bodyW:   document.body.scrollWidth,
    }));
    const overflow = result.scrollW > result.clientW;
    console.log(`w=${w}\tscrollW=${result.scrollW} clientW=${result.clientW} bodyW=${result.bodyW}\t${overflow ? '⚠ HORIZONTAL OVERFLOW' : 'ok'}`);
    await page.close();
  }
} finally {
  await browser.close();
}
