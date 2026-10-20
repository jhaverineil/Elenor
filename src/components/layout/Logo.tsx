import Image from 'next/image';
import { SITE } from '@/data/site';

interface LogoProps {
  /** "full": the stacked ÈLENOR Professional mark. "nav": the horizontal header lockup. */
  variant?: 'full' | 'nav';
  className?: string;
  preload?: boolean;
  sizes?: string;
}

// The gold mark reads on both the dark hero and light glass, so it is
// rendered as-is (no colour filters).
export default function Logo({ variant = 'full', className = 'h-12 w-auto', preload = false, sizes = '160px' }: LogoProps) {
  const logo = variant === 'nav' ? SITE.navLogo : SITE.logo;
  return (
    <Image
      src={logo.src}
      alt="Èlenor Professional — Where Beauty Evolved"
      width={logo.width}
      height={logo.height}
      preload={preload}
      fetchPriority={preload ? 'high' : undefined}
      sizes={sizes}
      className={`${className} object-contain`}
    />
  );
}
