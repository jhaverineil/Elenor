import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NotifyPage from '@/components/products/NotifyPage';
import { UPCOMING, getUpcoming } from '@/data/products';

export const dynamicParams = false;

export function generateStaticParams() {
  return UPCOMING.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<'/notify-me/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const piece = getUpcoming(slug);
  if (!piece) return {};
  const description = `${piece.description} Coming soon — leave your details to be told when it arrives.`;
  return {
    title: `${piece.name} — Coming soon`,
    description,
    alternates: { canonical: `/notify-me/${piece.slug}` },
    openGraph: {
      url: `/notify-me/${piece.slug}`,
      title: `${piece.name} | Elenor`,
      description,
      images: [{ url: piece.image.src, width: piece.image.width, height: piece.image.height, alt: piece.image.alt }],
    },
  };
}

export default async function NotifyMePiecePage({ params }: PageProps<'/notify-me/[slug]'>) {
  const { slug } = await params;
  const piece = getUpcoming(slug);
  if (!piece) notFound();
  return <NotifyPage piece={piece} />;
}
