'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { GALLERY_CATEGORIES, type GalleryCategory, type GalleryItem } from '@/data/gallery';

type Filter = 'all' | GalleryCategory;

export default function LookbookGallery({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const visible = useMemo(
    () => (filter === 'all' ? items : items.filter((i) => i.category === filter)),
    [filter, items],
  );
  const current = index === null ? null : visible[index];

  // Focus is handed back to the thumbnail explicitly: Safari does not focus
  // buttons on click, so the dialog's built-in restoration is not enough.
  const open = (i: number, opener: HTMLButtonElement) => {
    openerRef.current = opener;
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const step = (delta: number) =>
    setIndex((i) => (i === null ? i : (i + delta + visible.length) % visible.length));

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: items.length },
    ...GALLERY_CATEGORIES.map((c) => ({ ...c, count: items.filter((i) => i.category === c.id).length })),
  ];

  return (
    <>
      <div role="group" aria-label="Filter the lookbook" className="flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors ${
              filter === f.id
                ? 'border-mauve-dark bg-mauve-dark text-white'
                : 'border-gold/50 bg-ivory/60 text-mauve-deep hover:border-mauve hover:bg-ivory'
            }`}
          >
            {f.label} <span>({f.count})</span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {visible.length} images
      </p>

      <ul className="mt-10 columns-1 gap-5 sm:columns-2 md:mt-14 lg:columns-3 [&>li]:mb-5">
        {visible.map((item, i) => (
          <li key={item.id} className="break-inside-avoid">
            <figure className="glass-card group overflow-hidden rounded-2xl p-2.5">
              <button
                type="button"
                onClick={(e) => open(i, e.currentTarget)}
                className="image-hover relative block w-full overflow-hidden rounded-xl"
                aria-label={`View larger: ${item.alt}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw"
                  className="h-auto w-full"
                />
              </button>
              <figcaption className="px-2 pb-1.5 pt-3 text-sm leading-snug text-muted">{item.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={current ? `Image ${index! + 1} of ${visible.length}` : 'Image viewer'}
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-noir/92 p-0 text-cream backdrop:bg-noir/80 open:animate-[fadeIn_0.25s_ease-out]"
        onClose={() => {
          setIndex(null);
          openerRef.current?.focus();
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1);
          if (e.key === 'ArrowLeft') step(-1);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touchStartX.current = null;
        }}
      >
        {current && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <p className="text-xs uppercase tracking-[0.22em] text-cream/80">
                {index! + 1} / {visible.length}
              </p>
              <button
                type="button"
                onClick={close}
                autoFocus
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-cream transition-colors hover:bg-white/10"
                aria-label="Close image viewer"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="relative flex-1" onClick={(e) => e.target === e.currentTarget && close()}>
              <Image
                key={current.id}
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                className="object-contain px-2 sm:px-20"
              />
              <LightboxArrow direction="prev" onClick={() => step(-1)} />
              <LightboxArrow direction="next" onClick={() => step(1)} />
            </div>

            <div className="flex flex-col items-center gap-2 px-6 pb-6 pt-4 text-center">
              <p className="max-w-2xl font-serif text-xl text-cream">{current.caption}</p>
              {current.href && (
                <Link
                  href={current.href}
                  className="text-xs uppercase tracking-[0.18em] text-champagne underline-offset-4 hover:underline"
                >
                  {current.category === 'coming-soon' ? 'Notify me when it arrives' : 'View the product'}
                </Link>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

function LightboxArrow({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  const prev = direction === 'prev';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={prev ? 'Previous image' : 'Next image'}
      className={`absolute top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-champagne/50 bg-noir/40 text-cream transition-colors hover:bg-noir/70 ${
        prev ? 'left-2 sm:left-5' : 'right-2 sm:right-5'
      }`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d={prev ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
