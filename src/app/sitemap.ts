import type { MetadataRoute } from 'next';
import { PRODUCTS, UPCOMING } from '@/data/products';
import { GALLERY } from '@/data/gallery';
import { getActiveOffers } from '@/data/offers';
import { POLICY_UPDATED_ISO, absoluteUrl } from '@/data/site';

// Bump when page content changes meaningfully; search engines use it to
// prioritise recrawling, so it should not change on every build.
const CONTENT_UPDATED = '2026-10-20';

type Entry = {
  path: string;
  priority: number;
  changeFrequency: 'weekly' | 'monthly' | 'yearly';
  images?: string[];
  lastModified?: string;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Entry[] = [
    { path: '/', priority: 1, changeFrequency: 'weekly', images: ['/images/posters/hero.webp', ...PRODUCTS.map((p) => p.images.front.src)] },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly', images: ['/images/studio/marble-tray.webp', '/images/studio/delivery-hallway.webp', '/images/studio/parfum-plinth.webp'] },
    { path: '/products', priority: 0.9, changeFrequency: 'weekly', images: PRODUCTS.map((p) => p.images.front.src) },
    ...PRODUCTS.map((p) => ({
      path: `/products/${p.slug}`,
      priority: 0.9,
      changeFrequency: 'monthly' as const,
      images: [p.images.front.src, p.images.back.src],
    })),
    { path: '/lookbook', priority: 0.7, changeFrequency: 'monthly', images: GALLERY.map((g) => g.src) },
    { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.7, changeFrequency: 'yearly' },
    { path: '/notify-me', priority: 0.5, changeFrequency: 'monthly' },
    ...UPCOMING.map((u) => ({ path: `/notify-me/${u.slug}`, priority: 0.5, changeFrequency: 'monthly' as const, images: [u.image.src] })),
    ...(getActiveOffers().length ? [{ path: '/offers', priority: 0.6, changeFrequency: 'weekly' as const }] : []),
    { path: '/privacy-policy', priority: 0.2, changeFrequency: 'yearly', lastModified: POLICY_UPDATED_ISO },
    { path: '/terms-and-conditions', priority: 0.2, changeFrequency: 'yearly', lastModified: POLICY_UPDATED_ISO },
  ];

  return pages.map((p) => ({
    url: absoluteUrl(p.path),
    lastModified: p.lastModified ?? CONTENT_UPDATED,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
    ...(p.images ? { images: p.images.map((src) => absoluteUrl(src)) } : {}),
  }));
}
