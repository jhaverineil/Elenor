import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/data/products';

/** Collection card: front of pack, with the reverse revealed on hover. The
    title link stretches over the whole card so it is a single tab stop. */
export default function ProductCard({ product, headingLevel = 'h3' }: { product: Product; headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel;
  return (
    <article className="glass-card is-interactive group relative flex h-full flex-col rounded-2xl p-5 md:p-6">
      <div className="image-hover relative aspect-[4/5] overflow-hidden rounded-xl bg-[#f3e4da]">
        <Image
          src={product.images.front.src}
          alt={product.images.front.alt}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 768px) 30vw, 90vw"
          className="object-contain transition-opacity duration-500 motion-safe:group-hover:opacity-0"
        />
        <Image
          src={product.images.back.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 768px) 30vw, 90vw"
          className="object-contain opacity-0 transition-opacity duration-500 motion-safe:group-hover:opacity-100"
        />
      </div>
      <div className="mt-5 flex flex-1 flex-col">
        <p className="eyebrow">
          {product.category} · {product.format}
        </p>
        <Heading className="mt-2 font-serif text-2xl leading-tight text-ink">
          <Link
            href={`/products/${product.slug}`}
            className="transition-colors after:absolute after:inset-0 after:z-10 after:rounded-2xl group-hover:text-mauve-deep"
          >
            {product.name}
          </Link>
        </Heading>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{product.description}</p>
        <p className="mt-4 text-xs tracking-wide text-ink/70">{product.size}</p>
        <span aria-hidden="true" className="mt-6 self-start border-b border-transparent text-xs uppercase tracking-[0.18em] text-mauve-deep transition-colors group-hover:border-gold">
          Discover
        </span>
      </div>
    </article>
  );
}
