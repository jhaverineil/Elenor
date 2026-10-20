import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import CtaSection from '@/components/ui/CtaSection';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import PhilosophyGrid from '@/components/home/PhilosophyGrid';
import ProductCard from '@/components/products/ProductCard';
import { PRODUCTS } from '@/data/products';
import { SITE } from '@/data/site';
import JsonLd from '@/components/ui/JsonLd';
import { graph, webPageJsonLd } from '@/lib/seo';

const title = 'About Elenor — Our Story, Approach & Philosophy';
const description =
  'Elenor began as a notebook of products we kept returning to. Discover our story, our approach to curation and the principles behind every piece.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/about' },
  openGraph: { url: '/about', title, description },
};

// Plain statements of fact — easy for readers, search and answer engines to quote.
const AT_A_GLANCE = [
  { term: 'What Elenor is', detail: 'A quiet beauty studio and a considered edit of beauty: curated houses and considered formulations.' },
  { term: 'The collection', detail: 'Radiance Face Cream, Revive Serum and Velvet Matte Lipstick, with four further pieces in the making.' },
  { term: 'Standards', detail: 'Every current product is paraben free and cruelty free; the cream and serum are dermatologically tested.' },
  { term: 'Made in', detail: 'India, as stated on each pack.' },
  { term: 'How to buy', detail: 'Elenor does not sell online or list prices — availability is by enquiry.' },
  { term: 'Studio', detail: `${SITE.studio}. We reply to messages ${SITE.responseTime}.` },
];

const DISTINCT = [
  {
    title: 'Fewer launches, better formulas',
    body: 'We curate with a slower eye. A small shelf, refreshed slowly, so every piece earns its place.',
  },
  {
    title: 'We meet every house we carry',
    body: 'Where it is made, who makes it, what they will not compromise on — or it does not make our shelf.',
  },
  {
    title: 'Thoughtful packaging',
    body: 'Glass, paper, ink, weight. The way a cap closes. We notice these things, because the brands we love do too.',
  },
  {
    title: 'A real person answers',
    body: 'Write to us and someone who uses these products daily will reply — personally, and without a script.',
  },
];

function Quote({ children, cite }: { children: React.ReactNode; cite?: string }) {
  return (
    <Reveal className="container-x mx-auto max-w-3xl text-center">
      <div className="hairline mx-auto" />
      <blockquote className="mt-8 font-serif text-3xl italic leading-snug text-ink md:text-4xl">{children}</blockquote>
      <div className="hairline mx-auto mt-8" />
      {cite && <p className="eyebrow mt-6">— {cite}</p>}
    </Reveal>
  );
}

