/**
 * Devětsil motion system — six named motions, one budget.
 *
 * Rules that hold everywhere in this file:
 *  1. Markup renders complete and visible. A from-state is only ever set
 *     by JS, and only after `motionAllowed()` says yes, so a JS failure or
 *     a reduced-motion preference leaves a fully readable page.
 *  2. Pointer motions are gated behind `(pointer:fine)`.
 *  3. Pinning is gated behind a min-width so mobile scroll length stays honest.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const fineQuery = window.matchMedia('(pointer: fine)');
const wideQuery = window.matchMedia('(min-width: 900px)');

const motionAllowed = () => !reduceQuery.matches;

/** Teardown callbacks for everything this module attaches. */
let cleanups: Array<() => void> = [];
const onCleanup = (fn: () => void) => cleanups.push(fn);

/* ── 1. Settle ─────────────────────────────────────────────────────────
   Page load. Characters rise through a mask while the variable axes
   travel from light/wide to heavy/narrow. Runs once, ~900ms.
   ──────────────────────────────────────────────────────────────────── */
function settle() {
  const lines = document.querySelectorAll<HTMLElement>('[data-settle] .kinetic__line');
  if (!lines.length || !motionAllowed()) return;

  const chars = document.querySelectorAll<HTMLElement>('[data-settle] .kinetic__char');
  if (!chars.length) return;

  gsap.set(chars, { yPercent: 110, opacity: 0 });
  gsap.to(chars, {
    yPercent: 0,
    opacity: 1,
    duration: 0.85,
    ease: 'expo.out',
    stagger: { each: 0.022, from: 'start' },
  });

  const heavy = document.querySelectorAll<HTMLElement>('[data-settle] [data-axes]');
  heavy.forEach((el) => {
    const target = el.dataset.axes ?? '"wght" 780, "wdth" 82';
    gsap.fromTo(
      el,
      { fontVariationSettings: '"wght" 240, "wdth" 100' },
      { fontVariationSettings: target, duration: 1.1, ease: 'expo.out' },
    );
  });
}

/* ── 2. Repel ──────────────────────────────────────────────────────────
   Pointer displacement across the hero letters. Fine pointers only.
   ──────────────────────────────────────────────────────────────────── */
function repel() {
  const stage = document.querySelector<HTMLElement>('[data-repel]');
  if (!stage || !fineQuery.matches || !motionAllowed()) return;

  const chars = Array.from(stage.querySelectorAll<HTMLElement>('.kinetic__char'));
  if (!chars.length) return;

  const setters = chars.map((c) => ({
    x: gsap.quickTo(c, 'x', { duration: 0.5, ease: 'expo.out' }),
    y: gsap.quickTo(c, 'y', { duration: 0.5, ease: 'expo.out' }),
    el: c,
  }));

  const RADIUS = 190;
  const STRENGTH = 36;
  let frame = 0;

  const move = (event: PointerEvent) => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      for (const s of setters) {
        const r = s.el.getBoundingClientRect();
        const dx = r.left + r.width / 2 - event.clientX;
        const dy = r.top + r.height / 2 - event.clientY;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < RADIUS) {
          const force = (1 - dist / RADIUS) * STRENGTH;
          s.x((dx / dist) * force);
          s.y((dy / dist) * force);
        } else {
          s.x(0);
          s.y(0);
        }
      }
    });
  };

  const reset = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    setters.forEach((s) => {
      s.x(0);
      s.y(0);
    });
  };

  stage.addEventListener('pointermove', move);
  stage.addEventListener('pointerleave', reset);
  onCleanup(() => {
    stage.removeEventListener('pointermove', move);
    stage.removeEventListener('pointerleave', reset);
    reset();
  });
}

/* ── 3. Wipe ───────────────────────────────────────────────────────────
   Scroll reveal for headings, media and rows. 700ms expo-out, 60ms stagger.
   ──────────────────────────────────────────────────────────────────── */
function wipe() {
  if (!motionAllowed()) return;
  const groups = document.querySelectorAll<HTMLElement>('[data-reveal-group]');

  groups.forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!items.length) return;
    gsap.set(items, { yPercent: 18, opacity: 0 });
    ScrollTrigger.create({
      trigger: group,
      start: 'top 82%',
      once: true,
      onEnter: () =>
        gsap.to(items, {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'expo.out',
          stagger: 0.06,
        }),
    });
  });

  const singles = document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal-group] [data-reveal])');
  singles.forEach((el) => {
    gsap.set(el, { yPercent: 18, opacity: 0 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => gsap.to(el, { yPercent: 0, opacity: 1, duration: 0.7, ease: 'expo.out' }),
    });
  });
}

