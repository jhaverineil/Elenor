import Link from 'next/link';
import Logo from './Logo';
import { InstagramIcon, WhatsAppIcon } from '@/components/ui/Icons';
import { SITE, whatsappLink } from '@/data/site';

interface FooterProps {
  showOffers: boolean;
}

export default function SiteFooter({ showOffers }: FooterProps) {
  const year = new Date().getFullYear();

  const explore = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Elenor' },
    { href: '/products', label: 'Products' },
    { href: '/lookbook', label: 'Lookbook' },
    ...(showOffers ? [{ href: '/offers', label: 'Offers' }] : []),
  ];
  const care = [
    { href: '/contact', label: 'Contact & enquiries' },
    { href: '/faq', label: 'FAQ' },
    { href: '/notify-me', label: 'Notify me' },
    { href: '/contact?topic=studio', label: 'Studio visits' },
  ];
  const legal = [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-and-conditions', label: 'Terms & Conditions' },
  ];

  return (
    <footer className="border-t border-line bg-cream">
      <div className="container-x py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link href="/" aria-label="Èlenor Professional — home" className="inline-block">
              <Logo className="h-24 w-auto" sizes="180px" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">{SITE.shortDescription}</p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm text-ink transition-colors hover:text-mauve-deep"
            >
              <WhatsAppIcon className="h-4 w-4 text-mauve-dark" />
              WhatsApp {SITE.whatsappDisplay}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            {SITE.instagramUrl && (
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center gap-2 text-sm text-muted transition-colors hover:text-mauve-deep"
              >
                <InstagramIcon className="h-5 w-5" />
                Instagram
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>

          <FooterColumn title="Explore" links={explore} className="lg:col-span-2" />
          <FooterColumn title="Client care" links={care} className="lg:col-span-3">
            <li className="pt-2 text-muted">Studio — {SITE.studio}</li>
            <li className="text-muted">{SITE.hours}</li>
            <li>
              <a href={`mailto:${SITE.pressEmail}`} className="link-underline text-ink">
                {SITE.pressEmail}
              </a>
            </li>
          </FooterColumn>
          <FooterColumn title="Legal" links={legal} className="lg:col-span-3" />
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-line pt-8 text-xs text-muted md:flex-row md:items-center">
          <p>© {year} Elenor. All rights reserved.</p>
          <p>A considered edit of beauty.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  className = '',
  children,
}: {
  title: string;
  links: { href: string; label: string }[];
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={className}>
      <h2 className="eyebrow mb-5 font-sans">{title}</h2>
      <ul className="space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="link-underline text-ink">
              {l.label}
            </Link>
          </li>
        ))}
        {children}
      </ul>
    </div>
  );
}
