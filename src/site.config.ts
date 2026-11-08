import settings from './content/settings/site.json';

export const site = settings;

export const nav = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
  { href: '/exhibitions', label: 'Exhibitions' },
  ...(site.shopEnabled ? [{ href: '/shop', label: 'Shop' }] : []),
  { href: '/contact', label: 'Contact' },
];