/* ── 4. Magnet ─────────────────────────────────────────────────────────
   Buttons and project links pull toward the cursor, spring back on leave.
   The focus ring is untouched: transform only, never outline.
   ──────────────────────────────────────────────────────────────────── */
function magnet() {
  if (!fineQuery.matches || !motionAllowed()) return;
  document.querySelectorAll<HTMLElement>('[data-magnet]').forEach((el) => {
    const pull = Number(el.dataset.magnet) || 0.32;
    const x = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'expo.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'expo.out' });

    const move = (event: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((event.clientX - (r.left + r.width / 2)) * pull);
      y((event.clientY - (r.top + r.height / 2)) * pull);
    };
    const leave = () => {
      x(0);
      y(0);
    };

    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    el.addEventListener('blur', leave);
    onCleanup(() => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      el.removeEventListener('blur', leave);
      leave();
    });
  });
}

/* ── 5. Panel ──────────────────────────────────────────────────────────
   Sections carry their own ground via [data-ground]; the document body
   follows the active one so the overscroll area never flashes the wrong
   colour. Pure colour crossfade — no layout shift.
   ──────────────────────────────────────────────────────────────────── */
function panel() {
  const sections = document.querySelectorAll<HTMLElement>('.section');
  if (!sections.length) return;

  const apply = (el: HTMLElement) => {
    const ground = el.dataset.ground ?? 'paper';
    document.documentElement.dataset.activeGround = ground;
  };

  sections.forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => apply(el),
      onEnterBack: () => apply(el),
    });
  });
}

/* ── 6. Track ──────────────────────────────────────────────────────────
   Pinned horizontal scroll for the timeline and playground shelf.
   Scroll-linked, never autoplaying, and only above 900px — below that the
   markup is already an ordinary vertical list.
   ──────────────────────────────────────────────────────────────────── */
function track() {
  if (!motionAllowed()) return;

  ScrollTrigger.matchMedia({
    '(min-width: 900px) and (prefers-reduced-motion: no-preference)': () => {
      document.querySelectorAll<HTMLElement>('[data-track]').forEach((section) => {
        const lane = section.querySelector<HTMLElement>('[data-track-lane]');
        if (!lane) return;

        section.dataset.trackActive = 'true';
        const distance = () => Math.max(0, lane.scrollWidth - section.clientWidth + 120);

        const tween = gsap.to(lane, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => '+=' + distance(),
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(lane, { x: 0 });
          delete section.dataset.trackActive;
        };
      });
    },
  });
}

/* ── Smooth scroll (desktop, motion-allowed only) ───────────────────── */
async function smoothScroll() {
  if (!motionAllowed() || !fineQuery.matches || !wideQuery.matches) return;
  const { default: Lenis } = await import('lenis');
  const lenis = new Lenis({ duration: 0.9, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  onCleanup(() => {
    gsap.ticker.remove(raf);
    lenis.destroy();
  });
}

/* ── Local clock — a real fact about the person, not decoration ─────── */
function clock() {
  const el = document.querySelector<HTMLElement>('[data-clock]');
  if (!el) return;
  const zone = el.dataset.clock || 'Europe/Prague';
  const fmt = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: zone,
    hour12: false,
  });
  const tick = () => {
    el.textContent = fmt.format(new Date());
  };
  tick();
  const id = window.setInterval(tick, 15_000);
  onCleanup(() => window.clearInterval(id));
}

export function initMotion() {
  teardown();
  settle();
  repel();
  wipe();
  magnet();
  panel();
  track();
  clock();
  void smoothScroll();
}

export function teardown() {
  cleanups.forEach((fn) => fn());
  cleanups = [];
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

/* Re-run after every view transition so a case-study navigation gets its
   own motions and the previous page's listeners are released. */
document.addEventListener('astro:page-load', initMotion);
document.addEventListener('astro:before-swap', teardown);

/* A viewer who flips the OS setting mid-session gets the still page
   immediately rather than at the next reload. */
reduceQuery.addEventListener('change', () => {
  if (reduceQuery.matches) {
    teardown();
    gsap.set('[data-reveal], .kinetic__char', { clearProps: 'all' });
  } else {
    initMotion();
  }
});
