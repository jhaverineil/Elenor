import type { Metadata } from 'next';
import NotifyPage from '@/components/products/NotifyPage';

const description = 'Be the first to know when a new Elenor piece reaches the shelf. One note, no extras.';

export const metadata: Metadata = {
  title: 'Notify me',
  description,
  alternates: { canonical: '/notify-me' },
  openGraph: { url: '/notify-me', title: 'Notify me | Elenor', description },
};

export default function NotifyMeIndexPage() {
  return <NotifyPage />;
}
