import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import DeferredVideo from '@/components/media/DeferredVideo';
import ProductCard from '@/components/products/ProductCard';
import PhilosophyGrid from '@/components/home/PhilosophyGrid';
import OfferCard from '@/components/offers/OfferCard';
import NewsletterForm from '@/components/forms/NewsletterForm';
import FaqAccordion from '@/components/ui/FaqAccordion';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import JsonLd from '@/components/ui/JsonLd';
import { ArrowRightIcon, InstagramIcon } from '@/components/ui/Icons';
import { PRODUCTS } from '@/data/products';
import { MATERIA } from '@/data/brand';
import { GALLERY } from '@/data/gallery';
import { getFaqs } from '@/data/faqs';
import { getActiveOffers } from '@/data/offers';
import { SITE } from '@/data/site';
import { graph, organizationJsonLd, webPageJsonLd, websiteJsonLd } from '@/lib/seo';

const TITLE = 'Elenor — A Considered Edit of Beauty | Skincare & Lipstick';
const DESCRIPTION =
  'Elenor is a quiet beauty studio. Discover the Radiance Face Cream, Revive Serum and Velvet Matte Lipstick — paraben free, cruelty free and made in India.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: { url: '/', title: TITLE, description: DESCRIPTION },
};

const HOME_FAQS = ['what-is-elenor', 'buy-online', 'cruelty-free', 'coming-soon', 'reply-time'];
const LOOKBOOK_TEASER = ['studio-marble-tray', 'upcoming-eau-de-parfum', 'elenor-revive-serum-front', 'studio-parfum-plinth'];

