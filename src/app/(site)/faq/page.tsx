import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import FaqAccordion from '@/components/ui/FaqAccordion';
import CtaSection from '@/components/ui/CtaSection';
import JsonLd from '@/components/ui/JsonLd';
import { faqPageJsonLd, graph } from '@/lib/seo';
import { FAQ_GROUPS } from '@/data/faqs';
import { SITE } from '@/data/site';

const title = 'Elenor FAQ — Products, Ingredients, Availability & Studio Visits';
const description =
  'Answers about Elenor: whether products are cruelty free and paraben free, where they are made, pack sizes, ingredients, availability, studio visits and reply times.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/faq' },
  openGraph: { url: '/faq', title, description },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={graph(faqPageJsonLd('/faq', title, description, FAQ_GROUPS.flatMap((g) => g.items)))} />
      <PageHero
        eyebrow="FAQ"
        title="Questions, answered quietly."
        breadcrumbs={[{ label: 'FAQ', href: '/faq' }]}
        lead="Everything we are asked most often, grouped by topic. If your question is not here, write to us — a real person will reply."
      >
        <nav aria-label="FAQ topics" className="mt-10 flex flex-wrap justify-center gap-2">
          {FAQ_GROUPS.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="rounded-full border border-gold/50 bg-ivory/60 px-4 py-2 text-xs uppercase tracking-[0.18em] text-mauve-deep transition-colors hover:border-mauve hover:bg-ivory"
            >
              {g.title}
            </a>
          ))}
        </nav>
      </PageHero>

      <div className="container-x max-w-4xl space-y-16 pb-20 md:space-y-20 md:pb-28">
        {FAQ_GROUPS.map((g) => (
          <section key={g.id} id={g.id} aria-labelledby={`${g.id}-heading`}>
            <h2 id={`${g.id}-heading`} className="text-3xl text-ink md:text-4xl">
              {g.title}
            </h2>
            <div className="hairline mt-5" />
            <FaqAccordion className="mt-8" items={g.items} />
          </section>
        ))}
      </div>

      <CtaSection
        eyebrow="Still curious?"
        title="Ask us directly."
        body={`We reply ${SITE.responseTime}, and we read messages ${SITE.hoursSentence}.`}
        primary={{ href: '/contact', label: 'Write to us' }}
        secondary={{ href: '/products', label: 'Browse the collection' }}
      />
    </>
  );
}
