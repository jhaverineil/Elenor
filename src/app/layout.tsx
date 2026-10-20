import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { SITE } from '@/data/site';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Elenor — A considered edit of beauty',
    template: '%s | Elenor',
  },
  description: SITE.description,
  applicationName: 'Elenor',
  creator: 'Elenor',
  publisher: 'Elenor',
  category: 'beauty',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  openGraph: {
    type: 'website',
    siteName: 'Elenor',
    locale: 'en_GB',
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: 'Elenor skincare on a marble tray' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [SITE.ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: '#F7F3EE',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: browser extensions (e.g. LocatorJS adds
    // data-locator-target) modify <html> before React hydrates. This only
    // silences attribute differences on this one element, not its children.
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
