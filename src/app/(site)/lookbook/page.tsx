import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import CtaSection from '@/components/ui/CtaSection';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import LookbookGallery from '@/components/gallery/LookbookGallery';
import UpcomingCard from '@/components/products/UpcomingCard';
import { InstagramIcon } from '@/components/ui/Icons';
import { GALLERY } from '@/data/gallery';
import { UPCOMING } from '@/data/products';
import { SITE } from '@/data/site';

const description =
  'The Elenor lookbook: the collection, the pieces still in the making, and the studio they live in.';

export const metadata: Metadata = {
  title: 'Lookbook — Skincare, Lipstick & Eau de Parfum Imagery',
  description,
  alternates: { canonical: '/lookbook' },
  openGraph: { url: '/lookbook', title: 'The Elenor Lookbook', description },
};

export default function LookbookPage() {
  return (
    <>
      <PageHero
        eyebrow="Lookbook"
        title="The shelf, in light."
        breadcrumbs={[{ label: 'Lookbook', href: '/lookbook' }]}
        lead="A visual edit of the Elenor collection, the pieces still in the making, and the rooms they live in. Select any image to see it larger."
      />

      <section className="pb-20 md:pb-28" aria-label="Gallery">
        <div className="container-x">
          <LookbookGallery items={GALLERY} />
        </div>
      </section>

      <section id="coming-soon" className="section-y border-y border-line bg-surface" aria-labelledby="coming-soon-heading">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              id="coming-soon-heading"
              eyebrow="Next chapter"
              title="Coming soon."
              lead="Four pieces in the making — quietly composed, almost ready for the shelf."
            />
          </Reveal>
          <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-16 md:gap-8 lg:grid-cols-4">
            {UPCOMING.map((piece, i) => (
              <Reveal as="li" key={piece.slug} delay={i * 80}>
                <UpcomingCard piece={piece} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y" aria-label="Closing note">
        <Reveal className="container-x mx-auto max-w-3xl text-center">
          <div className="hairline mx-auto" />
          <blockquote className="mt-8 font-serif text-2xl italic leading-snug text-ink md:text-3xl">
            “A quiet life, considered, is its own form of beauty.”
          </blockquote>
          <div className="hairline mx-auto mt-8" />
          {SITE.instagramUrl && (
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-mauve-deep"
            >
              <InstagramIcon className="h-5 w-5" /> More from the studio on Instagram
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </Reveal>
      </section>

      <CtaSection
        eyebrow="Be first to know"
        title="Hear when a new piece arrives."
        body="Leave your details once and we will write to you the moment it reaches the shelf."
        primary={{ href: '/notify-me', label: 'Notify me' }}
        secondary={{ href: '/products', label: 'View the collection' }}
      />
    </>
  );
}
