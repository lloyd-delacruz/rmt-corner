import puppeteer from 'puppeteer';
import { mkdir, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';

// usage: node scripts/screenshot.mjs <url> [label] [width]
const url    = process.argv[2];
const label  = process.argv[3];
const width  = Number(process.argv[4]) || 1280;
const height = width <= 480 ? 800 : width <= 800 ? 1024 : 900;

if (!url) {
  console.error('usage: node scripts/screenshot.mjs <url> [label] [width]');
  process.exit(1);
}

const OUT_DIR = resolve(import.meta.dirname, '..', 'temporary screenshots');
await mkdir(OUT_DIR, { recursive: true });

const existing = await readdir(OUT_DIR);
const nums = existing.map(f => f.match(/^screenshot-(\d+)/)).filter(Boolean).map(m => Number(m[1]));
const next = nums.length ? Math.max(...nums) + 1 : 1;

const tag = [label, `${width}w`].filter(Boolean).join('-');
const filename = tag ? `screenshot-${next}-${tag}.png` : `screenshot-${next}.png`;
const outPath = join(OUT_DIR, filename);

const browser = await puppeteer.launch({ headless: 'new' });
try {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: outPath, fullPage: true });
  console.log(outPath);
} finally {
  await browser.close();
}
