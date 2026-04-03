# my-wiki × astro-paper v5.5.1 遷移計畫

## 狀態概覽

| Phase | 說明 | 狀態 |
|-------|------|------|
| Phase 0 | 前置準備 | ⬜ 未開始 |
| Phase 1 | 重建 public-site/ 骨架 | ⬜ 未開始 |
| Phase 2 | 個人化設定 — src/config.ts | ⬜ 未開始 |
| Phase 3 | 個人化設定 — src/constants.ts | ⬜ 未開始 |
| Phase 4 | 調整 astro.config.ts | ⬜ 未開始 |
| Phase 5 | 調整 content.config.ts — blog loader 路徑 | ⬜ 未開始 |
| Phase 6 | 筆記 frontmatter 遷移腳本 | ⬜ 未開始 |
| Phase 7 | 更新 GitHub Actions workflow | ⬜ 未開始 |
| Phase 8 | graph-viewer 保持原狀 | ⬜ 未開始 |
| Phase 9 | 清理 | ⬜ 未開始 |
| Phase 10 | 驗證清單 | ⬜ 未開始 |

---

## Phase 0：前置準備

### 建立遷移分支

```bash
git checkout -b feat/astro-paper-migration
```

### Node.js 版本需求

astro-paper v5.5.1 使用 `astro ^5.16.6`，需要 **Node.js ≥ 18.17.1**（建議使用 Node.js 20，與 `.github/workflows/deploy.yml` 中設定一致）。

```bash
node -v  # 確認版本 ≥ 18.17.1
```

---

## Phase 1：重建 public-site/ 骨架

### 步驟 1-1：清除現有 public-site/ 內容

保留目錄本身，刪除所有檔案（`node_modules/` 若存在也一併刪除）：

```bash
cd public-site
# 列出要刪除的內容（確認後再執行）
ls -la
# 清除
rm -rf src scripts public astro.config.mjs tsconfig.json package.json package-lock.json node_modules .gitignore
```

### 步驟 1-2：從 astro-paper v5.5.1 複製完整結構

從 GitHub 下載 astro-paper v5.5.1 的 zip 並解壓至 `public-site/`：

```bash
cd /tmp
curl -L https://github.com/satnaing/astro-paper/archive/refs/tags/v5.5.1.zip -o astro-paper.zip
unzip astro-paper.zip
# 將所有內容複製到 public-site/（排除 .git）
cp -r astro-paper-5.5.1/. /path/to/my-wiki/public-site/
# 刪除 pnpm-lock.yaml（改用 npm）
rm /path/to/my-wiki/public-site/pnpm-lock.yaml
```

### 步驟 1-3：統一使用 npm，安裝依賴

**不需要**修改 `package.json` 加入 pnpm 相關設定，直接以 npm 安裝：

```bash
cd public-site
npm install
```

這會自動產生 `package-lock.json`，取代 astro-paper 原本的 `pnpm-lock.yaml`。

> **注意**：astro-paper 的 `package.json` 的 `scripts.build` 為：
> ```
> "build": "astro check && astro build && pagefind --site dist && cp -r dist/pagefind public/"
> ```
> 此腳本在 Phase 7 更新 workflow 時需要確認相容性。

---

## Phase 2：個人化設定 — src/config.ts

### 初始佔位值（先填入 test）

編輯 `public-site/src/config.ts`，將以下 4 個欄位設為 `"test"`：

```typescript
export const SITE = {
  website: "test",   // 之後替換為實際部署 URL，如 "https://miamii11036.github.io/my-wiki/"
  author: "test",    // 之後替換為作者名稱
  // ...
  lang: "test",      // 實際應為語言代碼，如 "zh-TW"
  timezone: "test",  // 實際應為 IANA 格式，如 "Asia/Taipei"
  // 其餘欄位保持 astro-paper 預設值
} as const;
```

### src/config.ts 完整欄位說明

以下為 astro-paper v5.5.1 `src/config.ts` 中所有 `SITE` 欄位的完整個人化清單：

