import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import StatusPanel from '@/components/ui/StatusPanel';
import OfferCard from '@/components/offers/OfferCard';
import { getActiveOffers } from '@/data/offers';

const description = 'Current offers and seasonal moments at Elenor.';

export function generateMetadata(): Metadata {
  const hasOffers = getActiveOffers().length > 0;
  return {
    title: 'Offers',
    description,
    alternates: { canonical: '/offers' },
    openGraph: { url: '/offers', title: 'Offers | Elenor', description },
    // An empty offers page has nothing worth indexing.
    robots: hasOffers ? undefined : { index: false, follow: true },
  };
}

export default function OffersPage() {
  const offers = getActiveOffers();
  return (
    <>
      <PageHero
        eyebrow="Offers"
        title="Currently at Elenor."
        breadcrumbs={[{ label: 'Offers', href: '/offers' }]}
        lead="Seasonal moments and considered gestures, each with its dates and terms set out plainly."
      />
      <section className="pb-20 md:pb-28" aria-label="Current offers">
        <div className="container-x">
          {offers.length > 0 ? (
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              {offers.map((o) => (
                <li key={o.slug}>
                  <OfferCard offer={o} />
                </li>
              ))}
            </ul>
          ) : (
            <StatusPanel
              eyebrow="Nothing running"
              title="There are no offers at the moment."
              body="When Elenor runs an offer it will appear here, with its dates and terms. In the meantime, ask to be notified about new pieces and you will hear the moment they arrive."
              actions={[
                { href: '/notify-me', label: 'Notify me' },
                { href: '/products', label: 'View the collection', variant: 'secondary' },
              ]}
            />
          )}
        </div>
      </section>
    </>
  );
}
