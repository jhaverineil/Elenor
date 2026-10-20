import { z } from 'zod';

/**
 * Validates all required environment variables at startup.
 * If any variable is missing or malformed, a clear error is thrown
 * instead of a cryptic runtime crash.
 */
const envSchema = z.object({
  // Public site URL used for canonical links, Open Graph and the sitemap
  NEXT_PUBLIC_SITE_URL: z.string().url('NEXT_PUBLIC_SITE_URL must be a valid URL').optional(),

  // Admin session signing secret (NEXTAUTH_SECRET is accepted for older deployments)
  ADMIN_JWT_SECRET: z.string().min(32, 'ADMIN_JWT_SECRET should be at least 32 characters').optional(),
  NEXTAUTH_SECRET: z.string().optional(),

  // Supabase (public keys — exposed to browser)
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL')
    .optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),

  // SMTP delivery of enquiry emails to the studio inbox
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().regex(/^\d+$/).optional(),
  SMTP_FROM: z.string().email().optional(),
  ENQUIRY_NOTIFY_TO: z.string().email().optional(),

  // Optional automation webhook (e.g. n8n) alerted on new enquiries
  N8N_WEBHOOK_URL: z.string().url().optional(),

  // Optional contact channels — their UI stays hidden until these are set
  NEXT_PUBLIC_INSTAGRAM_URL: z.string().url().optional(),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().regex(/^\+?[\d\s-]{8,20}$/).optional(),

  // Runtime
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Parse — throws a ZodError with a human-readable message if validation fails
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:\n');
  parsed.error.issues.forEach((issue) => {
    console.error(`  • ${issue.path.join('.')}: ${issue.message}`);
  });
  // Only hard-crash in production; in development show warnings
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Missing required environment variables. See logs above.');
  }
}

export const env = parsed.data ?? (process.env as any);