| 欄位 | 用途 | 可選值 / 說明 | 建議個人化 |
|------|------|--------------|-----------|
| `website` | 網站完整 URL，用於 SEO、sitemap、canonical URL 等 | 字串，需包含 trailing slash，如 `"https://miamii11036.github.io/my-wiki/"` | **需設定**，目前填 `"test"` |
| `author` | 預設文章作者名稱，顯示於文章頁面與 RSS | 字串，如 `"miamii11036"` | **需設定**，目前填 `"test"` |
| `profile` | 作者個人頁面連結，顯示於 Footer | 字串 URL，如 `"https://github.com/miamii11036"` | 選填，可設定 GitHub 個人頁 |
| `desc` | 網站描述，用於 SEO meta description 與首頁副標題 | 字串，如 `"我的個人知識庫與學習筆記"` | **建議設定** |
| `title` | 網站標題，顯示於 Header、`<title>` 等 | 字串，如 `"My Wiki"` | **建議設定** |
| `ogImage` | 預設 Open Graph 圖片檔名（放於 `public/`） | 字串，如 `"og-image.jpg"` | 選填，可先保持預設 |
| `lightAndDarkMode` | 是否啟用亮/暗主題切換按鈕 | `true` / `false` | 建議保持 `true` |
| `postPerIndex` | 首頁顯示的最新文章數量 | 正整數，預設 `4` | 可依偏好調整 |
| `postPerPage` | 文章列表每頁顯示數量 | 正整數，預設 `4` | 可依偏好調整 |
| `scheduledPostMargin` | 排程發布的緩衝時間（毫秒），用於 `pubDatetime` 略早於現在的文章 | 預設 `15 * 60 * 1000`（15 分鐘） | 通常不需更動 |
| `showArchives` | 是否顯示「封存」頁面入口 | `true` / `false` | 保持 `true` 即可 |
| `showBackButton` | 文章詳細頁是否顯示「返回」按鈕 | `true` / `false` | 建議保持 `true` |
| `editPost.enabled` | 是否啟用「編輯此頁」連結 | `true` / `false` | 若使用 GitHub 可設 `true` |
| `editPost.text` | 「編輯此頁」連結文字 | 字串，如 `"Edit page"` | 可改為 `"在 GitHub 編輯"` |
| `editPost.url` | 「編輯此頁」連結基礎 URL | 字串，如 `"https://github.com/miamii11036/my-wiki/edit/main/content/notes/"` | **需設定**（若啟用） |
| `dynamicOgImage` | 是否動態產生 OG 圖片（使用 satori） | `true` / `false` | 保持 `true` |
| `dir` | 文字方向 | `"ltr"` / `"rtl"` / `"auto"` | 中文請保持 `"ltr"` |
| `lang` | HTML `lang` 屬性，影響 SEO 與瀏覽器行為 | IETF 語言代碼，如 `"zh-TW"` / `"en"` | **需設定**，目前填 `"test"`（正式值為 `"zh-TW"`） |
| `timezone` | 預設全域時區，影響文章日期顯示與排程 | IANA 時區格式，如 `"Asia/Taipei"` | **需設定**，目前填 `"test"`（正式值為 `"Asia/Taipei"`） |

---

## Phase 3：個人化設定 — src/constants.ts

### SOCIALS（社群連結）

`public-site/src/constants.ts` 中的 `SOCIALS` 陣列控制頁面上顯示的社群圖示連結。
**先保留 astro-paper 預設值**，之後再依需求修改或移除不需要的社群項目。

```typescript
// 之後依需求調整，例如只保留 GitHub：
export const SOCIALS: Social[] = [
  {
    name: "GitHub",
    href: "https://github.com/miamii11036",
    linkTitle: `${SITE.title} on GitHub`,
    icon: IconGitHub,
  },
] as const;
```

### SHARE_LINKS（文章分享連結）

`SHARE_LINKS` 陣列控制文章詳細頁的分享按鈕。
**先保留 astro-paper 預設值**（含 WhatsApp、Facebook、X、Telegram、Pinterest、Mail）。

---

## Phase 4：調整 astro.config.ts

編輯 `public-site/astro.config.ts`，在原有 astro-paper 設定基礎上新增 `base` 設定，並更新 `site`：

