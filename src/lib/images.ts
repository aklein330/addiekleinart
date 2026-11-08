import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}', {
  eager: true,
});

export function resolveImage(path: string): ImageMetadata {
  const image = files[`/src${path.startsWith('/') ? path : `/${path}`}`]?.default;
  if (!image) throw new Error(`Image not found in src/assets: ${path}`);
  return image;
}
