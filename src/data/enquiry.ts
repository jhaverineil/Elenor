// Enquiry topics, kept free of the validation library so forms can render them
// without loading it up front.

export const ENQUIRY_TOPICS = [
  { id: 'general', label: 'General enquiry' },
  { id: 'availability', label: 'Product availability' },
  { id: 'studio', label: 'Studio visit (by appointment)' },
  { id: 'press', label: 'Press' },
  { id: 'partnership', label: 'Brand partnership' },
  { id: 'privacy', label: 'Privacy request' },
] as const;

export type EnquiryTopic = (typeof ENQUIRY_TOPICS)[number]['id'];

export function topicLabel(id: string) {
  return ENQUIRY_TOPICS.find((t) => t.id === id)?.label ?? 'General enquiry';
}
