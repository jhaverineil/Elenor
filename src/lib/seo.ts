import { SITE, absoluteUrl } from '@/data/site';
import type { Faq } from '@/data/faqs';

// ─── Structured data (schema.org JSON-LD) ────────────────────────────────────
// Entities share stable @ids so search and answer engines resolve every page
// to the same brand. Only types whose content is visible on the page are used.

export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

export function organizationJsonLd() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    alternateName: 'Maison Elenor',
    url: SITE.url,
    logo: { '@type': 'ImageObject', url: absoluteUrl(SITE.logo.src), width: SITE.logo.width, height: SITE.logo.height },
    image: absoluteUrl(SITE.ogImage),
    description: SITE.description,
    slogan: SITE.tagline,
    email: SITE.pressEmail,
    telephone: `+${SITE.whatsappNumber}`,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: `+${SITE.whatsappNumber}`,
        url: absoluteUrl('/contact'),
        availableLanguage: ['English'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '10:00',
          closes: '19:00',
        },
      },
      { '@type': 'ContactPoint', contactType: 'press', email: SITE.pressEmail },
    ],
    ...(SITE.instagramUrl ? { sameAs: [SITE.instagramUrl] } : {}),
  };
}

export function websiteJsonLd() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE.name,
    alternateName: 'Elenor — A considered edit of beauty',
    url: SITE.url,
    description: SITE.description,
    inLanguage: 'en',
    publisher: { '@id': ORG_ID },
  };
}

type PageType = 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'FAQPage';

export function webPageJsonLd(type: PageType, path: string, name: string, description: string) {
  return {
    '@type': type,
    '@id': `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: 'en',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
  };
}

/** FAQPage markup — use only on the page where the questions are the main content. */
export function faqPageJsonLd(path: string, name: string, description: string, faqs: Faq[]) {
  return {
    ...webPageJsonLd('FAQPage', path, name, description),
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function graph(...nodes: Record<string, unknown>[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
