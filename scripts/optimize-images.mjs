/**
 * Copies images from /images → /public/images with canonical names,
 * compresses to JPEG (quality 80) and resizes to max dimensions per slot.
 * Run once: node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import { copyFile, mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, "../images");
const DEST = path.resolve(__dirname, "../public/images");

// source filename → { dest, maxWidth, maxHeight, quality }
const SLOTS = [
  // Hero
  { src: "hero.jpg",               dest: "hero-main.jpg",               maxW: 1600, maxH: 900,  q: 82 },
  // Owner portrait
  { src: "owner-portrait.jpg",     dest: "owner-portrait.jpg",          maxW: 800,  maxH: 1000, q: 82 },
  // Cuts
  { src: "modernBob.jpg",          dest: "gallery-cut-01.jpg",          maxW: 800,  maxH: 1000, q: 80 },
  { src: "curtainBang.jpg",        dest: "gallery-cut-02.jpg",          maxW: 800,  maxH: 1000, q: 80 },
  { src: "texturedCrop.jpg",       dest: "gallery-cut-03.jpg",          maxW: 800,  maxH: 1000, q: 80 },
  { src: "Longlayers.jpg",         dest: "gallery-cut-04.jpg",          maxW: 800,  maxH: 1000, q: 80 },
  // Color
  { src: "richBrunette.jpg",       dest: "gallery-color-01.jpg",        maxW: 800,  maxH: 1000, q: 80 },
  { src: "copperRedHair.jpg",      dest: "gallery-color-02.jpg",        maxW: 800,  maxH: 1000, q: 80 },
  { src: "PlatBlone.jpg",          dest: "gallery-color-03.jpg",        maxW: 800,  maxH: 1000, q: 80 },
  { src: "DimensonalBrunette.jpg", dest: "gallery-color-04.jpg",        maxW: 800,  maxH: 1000, q: 80 },
  // Balayage
  { src: "beachyBronde.jpg",       dest: "gallery-balayage-01.jpg",     maxW: 800,  maxH: 1000, q: 80 },
  { src: "MoneyPiece.jpg",         dest: "gallery-balayage-02.jpg",     maxW: 800,  maxH: 1000, q: 80 },
  { src: "sombeGradient.jpg",      dest: "gallery-balayage-03.jpg",     maxW: 800,  maxH: 1000, q: 80 },
  { src: "babyLights.jpg",         dest: "gallery-balayage-04.jpg",     maxW: 800,  maxH: 1000, q: 80 },
  // Extensions
  { src: "extensionLength.jpg",    dest: "gallery-extensions-01.jpg",   maxW: 800,  maxH: 1000, q: 80 },
  { src: "volLengthExtension.jpg", dest: "gallery-extensions-02.jpg",   maxW: 800,  maxH: 1000, q: 80 },
  // Updos
  { src: "romanticUpdo.jpg",       dest: "gallery-updo-01.jpg",         maxW: 800,  maxH: 1000, q: 80 },
  { src: "sleekUpdo.jpg",          dest: "gallery-updo-02.jpg",         maxW: 800,  maxH: 1000, q: 80 },
];

await mkdir(DEST, { recursive: true });

let totalBefore = 0;
let totalAfter = 0;

for (const slot of SLOTS) {
  const srcPath  = path.join(SRC, slot.src);
  const destPath = path.join(DEST, slot.dest);

  const { size: before } = await import("fs").then(fs =>
    fs.promises.stat(srcPath).catch(() => ({ size: 0 }))
  );

  if (!before) {
    console.warn(`  SKIP (not found): ${slot.src}`);
    continue;
  }

  await sharp(srcPath)
    .resize({ width: slot.maxW, height: slot.maxH, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: slot.q, mozjpeg: true })
    .toFile(destPath);

  const { size: after } = await import("fs").then(fs => fs.promises.stat(destPath));
  const saved = Math.round((1 - after / before) * 100);
  console.log(`  ✓ ${slot.dest.padEnd(30)} ${Math.round(before/1024)}KB → ${Math.round(after/1024)}KB  (${saved}% smaller)`);

  totalBefore += before;
  totalAfter  += after;
}

const totalSaved = Math.round((1 - totalAfter / totalBefore) * 100);
console.log(`\n  Total: ${Math.round(totalBefore/1024)}KB → ${Math.round(totalAfter/1024)}KB  (${totalSaved}% reduction)\n`);
