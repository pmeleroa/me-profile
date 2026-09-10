import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    category: z.enum(['Arquitectura', 'DevOps', 'IA Generativa', 'Liderazgo', 'Opinión']),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    ctaLabel: z.string().optional(),
    ctaText: z.string().optional(),
    ctaHref: z.string().optional(),
    draft: z.boolean().default(false),
    demo: z
      .object({
        slug: z.string(),
        label: z.string().default('Demo interactiva'),
      })
      .optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