```typescript
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
// 注意：不再從 SITE.website 取得 site，改為直接寫死部署 URL
// （因為 SITE.website 目前為 "test"，若 base 設定有誤會造成 sitemap 錯誤）

export default defineConfig({
  site: 'https://miamii11036.github.io',  // ← 設定部署網域
  base: '/my-wiki',                        // ← 設定部署基礎路徑
  integrations: [
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
  ],
  markdown: {
    // 保留 astro-paper 原有 markdown 設定
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    preserveScriptOrder: true,
  },
});
```

> **注意**：原來的 `remarkObsidianLinks` 插件**不再需要**。所有 Obsidian wiki-link 會由 Phase 6 的遷移腳本在筆記 Markdown 正文中預先轉換為標準連結。

---

## Phase 5：調整 content.config.ts — blog loader 路徑

### 修改 BLOG_PATH

編輯 `public-site/src/content.config.ts`，將 `BLOG_PATH` 從 `"src/data/blog"` 改為直接指向 `../../content/notes`（相對於 `public-site/` 根目錄）：

```typescript
// 修改前
export const BLOG_PATH = "src/data/blog";

// 修改後
export const BLOG_PATH = "../../content/notes";
```

這樣 astro-paper 的 glob loader 會直接讀取 repo 根目錄的 `content/notes/` 下所有 `.md` 檔案，**不需要 copy-content.mjs 腳本**。

### 修改 package.json scripts

編輯 `public-site/package.json`，移除 `prebuild` script 及 `build` 中的 `npm run prebuild &&` 部分：

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build && pagefind --site dist && cp -r dist/pagefind public/",
    "preview": "astro preview",
    "sync": "astro sync",
    "astro": "astro"
  }
}
```

---

## Phase 6：筆記 frontmatter 遷移腳本

### 建立腳本 scripts/migrate-frontmatter.mjs

建立 `scripts/migrate-frontmatter.mjs`，批次處理 `content/notes/` 下所有 `.md` 檔案。

#### 遷移邏輯

| 來源欄位 | 目標欄位 | 轉換規則 |
|----------|----------|----------|
| `title` | `title` | 直接保留原始值（如 `"8堆疊Stack"`） |
| （無） | `description` | 自動填入 `title` 的值作為 placeholder |
| `date` | `pubDatetime` | 轉為 ISO 8601 格式（`2026-04-03` → `2026-04-03T00:00:00.000Z`） |
| `tags` | `tags` | 直接保留原始值 |
| `public` | `draft` | `public: true` → `draft: false`；`public: false` → `draft: true` |
| `public_title` | （移除） | 不再需要 |
| `aliases` | （移除） | 不再需要 |
| `date` | （移除） | 已轉換至 `pubDatetime` |

#### Obsidian wiki-link 轉換（正文）

掃描 Markdown 正文，轉換所有 wiki-link 語法：

- `[[target|alias]]` → `[alias](./target.md)`
- `[[target]]` → `[target](./target.md)`

**範例**（`9A【題目】使用堆疊模擬佇列.md`）：

```markdown
# 轉換前
+ [[8堆疊Stack|堆疊是後進先出]]
+ [[9佇列Queue|佇列是先進先出]]

# 轉換後
+ [堆疊是後進先出](./8堆疊Stack.md)
+ [佇列是先進先出](./9佇列Queue.md)
```

#### 腳本範例

```javascript
// scripts/migrate-frontmatter.mjs
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, '../content/notes');
const DRY_RUN = process.argv.includes('--dry-run');

// 解析 frontmatter（簡易 YAML 解析）
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  return { raw: match[1], body: match[2] };
}

