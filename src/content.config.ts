import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const accent = z.enum(['poppy', 'cobalt', 'buttercup']);

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    year: z.string(),
    role: z.string(),
    stack: z.array(z.string()),
    accent,
    order: z.number(),
    live: z.string().url().optional(),
    repo: z.string().url().optional(),
    /** Short problem statement shown at the top of the case study. */
    problem: z.string(),
    outcome: z.string(),
    /** Set to false once real copy has replaced the placeholder. */
    placeholder: z.boolean().default(true),
  }),
});

const timeline = defineCollection({
  loader: glob({ base: './src/content/timeline', pattern: '**/*.md' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    from: z.string(),
    to: z.string(),
    blurb: z.string(),
    order: z.number(),
    placeholder: z.boolean().default(true),
  }),
});

const playground = defineCollection({
  loader: glob({ base: './src/content/playground', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    blurb: z.string(),
    tech: z.string(),
    href: z.string().optional(),
    order: z.number(),
    placeholder: z.boolean().default(true),
  }),
});

export const collections = { projects, timeline, playground };
