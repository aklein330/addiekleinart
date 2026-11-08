import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const [srcDir, outFile] = process.argv.slice(2);
const files = (await readdir(srcDir)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
const cell = 300;
const label = 36;
const cols = 6;
const rows = Math.ceil(files.length / cols);

const tiles = await Promise.all(
  files.map(async (f, i) => {
    const img = await sharp(join(srcDir, f)).rotate().resize(cell, cell, { fit: 'contain', background: '#ffffff' }).toBuffer();
    const meta = await sharp(join(srcDir, f)).metadata();
    const text = Buffer.from(
      `<svg width="${cell}" height="${label}"><rect width="100%" height="100%" fill="#fff"/><text x="6" y="24" font-size="18" font-family="Helvetica">${i + 1}. ${f.replace(/\.\w+$/, '')} ${meta.width}x${meta.height}</text></svg>`,
    );
    const x = (i % cols) * cell;
    const y = Math.floor(i / cols) * (cell + label);
    return [
      { input: img, left: x, top: y },
      { input: text, left: x, top: y + cell },
    ];
  }),
);

await sharp({ create: { width: cols * cell, height: rows * (cell + label), channels: 3, background: '#ffffff' } })
  .composite(tiles.flat())
  .jpeg({ quality: 80 })
  .toFile(outFile);
console.log(files.length, 'images');
