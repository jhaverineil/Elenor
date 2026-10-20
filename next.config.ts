import type { NextConfig } from "next";

// Security headers applied to all routes
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN', // Prevents clickjacking
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff', // Prevents MIME-type sniffing
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()', // Restrict browser APIs
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block', // Legacy XSS protection for older browsers
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload', // Force HTTPS for 2 years
  },
];

const nextConfig: NextConfig = {
  // Apply security headers globally
  async headers() {
    return [
      {
        source: '/(.*)', // Match all routes
        headers: securityHeaders,
      },
    ];
  },

  // All imagery is self-hosted in /public; serve modern formats where supported
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  async redirects() {
    return [
      // Alternative names for existing pages
      { source: '/collections', destination: '/products', permanent: true },
      { source: '/collections/:slug', destination: '/products/:slug', permanent: true },
      { source: '/services', destination: '/products', permanent: true },
      { source: '/gallery', destination: '/lookbook', permanent: true },
      { source: '/privacy', destination: '/privacy-policy', permanent: true },
      { source: '/terms', destination: '/terms-and-conditions', permanent: true },
      // Studio visits are arranged by enquiry; there is no online scheduling
      { source: '/book-appointment', destination: '/contact?topic=studio', permanent: false },
      // The former storefront: Elenor does not sell online
      { source: '/cart', destination: '/products', permanent: false },
      { source: '/checkout', destination: '/products', permanent: false },
      { source: '/order-confirmation', destination: '/products', permanent: false },
      { source: '/auth/:path*', destination: '/', permanent: false },
    ];
  },

  // Enable strict mode for better React development warnings
  reactStrictMode: true,
};

export default nextConfig;
