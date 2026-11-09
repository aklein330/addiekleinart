import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const imagePath = z.string();

const artworks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artworks' }),
  schema: z.object({
    title: z.string(),
    image: imagePath,
    alt: z.string(),
    year: z.number().nullish(),
    medium: z.string().nullish(),
    dimensions: z.string().nullish(),
    category: z.enum(['landscape', 'animal', 'otherworldly']),
    visible: z.boolean().default(true),
    featured: z.boolean().default(false),
    order: z.number().default(100),
    status: z.enum(['available', 'sold', 'nfs']).nullish(),
    price: z.number().nullish(),
    prints: z.boolean().default(false),
  }),
});

const exhibitions = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/exhibitions' }),
  schema: z.object({
    title: z.string(),
    venue: z.string(),
    venueUrl: z.string().url().nullish().or(z.literal('')),
    city: z.string(),
    start: z.coerce.date(),
    end: z.coerce.date().nullish(),
    type: z.enum(['solo', 'group', 'fair']),
    url: z.string().url().nullish().or(z.literal('')),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    portrait: imagePath,
    portraitAlt: z.string(),
    caption: z.string().nullish(),
    lede: z.string().nullish(),
  }),
});

export const collections = { artworks, exhibitions, pages };
