import Link from 'next/link';
import JsonLd from './JsonLd';
import { absoluteUrl } from '@/data/site';

export interface Crumb {
  label: string;
  href: string;
}

export default function Breadcrumbs({ items, className = '' }: { items: Crumb[]; className?: string }) {
  const trail = [{ label: 'Home', href: '/' }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-xs tracking-wide text-muted">
        <ol className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${className}`}>
          {trail.map((c, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={c.href} className="inline-flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-ink">
                    {c.label}
                  </span>
                ) : (
                  <>
                    <Link href={c.href} className="link-underline">
                      {c.label}
                    </Link>
                    <span aria-hidden="true" className="text-mauve">
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: trail.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.label,
            item: absoluteUrl(c.href),
          })),
        }}
      />
    </>
  );
}
