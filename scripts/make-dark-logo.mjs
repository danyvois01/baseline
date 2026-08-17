/**
 * Generates the dark-mode logo variant: navy pixels become white,
 * the lime tennis ball and underline stay untouched.
 *
 * Usage: node scripts/make-dark-logo.mjs
 * Output: public/logo_new_crop_dark.png
 */
import sharp from "sharp";

const SRC = "public/logo_new_crop.png";
const OUT = "public/logo_new_crop_dark.png";

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  const g = data[i + 1];
  const b = data[i + 2];
  const a = data[i + 3];
  if (a === 0) continue;

  // Lime pixels (#DFFF00-ish): green channel dominates blue by far — keep.
  const isLime = g > 140 && g > b + 60;
  if (isLime) continue;

  // Everything else (navy mark, navy/gray text, antialiased edges) → white,
  // preserving the alpha channel so edges stay smooth.
  data[i] = 255;
  data[i + 1] = 255;
  data[i + 2] = 255;
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toFile(OUT);

console.log(`Wrote ${OUT} (${info.width}x${info.height})`);
