import { z } from 'zod';
import { ENQUIRY_TOPICS, type EnquiryTopic } from '@/data/enquiry';

// Shared by the client forms and the API routes so both validate identically.
// Client forms import this module lazily (see loadValidation) to keep the
// validation library out of every page's initial JavaScript.

export { topicLabel } from '@/data/enquiry';

const TOPIC_IDS = ENQUIRY_TOPICS.map((t) => t.id) as [EnquiryTopic, ...EnquiryTopic[]];

const PHONE_RE = /^[+\d\s().-]{6,20}$/;

const name = z.string().trim().min(2, 'Please enter your full name').max(120, 'Please shorten your name');
const email = z
  .string()
  .trim()
  .min(1, 'Please enter your email address')
  .max(200, 'Please use a shorter email address')
  .pipe(z.email('Please enter a valid email address'));
const phone = z
  .string()
  .trim()
  .max(30)
  .optional()
  .refine((v) => !v || PHONE_RE.test(v), 'Please enter a valid phone number');

// Spam-protection fields sent alongside every submission.
const guard = {
  website: z.string().max(200).optional(), // honeypot — must stay empty
  startedAt: z.number().int().positive().optional(), // when the form was first rendered
};

export const enquirySchema = z.object({
  kind: z.literal('enquiry'),
  name,
  email,
  phone,
  topic: z.enum(TOPIC_IDS, 'Please choose what your enquiry is about'),
  product: z.string().trim().max(80).optional(),
  message: z
    .string()
    .trim()
    .min(10, 'A short note (10+ characters) helps us reply well')
    .max(2000, 'Please keep your message under 2,000 characters'),
  ...guard,
});

export const notifySchema = z.object({
  kind: z.literal('notify'),
  name,
  email,
  phone,
  piece: z.string().trim().max(80).optional(),
  note: z.string().trim().max(500, 'Please keep notes under 500 characters').optional(),
  ...guard,
});

export const submissionSchema = z.discriminatedUnion('kind', [enquirySchema, notifySchema]);

export const newsletterSchema = z.object({
  email,
  ...guard,
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
export type NotifyInput = z.infer<typeof notifySchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;

/** First error message per field, for inline display. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
