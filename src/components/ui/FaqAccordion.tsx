import Link from 'next/link';
import { PlusIcon } from './Icons';
import type { Faq } from '@/data/faqs';

/**
 * Native <details>/<summary> disclosure: keyboard operable and announced as
 * expanded/collapsed by screen readers without any client JavaScript.
 */
export default function FaqAccordion({ items, className = '' }: { items: Faq[]; className?: string }) {
  return (
    <div className={`divide-y divide-line border-y border-line ${className}`}>
      {items.map((faq) => (
        <details key={faq.id} id={`faq-${faq.id}`} className="group">
          <summary className="flex cursor-pointer items-start justify-between gap-6 py-5 text-left transition-colors hover:text-mauve-deep md:py-6">
            <h3 className="font-serif text-xl leading-snug text-ink md:text-2xl">{faq.question}</h3>
            <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/50 text-mauve-deep transition-transform duration-300 group-open:rotate-45">
              <PlusIcon className="h-4 w-4" />
            </span>
          </summary>
          <div className="pb-6 pr-12 text-base leading-relaxed text-ink/80">
            <p>{faq.answer}</p>
            {faq.link && (
              <Link
                href={faq.link.href}
                className="link-underline mt-4 inline-block text-xs uppercase tracking-[0.18em] text-mauve-deep"
              >
                {faq.link.label}
              </Link>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
