import puppeteer from 'puppeteer';
import { mkdir, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const url = process.argv[2] || 'http://localhost:3000/';
const OUT_DIR = resolve(import.meta.dirname, '..', 'temporary screenshots');
await mkdir(OUT_DIR, { recursive: true });
const existing = await readdir(OUT_DIR);
const nums = existing.map(f => f.match(/^screenshot-(\d+)/)).filter(Boolean).map(m => Number(m[1]));
const next = nums.length ? Math.max(...nums) + 1 : 1;
const outPath = join(OUT_DIR, `screenshot-${next}-r2-m-burger-open-375w.png`);

const browser = await puppeteer.launch({ headless: 'new' });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 800, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 600));
  await page.click('.nav-burger');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: outPath, fullPage: false });
  console.log(outPath);
} finally { await browser.close(); }
