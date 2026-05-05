import puppeteer from 'puppeteer';
const url = process.argv[2];
const out = process.argv[3];
const w   = Number(process.argv[4]);
const h   = w <= 480 ? 800 : w <= 800 ? 1024 : 900;
const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: w, height: h, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
// Force lazy-loaded images to start by rewriting loading=eager and walking the DOM
await page.evaluate(() => {
  document.querySelectorAll('img[loading="lazy"]').forEach(img => img.loading = 'eager');
});
// Scroll all the way down then back up
await page.evaluate(async () => {
  await new Promise((res) => {
    let y = 0; const step = 400;
    const id = setInterval(() => {
      window.scrollTo(0, y); y += step;
      if (y > document.body.scrollHeight + 500) { clearInterval(id); res(); }
    }, 40);
  });
  window.scrollTo(0, 0);
});
// Wait for every <img> to have completed loading (or timeout 8s)
await page.evaluate(() => Promise.race([
  Promise.all([...document.images].map(i => i.complete ? Promise.resolve() : new Promise(r => { i.onload = r; i.onerror = r; }))),
  new Promise(r => setTimeout(r, 8000))
]));
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(out);
