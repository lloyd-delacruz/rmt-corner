import puppeteer from 'puppeteer';
import { mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const url = process.argv[2] || 'http://localhost:3000/services.html';
const width = Number(process.argv[3]) || 1280;
const OUT_DIR = resolve(import.meta.dirname, '..', 'temporary screenshots');
await mkdir(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({ headless: 'new' });
try {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 500));

  const el = await page.$('.duration-guide');
  if (!el) throw new Error('.duration-guide not found');

  const out = join(OUT_DIR, `duration-${width}w.png`);
  await el.screenshot({ path: out });
  console.log(out);
} finally {
  await browser.close();
}
