/**
 * One-off: convert the generated festive hero PNG into responsive WebP.
 *
 * The source is 1672x941, so nothing is generated wider than native —
 * upscaling an AI render adds no real detail and costs bytes for nothing.
 *
 * Run: node scripts/convert-hero.mjs
 */

import sharp from "sharp";
import { mkdir, unlink, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "Diwali Night_ Lights, Likes, and Celebration.png");
const OUT = path.join(ROOT, "public", "hero");

const WIDTHS = [
  { w: 768, q: 72 },
  { w: 1200, q: 76 },
  { w: 1672, q: 80 },
];

await mkdir(OUT, { recursive: true });

const meta = await sharp(SRC).metadata();
console.log(
  `source: ${meta.width}x${meta.height} (${Math.round(
    (await stat(SRC)).size / 1024,
  )} KB)`,
);

for (const { w, q } of WIDTHS) {
  if (w > meta.width) {
    console.log(`skip ${w}w - wider than native`);
    continue;
  }
  const file = path.join(OUT, `festive-${w}.webp`);
  await sharp(SRC).resize({ width: w }).webp({ quality: q }).toFile(file);
  console.log(`${w}w -> ${(await stat(file)).size / 1024} KB`);
}

// Poster used as the placeholder / low-priority background.
const lqip = path.join(OUT, "festive-lqip.webp");
await sharp(SRC)
  .resize({ width: 20 })
  .webp({ quality: 40 })
  .toFile(lqip);
console.log(`lqip -> ${(await stat(lqip)).size / 1024} KB`);