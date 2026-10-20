'use client';

import Link from 'next/link';
import { useState } from 'react';

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-mauve-deep">
            {' '}
            *
          </span>
        ) : (
          <span className="normal-case tracking-normal"> (optional)</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-xs text-mauve-deep">
          {error}
        </p>
      )}
    </div>
  );
}

/** Props wiring an input to its hint / error text for assistive technology. */
export function describedBy(id: string, error?: string, hint?: string) {
  const ids = [error ? `${id}-error` : hint ? `${id}-hint` : null].filter(Boolean);
  return { 'aria-invalid': error ? true : undefined, 'aria-describedby': ids.length ? ids.join(' ') : undefined };
}

/** Hidden honeypot field; bots fill it, people never see it. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

/** Loads the shared validation schemas on demand (first focus or submit). */
export const loadValidation = () => import('@/lib/validation');

/** Timestamp of first render, used by the server-side time trap. */
export function useStartedAt() {
  const [startedAt] = useState(() => Date.now());
  return startedAt;
}

export function FormAlert({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-md border border-mauve/40 bg-blush/30 px-4 py-3 text-sm text-ink">
      {message}
    </p>
  );
}

export function PrivacyNotice({ children }: { children?: React.ReactNode }) {
  return (
    <p className="text-xs leading-relaxed text-muted">
      {children ?? 'We use your details only to reply to you.'} Read how we handle them in our{' '}
      <Link href="/privacy-policy" className="text-mauve-deep underline underline-offset-2">
        Privacy Policy
      </Link>
      .
    </p>
  );
}