// 轉換 frontmatter
function migrateFrontmatter(rawYaml, body) {
  const lines = rawYaml.split('\n');
  const data = {};
  for (const line of lines) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (m) data[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  }

  const title = data.title || '';
  const description = title;
  const pubDatetime = data.date ? `${data.date}T00:00:00.000Z` : '';
  const tags = rawYaml.match(/^tags:\s*\[([^\]]*)\]/m)?.[1] || 'others';
  const draft = data.public === 'false' ? 'true' : 'false';

  const newFrontmatter = [
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `pubDatetime: ${pubDatetime}`,
    `tags: [${tags}]`,
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

  const newFrontmatter = migrateFrontmatter(parsed.raw, parsed.body);
  const newBody = convertWikiLinks(parsed.body);
  const newContent = `---\n${newFrontmatter}\n---\n${newBody}`;

  if (DRY_RUN) {
    console.log(`\n[DRY-RUN] ${relative(CONTENT_DIR, filePath)}`);
    console.log('--- 新 frontmatter ---');
    console.log(newFrontmatter);
  } else {
    writeFileSync(filePath, newContent, 'utf-8');
    console.log(`[OK] ${relative(CONTENT_DIR, filePath)}`);
  }
  processedCount++;
}

console.log(`\n✅ 處理完成：${processedCount} 個檔案，${totalLinks} 個 wiki-link 被轉換`);
if (DRY_RUN) console.log('（Dry-run 模式：未寫入任何檔案）');
```

#### 使用方式

```bash
# 預覽變更（不寫入）
node scripts/migrate-frontmatter.mjs --dry-run

# 實際執行轉換
node scripts/migrate-frontmatter.mjs
```

> **重要**：執行前請先確認 `content/notes/` 已用 Git 追蹤（或備份），以便確認轉換結果後可回溯。

---

## Phase 7：更新 GitHub Actions workflow

編輯 `.github/workflows/deploy.yml`，移除 prebuild 步驟，確認 pagefind 正常運作：

```yaml
name: Build & Deploy to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'content/**'
      - 'public-site/**'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      # 建構公開網站
      - name: Install dependencies
        working-directory: public-site
        run: npm ci

      - name: Build public site
        working-directory: public-site
        run: npm run build
        # astro-paper 的 build script 包含：
        # astro check && astro build && pagefind --site dist && cp -r dist/pagefind public/
        # pagefind 由 npm 依賴管理，npm ci 會安裝，無需額外步驟

      # 建構知識圖譜資料（供本地使用）
      - name: Build graph data
        run: |
          cd scripts
          npm ci
          cd ..
          node scripts/build-graph.mjs

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: public-site/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

> **說明**：
> - 工作目錄維持 `public-site`
> - 使用 `npm ci` + `npm run build`（和之前一致）
> - `pagefind` 已列在 astro-paper 的 `devDependencies`，`npm ci` 時會自動安裝，不需要額外的安裝步驟
> - `prebuild` 步驟（`copy-content.mjs`）已移除，不再需要
> - `graph-viewer` 相關步驟保持不變

---

## Phase 8：graph-viewer 保持原狀

`graph-viewer/` 目錄是獨立的本地工具（D3.js + HTML），**完全不部署至 GitHub Pages**，僅供本地使用。

**決策**：此次遷移不影響 `graph-viewer/`，原因如下：
1. `graph-viewer/` 與 `public-site/` 完全獨立，無共用程式碼
2. astro-paper 的主題風格套用不需整合圖譜功能
3. `graph-viewer/` 讀取 `graph-viewer/data/graph.json`，由 `scripts/build-graph.mjs` 產生，兩者均維持原狀

以下檔案**不動**：
- `graph-viewer/index.html`
- `graph-viewer/data/graph.json`
- `scripts/build-graph.mjs`
- `scripts/package.json`
- `scripts/package-lock.json`

---

## Phase 9：清理

遷移完成並確認網站正常運作後，刪除以下不再需要的檔案：

| 檔案 / 目錄 | 原因 |
|------------|------|
| `public-site/scripts/copy-content.mjs` | Phase 5 已改用直接路徑，不再需要複製腳本 |
| `public-site/astro.config.mjs` | 已被 astro-paper 的 `astro.config.ts`（TypeScript 版）取代 |
| 舊的 `public-site/src/content/config.ts` | 已被 astro-paper 的 `src/content.config.ts` 取代 |
| 舊的 `public-site/src/layouts/` | 已被 astro-paper 的 layouts 取代 |
| 舊的 `public-site/src/components/` | 已被 astro-paper 的 components 取代 |
| 舊的 `public-site/src/pages/` | 已被 astro-paper 的 pages 取代 |

