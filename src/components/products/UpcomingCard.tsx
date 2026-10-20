import Image from 'next/image';
import Link from 'next/link';
import type { UpcomingPiece } from '@/data/products';

export default function UpcomingCard({ piece }: { piece: UpcomingPiece }) {
  return (
    <article className="glass-card is-interactive group relative flex h-full flex-col rounded-2xl p-5 md:p-6">
      <div className="image-hover relative aspect-[4/3] overflow-hidden rounded-xl bg-line/30">
        <Image
          src={piece.image.src}
          alt={piece.image.alt}
          fill
          sizes="(min-width: 1024px) 270px, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 z-[4] rounded-full bg-ivory/90 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-mauve-deep">
          Coming soon
        </span>
      </div>
      <div className="mt-5 flex flex-1 flex-col">
        <p className="eyebrow">{piece.label}</p>
        <h3 className="mt-2 font-serif text-xl leading-tight text-ink md:text-2xl">{piece.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{piece.description}</p>
        <Link
          href={`/notify-me/${piece.slug}`}
          className="mt-auto self-start border-b border-transparent pt-6 text-xs uppercase tracking-[0.18em] text-mauve-deep transition-colors after:absolute after:inset-0 after:z-10 after:rounded-2xl group-hover:border-gold"
        >
          Notify me<span className="sr-only"> about {piece.name}</span>
        </Link>
      </div>
    </article>
  );
}
