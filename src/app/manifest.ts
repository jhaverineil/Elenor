import type { MetadataRoute } from 'next';
import { SITE } from '@/data/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Elenor — A considered edit of beauty',
    short_name: 'Elenor',
    description: SITE.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#F8EDE6',
    theme_color: '#F7F3EE',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
