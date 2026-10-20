import { PRODUCTS, UPCOMING } from './products';

export type GalleryCategory = 'collection' | 'coming-soon' | 'studio';

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  category: GalleryCategory;
  href?: string;
}

export const GALLERY_CATEGORIES: { id: GalleryCategory; label: string }[] = [
  { id: 'collection', label: 'The Collection' },
  { id: 'coming-soon', label: 'Coming soon' },
  { id: 'studio', label: 'Studio' },
];

const studio: GalleryItem[] = [
  {
    id: 'studio-marble-tray',
    src: '/images/studio/marble-tray.webp',
    alt: 'Elenor moisturising cream, ampoule and toner arranged on a marble tray with dried branches and soft linen',
    caption: 'A morning shelf — cream, ampoule and toner on marble.',
    width: 1402,
    height: 1122,
    category: 'studio',
  },
  {
    id: 'studio-delivery',
    src: '/images/studio/delivery-hallway.webp',
    alt: 'Open Elenor delivery box with skincare in a sunlit hallway beside greenery and a linen-draped armchair',
    caption: 'Unboxed in the hallway light.',
    width: 1402,
    height: 1122,
    category: 'studio',
  },
  {
    id: 'studio-parfum-plinth',
    src: '/images/studio/parfum-plinth.webp',
    alt: 'Elenor Eau de Parfum bottle with a faceted gold cap on a stone plinth with dried blossoms and silk',
    caption: 'Glass, paper, ink, weight — the details, kept.',
    width: 1209,
    height: 1301,
    category: 'studio',
  },
];

const collection: GalleryItem[] = PRODUCTS.flatMap((p) => [
  {
    id: `${p.slug}-front`,
    ...p.images.front,
    caption: `${p.name} — ${p.tagline}`,
    category: 'collection' as const,
    href: `/products/${p.slug}`,
  },
  {
    id: `${p.slug}-back`,
    ...p.images.back,
    caption: `${p.name} — on the reverse`,
    category: 'collection' as const,
    href: `/products/${p.slug}`,
  },
]);

const comingSoon: GalleryItem[] = UPCOMING.map((u) => ({
  id: `upcoming-${u.slug}`,
  ...u.image,
  caption: `${u.name} — coming soon`,
  category: 'coming-soon' as const,
  href: `/notify-me/${u.slug}`,
}));

// Interleaved so the unfiltered grid reads as an edit rather than a list.
export const GALLERY: GalleryItem[] = [
  studio[0],
  collection[0],
  comingSoon[0],
  collection[2],
  studio[2],
  collection[4],
  comingSoon[2],
  studio[1],
  collection[1],
  comingSoon[3],
  collection[3],
  comingSoon[1],
  collection[5],
];
