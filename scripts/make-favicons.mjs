import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const [src, outDir] = process.argv.slice(2);
const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;

let minX = width, maxX = 0, minY = height, maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 3;
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    if (g > 150 && g - r > 60 && b > 100) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }
}

const cx = (minX + maxX) / 2;
const cy = maxY - (maxX - minX) / 2;
const r = (maxX - minX) / 2;
console.log({ minX, maxX, minY, maxY, cx, cy, r });

const size = Math.round(r * 2);
const left = Math.round(cx - r);
const top = Math.round(cy - r);
const pad = (n) => Math.max(0, n);
const extend = { top: pad(-top), left: pad(-left), bottom: pad(top + size - height), right: pad(left + size - width) };

const square = await sharp(src)
  .removeAlpha()
  .extend({ ...extend, background: '#ffffff' })
  .extract({ left: left + extend.left, top: top + extend.top, width: size, height: size })
  .toBuffer();

const mask = Buffer.from(
  `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`,
);
const round = await sharp(square).ensureAlpha().composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();

const png = (s) => sharp(round).resize(s, s).png().toBuffer();
await sharp(await png(512)).toFile(`${outDir}/icon-512.png`);
await sharp(await png(192)).toFile(`${outDir}/icon-192.png`);
await sharp(round).resize(160, 160).extend({ top: 10, bottom: 10, left: 10, right: 10, background: '#ffffff' }).flatten({ background: '#ffffff' }).png().toFile(`${outDir}/apple-touch-icon.png`);

const icoSizes = [16, 32, 48];
const images = await Promise.all(icoSizes.map(png));
const header = Buffer.alloc(6 + 16 * images.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = header.length;
images.forEach((img, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(icoSizes[i], e);
  header.writeUInt8(icoSizes[i], e + 1);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(img.length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += img.length;
});
await writeFile(`${outDir}/favicon.ico`, Buffer.concat([header, ...images]));
await sharp(round).resize(64, 64).png().toFile('/tmp/favicon-check-64.png');
await sharp(await png(32)).resize(128, 128, { kernel: 'nearest' }).png().toFile('/tmp/favicon-check-32.png');
console.log('done');
