import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import ProductCard from '@/components/products/ProductCard';
import FaqAccordion from '@/components/ui/FaqAccordion';
import CtaSection from '@/components/ui/CtaSection';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { PRODUCTS, UPCOMING, getProduct } from '@/data/products';
import { getFaqs } from '@/data/faqs';
import { SITE, absoluteUrl } from '@/data/site';
import JsonLd from '@/components/ui/JsonLd';
import { graph, webPageJsonLd } from '@/lib/seo';

const title = 'Skincare & Lipstick Collection — Paraben & Cruelty Free';
const description =
  'The Elenor collection: Radiance Face Cream with niacinamide, Revive Serum with hyaluronic acid and Velvet Matte Lipstick — paraben free, cruelty free and made in India.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/products' },
  openGraph: { url: '/products', title: `${title} | Elenor`, description },
};

const STEPS = [
  { title: 'Choose a piece', body: 'Read the full ingredients, directions and pack size on each product page.' },
  {
    title: 'Write to us',
    body: 'Send an enquiry from the product page or the contact form — or message us on WhatsApp.',
  },
  { title: 'Hear back personally', body: `A real person replies ${SITE.responseTime} with availability and next steps.` },
];

export default function ProductsPage() {
  const featured = getProduct('elenor-radiance-cream')!;
  const shared = ['Paraben free', 'Cruelty free', 'Made in India', 'Full ingredient lists'];

  return (
    <>
      <JsonLd
        data={graph({
          ...webPageJsonLd('CollectionPage', '/products', title, description),
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: PRODUCTS.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: absoluteUrl(`/products/${p.slug}`),
              name: p.name,
            })),
          },
        })}
      />
      <PageHero
        eyebrow="The Collection"
        title="Three pieces, quietly chosen."
        breadcrumbs={[{ label: 'Products', href: '/products' }]}
        lead="An introduction to the shelf at Elenor — composed for a slow morning, an unhurried evening, the lipstick you reach for without thinking."
      />

      <section className="pb-20 md:pb-24" aria-label="Product list">
        <div className="container-x">
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {PRODUCTS.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 90}>
                <ProductCard product={p} headingLevel="h2" />
              </Reveal>
            ))}
          </ul>
          <ul className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.2em] text-muted" aria-label="Shared standards">
            {shared.map((s) => (
              <li key={s} className="inline-flex items-center gap-2">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured offering */}
      <section className="section-y border-y border-line bg-surface" aria-labelledby="featured-heading">
        <div className="container-x grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-6">
            <div className="image-hover relative aspect-[6/5] overflow-hidden rounded-2xl bg-[#f3e4da]">
              <Image src={featured.images.front.src} alt={featured.images.front.alt} fill sizes="(min-width: 768px) 50vw, 92vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal className="md:col-span-6" delay={100}>
            <SectionHeading
              id="featured-heading"
              eyebrow="In focus"
              title={featured.name}
              align="left"
              lead={
                <>
                  <p className="font-serif text-xl italic text-mauve-deep">{featured.tagline}</p>
                  <p className="mt-4">{featured.longDescription}</p>
                </>
              }
            />
            <dl className="mt-8 grid grid-cols-2 gap-6 text-sm">
              <div>
                <dt className="eyebrow">Size</dt>
                <dd className="mt-2 text-ink">{featured.size}</dd>
              </div>
              <div>
                <dt className="eyebrow">Key ingredients</dt>
                <dd className="mt-2 text-ink">{featured.keyIngredients.slice(0, 2).join(', ')}</dd>
              </div>
            </dl>
            <Link href={`/products/${featured.slug}`} className="btn-primary mt-9">
              Discover {featured.name}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="section-y" aria-labelledby="how-heading">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              id="how-heading"
              eyebrow="A note from the studio"
              title="No prices, no checkout — just a conversation."
              lead="We do not list prices, and we are not selling online. Elenor exists, for now, as a house of stories and sensibility. To ask about availability, write to us directly."
            />
          </Reveal>
          <ol className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 80} className="glass-card rounded-2xl p-7">
                <p className="font-serif text-4xl text-mauve/70">0{i + 1}</p>
                <h3 className="mt-3 font-serif text-2xl text-ink">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Coming soon teaser */}
      <section className="pb-20 md:pb-28" aria-labelledby="next-heading">
        <Reveal className="container-x">
          <div className="glass-card grid grid-cols-1 items-center gap-8 overflow-hidden rounded-3xl p-6 md:grid-cols-2 md:p-10">
            <div className="grid grid-cols-2 gap-3">
              {UPCOMING.map((u) => (
                <div key={u.slug} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-line/40">
                  <Image src={u.image.src} alt={u.image.alt} fill sizes="(min-width: 768px) 22vw, 45vw" className="object-cover" />
                </div>
              ))}
            </div>
            <div>
              <SectionHeading
                id="next-heading"
                eyebrow="Next chapter"
                title="Four pieces in the making."
                align="left"
                lead="An Eau de Parfum, a new lipstick and two serums — quietly composed, almost ready for the shelf."
              />
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/lookbook#coming-soon" className="btn-primary">
                  See what&rsquo;s coming
                </Link>
                <Link href="/notify-me" className="btn-secondary">
                  Notify me
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="pb-20 md:pb-28" aria-labelledby="products-faq-heading">
        <div className="container-x max-w-4xl">
          <SectionHeading id="products-faq-heading" eyebrow="Questions" title="About the collection." />
          <FaqAccordion className="mt-12" items={getFaqs(['buy-online', 'cruelty-free', 'made-where', 'ingredients', 'routine'])} />
        </div>
      </section>

      <CtaSection
        eyebrow="Enquiries"
        title="Ask about availability."
        body={`Tell us which piece you are interested in and we will reply ${SITE.responseTime}.`}
        primary={{ href: '/contact?topic=availability', label: 'Make an enquiry' }}
        secondary={{ href: '/lookbook', label: 'Browse the Lookbook' }}
      />
    </>
  );
}
