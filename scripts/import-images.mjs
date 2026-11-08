import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { join, parse } from 'node:path';

const [srcDir, destDir, maxEdge = '3200'] = process.argv.slice(2);
await mkdir(destDir, { recursive: true });

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

for (const file of (await readdir(srcDir)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort()) {
  const out = join(destDir, `${slugify(parse(file).name)}.jpg`);
  const info = await sharp(join(srcDir, file))
    .rotate()
    .resize(Number(maxEdge), Number(maxEdge), { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(out);
  console.log(`${file} -> ${out} ${info.width}x${info.height} ${(info.size / 1e6).toFixed(1)}MB`);
}