```bash
# 在 Phase 1 清除 public-site/ 時這些檔案應已移除
# 確認清理完成：
ls public-site/scripts/  # 應為空或不存在
```

---

## Phase 10：驗證清單

完成所有 Phase 後，依序確認以下項目：

### 本地驗證

- [ ] `npm run dev`（於 `public-site/`）能正常啟動，無報錯
- [ ] 瀏覽器開啟 `http://localhost:4321/my-wiki/`，首頁正常顯示
- [ ] 筆記正確顯示在首頁 blog 列表（含正確標題、日期、標籤）
- [ ] 標籤頁面（`/my-wiki/tags/`）正常列出所有標籤
- [ ] 點擊標籤後能正確篩選文章
- [ ] 搜尋功能（pagefind）需先執行 `npm run build` 後測試（`npm run preview`）
- [ ] 亮/暗主題切換按鈕正常運作
- [ ] 文章詳細頁的 wiki-link 已轉換為標準 Markdown 連結，點擊可正常導向

### 建構驗證

- [ ] `npm run build`（於 `public-site/`）成功完成，無 TypeScript 錯誤
- [ ] `dist/` 目錄產生，`dist/pagefind/` 存在
- [ ] `npm run preview` 能正常預覽，搜尋功能正常

### 部署驗證

- [ ] 推送 `feat/astro-paper-migration` 分支觸發 GitHub Actions
- [ ] GitHub Actions workflow 成功完成
- [ ] `https://miamii11036.github.io/my-wiki/` 正常顯示新版網站

---

## 風險與注意事項

### ⚠️ 風險 1：frontmatter 遷移的 YAML 解析

腳本範例使用簡易正則解析 frontmatter，對於複雜 YAML（多行值、巢狀結構等）可能解析錯誤。
**建議**：正式執行前，先以 `--dry-run` 確認所有檔案的轉換結果，並考慮使用 `gray-matter` 等成熟的 YAML 解析庫。

### ⚠️ 風險 2：pagefind 在 CI 的相容性

astro-paper 的 build script 包含 `pagefind --site dist`，需確認 `pagefind` 在 CI（Ubuntu latest）上能正常執行。
`pagefind` 已列於 `devDependencies`，`npm ci` 後應可直接使用。若遇到問題，確認 Node.js 版本是否符合 pagefind 需求。

### ⚠️ 風險 3：content.config.ts 的相對路徑

將 `BLOG_PATH` 設為 `"../../content/notes"` 是相對於 `public-site/` 根目錄的路徑。Astro 的 glob loader 解析相對路徑時，以專案根目錄（即 `public-site/`）為基準，因此 `../../content/notes` 會正確指向 repo 根目錄的 `content/notes/`。**建議本地先測試確認**，再推送至 CI。

### ⚠️ 風險 4：astro-paper TypeScript 嚴格模式

astro-paper 使用嚴格的 TypeScript 設定，`astro check` 會在 build 時進行型別檢查。若筆記的 frontmatter 欄位有不符合 schema 的值（如 `pubDatetime` 格式錯誤），build 將失敗。**建議**：先執行 `npm run sync` 確認 content collection 類型正常，再執行 `npm run build`。

### ⚠️ 風險 5：cp -r 指令在 Windows CI 環境

astro-paper 的 build script 包含 `cp -r dist/pagefind public/`，此指令在 Linux/macOS 有效，但在 Windows 環境（若未來有需要）可能需要調整。目前 GitHub Actions 使用 `ubuntu-latest`，無此問題。

### ℹ️ 注意：SITE.website 與 astro.config.ts 的 site

Phase 2 中 `SITE.website` 設為 `"test"`，而 Phase 4 中 `astro.config.ts` 的 `site` 直接設為 `'https://miamii11036.github.io'`。兩者分別控制不同的功能：
- `astro.config.ts` 的 `site` 影響 Astro 的 URL 生成、sitemap 基礎 URL
- `SITE.website` 主要用於 Open Graph、RSS 等 meta 設定

正式上線前需將 `SITE.website` 更新為完整的部署 URL（`https://miamii11036.github.io/my-wiki/`）。
