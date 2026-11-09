import { getCollection } from 'astro:content';
import { resolveImage } from './images';

export async function getArtworks() {
  const all = await getCollection('artworks', (entry) => entry.data.visible);
  return all
    .map((entry) => ({ ...entry, data: { ...entry.data, image: resolveImage(entry.data.image) } }))
    .sort((a, b) => a.data.order - b.data.order || (b.data.year ?? 0) - (a.data.year ?? 0));
}

export type Artwork = Awaited<ReturnType<typeof getArtworks>>[number];

export const categoryLabel = { landscape: 'Landscapes', animal: 'Animals', otherworldly: 'Otherworldly' } as const;

export const statusLabel = { available: 'Available', sold: 'Sold', nfs: 'Not available' } as const;

export const formatPrice = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
