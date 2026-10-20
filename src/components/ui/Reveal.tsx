'use client';

import { useEffect, useRef } from 'react';

interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'ul' | 'li' | 'article' | 'aside';
  delay?: number;
}

/**
 * Fades content up as it scrolls into view. Content renders visible on the
 * server; only elements that start below the fold are hidden (by JS) and then
 * revealed, so nothing depends on hydration and above-the-fold content never
 * flashes. Reduced-motion users get static content via CSS.
 */
export default function Reveal({ as: Tag = 'div', delay = 0, style, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    // The observer's first callback says (asynchronously, without forcing a
    // layout) whether the element starts on screen. On-screen content is left
    // alone; anything below the fold is hidden, then revealed on arrival.
    let first = true;
    const observer = new IntersectionObserver(([entry]) => {
      if (first) {
        first = false;
        if (entry.isIntersecting) {
          observer.disconnect();
          return;
        }
        el.dataset.reveal = 'pending';
        return;
      }
      if (entry.isIntersecting) {
        el.dataset.reveal = 'shown';
        observer.disconnect();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      style={delay ? ({ ...style, '--reveal-delay': `${delay}ms` } as React.CSSProperties) : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
