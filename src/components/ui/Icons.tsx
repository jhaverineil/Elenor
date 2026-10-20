// Hairline icons drawn to match the live Elenor site.
type IconProps = React.SVGProps<SVGSVGElement>;

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19.05 4.91A10 10 0 0 0 4.9 19.06L4 22l3.06-.9a10 10 0 0 0 14.84-8.65 10 10 0 0 0-2.85-7.54Zm-7.05 14.6a8.45 8.45 0 0 1-4.32-1.18l-.31-.18-2.27.67.68-2.21-.2-.32a8.45 8.45 0 1 1 6.42 3.22Zm4.6-6.34c-.25-.13-1.49-.74-1.72-.83s-.4-.13-.57.13-.65.83-.8 1-.3.19-.55.06a6.92 6.92 0 0 1-2.04-1.26 7.66 7.66 0 0 1-1.41-1.76c-.15-.25 0-.39.11-.51s.25-.3.37-.45a1.7 1.7 0 0 0 .25-.4.46.46 0 0 0 0-.44c-.06-.13-.57-1.37-.78-1.88s-.41-.43-.57-.43h-.49a.95.95 0 0 0-.69.32 2.87 2.87 0 0 0-.9 2.13 5 5 0 0 0 1.04 2.66 11.43 11.43 0 0 0 4.36 3.85c.61.26 1.08.41 1.45.53a3.49 3.49 0 0 0 1.6.1 2.62 2.62 0 0 0 1.72-1.21 2.13 2.13 0 0 0 .15-1.21c-.06-.11-.23-.18-.48-.31Z" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function PhilosophyIcon({ name, ...props }: IconProps & { name: string }) {
  if (name === 'curated') {
    return (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" {...props}>
        <path d="M16 5c4 4 4 8 0 12-4-4-4-8 0-12Z" />
        <path d="M16 17v10M11 22h10" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === 'personal') {
    return (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" {...props}>
        <path d="M16 26s-9-5-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 7-9 12-9 12Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" {...props}>
      <circle cx="16" cy="16" r="11" />
      <path d="M11 19c2-3 8-3 10 0" strokeLinecap="round" />
      <circle cx="13" cy="14" r="0.6" fill="currentColor" />
      <circle cx="19" cy="14" r="0.6" fill="currentColor" />
    </svg>
  );
}
