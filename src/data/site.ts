/**
 * Single source of truth for personal details.
 * Anything still marked TODO is waiting on confirmation.
 */
export const site = {
  name: 'Victor Buch',
  first: 'Victor',
  last: 'Buch',
  role: 'Frontend developer',
  location: 'Prague, Czechia',
  timezone: 'Europe/Prague',
  // TODO: confirm whether to publish this address or a forwarding one.
  email: 'victorbuch1998@gmail.com',
  socials: [
    { label: 'GitHub', href: 'https://github.com/VictorBuch', handle: 'VictorBuch' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/victor-buch', handle: 'victor-buch' },
    { label: 'CodePen', href: 'https://codepen.io/VictorBuch', handle: 'VictorBuch' },
    { label: 'Git', href: 'https://git.victorbuch.com', handle: 'git.victorbuch.com' },
  ],
  bio: [
    "I'm a frontend developer who builds intuitive, visually appealing interfaces and finishes them with motion that means something. I've led the user-facing product at AutoPi and StudentPulse, consulted on interfaces at Netcompany, and I'm now at Ventrata in Prague.",
    "Off the clock I self-host: my own git forge, my own Linux boxes, my own networking and user management. WannaShare — the expense splitter I wrote end to end in Flutter and Go — runs on that hardware, which means I ship the frontend, the backend and the machine it lands on.",
  ],
  skills: [
    {
      group: 'Frontend',
      items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Vue', 'React', 'Angular', 'Svelte'],
    },
    {
      group: 'Frameworks',
      items: ['Astro', 'Nuxt', 'SvelteKit', 'Next.js', 'Islands & partial hydration'],
    },
    {
      group: 'Motion',
      items: ['GSAP', 'ScrollTrigger', 'CSS keyframes', 'WebGL', 'Scroll-linked scenes'],
    },
    {
      group: 'Design & systems',
      items: ['Figma', 'Design systems', 'CSS architecture', 'Tailwind', 'WCAG 2.2 AA', 'UX/UI'],
    },
    {
      group: 'Beyond the browser',
      items: ['Linux', 'Networking', 'User management', 'Self-hosting', 'Go', 'Flutter', 'Nix'],
    },
  ],
  meta: {
    title: 'Victor Buch — Frontend developer, Prague',
    description:
      'Frontend developer in Prague. Interfaces that stay fast and readable, finished with motion that means something. Selected work, experiments and experience.',
  },
} as const;

export type Site = typeof site;
