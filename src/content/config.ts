import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    articleSlug: z.string(),
    excerpt: z.string(),
    category: z.enum(['fiestas', 'turismo', 'gastronomia', 'cultura', 'agenda', 'lugares']),
    author: z.string(),
    publishedAt: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    imageCredit: z.string().optional(),
    isAiGenerated: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { articles };
