import { defineConfig } from 'astro/config';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const assetsDir = join(process.cwd(), 'src');
const types = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif' };

const serveSrcAssetsInDev = {
  name: 'serve-src-assets-in-dev',
  configureServer(server) {
    server.middlewares.use('/assets', (req, res, next) => {
      const file = normalize(join(assetsDir, 'assets', decodeURIComponent(req.url.split('?')[0])));
      if (!file.startsWith(join(assetsDir, 'assets')) || !existsSync(file) || !statSync(file).isFile()) return next();
      res.setHeader('Content-Type', types[extname(file).toLowerCase()] ?? 'application/octet-stream');
      createReadStream(file).pipe(res);
    });
  },
};

export default defineConfig({
  site: 'https://example.com',
  vite: { plugins: [serveSrcAssetsInDev] },
});
