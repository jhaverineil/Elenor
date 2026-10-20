'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Logo from './Logo';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { whatsappLink, type NavItem } from '@/data/site';

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';

/**
 * "Dynamic island" navigation: a floating glass capsule that tightens as the
 * page scrolls, with a highlight that glides between links and rests on the
 * current section. On small screens the island expands into the menu panel.
 */
export default function SiteHeader({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);
  // The menu remembers the path it was opened on, so navigating closes it.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const close = useCallback(() => setOpenedOn(null), []);

  const listRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      setCompact(window.scrollY > 40);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile menu: lock scroll, move focus in, close on Escape or on resize to desktop.
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const toggle = toggleRef.current;
    const previous = body.style.overflow;
    body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const desktop = window.matchMedia('(min-width: 768px)');
    desktop.addEventListener('change', close);
    window.addEventListener('keydown', onKey);
    return () => {
      body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', close);
      toggle?.focus({ preventScroll: true });
    };
  }, [open, close]);

  // Glide the highlight to a link, measured against the list itself (each
  // link sits in its own positioned <li>, so offsetLeft would always be 0).
  const moveIndicator = useCallback((target: HTMLElement | null, animate = true) => {
    const ind = indicatorRef.current;
    const list = listRef.current;
    if (!ind || !list) return;
    if (!target) {
      ind.style.opacity = '0';
      return;
    }
    const left = target.getBoundingClientRect().left - list.getBoundingClientRect().left;
    if (!animate) ind.style.transition = 'none';
    ind.style.width = `${target.offsetWidth}px`;
    ind.style.transform = `translateX(${left}px)`;
    ind.style.opacity = '1';
    if (!animate) {
      void ind.offsetWidth; // apply the jump before restoring transitions
      ind.style.transition = '';
    }
  }, []);

  const activeLink = useCallback(
    () => listRef.current?.querySelector<HTMLElement>('a[aria-current="page"]') ?? null,
    [],
  );

  useLayoutEffect(() => {
    moveIndicator(activeLink(), false);
    // Link widths settle once the web font has loaded.
    document.fonts?.ready.then(() => moveIndicator(activeLink(), false));
  }, [pathname, moveIndicator, activeLink]);

  const overHero = pathname === '/' && !compact && !open;
  const tone = open ? 'island-light island-open' : overHero ? 'island-dark' : 'island-light';

  return (
    <>
      {/* Mobile scrim behind the expanded island */}
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 z-40 bg-noir/25 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-5">
        <a
          href="#main"
          className="pointer-events-auto sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[70] focus:rounded-full focus:bg-ivory focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
        >
          Skip to content
        </a>

        <div
          className={`island pointer-events-auto mx-auto w-full rounded-[30px] md:rounded-full ${tone} ${
            compact ? 'md:max-w-[860px]' : 'md:max-w-[980px]'
          }`}
        >
          <nav
            aria-label="Primary"
            className={`grid grid-cols-[1fr_auto] items-center transition-[height,padding] duration-500 md:grid-cols-[1fr_auto_1fr] ${EASE} ${
              compact ? 'h-[60px] pl-5 pr-2 md:h-[58px] md:pl-5 md:pr-[9px]' : 'h-[60px] pl-5 pr-2 md:h-[68px] md:pl-6 md:pr-3'
            }`}
          >
            <Link href="/" aria-label="Èlenor Professional — home" className="inline-flex items-center justify-self-start">
              <Logo
                variant="nav"
                preload
                sizes="180px"
                className={`w-auto transition-[height] duration-500 ${EASE} ${compact ? 'h-[32px] md:h-[34px]' : 'h-[32px] md:h-[40px]'}`}
              />
            </Link>

            <ul
              ref={listRef}
              className="relative hidden items-center md:flex"
              onMouseLeave={() => moveIndicator(activeLink())}
            >
              <span
                ref={indicatorRef}
                aria-hidden="true"
                className={`island-indicator absolute inset-y-0 left-0 rounded-full opacity-0 ${
                  overHero ? 'island-indicator-dark' : 'island-indicator-light'
                }`}
              />
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href} className="relative z-10">
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      onMouseEnter={(e) => moveIndicator(e.currentTarget)}
                      onFocus={(e) => moveIndicator(e.currentTarget)}
                      onBlur={() => moveIndicator(activeLink())}
                      className={`block rounded-full px-3.5 py-2 text-[13.5px] tracking-wide transition-colors duration-200 lg:px-4 ${
                        overHero
                          ? active
                            ? 'font-medium text-white'
                            : 'text-white/80 hover:text-white'
                          : active
                            ? 'font-medium text-ink'
                            : 'text-ink/70 hover:text-ink'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center justify-self-end">
              <Link
                href="/contact"
                aria-current={isActive(pathname, '/contact') ? 'page' : undefined}
                className={`hidden !py-0 !text-[13px] md:inline-flex ${compact ? 'h-10 !px-5' : 'h-11 !px-6'} ${
                  overHero ? 'btn-ghost-light' : 'btn-primary'
                }`}
              >
                Enquire
              </Link>
              <button
                ref={toggleRef}
                type="button"
                className={`relative inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors md:hidden ${
                  overHero ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-black/5'
                }`}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                aria-controls="island-menu"
                onClick={() => (open ? close() : setOpenedOn(pathname))}
              >
                <span aria-hidden="true" className="relative block h-3.5 w-5">
                  <span className={`absolute left-0 top-0 h-px w-5 bg-current transition-transform duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
                  <span className={`absolute left-0 top-[7px] h-px w-5 bg-current transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
                  <span className={`absolute left-0 top-[14px] h-px w-5 bg-current transition-transform duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
                </span>
              </button>
            </div>
          </nav>

          {/* Mobile: the island expands to reveal the menu */}
          <div
            id="island-menu"
            ref={panelRef}
            inert={!open}
            className={`grid transition-[grid-template-rows] duration-500 md:hidden ${EASE} ${
              open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden">
              <nav aria-label="Mobile" className="px-4 pb-4 pt-1">
                <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                <ul className="mt-3 flex flex-col">
                  {[...navItems, { href: '/contact', label: 'Contact' }].map((item) => {
                    const active = isActive(pathname, item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={close}
                          aria-current={active ? 'page' : undefined}
                          className={`flex items-center justify-between rounded-2xl px-3 py-2.5 font-serif text-[1.65rem] leading-tight transition-colors ${
                            active ? 'bg-white/80 text-mauve-deep shadow-[inset_0_0_0_1px_rgba(201,161,75,0.35)]' : 'text-ink hover:bg-white/50'
                          }`}
                        >
                          {item.label}
                          {active && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link href="/contact" onClick={close} className="btn-primary !px-4">
                    Enquire
                  </Link>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-secondary !px-4">
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
