'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface DeferredVideoProps {
  src: string;
  poster: string;
  /** Load as soon as the page is idle (hero) or only when scrolled near (below the fold). */
  trigger?: 'idle' | 'visible';
  preloadPoster?: boolean;
  className?: string;
}

/**
 * Decorative background video. The poster frame is always rendered (and is all
 * that small screens, reduced-motion and data-saver visitors receive); the
 * video file is only requested on wider screens once the page is idle or the
 * section approaches the viewport, then fades in when it can play.
 */
export default function DeferredVideo({ src, poster, trigger = 'visible', preloadPoster = false, className = '' }: DeferredVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const narrow = window.matchMedia('(max-width: 767px)').matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (reduceMotion || narrow || connection?.saveData) return;

    if (trigger === 'idle') {
      const start = () => setLoad(true);
      if (typeof window.requestIdleCallback === 'function') {
        const id = window.requestIdleCallback(start, { timeout: 1500 });
        return () => window.cancelIdleCallback(id);
      }
      const t = window.setTimeout(start, 800);
      return () => window.clearTimeout(t);
    }

    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '360px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [trigger]);

  return (
    <div ref={wrapperRef} className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <Image
        src={poster}
        alt=""
        fill
        preload={preloadPoster}
        fetchPriority={preloadPoster ? 'high' : undefined}
        sizes="100vw"
        className="object-cover"
      />
      {load && (
        <video
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setReady(true)}
        />
      )}
    </div>
  );
}
