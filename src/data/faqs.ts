// ─── Frequently asked questions ──────────────────────────────────────────────
// Every answer restates something Elenor already publishes (site copy or
// product packaging). Do not add policies here that the business has not set.

import { SITE } from './site';

export interface Faq {
  id: string;
  question: string;
  answer: string;
  link?: { href: string; label: string };
}

export interface FaqGroup {
  id: string;
  title: string;
  items: Faq[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: 'general',
    title: 'About Elenor',
    items: [
      {
        id: 'what-is-elenor',
        question: 'What is Elenor?',
        answer:
          'Elenor is a quiet studio devoted to the small, steady gestures of self-care — a considered edit of beauty. We compose with restraint: fewer pieces, finer ingredients, and a deep respect for the ritual itself.',
        link: { href: '/about', label: 'Read our story' },
      },
      {
        id: 'how-we-choose',
        question: 'How do you choose what goes on the shelf?',
        answer:
          'We meet every house we carry — where they are made, who is making them, and what they will not compromise on. If we cannot answer those questions honestly, the house does not make our shelf.',
      },
      {
        id: 'studio-visit',
        question: 'Can I visit the studio?',
        answer: `The studio is open by appointment only. Write to us to arrange a visit and a member of the team will reply ${SITE.responseTime}.`,
        link: { href: '/contact?topic=studio', label: 'Request a studio visit' },
      },
    ],
  },
  {
    id: 'products',
    title: 'Products & ingredients',
    items: [
      {
        id: 'cruelty-free',
        question: 'Are Elenor products cruelty free and paraben free?',
        answer:
          'Yes. The Radiance Face Cream, Revive Serum and Velvet Matte Lipstick are each labelled paraben free and cruelty free. The face cream and serum are also dermatologically tested.',
      },
      {
        id: 'made-where',
        question: 'Where are the products made?',
        answer: 'The current Elenor collection is made in India, as stated on each pack.',
      },
      {
        id: 'sizes',
        question: 'What sizes do Elenor products come in?',
        answer:
          'Radiance Face Cream comes in a 50 g (1.76 oz) jar, Revive Serum in a 30 ml (1.01 fl. oz.) dropper bottle, and Velvet Matte Lipstick has a net weight of 3.5 g.',
      },
      {
        id: 'ingredients',
        question: 'Where can I read the full ingredient lists?',
        answer:
          'Each product page lists the complete ingredients exactly as printed on the packaging, along with directions for use and pack size.',
        link: { href: '/products', label: 'Browse the collection' },
      },
      {
        id: 'routine',
        question: 'How do I use the serum and the cream together?',
        answer:
          'The packaging directions are: Revive Serum — apply 2–3 drops on clean skin and gently pat until absorbed; Radiance Face Cream — apply a small amount on clean face and neck. Both are for daily use. Every product is for external use only.',
      },
    ],
  },
  {
    id: 'availability',
    title: 'Availability & enquiries',
    items: [
      {
        id: 'buy-online',
        question: 'Can I buy Elenor products on this website?',
        answer:
          'Not at the moment. We do not list prices and we are not selling online — Elenor exists, for now, as a house of stories and sensibility. To ask about availability, write to us directly and we will reply personally.',
        link: { href: '/contact?topic=availability', label: 'Ask about availability' },
      },
      {
        id: 'coming-soon',
        question: 'How will I know when a new piece arrives?',
        answer:
          'Four new pieces are in the making. Leave your details on the Notify me page and we will write to you once, the moment that piece reaches the shelf.',
        link: { href: '/notify-me', label: 'Notify me' },
      },
      {
        id: 'reply-time',
        question: 'How quickly will you reply?',
        answer: `A real person reads every message. We reply ${SITE.responseTime}, and we read messages ${SITE.hoursSentence}.`,
      },
      {
        id: 'whatsapp',
        question: 'Can I message Elenor on WhatsApp?',
        answer: `Yes — message the studio on WhatsApp at ${SITE.whatsappDisplay}. It is the fastest way to reach us, and we read messages ${SITE.hoursSentence}.`,
        link: { href: '/contact', label: 'Open WhatsApp' },
      },
      {
        id: 'newsletter',
        question: 'How often does the newsletter arrive?',
        answer:
          'Letters from Elenor are quiet dispatches — new houses, ingredient stories, occasional rituals — and arrive no more than once a month.',
      },
      {
        id: 'press',
        question: 'Who should press contact?',
        answer: `Please write to ${SITE.pressEmail}, or use the contact form and choose “Press”.`,
      },
    ],
  },
];

export function getFaqs(ids: string[]): Faq[] {
  const all = FAQ_GROUPS.flatMap((g) => g.items);
  return ids.map((id) => all.find((f) => f.id === id)).filter((f): f is Faq => Boolean(f));
}