export default function AboutPage() {
  return (
    <>
      <JsonLd data={graph(webPageJsonLd('AboutPage', '/about', title, description))} />
      {/* Hero & story */}
      <section className="pb-16 pt-28 sm:pt-32 md:pb-24 md:pt-40" aria-labelledby="page-title">
        <div className="container-x">
          <Breadcrumbs items={[{ label: 'About', href: '/about' }]} />
          <div className="mt-10 grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5">
              <div className="image-hover relative aspect-[4/5] max-w-md overflow-hidden rounded-sm bg-line/40">
                <Image
                  src="/images/studio/marble-tray.webp"
                  alt="Elenor moisturising cream, ampoule and toner arranged on a marble tray with dried branches and soft linen"
                  fill
                  preload
                  fetchPriority="high"
                  sizes="(min-width: 768px) 40vw, 92vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-7">
              <SectionHeading
                as="h1"
                id="page-title"
                eyebrow="About Elenor"
                title="A quieter way to discover beauty."
                align="left"
                size="xl"
                lead={
                  <>
                    <p>
                      Elenor began as a notebook of products we kept returning to. Over time it became a small studio: a
                      way to bring the houses we trust to the people who value the same things — craft, restraint,
                      intention.
                    </p>
                    <p className="mt-4 text-base text-muted">
                      We curate beauty with a slower eye: fewer launches, better formulas, thoughtful packaging, and
                      brands that feel personal instead of noisy. The goal is simple — to help you find products that
                      stay on your shelf because they truly belong there.
                    </p>
                  </>
                }
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-y border-y border-line bg-surface" aria-label="From the founder's notebook">
        <Quote cite="Founder’s notebook, 2024">“We choose less, slowly. The shelf is small on purpose.”</Quote>
      </section>

      {/* Approach */}
      <section className="section-y" aria-labelledby="approach-heading">
        <div className="container-x grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-16">
          <Reveal className="md:order-2 md:col-span-6">
            <div className="image-hover relative aspect-[4/3] overflow-hidden rounded-sm bg-line/40">
              <Image
                src="/images/studio/delivery-hallway.webp"
                alt="Open Elenor delivery box with skincare products in a sunlit hallway, a vase of greenery and a linen-draped armchair"
                fill
                sizes="(min-width: 768px) 50vw, 92vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal className="md:order-1 md:col-span-6" delay={100}>
            <SectionHeading
              id="approach-heading"
              eyebrow="Our approach"
              title="We meet every house we carry."
              align="left"
              lead={
                <>
                  <p>
                    Where they are made, who is making them, what they will not compromise on. If we cannot answer those
                    questions honestly, the house does not make our shelf.
                  </p>
                  <p className="mt-4 text-base text-muted">
                    The result is a small, slow, deliberate edit. It is also the reason a real person answers when you
                    write to us.
                  </p>
                </>
              }
            />
          </Reveal>
        </div>
      </section>

      {/* Philosophy & values */}
      <section className="section-y satin-overlay border-y border-line bg-surface" aria-labelledby="values-heading">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              id="values-heading"
              eyebrow="Philosophy"
              title="Beauty, properly considered."
              lead="Three principles shape every decision at the studio — what we make, what we carry, and how we speak to you."
            />
          </Reveal>
          <PhilosophyGrid />
        </div>
      </section>

      {/* Craft */}
      <section className="section-y" aria-labelledby="craft-heading">
        <div className="container-x grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-5">
            <div className="image-hover relative aspect-square max-w-sm overflow-hidden rounded-sm bg-line/40">
              <Image
                src="/images/studio/parfum-plinth.webp"
                alt="Elenor Eau de Parfum bottle with a faceted gold cap on a stone plinth, dried blossoms and silk drape in warm light"
                fill
                sizes="(min-width: 768px) 35vw, 92vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal className="md:col-span-7" delay={100}>
            <SectionHeading
              id="craft-heading"
              eyebrow="Craft"
              title="The details, kept."
              align="left"
              lead="Glass, paper, ink, weight. The way a cap closes. We notice these things, because the brands we love do too."
            />
          </Reveal>
        </div>
      </section>

      {/* What makes Elenor distinctive */}
      <section className="pb-20 md:pb-28" aria-labelledby="distinct-heading">
        <div className="container-x">
          <Reveal>
            <SectionHeading id="distinct-heading" eyebrow="What sets us apart" title="Small on purpose." />
          </Reveal>
          <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {DISTINCT.map((d, i) => (
              <Reveal as="li" key={d.title} delay={i * 70} className="tile-hover rounded-xl border border-line bg-ivory/40 p-7">
                <p className="font-serif text-4xl text-mauve/70">0{i + 1}</p>
                <h3 className="mt-4 font-serif text-2xl leading-tight text-ink">{d.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{d.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* At a glance */}
      <section className="pb-20 md:pb-28" aria-labelledby="glance-heading">
        <div className="container-x max-w-4xl">
          <Reveal>
            <SectionHeading id="glance-heading" eyebrow="In brief" title="Elenor at a glance." />
          </Reveal>
          <Reveal>
            <dl className="glass-card mt-12 divide-y divide-line rounded-2xl px-6 md:px-10">
              {AT_A_GLANCE.map((f) => (
                <div key={f.term} className="grid grid-cols-1 gap-1 py-5 sm:grid-cols-3 sm:gap-6">
                  <dt className="eyebrow pt-1">{f.term}</dt>
                  <dd className="leading-relaxed text-ink sm:col-span-2">{f.detail}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Offerings */}
      <section className="pb-20 md:pb-28" aria-labelledby="offerings-heading">
        <div className="container-x">
          <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading id="offerings-heading" eyebrow="The Collection" title="Where to begin." align="left" />
            <Link href="/products" className="btn-secondary shrink-0">
              View all products
            </Link>
          </Reveal>
          <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {PRODUCTS.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pb-20 md:pb-28" aria-label="Closing thought">
        <Quote>“Beauty, properly considered, is a quiet form of care.”</Quote>
      </section>

      <CtaSection
        eyebrow="Write to us"
        title="A real person reads every message."
        body="Ask about a piece, arrange a studio visit by appointment, or simply say hello."
        primary={{ href: '/contact', label: 'Make an enquiry' }}
        secondary={{ href: '/lookbook', label: 'See the Lookbook' }}
      />
    </>
  );
}
