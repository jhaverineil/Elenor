'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface DeferredVideoProps {
  src: string;
  /** Lighter encode served below 768px wide. */
  mobileSrc?: string;
  poster: string;
  /** Load as soon as the page is idle (hero) or only when scrolled near (below the fold). */
  trigger?: 'idle' | 'visible';
  preloadPoster?: boolean;
  className?: string;
}

/**
 * Decorative background video. The poster frame renders immediately; the
 * video (a lighter file on phones) loads once the page is idle or the section
 * approaches the viewport, then fades in as soon as it can play. Visitors who
 * ask for reduced motion or data saving keep the still poster.
 */
export default function DeferredVideo({
  src,
  mobileSrc,
  poster,
  trigger = 'visible',
  preloadPoster = false,
  className = '',
}: DeferredVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (reduceMotion || connection?.saveData) return;

    const narrow = window.matchMedia('(max-width: 767px)').matches;
    const start = () => setSource(narrow && mobileSrc ? mobileSrc : src);

    if (trigger === 'idle') {
      if (typeof window.requestIdleCallback === 'function') {
        const id = window.requestIdleCallback(start, { timeout: 800 });
        return () => window.cancelIdleCallback(id);
      }
      const t = window.setTimeout(start, 300);
      return () => window.clearTimeout(t);
    }

    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      },
      { rootMargin: '360px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [trigger, src, mobileSrc]);

  // iOS Safari and in-app browsers only autoplay when the element is muted at
  // the property level before play() — React's `muted` prop alone is not enough.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source) return;
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.play().catch(() => {
      // Autoplay refused (e.g. Low Power Mode): the poster simply stays.
    });
  }, [source]);

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
      {source && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
          src={source}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          preload="auto"
          poster={poster}
          onPlaying={() => setReady(true)}
        />
      )}
    </div>
  );
}
