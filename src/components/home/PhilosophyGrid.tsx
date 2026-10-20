import Reveal from '@/components/ui/Reveal';
import { PhilosophyIcon } from '@/components/ui/Icons';
import { PHILOSOPHY } from '@/data/brand';

/** The three principles behind Elenor — used on Home and About. */
export default function PhilosophyGrid() {
  return (
    <ul className="mt-14 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-3 md:gap-14">
      {PHILOSOPHY.map((p, i) => (
        <Reveal as="li" key={p.title} delay={i * 90} className="text-center md:text-left">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-ivory/60 text-mauve-dark">
            <PhilosophyIcon name={p.icon} className="h-7 w-7" />
          </div>
          <h3 className="mt-6 font-serif text-2xl leading-tight text-ink">{p.title}.</h3>
          <p className="mt-4 text-base leading-relaxed text-ink/80">{p.body}</p>
        </Reveal>
      ))}
    </ul>
  );
}
