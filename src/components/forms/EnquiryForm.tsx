'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { submitInquiry } from '@/services/contactService';
import { ENQUIRY_TOPICS, type EnquiryTopic } from '@/data/enquiry';
import { PRODUCTS } from '@/data/products';
import { SITE } from '@/data/site';
import { FormAlert, FormField, Honeypot, PrivacyNotice, describedBy, loadValidation, useStartedAt } from './FormParts';

const empty = { name: '', email: '', phone: '', message: '' };

function initialFromParams(params: URLSearchParams | null) {
  const topicParam = params?.get('topic') ?? '';
  const topic = (ENQUIRY_TOPICS.some((t) => t.id === topicParam) ? topicParam : 'general') as EnquiryTopic;
  const product = PRODUCTS.find((p) => p.slug === params?.get('product'));
  let message = '';
  if (product) message = `I'd like to know more about the availability of the ${product.name}.`;
  else if (topic === 'studio') message = 'I would like to arrange a visit to the studio. Days and times that suit me: ';
  return { topic, product: product?.slug, message };
}

export default function EnquiryForm() {
  const params = useSearchParams();
  const [initial] = useState(() => initialFromParams(params));
  const [values, setValues] = useState({ ...empty, message: initial.message });
  const [topic, setTopic] = useState<EnquiryTopic>(initial.topic);
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
    const { enquirySchema, fieldErrors } = await loadValidation();
    const payload = {
      kind: 'enquiry' as const,
      ...values,
      phone: values.phone || undefined,
      topic,
      product: initial.product,
      website: honeypot,
      startedAt,
    };
    const parsed = enquirySchema.safeParse(payload);
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs);
      const first = Object.keys(errs)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
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
      <div className="glass-card rounded-2xl p-8 md:p-12" role="status" aria-live="polite">
        <p className="eyebrow">Received</p>
        <h2 className="mt-3 text-4xl text-ink">Thank you.</h2>
        <div className="hairline mt-5" />
        <p className="mt-5 max-w-md leading-relaxed text-ink/80">
          Your note is with our concierge. We will reply {SITE.responseTime}. In the meantime, you are welcome to keep
          browsing.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/products" className="btn-primary">
            Continue browsing
          </Link>
          <button type="button" className="btn-secondary" onClick={() => setStatus('idle')}>
            Send another
          </button>
        </div>
      </div>
    );
  }

  const field = (id: keyof typeof empty) => describedBy(`enq-${id}`, errors[id]);

  return (
    <form
      onSubmit={handleSubmit}
      onFocusCapture={() => void loadValidation()}
      noValidate
      className="relative space-y-6"
      aria-describedby="enq-required-note"
    >
      <p id="enq-required-note" className="text-xs text-muted">
        Fields marked <span className="text-mauve-deep">*</span> are required.
      </p>
      <Honeypot value={honeypot} onChange={setHoneypot} />

      <FormField label="Full name" htmlFor="enq-name" error={errors.name} required>
        <input id="enq-name" name="name" type="text" autoComplete="name" required value={values.name} onChange={update('name')} className="input-field" {...field('name')} />
      </FormField>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField label="Email" htmlFor="enq-email" error={errors.email} required>
          <input id="enq-email" name="email" type="email" autoComplete="email" inputMode="email" required value={values.email} onChange={update('email')} className="input-field" {...field('email')} />
        </FormField>
        <FormField label="Phone" htmlFor="enq-phone" error={errors.phone}>
          <input id="enq-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" value={values.phone} onChange={update('phone')} className="input-field" {...field('phone')} />
        </FormField>
      </div>

      <FormField label="Your enquiry is about" htmlFor="enq-topic" error={errors.topic} required>
        <div className="relative">
          <select
            id="enq-topic"
            name="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value as EnquiryTopic)}
            className="input-field cursor-pointer appearance-none pr-10"
            {...describedBy('enq-topic', errors.topic)}
          >
            {ENQUIRY_TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mauve-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </FormField>

      <FormField label="Message" htmlFor="enq-message" error={errors.message} required>
        <textarea id="enq-message" name="message" rows={6} required value={values.message} onChange={update('message')} className="input-field resize-y" {...field('message')} />
      </FormField>

      <PrivacyNotice />
      <FormAlert message={formError} />

      <button type="submit" className="btn-primary" disabled={status === 'sending'} aria-busy={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  );
}
