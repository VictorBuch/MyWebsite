# Victor Buch — portfolio

Astro 5 + GSAP. Single scrolling home page, one case study per project at
`/work/<slug>/`.

Page structure is "front-loaded proof": the hero is a band rather than a full
screen, the strongest project takes the fold with its screenshots, the other two
sit below as compact cards, and skills fold into About instead of standing as a
separate wall. Only the experience timeline pins. This was picked against two
alternatives (an index-spread where every project claimed a full viewport, and a
single-column dossier with no pinning at all) — measured at 1440x900, it cut the
page from 7401px to 4723px and halved the pinned sections.

Design direction: **Devětsil** — Prague avant-garde poster grammar. Three
saturated inks on lilac-tinted paper, oversized variable display type, and
sections that swap their whole colour ground as you scroll.

## Commands

```bash
npm install
npm run dev       # localhost:4321
npm run build     # static output in dist/
npm run preview   # serve dist/
npm run check     # astro check (TypeScript + template diagnostics)
```

## Layout of the repo

```
src/
  data/site.ts            name, location, socials, bio, skill groups
  content/
    projects/*.md         one file per case study (frontmatter + body)
    timeline/*.md         experience entries
    playground/*.md       CodePen experiments
  content.config.ts       schemas — a bad frontmatter field fails the build
  assets/work/<slug>/     screenshots; the case study picks them up by folder
  components/             KineticType, Timeline, Playground, Header, Footer
  scripts/motion.ts       the six named motions
  styles/tokens.css       colour, type, space, motion tokens
  styles/base.css         reset, base, layout, utilities (cascade layers)
```

Adding a project means adding `src/content/projects/<slug>.md` and, if you have
screenshots, `src/assets/work/<slug>/`. No code change.

## The six motions

Every animation on the site is one of these, defined in `src/scripts/motion.ts`.
Naming them keeps the motion budget honest and gives each one a single
reduced-motion fallback.

| Motion | Where | Reduced-motion fallback |
| --- | --- | --- |
| Settle | Page load: characters rise, variable axes travel | Instant, no from-state set |
| Repel  | Hero letters displace under the cursor | Disabled (also `pointer: coarse`) |
| Wipe   | Scroll reveal for headings, rows, media | Content simply visible |
| Magnet | Buttons and links pull toward the cursor | Disabled |
| Panel  | Section ground colour crossfade | Instant swap |
| Track  | Pinned horizontal experience timeline | Vertical/grid list, no pinning |

Rules the module holds to:

1. Markup renders complete and visible. A from-state is only ever set by JS,
   after `motionAllowed()` returns true — so a JS failure or a reduced-motion
   preference leaves a fully readable page.
2. Pointer motions are gated behind `(pointer: fine)`.
3. Pinning is gated behind `min-width: 900px`, so mobile scroll length stays
   honest. The horizontal lane CSS only applies while `data-track-active` is
   set, which means no motion, no unreachable off-screen row.
4. Flipping the OS reduced-motion setting mid-session tears the motions down
   immediately rather than at the next reload.

## Accessibility

- Skip link, semantic landmarks, logical heading order.
- Kinetic type renders the real string once as visually-hidden text; the
  per-character spans are `aria-hidden`, so a screen reader hears words.
- Poppy and buttercup are display inks. At label and body sizes they are only
  used through `--poppy-ink` / `--butter-ink`, which are contrast-checked
  against every ground (light, dark, ink panel, buttercup panel).
- 44px minimum on every interactive target; visible cobalt focus ring, and
  project slabs show the ring on the slab, not the stretched anchor.
- Three theme states: system (default), explicit light, explicit dark.

## Budget

Measured on the current build, gzipped:

| Asset | Size |
| --- | --- |
| GSAP + ScrollTrigger + motion module | 47.5 KB |
| Astro ClientRouter (view transitions) | 4.6 KB |
| Lenis (desktop only, dynamically imported) | 5.5 KB |
| CSS (whole site, one file) | 5.3 KB |
| `index.html` | 5.3 KB |

## Still open

Everything below is placeholder or unconfirmed. Files carrying draft content
set `placeholder: true` in frontmatter, which renders a visible "draft" marker
so nothing fake ships by accident.

- **The Homelab case study** (`src/content/projects/homelab.md`) — the whole
  thing. Hardware, what runs on it, who else uses it, what broke once.
- **Timeline dates** for AutoPi.io, Netcompany and StudentPulse
  (`src/content/timeline/*.md`). Ventrata is confirmed: Feb 2025 – now.
- **Playground pens** (`src/content/playground/pen-0*.md`) — three of the four
  need a name and a one-line description. URLs are real.
- **Portrait** — `src/pages/index.astro` renders a "VB" plate where the photo
  goes.
- **Email** — `src/data/site.ts` publishes the Gmail address. Swap it if you
  want a forwarding address instead.
- **OG image** — no social card yet.
