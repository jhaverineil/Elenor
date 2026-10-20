// ─── Brand facts ─────────────────────────────────────────────────────────────
// Everything here is published on the live Elenor site. Values that the live
// site only had as placeholders (Instagram profile, WhatsApp number) are read
// from the environment and their UI is hidden until they are configured.

export const SITE = {
  name: 'Elenor',
  tagline: 'A considered edit of beauty',
  description:
    'Elenor — a considered edit of beauty. Curated cosmetic houses and considered formulations.',
  shortDescription: 'A considered edit of beauty. Curated houses, considered formulations.',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://elenorr.netlify.app').replace(/\/$/, ''),
  studio: 'By appointment only',
  hours: 'Mon – Sat, 10:00 – 19:00',
  hoursSentence: 'between 10:00 and 19:00, Monday to Saturday',
  responseTime: 'within one business day',
  pressEmail: 'press@elenor.studio',
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || null,
  // Studio WhatsApp line; the environment variable can override it per deploy.
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+91 99243 96959').replace(/[^\d]/g, ''),
  whatsappDisplay: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+91 99243 96959',
  ogImage: '/images/og-elenor.jpg',
  logo: { src: '/brand/elenor-professional.png', width: 779, height: 520 },
  // Horizontal emblem + wordmark lockup for the navigation, where the full
  // stacked logo's smaller lines would be illegible.
  navLogo: { src: '/brand/elenor-nav.png', width: 672, height: 176 },
} as const;

export const POLICY_UPDATED = '20 October 2026';
export const POLICY_UPDATED_ISO = '2026-10-20';

export function whatsappLink(message = "Hi, I'd like to learn more about Elenor's collection.") {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function absoluteUrl(path = '/') {
  return `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`;
}

// ─── Navigation ──────────────────────────────────────────────────────────────
export interface NavItem {
  href: string;
  label: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/products', label: 'Products' },
  { href: '/lookbook', label: 'Lookbook' },
  { href: '/faq', label: 'FAQ' },
];

export const OFFERS_NAV_ITEM: NavItem = { href: '/offers', label: 'Offers' };
