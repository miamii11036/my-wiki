import { defineConfig } from 'astro/config';
import remarkWikiLink from 'remark-wiki-link';

export default defineConfig({
  site: 'https://miamii11036.github.io',
  base: '/my-wiki',
  markdown: {
    remarkPlugins: [
      [remarkWikiLink, {
        hrefTemplate: (permalink) => `/my-wiki/notes/${permalink}`,
        pageResolver: (name) => [name.replace(/ /g, '-').toLowerCase()],
      }]
    ],
    shikiConfig: {
      theme: 'github-dark',
    }
  }
});
