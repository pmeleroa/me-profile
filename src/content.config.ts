import { defineCollection, z, reference } from 'astro:content';
import { glob } from 'astro/loaders';

const seriesCollection = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/series' }),
  schema: z.object({
    title: z.string(),
  }),
});

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    category: z.enum(['Opinión', 'Análisis', 'Guía', 'Recursos']),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    ctaLabel: z.string().optional(),
    ctaText: z.string().optional(),
    ctaHref: z.string().optional(),
    draft: z.boolean().default(false),
    series: z
      .object({
        id: reference('series'),
        part: z.number().int().positive(),
      })
      .optional(),
    demo: z
      .object({
        slug: z.string(),
        label: z.string().default('Demo interactiva'),
      })
      .optional(),
  }),
});

export const collections = {
  series: seriesCollection,
  blog: blogCollection,
};
  