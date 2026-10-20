import Link from 'next/link';

interface StatusPanelProps {
  eyebrow: string;
  title: string;
  body: React.ReactNode;
  actions?: { href: string; label: string; variant?: 'primary' | 'secondary' }[];
  children?: React.ReactNode;
  headingLevel?: 'h1' | 'h2';
}

/** Shared empty / error / confirmation state. */
export default function StatusPanel({ eyebrow, title, body, actions = [], children, headingLevel = 'h2' }: StatusPanelProps) {
  const Heading = headingLevel;
  return (
    <div className="glass-card mx-auto max-w-2xl rounded-3xl px-6 py-12 text-center sm:px-12">
      <p className="eyebrow">{eyebrow}</p>
      <Heading className="mt-4 text-3xl text-ink md:text-4xl">{title}</Heading>
      <div className="hairline mx-auto mt-6" />
      <div className="mx-auto mt-6 max-w-md leading-relaxed text-ink/80">{body}</div>
      {children}
      {actions.length > 0 && (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {actions.map((a) => (
            <Link key={a.href} href={a.href} className={a.variant === 'secondary' ? 'btn-secondary' : 'btn-primary'}>
              {a.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
