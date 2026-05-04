import puppeteer from 'puppeteer';
import { mkdir, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';

// usage: node scripts/screenshot-fold.mjs <url> [label] [width] [scrollY]
const url     = process.argv[2];
const label   = process.argv[3];
const width   = Number(process.argv[4]) || 1280;
const scrollY = Number(process.argv[5]) || 0;
const height  = width <= 480 ? 800 : width <= 800 ? 1024 : 900;

if (!url) { console.error('usage: screenshot-fold.mjs <url> [label] [w] [scrollY]'); process.exit(1); }

const OUT_DIR = resolve(import.meta.dirname, '..', 'temporary screenshots');
await mkdir(OUT_DIR, { recursive: true });
const existing = await readdir(OUT_DIR);
const nums = existing.map(f => f.match(/^screenshot-(\d+)/)).filter(Boolean).map(m => Number(m[1]));
const next = nums.length ? Math.max(...nums) + 1 : 1;
const tag = [label, `${width}w`, `y${scrollY}`].filter(Boolean).join('-');
const filename = `screenshot-${next}-${tag}.png`;
const outPath = join(OUT_DIR, filename);

const browser = await puppeteer.launch({ headless: 'new' });
try {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  // Disable smooth-scroll so jumps land instantly
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  await new Promise(r => setTimeout(r, 800));
  if (scrollY) {
    await page.evaluate(y => { window.scrollTo({ top: y, behavior: 'instant' }); }, scrollY);
    await new Promise(r => setTimeout(r, 500));
    const actual = await page.evaluate(() => window.scrollY);
    console.error(`requested y=${scrollY} actual=${actual}`);
  }
  await page.screenshot({ path: outPath, fullPage: false });
  console.log(outPath);
} finally { await browser.close(); }
