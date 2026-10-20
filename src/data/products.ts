// ─── Products ────────────────────────────────────────────────────────────────
// Copy comes from the live Elenor catalogue; ingredients, directions, sizes and
// claims are transcribed from the product packaging photography.

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Product {
  slug: string;
  name: string;
  /** Search-facing title and description (kept factual — no unverified claims). */
  seoTitle: string;
  seoDescription: string;
  category: 'Skincare' | 'Lip';
  format: string;
  tagline: string;
  description: string;
  longDescription: string;
  packagingNote: string;
  size: string;
  keyIngredients: string[];
  ingredients: string;
  directions?: string;
  claims: string[];
  origin: string;
  care: string;
  images: { front: ProductImage; back: ProductImage };
}

export const PRODUCTS: Product[] = [
  {
    slug: 'elenor-radiance-cream',
    name: 'Radiance Face Cream',
    seoTitle: 'Radiance Face Cream with Niacinamide & Hyaluronic Acid',
    seoDescription:
      'Elenor Radiance Face Cream (50 g): a lightweight daily face cream with niacinamide and hyaluronic acid. Paraben free, cruelty free, dermatologically tested, made in India.',
    category: 'Skincare',
    format: 'Day cream',
    tagline: 'Brighten · Nourish · Glow',
    description:
      'A weightless day cream with niacinamide and hyaluronic acid for a quietly lit complexion.',
    longDescription:
      'Radiance Face Cream is composed in small batches with niacinamide, low-molecular hyaluronic acid and a soft cushion of glycerin. It absorbs without residue and leaves a faint, powdered luminosity beneath makeup.',
    packagingNote:
      'Enriched with niacinamide and hyaluronic acid, this lightweight cream deeply nourishes, brightens and reveals naturally glowing skin.',
    size: '50 g / 1.76 oz',
    keyIngredients: ['Niacinamide', 'Hyaluronic acid', 'Glycerin', 'Allantoin'],
    ingredients:
      'Aqua, Glycerin, Niacinamide, Cetearyl Olivate, Sorbitan Olivate, Caprylic/Capric Triglyceride, Hyaluronic Acid, Dimethicone, Carbomer, Allantoin, Phenoxyethanol, Ethylhexylglycerin, Fragrance.',
    directions: 'Apply a small amount on clean face and neck. Use daily.',
    claims: ['Paraben free', 'Cruelty free', 'Dermatologically tested'],
    origin: 'Made in India',
    care: 'For external use only. Store in a cool, dry place.',
    images: {
      front: {
        src: '/images/products/radiance-cream-front.webp',
        alt: 'Elenor Radiance Face Cream — frosted glass jar with gold lid',
        width: 1378,
        height: 1141,
      },
      back: {
        src: '/images/products/radiance-cream-back.webp',
        alt: 'Back of the Radiance Face Cream jar showing directions and the full ingredient list',
        width: 1364,
        height: 1153,
      },
    },
  },
  {
    slug: 'elenor-revive-serum',
    name: 'Revive Serum',
    seoTitle: 'Revive Serum with Niacinamide, Hyaluronic Acid & Panthenol',
    seoDescription:
      'Elenor Revive Serum (30 ml): a hydrating face serum with niacinamide, hyaluronic acid and panthenol. Paraben free, cruelty free, dermatologically tested, made in India.',
    category: 'Skincare',
    format: 'Serum',
    tagline: 'Hydrate · Repair · Renew',
    description:
      'A reparative serum of niacinamide, hyaluronic acid and panthenol for a smooth, youthful glow.',
    longDescription:
      'Revive Serum is a powerful blend of actives that hydrates, repairs and revitalises the skin. Panthenol soothes, niacinamide refines, hyaluronic acid softens.',
    packagingNote:
      'A powerful blend of actives that hydrates, repairs and revitalises skin for a smooth, youthful glow.',
    size: '30 ml / 1.01 fl. oz.',
    keyIngredients: ['Niacinamide', 'Hyaluronic acid', 'Panthenol', 'Sodium hyaluronate'],
    ingredients:
      'Aqua, Propanediol, Glycerin, Niacinamide, Hyaluronic Acid, Panthenol, Allantoin, Sodium Hyaluronate, Phenoxyethanol, Ethylhexylglycerin, Fragrance.',
    directions: 'Apply 2–3 drops on clean skin and gently pat until absorbed. Use daily.',
    claims: ['Paraben free', 'Cruelty free', 'Dermatologically tested'],
    origin: 'Made in India',
    care: 'For external use only. Store in a cool, dry place.',
    images: {
      front: {
        src: '/images/products/revive-serum-front.webp',
        alt: 'Elenor Revive Serum — frosted dropper bottle with brushed gold collar',
        width: 1122,
        height: 1402,
      },
      back: {
        src: '/images/products/revive-serum-back.webp',
        alt: 'Back of the Revive Serum bottle showing directions and the full ingredient list',
        width: 1122,
        height: 1402,
      },
    },
  },
  {
    slug: 'elenor-velvet-lipstick',
    name: 'Velvet Matte Lipstick',
    seoTitle: 'Velvet Matte Lipstick — Long-Wear Nude Matte',
    seoDescription:
      'Elenor Velvet Matte Lipstick (3.5 g): a long-wear matte nude with castor seed oil and candelilla wax. Rich colour, comfort wear. Paraben free, cruelty free, made in India.',
    category: 'Lip',
    format: 'Lipstick',
    tagline: 'Rich Colour · Comfort Wear · Long Lasting',
    description:
      'A long-wear matte in a quiet, sun-warmed nude — comfort and pigment in one slim case.',
    longDescription:
      'Velvet Matte Lipstick is a richly pigmented bullet built on castor seed oil, candelilla wax and a powder finish. Comfort wear, true colour, no transfer at the rim of the cup.',
    packagingNote: 'Rich colour, comfort wear and a long-lasting matte finish.',
    size: 'Net wt. 3.5 g',
    keyIngredients: ['Castor seed oil', 'Candelilla wax', 'Mica'],
    ingredients:
      'Octyldodecanol, Ricinus Communis (Castor) Seed Oil, Candelilla Wax, Euphorbia Cerifera (Candelilla) Wax, Microcrystalline Wax, Mica, Titanium Dioxide, Iron Oxides, Fragrance.',
    claims: ['Paraben free', 'Cruelty free'],
    origin: 'Made in India',
    care: 'For external use only. Store in a cool, dry place.',
    images: {
      front: {
        src: '/images/products/velvet-lipstick-front.webp',
        alt: 'Elenor Velvet Matte Lipstick — blush-rose case with gold trim',
        width: 1123,
        height: 1400,
      },
      back: {
        src: '/images/products/velvet-lipstick-back.webp',
        alt: 'Velvet Matte Lipstick carton showing its claims and the full ingredient list',
        width: 1417,
        height: 1110,
      },
    },
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

// ─── Coming soon ─────────────────────────────────────────────────────────────
export interface UpcomingPiece {
  slug: string;
  name: string;
  label: string;
  description: string;
  image: ProductImage;
}

export const UPCOMING: UpcomingPiece[] = [
  {
    slug: 'eau-de-parfum',
    name: 'Eau de Parfum',
    label: 'Parfum',
    description:
      'Osmanthus and pink pepper folded into a soft, lingering veil — feminine, warm, undeniably hers.',
    image: {
      src: '/images/coming-soon/eau-de-parfum.webp',
      alt: 'Elenor Eau de Parfum flacon with a gold floral cap beside its gift box on a dressing table',
      width: 1800,
      height: 982,
    },
  },
  {
    slug: 'velvet-matte-lipstick',
    name: 'Velvet Matte Lipstick',
    label: 'Lip',
    description:
      'Rich, comfortable colour in a weightless matte finish. Long wearing, never drying — a daily quiet luxury.',
    image: {
      src: '/images/coming-soon/velvet-matte-lipstick.webp',
      alt: 'Elenor lipstick in a deep red shade with a black and gold case on white marble',
      width: 1800,
      height: 1005,
    },
  },
  {
    slug: 'radiant-glow-serum',
    name: 'Radiant Glow Serum',
    label: 'Glow',
    description:
      'A lightweight serum with niacinamide and vitamin E. Brightens, hydrates, and revives a dewy, lit-from-within finish.',
    image: {
      src: '/images/coming-soon/radiant-glow-serum.webp',
      alt: 'Elenor Radiant Glow Serum bottle and carton on a stone plinth with blossom and blush silk',
      width: 1402,
      height: 1122,
    },
  },
  {
    slug: 'anti-aging-serum',
    name: 'Anti-Aging Serum',
    label: 'Renew',
    description:
      'Bakuchiol and peptides in a slow, golden serum — softens fine lines while you sleep, kindly and quietly.',
    image: {
      src: '/images/coming-soon/anti-aging-serum.webp',
      alt: 'Amber Elenor serum bottle on a marble bedside table in soft morning light',
      width: 1800,
      height: 982,
    },
  },
];

export function getUpcoming(slug: string) {
  return UPCOMING.find((p) => p.slug === slug);
}