export default function HomePage() {
  const offers = getActiveOffers();
  const teaser = LOOKBOOK_TEASER.map((id) => GALLERY.find((g) => g.id === id)!).filter(Boolean);

  return (
    <>
      <JsonLd data={graph(organizationJsonLd(), websiteJsonLd(), webPageJsonLd('WebPage', '/', TITLE, DESCRIPTION))} />

      {/* 1 · Hero */}
      <section className="relative min-h-[100svh] w-full overflow-hidden bg-noir" aria-labelledby="hero-heading">
        <DeferredVideo src="/videos/hero.mp4" mobileSrc="/videos/hero-mobile.mp4" poster="/images/posters/hero.webp" trigger="idle" preloadPoster />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              // A light, even veil over the whole video, then side and bottom
              // shading behind the headline so the text always reads.
              'linear-gradient(rgba(15,11,14,0.22), rgba(15,11,14,0.22)), linear-gradient(90deg, rgba(15,11,14,0.55) 0%, rgba(15,11,14,0.2) 45%, rgba(15,11,14,0) 70%), linear-gradient(180deg, rgba(15,11,14,0.35) 0%, rgba(15,11,14,0.05) 35%, rgba(15,11,14,0.3) 65%, rgba(15,11,14,0.75) 100%)',
          }}
        />
        <div className="container-x relative z-10 flex min-h-[100svh] flex-col justify-end pb-16 pt-28 md:pb-24">
          <div className="max-w-3xl">
            <p className="eyebrow !text-cream/85">Maison Elenor</p>
            <h1
              id="hero-heading"
              className="mt-5 font-serif text-5xl uppercase leading-[1.05] text-white [text-shadow:0_2px_24px_rgba(15,11,14,0.45)] sm:text-6xl md:text-[3.75rem]"
            >
              Elenor, a house of beauty
            </h1>
            <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-cream/90 [text-shadow:0_1px_14px_rgba(15,11,14,0.5)] md:text-lg">
              A considered edit of beauty. Curated houses, considered formulations — and nothing that does not belong on
              your shelf.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/about" className="btn-primary">
                Explore the brand
              </Link>
              <Link href="/products" className="btn-ghost-light">
                View the collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2 · Brand introduction */}
      <section className="section-y" aria-labelledby="intro-heading">
        <Reveal className="container-x mx-auto max-w-3xl text-center">
          <SectionHeading
            id="intro-heading"
            eyebrow="Maison Elenor"
            title="A house for considered beauty."
            lead={
              <>
                <p>
                  Elenor is a quiet studio devoted to the small, steady gestures of self-care. We compose with restraint —
                  fewer pieces, finer ingredients, and a deep respect for the ritual itself.
                </p>
                <p className="mt-5 text-base text-muted">
                  The first Elenor collection is a niacinamide face cream, a hydrating serum and a velvet matte lipstick
                  — each paraben free, cruelty free and made in India. No noise, no urgency. Only the things worth
                  keeping.
                </p>
              </>
            }
          />
          <Link href="/about" className="link-underline mt-9 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-mauve-deep">
            Read our story <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>

      {/* 3 · Featured collection */}
      <section className="pb-20 md:pb-28" aria-labelledby="collection-heading">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              id="collection-heading"
              eyebrow="The Collection"
              title="Three pieces, quietly chosen."
              lead="Composed for a slow morning, an unhurried evening, the lipstick you reach for without thinking."
            />
          </Reveal>
          <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {PRODUCTS.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 90}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </ul>
          <div className="mt-12 text-center">
            <Link href="/products" className="btn-secondary">
              View the full collection
            </Link>
          </div>
        </div>
      </section>

      {/* 4 · Signature experience */}
      <section
        className="relative flex min-h-[520px] items-end overflow-hidden bg-noir sm:min-h-[64vh] lg:min-h-[78vh]"
        aria-labelledby="signature-heading"
      >
        <DeferredVideo src="/videos/perfume-flacon.mp4" mobileSrc="/videos/perfume-flacon-mobile.mp4" poster="/images/posters/perfume-flacon.webp" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(15,11,14,0.6) 0%, rgba(15,11,14,0.25) 50%, rgba(15,11,14,0) 75%), linear-gradient(180deg, rgba(15,11,14,0.40) 0%, rgba(15,11,14,0.18) 35%, rgba(15,11,14,0.3) 65%, rgba(15,11,14,0.72) 100%)',
          }}
        />
        <div className="container-x relative w-full pb-16 pt-28 sm:pb-20 md:pb-24">
          <Reveal className="max-w-2xl">
            <p className="eyebrow !text-cream/85">Signature · Coming soon</p>
            <h2 id="signature-heading" className="mt-5 font-serif text-[2.25rem] leading-[1.05] text-cream sm:text-5xl lg:text-6xl">
              <span className="block">A scent,</span>
              <span className="block font-light italic">suspended in light.</span>
            </h2>
            <div className="hairline mt-6" />
            <p className="mt-7 text-base font-light leading-relaxed text-cream/90 md:text-lg">
              Crystal, light, a slow drift of perfume — the shape of a Maison Elenor composition. Osmanthus and pink pepper
              folded into a soft, lingering veil.
            </p>
            <Link href="/notify-me/eau-de-parfum" className="btn-ghost-light mt-9">
              Be first to know
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 5 · Why Elenor */}
      <section className="section-y satin-overlay" aria-labelledby="philosophy-heading">
        <div className="container-x">
          <Reveal>
            <SectionHeading id="philosophy-heading" eyebrow="Why Elenor" title="Beauty, properly considered." />
          </Reveal>
          <PhilosophyGrid />
        </div>
      </section>

      {/* 6 · The Materia */}
      <section className="pb-20 md:pb-28" aria-labelledby="materia-heading">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              id="materia-heading"
              eyebrow="The Materia"
              title="From garden to glass."
              lead="A small library of the materials we return to — sourced honestly, composed with care."
            />
          </Reveal>
          <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-16 md:gap-6 lg:grid-cols-3">
            {MATERIA.map((m, i) => (
              <Reveal as="li" key={m.name} delay={(i % 3) * 70} className="tile-hover rounded-xl border border-line bg-ivory/40 p-7 md:p-8">
                <p className="eyebrow text-[0.65rem]">{m.origin}</p>
                <h3 className="mt-3 font-serif text-2xl leading-tight text-ink">{m.name}</h3>
                <div className="mt-4 h-px w-8 bg-gradient-to-r from-gold to-blush-dark" />
                <p className="mt-4 text-sm leading-relaxed text-ink/75">{m.note}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 7 · Lookbook teaser */}
      <section className="pb-20 md:pb-28" aria-labelledby="lookbook-heading">
        <div className="container-x">
          <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading id="lookbook-heading" eyebrow="Lookbook" title="The shelf, in light." align="left" />
            <Link href="/lookbook" className="btn-secondary shrink-0">
              Open the Lookbook
            </Link>
          </Reveal>
          <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {teaser.map((g, i) => (
              <Reveal as="li" key={g.id} delay={i * 80} className={i % 2 === 1 ? 'md:mt-12' : ''}>
                <Link href="/lookbook" className="image-hover group block aspect-[4/5] overflow-hidden rounded-2xl bg-line/40">
                  <Image
                    src={g.src}
                    alt={g.alt}
                    width={g.width}
                    height={g.height}
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="h-full w-full object-cover"
                  />
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 8 · Offers — only rendered while an approved offer is live */}
      {offers.length > 0 && (
        <section className="pb-20 md:pb-28" aria-labelledby="offers-heading">
          <div className="container-x">
            <SectionHeading id="offers-heading" eyebrow="Offers" title="Currently at Elenor." />
            <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
              {offers.slice(0, 2).map((o) => (
                <li key={o.slug}>
                  <OfferCard offer={o} />
                </li>
              ))}
            </ul>
            <div className="mt-10 text-center">
              <Link href="/offers" className="btn-secondary">
                All offers
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 9 · Social — only when the official profile is configured */}
      {SITE.instagramUrl && (
        <section className="pb-20 md:pb-24" aria-label="Follow Elenor">
          <Reveal className="container-x flex flex-col items-center gap-4 text-center">
            <p className="eyebrow">Follow the studio</p>
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-serif text-3xl text-ink transition-colors hover:text-mauve-deep md:text-4xl"
            >
              <InstagramIcon className="h-7 w-7" /> Elenor on Instagram
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </Reveal>
        </section>
      )}

      {/* 10 · FAQ */}
      <section className="pb-20 md:pb-28" aria-labelledby="faq-heading">
        <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionHeading id="faq-heading" eyebrow="Questions" title="Good to know." align="left" />
            <p className="mt-6 leading-relaxed text-muted">
              How Elenor works, what is in each piece, and how to reach a real person at the studio.
            </p>
            <Link href="/faq" className="link-underline mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-mauve-deep">
              All questions <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal className="lg:col-span-8">
            <FaqAccordion items={getFaqs(HOME_FAQS)} />
          </Reveal>
        </div>
      </section>

      {/* 11 · Final call to action */}
      <section className="pb-20 md:pb-28" aria-labelledby="future-heading">
        <div className="container-x mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow pulse-soft">Launching soon</p>
            <h2 id="future-heading" className="mt-6 font-serif text-4xl leading-[1.1] text-ink md:text-6xl">
              <span className="block">A new edit,</span>
              <span className="block font-light italic text-mauve-deep">arriving this season.</span>
            </h2>
            <div className="hairline mx-auto mt-8" />
            <p className="mt-8 text-lg font-light leading-relaxed text-ink/80">
              Four new pieces in the making, one slow unveiling. Subscribe to be the first to read about it — or ask us
              anything in the meantime.
            </p>
          </Reveal>
          <Reveal className="glass-card mt-12 rounded-3xl p-8 md:p-12">
            <p className="eyebrow">Letters from Elenor</p>
            <h3 className="mt-4 font-serif text-3xl text-ink md:text-4xl">Slow notes from the studio.</h3>
            <p className="mx-auto mt-5 max-w-lg leading-relaxed text-muted">
              Quiet dispatches: new houses, ingredient stories, occasional rituals. No more than once a month.
            </p>
            <NewsletterForm />
          </Reveal>
          <p className="mt-10 text-sm text-muted">
            Prefer to talk?{' '}
            <Link href="/contact" className="link-underline text-mauve-deep">
              Write to us
            </Link>{' '}
            — we reply {SITE.responseTime}.
          </p>
        </div>
      </section>
    </>
  );
}
