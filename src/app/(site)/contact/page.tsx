import type { Metadata } from 'next';
import { Suspense } from 'react';
import PageHero from '@/components/ui/PageHero';
import FaqAccordion from '@/components/ui/FaqAccordion';
import SectionHeading from '@/components/ui/SectionHeading';
import EnquiryForm from '@/components/forms/EnquiryForm';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { getFaqs } from '@/data/faqs';
import { SITE, whatsappLink } from '@/data/site';
import JsonLd from '@/components/ui/JsonLd';
import { graph, webPageJsonLd } from '@/lib/seo';

const title = 'Contact Elenor — Enquiries, WhatsApp, Studio Visits & Press';
const description = `Write to Elenor or message us on WhatsApp (${SITE.whatsappDisplay}) — ask about product availability, arrange a studio visit by appointment, or reach press. We reply ${SITE.responseTime}.`;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/contact' },
  openGraph: { url: '/contact', title, description },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={graph(webPageJsonLd('ContactPage', '/contact', title, description))} />
      <PageHero
        eyebrow="Contact"
        title="Write to us."
        align="left"
        breadcrumbs={[{ label: 'Contact', href: '/contact' }]}
        lead={`Send a note below or open WhatsApp directly. A real person reads each message, and we reply ${SITE.responseTime}.`}
      />

      <section className="pb-20 md:pb-24" aria-label="Enquiry">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="sr-only">Enquiry form</h2>
            <Suspense fallback={<div className="h-[640px] animate-pulse rounded-2xl bg-line/30" aria-busy="true" aria-label="Loading form" />}>
              <EnquiryForm />
            </Suspense>
          </div>

          <aside className="lg:col-span-5" aria-label="Studio details">
            <div className="rounded-sm border border-line bg-surface p-8 md:p-10">
              <p className="eyebrow">Direct</p>
              <h2 className="mt-3 text-4xl text-ink md:text-[2.75rem]">On WhatsApp</h2>
              <p className="mt-4 leading-relaxed text-muted">
                For the fastest reply, message us directly. We read {SITE.hoursSentence}.
              </p>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-7 !px-7 !py-3.5 text-base"
              >
                <WhatsAppIcon className="h-4 w-4" /> Open WhatsApp
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <p className="mt-5 text-sm text-muted">
                Or save our number:{' '}
                <a href={`tel:+${SITE.whatsappNumber}`} className="link-underline text-ink">
                  {SITE.whatsappDisplay}
                </a>
              </p>
            </div>

            <dl className="mt-10 space-y-6 px-1 text-sm">
              <div>
                <dt className="eyebrow">Studio</dt>
                <dd className="mt-2 text-ink">{SITE.studio}</dd>
              </div>
              <div>
                <dt className="eyebrow">Hours</dt>
                <dd className="mt-2 text-ink">{SITE.hours}</dd>
              </div>
              <div>
                <dt className="eyebrow">Response time</dt>
                <dd className="mt-2 text-ink">We reply {SITE.responseTime}</dd>
              </div>
              <div>
                <dt className="eyebrow">Press</dt>
                <dd className="mt-2">
                  <a href={`mailto:${SITE.pressEmail}`} className="link-underline text-ink">
                    {SITE.pressEmail}
                  </a>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="pb-20 md:pb-28" aria-labelledby="contact-faq-heading">
        <div className="container-x max-w-4xl">
          <SectionHeading id="contact-faq-heading" eyebrow="Before you write" title="Questions we hear often." />
          <FaqAccordion className="mt-12" items={getFaqs(['reply-time', 'whatsapp', 'studio-visit', 'buy-online', 'press'])} />
        </div>
      </section>
    </>
  );
}
