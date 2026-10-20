'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ProductImage } from '@/data/products';

/** Main product image with front / reverse thumbnails. */
export default function ProductMedia({ front, back, name }: { front: ProductImage; back: ProductImage; name: string }) {
  const views = [
    { id: 'front', label: 'Front', image: front },
    { id: 'back', label: 'Reverse', image: back },
  ];
  const [active, setActive] = useState(0);
  const [switched, setSwitched] = useState(false);
  const current = views[active].image;

  return (
    <div>
      <div className="image-hover relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#f3e4da]">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          preload={!switched}
          fetchPriority={switched ? undefined : 'high'}
          sizes="(min-width: 768px) 46vw, 92vw"
          // Fade only on user switches: animating the first paint from
          // opacity 0 would delay Largest Contentful Paint.
          className={`object-contain ${switched ? 'animate-[fadeIn_0.4s_ease-out]' : ''}`}
        />
      </div>
      <div className="mt-4 flex gap-3" role="group" aria-label={`${name} views`}>
        {views.map((v, i) => (
          <button
            key={v.id}
            type="button"
            onClick={() => {
              setActive(i);
              setSwitched(true);
            }}
            aria-pressed={active === i}
            className={`relative h-20 w-20 overflow-hidden rounded-xl border bg-[#f3e4da] transition-colors md:h-24 md:w-24 ${
              active === i ? 'border-mauve-dark ring-2 ring-mauve/30' : 'border-line hover:border-gold'
            }`}
          >
            <Image src={v.image.src} alt="" fill sizes="96px" className="object-cover" />
            <span className="sr-only">Show {v.label.toLowerCase()} of pack</span>
          </button>
        ))}
      </div>
    </div>
  );
}
