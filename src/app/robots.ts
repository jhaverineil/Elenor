import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/data/site';

// Netlify sets CONTEXT to "deploy-preview" / "branch-deploy" for non-production
// builds; keep those out of search results.
const isProduction = !process.env.CONTEXT || process.env.CONTEXT === 'production';

// Search and AI answer-engine crawlers are welcomed explicitly so the brand can
// be cited in AI Overviews, ChatGPT search, Perplexity, Copilot and Claude.
const ANSWER_ENGINES = [
  'Googlebot',
  'Bingbot',
  'Google-Extended',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Perplexity-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'Applebot',
  'Applebot-Extended',
];

const PRIVATE = ['/admin', '/api/'];

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: [
      { userAgent: ANSWER_ENGINES, allow: '/', disallow: PRIVATE },
      { userAgent: '*', allow: '/', disallow: PRIVATE },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
