import Link from 'next/link';
import { formatOfferDate, type Offer } from '@/data/offers';

export default function OfferCard({ offer }: { offer: Offer }) {
  return (
    <article className="glass-card flex h-full flex-col rounded-2xl p-6 md:p-8">
      <p className="eyebrow">
        Valid {formatOfferDate(offer.validFrom)} – {formatOfferDate(offer.validUntil)}
      </p>
      <h3 className="mt-3 font-serif text-3xl leading-tight text-ink">{offer.title}</h3>
      <p className="mt-3 font-serif text-xl italic text-mauve-deep">{offer.benefit}</p>
      <p className="mt-4 leading-relaxed text-ink/80">{offer.description}</p>
      {offer.eligibility && (
        <p className="mt-4 text-sm text-ink/80">
          <span className="font-medium text-ink">Eligibility: </span>
          {offer.eligibility}
        </p>
      )}
      {offer.terms.length > 0 && (
        <details className="mt-5 text-sm text-muted">
          <summary className="cursor-pointer text-xs uppercase tracking-[0.18em] text-mauve-deep">Terms</summary>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            {offer.terms.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </details>
      )}
      <Link href={offer.cta.href} className="btn-primary mt-auto self-start !mt-8">
        {offer.cta.label}
      </Link>
    </article>
  );
}
