import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { glob } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

async function buildGraph() {
  const files = await glob('content/**/*.md', { cwd: ROOT, absolute: false });
  const nodes = [];
  const links = [];

  // 建立所有節點
  const noteMap = new Map();
  for (const file of files) {
    const raw = await fs.readFile(path.join(ROOT, file), 'utf-8');
    const { data, content } = matter(raw);
    const id = path.basename(file, '.md');

    noteMap.set(id, { file, data, content });
    nodes.push({
      id,
      title: data.title || id,
      tags: data.tags || [],
      public: !data.draft || false,
      group: data.tags?.[0] || 'uncategorized',
    });
  }

  // 解析雙向連結（[text](./path.md) 兩種格式），建立邊
  const mdLinkRegex = /\[[^\]]*\]\(([^)]+\.md)(?:#[^)]*)?\)/g;

  for (const [id, { content }] of noteMap) {
    let match;
    // 解析 [text](./path.md) 格式
    mdLinkRegex.lastIndex = 0;
    while ((match = mdLinkRegex.exec(content)) !== null) {
      const target = path.basename(match[1], '.md');
      if (noteMap.has(target) && target !== id) {
        links.push({ source: id, target });
      }
    }
  }

  const graphData = { nodes, links };

  // 確保輸出目錄存在
  const outDir = path.join(ROOT, 'graph-viewer/data');
  await fs.mkdir(outDir, { recursive: true });

  await fs.writeFile(
    path.join(outDir, 'graph.json'),
    JSON.stringify(graphData, null, 2)
  );
  console.log(`✅ Graph built: ${nodes.length} nodes, ${links.length} links`);
}

buildGraph();
