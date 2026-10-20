'use client';

import { useState } from 'react';
import { subscribeNewsletter } from '@/services/contactService';
import { FormAlert, Honeypot, PrivacyNotice, loadValidation, useStartedAt } from './FormParts';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const startedAt = useStartedAt();
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { newsletterSchema, fieldErrors } = await loadValidation();
    const parsed = newsletterSchema.safeParse({ email, website: honeypot, startedAt });
    if (!parsed.success) {
      setError(fieldErrors(parsed.error).email ?? 'Please check your email address.');
      return;
    }
    setStatus('sending');
    const result = await subscribeNewsletter(parsed.data);
    if (!result.success) {
      setStatus('idle');
      setError(result.fieldErrors?.email ?? result.error ?? 'Something went wrong. Please try again.');
      return;
    }
    setStatus('sent');
    setEmail('');
  };

  if (status === 'sent') {
    return (
      <p className="mt-8 font-serif text-2xl italic text-mauve-deep" role="status" aria-live="polite">
        Thank you. We&rsquo;ll write soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} onFocusCapture={() => void loadValidation()} noValidate className="relative mx-auto mt-8 max-w-xl">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          placeholder="your@email"
          aria-invalid={error ? true : undefined}
          aria-describedby="newsletter-help"
          className="input-field input-pill flex-1"
        />
        <button type="submit" className="btn-primary whitespace-nowrap" disabled={status === 'sending'} aria-busy={status === 'sending'}>
          {status === 'sending' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>
      <div id="newsletter-help" className="mt-4 space-y-3">
        <FormAlert message={error} />
        <PrivacyNotice>We use your email only to send Letters from Elenor, and you can ask us to remove it at any time.</PrivacyNotice>
      </div>
    </form>
  );
}
