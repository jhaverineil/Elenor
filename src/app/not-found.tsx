import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Logo from '@/components/layout/Logo';
import { PRIMARY_NAV } from '@/data/site';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

// Rendered for unmatched URLs and for notFound() anywhere in the app. It sits
// outside the (site) layout, so it brings its own header and footer.
export default function NotFound() {
  return (
    <>
      <SiteHeader navItems={PRIMARY_NAV} />
      <main id="main" className="flex min-h-[80vh] items-center pb-20 pt-32">
        <div className="container-x mx-auto max-w-2xl text-center">
          <Logo className="mx-auto h-28 w-auto" sizes="200px" />
          <p className="eyebrow mt-10">404</p>
          <h1 className="mt-4 text-5xl text-ink md:text-6xl">Page not found.</h1>
          <div className="hairline mx-auto mt-6" />
          <p className="mt-6 leading-relaxed text-muted">
            The page you were looking for is not on our shelf. It may have moved, or the link may be mistyped.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-primary">
              Return home
            </Link>
            <Link href="/products" className="btn-secondary">
              View the collection
            </Link>
            <Link href="/contact" className="btn-secondary">
              Contact us
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter showOffers={false} />
    </>
  );
}
