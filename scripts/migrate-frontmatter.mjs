// scripts/migrate-frontmatter.mjs
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, '../content/notes');
const DRY_RUN = process.argv.includes('--dry-run');

// 解析 frontmatter
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  return { raw: match[1], body: match[2] };
}

// 轉換 frontmatter
function migrateFrontmatter(rawYaml) {
  const lines = rawYaml.split('\n');
  const data = {};
  let inTagsBlock = false;
  let tagsInline = null;
  let tagsArray = [];

  for (const line of lines) {
    // 嘗試擷取 inline tags: [a, b, c]
    const inlineTagsMatch = line.match(/^tags:\s*\[([^\]]*)\]$/);
    if (inlineTagsMatch) {
      tagsInline = inlineTagsMatch[1];
      inTagsBlock = false;
      continue;
    }
    // 嘗試擷取 block tags:
    if (line.match(/^tags:\s*$/)) {
      inTagsBlock = true;
      continue;
    }
    // 擷取 block tags list items
    if (inTagsBlock && line.match(/^\s*-\s+/)) {
      tagsArray.push(line.replace(/^\s*-\s+/, '').trim());
      continue;
    }
    inTagsBlock = false;

    const m = line.match(/^(\w+):\s*(.*)$/);
    if (m) {
      data[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
    }
  }

  const title = data.title || '';
  const description = title;
  const pubDatetime = data.date ? `${data.date}T00:00:00.000Z` : '';

  let tagsStr;
  if (tagsInline !== null) {
    tagsStr = tagsInline;
  } else if (tagsArray.length > 0) {
    tagsStr = tagsArray.join(', ');
  } else {
    tagsStr = 'others';
  }

  const draft = data.public === 'false' ? 'true' : 'false';

  const newFrontmatter = [
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `pubDatetime: ${pubDatetime}`,
    `tags: [${tagsStr}]`,
    `draft: ${draft}`,
  ].join('\n');

  return newFrontmatter;
}

// 轉換 Obsidian wiki-link（正文）
let totalLinks = 0;
function convertWikiLinks(body) {
  return body.replace(/\[\[([^\]]+)\]\]/g, (_, content) => {
    totalLinks++;
    const pipeIdx = content.indexOf('|');
    if (pipeIdx !== -1) {
      const target = content.slice(0, pipeIdx).trim();
      const alias = content.slice(pipeIdx + 1).trim();
      return `[${alias}](./${target}.md)`;
    } else {
      const target = content.trim();
      return `[${target}](./${target}.md)`;
    }
  });
}

// 轉換 Obsidian table 分隔線（統一為 :--- 靠左對齊）
let totalTables = 0;
function convertTables(body) {
  const tableSeparatorRegex = /^\|[\s\-\|:]+\|$/gm;
  return body.replace(tableSeparatorRegex, (match) => {
    totalTables++;
    const cols = match.split('|').filter(cell => cell.trim() !== '');
    const standardized = cols.map(() => ' :--- ').join('|');
    return `|${standardized}|`;
  });
}

// 遞迴掃描所有 .md 檔案
function walk(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      results.push(...walk(fullPath));
    } else if (entry.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walk(CONTENT_DIR);
let processedCount = 0;

for (const filePath of files) {
  const content = readFileSync(filePath, 'utf-8');
  const parsed = parseFrontmatter(content);
  if (!parsed) {
    console.warn(`[SKIP] 無法解析 frontmatter：${relative(CONTENT_DIR, filePath)}`);
    continue;
  }

  const newFrontmatter = migrateFrontmatter(parsed.raw);
  let newBody = convertWikiLinks(parsed.body);
  newBody = convertTables(newBody);
  const newContent = `---\n${newFrontmatter}\n---\n${newBody}`;

  if (DRY_RUN) {
    console.log(`\n[DRY-RUN] ${relative(CONTENT_DIR, filePath)}`);
    console.log('--- 新 frontmatter ---');
    console.log(newFrontmatter);
    console.log('--- 前 200 字正文 ---');
    console.log(newBody.slice(0, 200));
  } else {
    writeFileSync(filePath, newContent, 'utf-8');
    console.log(`[OK] ${relative(CONTENT_DIR, filePath)}`);
  }
  processedCount++;
}

console.log(`\n✅ 處理完成：${processedCount} 個檔案，${totalLinks} 個 wiki-link 被轉換，${totalTables} 個 table 分隔線被標準化`);
if (DRY_RUN) console.log('（Dry-run 模式：未寫入任何檔案）');
