import SectionHeading from './SectionHeading';
import Breadcrumbs, { type Crumb } from './Breadcrumbs';

interface PageHeroProps {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  breadcrumbs?: Crumb[];
  align?: 'center' | 'left';
  children?: React.ReactNode;
}

/** Standard inner-page opening: breadcrumbs, eyebrow, serif title, hairline, lead. */
export default function PageHero({ eyebrow, title, lead, breadcrumbs, align = 'center', children }: PageHeroProps) {
  return (
    <section className="pb-12 pt-28 sm:pt-32 md:pb-20 md:pt-40" aria-labelledby="page-title">
      <div className="container-x">
        {breadcrumbs && (
          <Breadcrumbs items={breadcrumbs} className={`mb-10 ${align === 'center' ? 'justify-center' : ''}`} />
        )}
        <SectionHeading as="h1" id="page-title" eyebrow={eyebrow} title={title} lead={lead} align={align} size="xl" />
        {children}
      </div>
    </section>
  );
}
