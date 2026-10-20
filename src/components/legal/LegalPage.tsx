import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import { POLICY_UPDATED } from '@/data/site';

export interface LegalSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

interface LegalPageProps {
  eyebrow: string;
  title: string;
  intro: React.ReactNode;
  path: string;
  sections: LegalSection[];
}

export default function LegalPage({ eyebrow, title, intro, path, sections }: LegalPageProps) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} align="left" breadcrumbs={[{ label: title, href: path }]} lead={intro}>
        <p className="mt-6 text-sm text-muted">Last updated: {POLICY_UPDATED}</p>
      </PageHero>

      <div className="container-x grid grid-cols-1 gap-12 pb-20 md:pb-28 lg:grid-cols-12 lg:gap-16">
        <nav aria-label="On this page" className="lg:col-span-4">
          <div className="glass-card rounded-2xl p-6 lg:sticky lg:top-28">
            <h2 className="eyebrow font-sans">On this page</h2>
            <ol className="mt-4 space-y-2.5 text-sm">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="link-underline text-ink">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <article className="prose-elenor lg:col-span-8">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`}>
              <h2 id={`${s.id}-h`} className={i === 0 ? '!mt-0' : ''}>
                {i + 1}. {s.title}
              </h2>
              {s.body}
            </section>
          ))}
          <p className="!mt-12 text-sm text-muted">
            Questions about this page? <Link href={path === '/privacy-policy' ? '/contact?topic=privacy' : '/contact'}>Write to us</Link>.
          </p>
        </article>
      </div>
    </>
  );
}
