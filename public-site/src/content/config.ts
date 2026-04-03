import { defineCollection, z } from 'astro:content';

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    public_title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    public: z.boolean(),
    aliases: z.array(z.string()).optional(),
  }),
});

export const collections = { notes };
