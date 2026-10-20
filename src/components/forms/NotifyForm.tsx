'use client';

import Link from 'next/link';
import { useState } from 'react';
import { submitInquiry } from '@/services/contactService';
import { FormAlert, FormField, Honeypot, PrivacyNotice, describedBy, loadValidation, useStartedAt } from './FormParts';

const empty = { name: '', email: '', phone: '', note: '' };

export default function NotifyForm({ piece }: { piece?: { slug: string; name: string } }) {
  const [values, setValues] = useState(empty);
  const [honeypot, setHoneypot] = useState('');
  const startedAt = useStartedAt();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [formError, setFormError] = useState('');

  const update = (field: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setFormError('');
    const { notifySchema, fieldErrors } = await loadValidation();
    const parsed = notifySchema.safeParse({
      kind: 'notify',
      ...values,
      phone: values.phone || undefined,
      note: values.note || undefined,
      piece: piece?.slug,
      website: honeypot,
      startedAt,
    });
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs);
      form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    setStatus('sending');
    const result = await submitInquiry(parsed.data);
    if (!result.success) {
      setStatus('idle');
      setErrors(result.fieldErrors ?? {});
      setFormError(result.error ?? 'Something went wrong. Please try again.');
      return;
    }
    setStatus('sent');
    setValues(empty);
  };

  if (status === 'sent') {
    return (
      <div className="glass-card rounded-2xl p-8 md:p-10" role="status" aria-live="polite">
        <p className="eyebrow">On the list</p>
        <h2 className="mt-3 text-4xl text-ink">Thank you.</h2>
        <div className="hairline mt-5" />
        <p className="mt-5 leading-relaxed text-ink/80">
          You will hear from us the moment <span className="italic">{piece?.name ?? 'this piece'}</span> reaches the
          shelf. In the meantime, you are welcome to keep browsing.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/lookbook" className="btn-secondary">
            Back to the Lookbook
          </Link>
          <Link href="/products" className="btn-primary">
            Continue browsing
          </Link>
        </div>
      </div>
    );
  }

  const field = (id: keyof typeof empty) => describedBy(`notify-${id}`, errors[id]);

  return (
    <form onSubmit={handleSubmit} onFocusCapture={() => void loadValidation()} noValidate className="relative space-y-6">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <FormField label="Full name" htmlFor="notify-name" error={errors.name} required>
        <input id="notify-name" name="name" type="text" autoComplete="name" required value={values.name} onChange={update('name')} className="input-field" {...field('name')} />
      </FormField>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField label="Email" htmlFor="notify-email" error={errors.email} required>
          <input id="notify-email" name="email" type="email" autoComplete="email" inputMode="email" required value={values.email} onChange={update('email')} className="input-field" {...field('email')} />
        </FormField>
        <FormField label="Phone" htmlFor="notify-phone" error={errors.phone}>
          <input id="notify-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" value={values.phone} onChange={update('phone')} className="input-field" {...field('phone')} />
        </FormField>
      </div>
      <FormField label="A short note" htmlFor="notify-note" error={errors.note} hint="Anything you would like us to know.">
        <textarea id="notify-note" name="note" rows={4} value={values.note} onChange={update('note')} className="input-field resize-y" {...describedBy('notify-note', errors.note, 'hint')} />
      </FormField>
      <PrivacyNotice>We will use your details only to tell you when this piece arrives.</PrivacyNotice>
      <FormAlert message={formError} />
      <div className="flex flex-wrap items-center gap-5">
        <button type="submit" className="btn-primary" disabled={status === 'sending'} aria-busy={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Notify me'}
        </button>
        <Link href="/lookbook" className="link-underline text-xs uppercase tracking-[0.18em] text-mauve-deep">
          Back to the Lookbook
        </Link>
      </div>
    </form>
  );
}
