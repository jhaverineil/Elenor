import Link from 'next/link';
import Reveal from './Reveal';

interface CtaLink {
  href: string;
  label: string;
}

interface CtaSectionProps {
  eyebrow?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  primary: CtaLink;
  secondary?: CtaLink;
  children?: React.ReactNode;
}

/** Closing call to action used at the foot of most pages. */
export default function CtaSection({ eyebrow, title, body, primary, secondary, children }: CtaSectionProps) {
  return (
    <section className="pb-20 md:pb-28" aria-label="Next steps">
      <div className="container-x max-w-4xl">
        <Reveal className="glass-card rounded-3xl px-6 py-12 text-center sm:px-10 md:px-16 md:py-16">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className="mt-4 text-3xl leading-tight text-ink md:text-5xl">{title}</h2>
          <div className="hairline mx-auto mt-6" />
          {body && <p className="mx-auto mt-6 max-w-xl leading-relaxed text-ink/80">{body}</p>}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href={primary.href} className="btn-primary">
              {primary.label}
            </Link>
            {secondary && (
              <Link href={secondary.href} className="btn-secondary">
                {secondary.label}
              </Link>
            )}
          </div>
          {children}
        </Reveal>
      </div>
    </section>
  );
}
