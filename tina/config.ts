import { defineConfig } from 'tinacms';

const slugify = (value?: string) =>
  (value ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export default defineConfig({
  branch: process.env.TINA_BRANCH || process.env.HEAD || 'main',
  clientId: process.env.TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    publicFolder: 'public',
    outputFolder: 'admin',
  },
  media: {
    tina: {
      publicFolder: 'src',
      mediaRoot: 'assets',
    },
  },
  schema: {
    collections: [
      {
        name: 'artwork',
        label: 'Paintings',
        path: 'src/content/artworks',
        format: 'md',
        ui: {
          filename: { readonly: true, slugify: (values) => slugify(values?.title) },
        },
        defaultItem: () => ({ category: 'animal', order: 100, year: new Date().getFullYear() }),
        fields: [
          { type: 'string', name: 'title', label: 'Title', isTitle: true, required: true },
          { type: 'image', name: 'image', label: 'Image', required: true },
          {
            type: 'string',
            name: 'alt',
            label: 'Image description',
            description: 'A short description of the painting for screen readers and search engines.',
            required: true,
          },
          {
            type: 'string',
            name: 'category',
            label: 'Category',
            options: [
              { value: 'landscape', label: 'Landscape' },
              { value: 'animal', label: 'Animal' },
              { value: 'otherworldly', label: 'Otherworldly' },
            ],
            required: true,
          },
          { type: 'number', name: 'year', label: 'Year' },
          { type: 'string', name: 'medium', label: 'Medium', description: 'e.g. Oil on canvas' },
          { type: 'string', name: 'dimensions', label: 'Size', description: 'e.g. 24 × 36 in' },
          {
            type: 'string',
            name: 'status',
            label: 'Availability',
            options: [
              { value: 'available', label: 'Available' },
              { value: 'sold', label: 'Sold' },
              { value: 'nfs', label: 'Not for sale / private collection' },
            ],
          },
          { type: 'number', name: 'price', label: 'Price (USD)', description: 'Shown when the painting is available.' },
          { type: 'boolean', name: 'prints', label: 'Prints available' },
          { type: 'boolean', name: 'featured', label: 'Feature on home page' },
          {
            type: 'number',
            name: 'order',
            label: 'Sort order',
            description: 'Lower numbers appear first. The first featured painting is the large home page image.',
          },
          { type: 'rich-text', name: 'body', label: 'Notes about this painting', isBody: true },
        ],
      },
      {
        name: 'exhibition',
        label: 'Exhibitions',
        path: 'src/content/exhibitions',
        format: 'json',
        ui: {
          filename: {
            readonly: true,
            slugify: (values) => slugify(`${values?.start?.slice?.(0, 4) ?? ''} ${values?.title ?? ''}`),
          },
        },
        fields: [
          { type: 'string', name: 'title', label: 'Title', isTitle: true, required: true },
          { type: 'string', name: 'venue', label: 'Venue', required: true },
          { type: 'string', name: 'city', label: 'City', required: true },
          { type: 'datetime', name: 'start', label: 'Start date', required: true, ui: { dateFormat: 'MMMM D, YYYY' } },
          { type: 'datetime', name: 'end', label: 'End date', ui: { dateFormat: 'MMMM D, YYYY' } },
          {
            type: 'string',
            name: 'type',
            label: 'Type',
            options: [
              { value: 'solo', label: 'Solo exhibition' },
              { value: 'group', label: 'Group exhibition' },
              { value: 'fair', label: 'Art fair' },
            ],
            required: true,
          },
          { type: 'string', name: 'url', label: 'Link (optional)' },
        ],
      },
      {
        name: 'page',
        label: 'About page',
        path: 'src/content/pages',
        format: 'md',
        match: { include: 'about' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: 'string', name: 'title', label: 'Small heading', required: true },
          { type: 'image', name: 'portrait', label: 'Portrait', required: true },
          { type: 'string', name: 'portraitAlt', label: 'Portrait description', required: true },
          { type: 'string', name: 'caption', label: 'Portrait caption' },
          { type: 'string', name: 'lede', label: 'Intro line', ui: { component: 'textarea' } },
          { type: 'rich-text', name: 'body', label: 'Biography, statement, commissions', isBody: true },
        ],
      },
      {
        name: 'settings',
        label: 'Site settings',
        path: 'src/content/settings',
        format: 'json',
        match: { include: 'site' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: 'string', name: 'artistName', label: 'Artist name', required: true },
          { type: 'string', name: 'tagline', label: 'Tagline', description: 'Shown on the home page.', required: true },
          {
            type: 'string',
            name: 'description',
            label: 'Search description',
            description: 'One sentence shown in Google results.',
            required: true,
          },
          { type: 'string', name: 'email', label: 'Contact email', required: true },
          { type: 'string', name: 'location', label: 'Studio location' },
          { type: 'string', name: 'instagram', label: 'Instagram link' },
          { type: 'boolean', name: 'shopEnabled', label: 'Show the Shop page in the menu' },
        ],
      },
    ],
  },
});
