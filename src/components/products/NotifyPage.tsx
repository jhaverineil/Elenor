import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SectionHeading from '@/components/ui/SectionHeading';
import NotifyForm from '@/components/forms/NotifyForm';
import { UPCOMING, type UpcomingPiece } from '@/data/products';

/** Shared body for /notify-me and /notify-me/[slug]. */
export default function NotifyPage({ piece }: { piece?: UpcomingPiece }) {
  const crumbs = [{ label: 'Notify me', href: '/notify-me' }];
  if (piece) crumbs.push({ label: piece.name, href: `/notify-me/${piece.slug}` });

  return (
    <section className="pb-20 pt-28 sm:pt-32 md:pb-28 md:pt-40" aria-labelledby="page-title">
      <div className="container-x max-w-2xl">
        <Breadcrumbs items={crumbs} />
        <SectionHeading
          as="h1"
          id="page-title"
          className="mt-10"
          eyebrow="Notify me"
          title={piece ? `Quietly first to know: ${piece.name}.` : 'Quietly first to know.'}
          align="left"
          size="xl"
          lead="Leave your details and we will write to you the moment this piece reaches the shelf. One note, no extras."
        />

        <div className="mt-10">
          {piece ? (
            <div className="glass-card flex items-center gap-4 rounded-2xl p-5 md:gap-5 md:p-6">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-line/30 md:h-24 md:w-24">
                <Image src={piece.image.src} alt={piece.image.alt} fill sizes="96px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="eyebrow">{piece.label} · Coming soon</p>
                <h2 className="mt-1 font-serif text-2xl leading-tight text-ink">{piece.name}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{piece.description}</p>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="eyebrow font-sans">Pick a release</h2>
              <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {UPCOMING.map((u) => (
                  <li key={u.slug}>
                    <Link
                      href={`/notify-me/${u.slug}`}
                      className="flex items-center gap-3 rounded-xl border border-line/70 bg-surface px-3 py-3 text-sm text-ink transition-colors hover:border-mauve"
                    >
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-line/30">
                        <Image src={u.image.src} alt="" fill sizes="48px" className="object-cover" />
                      </span>
                      {u.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted">Or leave your details below to hear about every new release.</p>
            </div>
          )}
        </div>

        <div className="mt-10">
          <NotifyForm piece={piece ? { slug: piece.slug, name: piece.name } : undefined} />
        </div>
      </div>
    </section>
  );
}
