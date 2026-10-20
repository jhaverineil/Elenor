'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[Site] Unhandled render error:', error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] items-center pb-20 pt-32" aria-labelledby="error-title">
      <div className="container-x mx-auto max-w-2xl text-center">
        <p className="eyebrow">Something went wrong</p>
        <h1 id="error-title" className="mt-4 text-5xl text-ink">
          A moment, please.
        </h1>
        <div className="hairline mx-auto mt-6" />
        <p className="mt-6 leading-relaxed text-muted">
          This page could not be displayed. Please try again — if it keeps happening, let us know.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-secondary">
            Return home
          </Link>
        </div>
      </div>
    </section>
  );
}
