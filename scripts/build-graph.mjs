import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';

async function buildGraph() {
  const files = await glob('content/**/*.md');
  const nodes = [];
  const links = [];
  const wikiLinkRegex = /\[\[([^\]|]+)(\|[^\]]*)?\]\]/g;

  // 建立所有節點
  const noteMap = new Map();
  for (const file of files) {
    const raw = await fs.readFile(file, 'utf-8');
    const { data, content } = matter(raw);
    const id = path.basename(file, '.md');

    noteMap.set(id, { file, data, content });
    nodes.push({
      id,
      title: data.title || id,
      tags: data.tags || [],
      public: data.public || false,
      group: data.tags?.[0] || 'uncategorized',
    });
  }

  // 解析雙向連結，建立邊
  for (const [id, { content }] of noteMap) {
    let match;
    while ((match = wikiLinkRegex.exec(content)) !== null) {
      const target = match[1].trim();
      if (noteMap.has(target)) {
        links.push({ source: id, target });
      }
    }
  }

  const graphData = { nodes, links };

  // 確保輸出目錄存在
  await fs.mkdir('graph-viewer/data', { recursive: true });

  await fs.writeFile(
    'graph-viewer/data/graph.json',
    JSON.stringify(graphData, null, 2)
  );
  console.log(`✅ Graph built: ${nodes.length} nodes, ${links.length} links`);
}

buildGraph();
