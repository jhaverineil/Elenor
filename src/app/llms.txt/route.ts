import { PRODUCTS, UPCOMING } from '@/data/products';
import { FAQ_GROUPS } from '@/data/faqs';
import { PHILOSOPHY } from '@/data/brand';
import { SITE, absoluteUrl, whatsappLink } from '@/data/site';

export const dynamic = 'force-static';

/**
 * /llms.txt — a plain-markdown brief for AI assistants and answer engines
 * (see llmstxt.org). Generated from the same data as the site, so it always
 * matches what visitors see.
 */
export function GET() {
  const lines: string[] = [
    '# Elenor',
    '',
    `> Elenor is a quiet beauty studio and ${SITE.tagline.toLowerCase()}: curated houses and considered formulations. It does not sell online or list prices; availability is by enquiry.`,
    '',
    '## Key facts',
    `- Current collection: ${PRODUCTS.map((p) => p.name).join(', ')}.`,
    '- All current products are paraben free and cruelty free; the Radiance Face Cream and Revive Serum are dermatologically tested.',
    '- Products are made in India (as stated on the packaging).',
    `- Coming soon: ${UPCOMING.map((u) => u.name).join(', ')}.`,
    `- Studio: ${SITE.studio}. Hours: ${SITE.hours}. Replies ${SITE.responseTime}.`,
    `- WhatsApp: ${SITE.whatsappDisplay} (${whatsappLink()})`,
    `- Press: ${SITE.pressEmail}`,
    `- Philosophy: ${PHILOSOPHY.map((p) => `${p.title} — ${p.body}`).join(' ')}`,
    '',
    '## Pages',
    `- [Home](${absoluteUrl('/')}): introduction to Elenor and the collection`,
    `- [About](${absoluteUrl('/about')}): story, approach to curation and philosophy`,
    `- [Products](${absoluteUrl('/products')}): the current collection and how enquiries work`,
    `- [Lookbook](${absoluteUrl('/lookbook')}): imagery and the pieces coming soon`,
    `- [FAQ](${absoluteUrl('/faq')}): answers about products, ingredients, availability and the studio`,
    `- [Contact](${absoluteUrl('/contact')}): enquiries, studio visits by appointment and press`,
    `- [Notify me](${absoluteUrl('/notify-me')}): be told when a new piece arrives`,
    '',
    '## Products',
  ];

  for (const p of PRODUCTS) {
    lines.push(
      '',
      `### ${p.name}`,
      `URL: ${absoluteUrl(`/products/${p.slug}`)}`,
      `- Type: ${p.category} — ${p.format}`,
      `- Size: ${p.size}`,
      `- Summary: ${p.description}`,
      `- Key ingredients: ${p.keyIngredients.join(', ')}`,
      `- Full ingredients: ${p.ingredients}`,
      ...(p.directions ? [`- Directions: ${p.directions}`] : []),
      `- Claims: ${p.claims.join(', ')}`,
      `- Origin: ${p.origin}`,
      '- Price: not listed; availability by enquiry.',
    );
  }

  lines.push('', '## Frequently asked questions');
  for (const g of FAQ_GROUPS) {
    lines.push('', `### ${g.title}`);
    for (const f of g.items) lines.push('', `**${f.question}**`, f.answer);
  }

  lines.push(
    '',
    '## Policies',
    `- [Privacy Policy](${absoluteUrl('/privacy-policy')})`,
    `- [Terms & Conditions](${absoluteUrl('/terms-and-conditions')})`,
    '',
  );

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
