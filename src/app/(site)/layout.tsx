import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import { OFFERS_NAV_ITEM, PRIMARY_NAV } from '@/data/site';
import { getActiveOffers } from '@/data/offers';

// Offers carry validity dates, so pages are re-rendered hourly to keep the
// navigation, footer and offer sections in step with the calendar.
export const revalidate = 3600;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const hasOffers = getActiveOffers().length > 0;
  const nav = hasOffers ? [...PRIMARY_NAV, OFFERS_NAV_ITEM] : PRIMARY_NAV;
  return (
    <>
      <SiteHeader navItems={nav} />
      <main id="main" className="min-h-screen">
        {children}
      </main>
      <SiteFooter showOffers={hasOffers} />
    </>
  );
}
