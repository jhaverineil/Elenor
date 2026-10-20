interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  as?: 'h1' | 'h2';
  align?: 'center' | 'left';
  id?: string;
  size?: 'lg' | 'xl';
  tone?: 'ink' | 'light';
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  lead,
  as: Heading = 'h2',
  align = 'center',
  id,
  size = 'lg',
  tone = 'ink',
  className = '',
}: SectionHeadingProps) {
  const centered = align === 'center';
  const titleSize = size === 'xl' ? 'text-5xl md:text-6xl' : 'text-4xl md:text-5xl';
  return (
    <div className={`${centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'} ${className}`}>
      {eyebrow && <p className={`eyebrow ${tone === 'light' ? '!text-cream/85' : ''}`}>{eyebrow}</p>}
      <Heading
        id={id}
        className={`${eyebrow ? 'mt-4' : ''} ${titleSize} leading-[1.1] ${tone === 'light' ? 'text-cream' : 'text-ink'}`}
      >
        {title}
      </Heading>
      <div className={`hairline mt-6 ${centered ? 'mx-auto' : ''}`} />
      {lead && (
        <div
          className={`mt-7 text-base font-light leading-relaxed md:text-lg ${
            tone === 'light' ? 'text-cream/85' : 'text-ink/80'
          }`}
        >
          {lead}
        </div>
      )}
    </div>
  );
}
