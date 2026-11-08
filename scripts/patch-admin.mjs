import { readFile, writeFile } from 'node:fs/promises';

const file = new URL('../public/admin/index.html', import.meta.url);
const marker = 'id="netlify-badge-position"';
const style = `<style ${marker}>#nl-badge-frame{right:auto!important;left:0!important}</style>`;

const html = await readFile(file, 'utf8');
if (html.includes(marker)) {
  console.log('admin page already patched');
} else {
  if (!html.includes('</head>')) throw new Error('No </head> in admin page');
  await writeFile(file, html.replace('</head>', `${style}</head>`));
  console.log('moved Netlify badge to the left on the admin page');
}
