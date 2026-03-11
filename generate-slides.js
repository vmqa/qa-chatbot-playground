#!/usr/bin/env node
/**
 * Generates 2x retina PNG screenshots for both carousel sets.
 * Run from repo root:  node generate-slides.js
 *
 * Outputs:
 *   ai-pipeline-slide-{1,2,3}.png     — 3-slide set
 *   ai-carousel-slide-{1..6}.png      — 6-slide set
 */

const path = require('path');
const { chromium } = require(path.resolve(__dirname, 'frontend/node_modules/@playwright/test'));

const ROOT = path.resolve(__dirname);

const THREE_SLIDES = [
  'ai-pipeline-slide-1.html',
  'ai-pipeline-slide-2.html',
  'ai-pipeline-slide-3.html',
];

const SIX_SLIDES = [
  'ai-carousel-slide-1.html',
  'ai-carousel-slide-2.html',
  'ai-carousel-slide-3.html',
  'ai-carousel-slide-4.html',
  'ai-carousel-slide-5.html',
  'ai-carousel-slide-6.html',
];

async function capture(context, slides, label) {
  console.log(`\n── ${label} ──`);
  for (const slide of slides) {
    const page = await context.newPage();
    await page.goto(`file://${path.join(ROOT, slide)}`);
    await page.waitForTimeout(400); // let fonts settle
    const out = path.join(ROOT, slide.replace('.html', '.png'));
    await page.screenshot({ path: out });
    console.log(`  ✓  ${slide.replace('.html', '.png')}`);
    await page.close();
  }
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1200, height: 675 },
    deviceScaleFactor: 2, // 2x retina → 2400×1350px, sharp text
  });

  await capture(context, THREE_SLIDES, '3-slide set (ai-pipeline-slide-*)');
  await capture(context, SIX_SLIDES,   '6-slide set (ai-carousel-slide-*)');

  await browser.close();
  console.log('\n✅ All done! Now run:  python3 combine-pdf.py');
})();
