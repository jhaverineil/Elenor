import type { ApiResponse } from '@/types';
import type { EnquiryInput, NewsletterInput, NotifyInput } from '@/lib/validation';

export type SubmitResult = ApiResponse<{ id: string }> & { fieldErrors?: Record<string, string> };

async function post(url: string, payload: unknown): Promise<SubmitResult> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    return { success: false, error: 'We could not reach the studio. Please check your connection and try again.' };
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return {
      success: false,
      error: data.message ?? 'Something went wrong. Please try again.',
      fieldErrors: data.fieldErrors,
    };
  }
  return { success: true, data };
}

/**
 * Client-side service: sends a contact enquiry or "Notify me" request to the
 * public API controller. Abstracts the fetch call away from the form views.
 */
export function submitInquiry(input: EnquiryInput | NotifyInput) {
  return post('/api/inquiry', input);
}

/** Client-side service: subscribes an email address to Letters from Elenor. */
export function subscribeNewsletter(input: NewsletterInput) {
  return post('/api/newsletter', input);
}
