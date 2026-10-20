import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FaqAccordion from '@/components/ui/FaqAccordion';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import ProductCard from '@/components/products/ProductCard';
import ProductMedia from '@/components/products/ProductMedia';
import { ArrowRightIcon, WhatsAppIcon } from '@/components/ui/Icons';
import { PRODUCTS, getProduct, type Product } from '@/data/products';
import type { Faq } from '@/data/faqs';
import { SITE, whatsappLink } from '@/data/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<'/products/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.seoTitle,
    description: product.seoDescription,
    keywords: [product.name, `Elenor ${product.name}`, ...product.keyIngredients, ...product.claims, product.origin],
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: 'website',
      url: `/products/${product.slug}`,
      title: `${product.name} | Elenor`,
      description: product.seoDescription,
      images: [{ url: product.images.front.src, width: product.images.front.width, height: product.images.front.height, alt: product.images.front.alt }],
    },
  };
}

function productFaqs(p: Product): Faq[] {
  const faqs: Faq[] = [
    {
      id: `${p.slug}-buy`,
      question: `How can I get the ${p.name}?`,
      answer: `We do not sell online or list prices. Send us an enquiry about the ${p.name} and we will reply ${SITE.responseTime} with availability.`,
      link: { href: `/contact?topic=availability&product=${p.slug}`, label: 'Enquire now' },
    },
    {
      id: `${p.slug}-claims`,
      question: `Is the ${p.name} ${p.claims.slice(0, 2).join(' and ').toLowerCase()}?`,
      answer: `Yes — the pack is labelled ${p.claims.join(', ').toLowerCase()}. It is ${p.origin.toLowerCase()}.`,
    },
  ];
  if (p.directions) {
    faqs.push({ id: `${p.slug}-use`, question: `How do I use the ${p.name}?`, answer: `${p.directions} ${p.care}` });
  }
  return faqs;
}

export default async function ProductPage({ params }: PageProps<'/products/[slug]'>) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = PRODUCTS.filter((p) => p.slug !== product.slug);
  const enquireHref = `/contact?topic=availability&product=${product.slug}`;
  const wa = whatsappLink(`Hi, I'd like to know more about the Elenor ${product.name}.`);

  return (
    <>
      <section className="pb-16 pt-28 sm:pt-32 md:pb-24 md:pt-36" aria-labelledby="product-title">
        <div className="container-x">
          <Breadcrumbs
            items={[
              { label: 'Products', href: '/products' },
              { label: product.name, href: `/products/${product.slug}` },
            ]}
          />
          <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-6">
              <ProductMedia front={product.images.front} back={product.images.back} name={product.name} />
            </div>

            <div className="md:col-span-6">
              <p className="eyebrow">
                Elenor · {product.category} · {product.format}
              </p>
              <h1 id="product-title" className="mt-4 text-5xl leading-[1.05] text-ink md:text-6xl">
                {product.name}
              </h1>
              <p className="mt-4 font-serif text-xl italic text-mauve-deep">{product.tagline}</p>
              <div className="hairline mt-7" />
              <p className="mt-7 text-lg font-light leading-relaxed text-ink/85">{product.description}</p>
              <p className="mt-4 leading-relaxed text-muted">{product.longDescription}</p>

              <ul className="mt-7 flex flex-wrap gap-2" aria-label="Product claims">
                {product.claims.map((c) => (
                  <li key={c} className="rounded-full border border-gold/50 bg-ivory/70 px-3 py-1 text-xs tracking-wide text-ink/80">
                    {c}
                  </li>
                ))}
              </ul>

              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-line py-6 text-sm">
                <div>
                  <dt className="eyebrow">Size</dt>
                  <dd className="mt-1.5 text-ink">{product.size}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Origin</dt>
                  <dd className="mt-1.5 text-ink">{product.origin}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="eyebrow">Key ingredients</dt>
                  <dd className="mt-1.5 text-ink">{product.keyIngredients.join(' · ')}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="eyebrow">Price & availability</dt>
                  <dd className="mt-1.5 text-ink">
                    We do not list prices or sell online. Enquire and we will reply {SITE.responseTime}.
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={enquireHref} className="btn-primary">
                  Enquire about availability
                </Link>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <WhatsAppIcon className="h-4 w-4" /> Ask on WhatsApp
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="section-y border-y border-line bg-surface" aria-labelledby="details-heading">
        <div className="container-x grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-5">
            <SectionHeading id="details-heading" eyebrow="On the pack" title="The details." align="left" lead={product.packagingNote} />
          </Reveal>
          <Reveal className="space-y-10 md:col-span-7" delay={100}>
            {product.directions && (
              <div>
                <h3 className="font-serif text-2xl text-ink">Directions</h3>
                <p className="mt-3 leading-relaxed text-ink/80">{product.directions}</p>
              </div>
            )}
            <div>
              <h3 className="font-serif text-2xl text-ink">Full ingredients</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">{product.ingredients}</p>
            </div>
            <div>
              <h3 className="font-serif text-2xl text-ink">Care</h3>
              <p className="mt-3 leading-relaxed text-ink/80">{product.care}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-y" aria-labelledby="product-faq-heading">
        <div className="container-x max-w-4xl">
          <SectionHeading id="product-faq-heading" eyebrow="Questions" title={`About the ${product.name}.`} />
          <FaqAccordion className="mt-12" items={productFaqs(product)} />
        </div>
      </section>

      {/* Related */}
      <section className="pb-20 md:pb-28" aria-labelledby="related-heading">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading id="related-heading" eyebrow="Also on the shelf" title="You may also consider." align="left" />
            <Link href="/products" className="link-underline inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-mauve-deep">
              Back to the collection <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:mx-auto lg:max-w-4xl">
            {related.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
