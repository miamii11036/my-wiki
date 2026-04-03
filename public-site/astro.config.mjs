import { defineConfig } from 'astro/config';
import { readdirSync, statSync } from 'fs';
import { join, basename, relative, dirname } from 'path';
import { fileURLToPath } from 'url';
import { visit } from 'unist-util-visit';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Build a map from note filename (without extension, lowercase) to its full slug path
function buildNoteSlugMap(contentDir) {
  const map = new Map();
  function walk(dir) {
    for (const entry of readdirSync(dir)) {
      const fullPath = join(dir, entry);
      if (statSync(fullPath).isDirectory()) {
        walk(fullPath);
      } else if (entry.endsWith('.md')) {
        const name = basename(entry, '.md');
        const relativePath = relative(contentDir, fullPath).replace(/\.md$/, '');
        // Astro generates lowercase slugs
        const slug = relativePath.toLowerCase().replace(/ /g, '-');
        map.set(name.toLowerCase(), slug);
      }
    }
  }
  walk(contentDir);
  return map;
}

const noteSlugMap = buildNoteSlugMap(join(__dirname, 'src/content/notes'));

// Custom remark plugin: resolves [[name|alias]] (Obsidian-style) to correct links
function remarkObsidianLinks() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === null) return;
      const WIKI_LINK = /\[\[([^\]]+)\]\]/g;
      if (!WIKI_LINK.test(node.value)) return;
      WIKI_LINK.lastIndex = 0;

      let match;
      let lastIndex = 0;
      const newNodes = [];

      while ((match = WIKI_LINK.exec(node.value)) !== null) {
        if (match.index > lastIndex) {
          newNodes.push({ type: 'text', value: node.value.slice(lastIndex, match.index) });
        }

        const content = match[1];
        const pipeIdx = content.indexOf('|');
        let name, alias;
        if (pipeIdx !== -1) {
          name = content.slice(0, pipeIdx).trim();
          alias = content.slice(pipeIdx + 1).trim();
        } else {
          name = content.trim();
          alias = name;
        }

        const slug = noteSlugMap.get(name.toLowerCase()) ?? name.replace(/ /g, '-').toLowerCase();
        newNodes.push({
          type: 'link',
          url: `/my-wiki/notes/${slug}`,
          title: null,
          children: [{ type: 'text', value: alias }],
        });

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < node.value.length) {
        newNodes.push({ type: 'text', value: node.value.slice(lastIndex) });
      }

      parent.children.splice(index, 1, ...newNodes);
    });
  };
}

export default defineConfig({
  site: 'https://miamii11036.github.io',
  base: '/my-wiki',
  markdown: {
    remarkPlugins: [remarkObsidianLinks],
    shikiConfig: {
      theme: 'github-dark',
    }
  }
});
