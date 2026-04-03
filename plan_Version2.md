# 個人知識倉儲系統 — 專案計畫書

> **建立日期**：2026-04-03
> **最後更新**：2026-04-03
> **專案類型**：個人知識管理 + 公開部落格
> **狀態**：規劃中

---

## 目錄

- [一、專案目標](#一專案目標)
- [二、核心需求](#二核心需求)
- [三、整體架構](#三整體架構)
- [四、技術選型](#四技術選型)
- [五、目錄結構](#五目錄結構)
- [六、功能模組設計](#六功能模組設計)
  - [6.1 Markdown 內容管理](#61-markdown-內容管理)
  - [6.2 公開網站（Astro）](#62-公開網站astro)
  - [6.3 知識圖譜（D3.js）](#63-知識圖譜d3js)
  - [6.4 GitHub Pages 部署](#64-github-pages-部署)
  - [6.5 CI/CD 自動化（GitHub Actions）](#65-cicd-自動化github-actions)
  - [6.6 自訂域名與 SSL](#66-自訂域名與-ssl)
- [七、工作流程](#七工作流程)
- [八、成本預估](#八成本預估)
- [九、實作時程](#九實作時程)
- [十、未來擴展](#十未來擴展)

---

## 一、專案目標

建立一套個人專屬的知識倉儲系統，整合以下能力：

1. 以 Markdown 撰寫與管理所有筆記
2. 透過 `[[雙向連結]]` 自動生成可互動的知識圖譜（僅限本地使用）
3. 所有內容以 Git 進行版本控制，儲存於 GitHub
4. 架設個人網站，選擇性公開部分文章供全球使用者瀏覽
5. 透過 GitHub Pages 部署靜態網站，並綁定自訂域名

---

## 二、核心需求

| 編號 | 需求                         | 範圍     | 說明                                          |
| ---- | ---------------------------- | -------- | --------------------------------------------- |
| R1   | 支援 Markdown 語法           | 全域     | 含程式碼高亮、數學公式、表格等                |
| R2   | 互動式知識圖譜               | 本地私有 | 自動解析 `[[wikilink]]`，支援篩選、縮放、跳轉 |
| R3   | GitHub 版本控制               | 全域     | Markdown 檔案直接存於 repo                    |
| R4   | 個人公開網站                 | 公開     | 僅展示 `public: true` 的文章                  |
| R5   | Frontmatter 權限控制         | 全域     | 透過 `public: true/false` 標記文章可見性      |
| R6   | GitHub Pages 靜態部署        | 部署     | 零伺服器維護、全球 CDN                        |
| R7   | 自訂域名 + SSL               | 部署     | GitHub Pages 原生支援，自動配發 SSL 憑證      |
| R8   | CI/CD 自動部署               | 部署     | GitHub Actions 推送後自動建構與部署           |

---

## 三、整體架構

```
┌─────────────────────────────────────────────────┐
│                GitHub Repository                 │
│  ┌───────────┐  ┌────────────┐  ┌─────────────┐ │
│  │ /content   │  │/public-site│  │/graph-viewer│ │
│  │  *.md      │  │  (Astro)   │  │ (本地 D3.js)│ │
│  └─────┬─────┘  └─────┬──────┘  └──────┬──────┘ │
└────────┼──────────────┼────────────────┼─────────┘
         │              │                │
         ▼              ▼                ▼
  版本控制所有筆記   GitHub Actions    本地瀏覽器使用
                   自動建構 + 部署
                        │
                        ▼
                ┌───────────────┐
                │ GitHub Pages  │
                │ (全球 CDN)    │
                │ your-domain.com│
                │ 自動 SSL      │
                └───────────────┘
```

---

## 四、技術選型

| 層級         | 技術                  | 選用理由                                              |
| ------------ | --------------------- | ----------------------------------------------------- |
| 內容格式     | Markdown + Frontmatter | 純文字、可版本控制、生態成熟                          |
| 版本控制     | Git + GitHub          | 免費、可靠、與 GitHub Pages 天然整合                  |
| 公開網站     | Astro                 | 原生 Markdown 支援、Content Collections API 過濾靈活、島嶼架構零 JS 效能佳 |
| 知識圖譜     | D3.js (Force Layout)  | 高度客製化、互動功能完整、社群資源豐富               |
| 圖譜資料建構 | Node.js 腳本          | 解析 Markdown 雙向連結並生成 JSON                     |
| Markdown 解析 | remark-wiki-link     | 支援 `[[wikilink]]` 語法轉換                         |
| 程式碼高亮   | Shiki                 | Astro 內建支援、主題豐富                              |
| 部署平台     | GitHub Pages          | 免費、零維護、全球 CDN、自動 SSL                      |
| CI/CD        | GitHub Actions        | 與 GitHub 深度整合、免費額度充足                      |

---

## 五、目錄結構

```
knowledge-base/
├── content/                    # 所有 Markdown 筆記
│   ├── notes/                  # 主要筆記
│   │   ├── laravel/
│   │   ├── docker/
│   │   └── javascript/
│   ├── daily/                  # 每日日誌（可選）
│   └── templates/              # 筆記模板
├── public-site/                # Astro 公開網站原始碼
│   ├── src/
│   │   ├── pages/
│   │   ├── layouts/
│   │   └── components/
│   ├── public/
│   │   └── CNAME              # 自訂域名設定
│   ├── astro.config.mjs
│   └── package.json
├── graph-viewer/               # 本地知識圖譜工具
│   ├── index.html
│   ├── data/
│   │   └── graph.json          # 自動生成的圖譜資料
│   └── styles/
├── scripts/                    # 建構腳本
│   ├── build-graph.mjs         # 解析雙向連結 → 生成圖譜 JSON
│   └── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD 自動部署至 GitHub Pages
└── README.md
```

---

## 六、功能模組設計

### 6.1 Markdown 內容管理

**Frontmatter 規範：**

```yaml
---
title: "文章標題"  #私有文章標題
public_title: "文章標題" #公開文章標題，如果public為true時，文章標題使用public_title，而非title
date: YYYY-MM-DD
tags: [tag1, tag2, tag3]
public: true          # true = 公開 | false = 私有
aliases: [別名1, 別名2]  # 可選，用於圖譜節點識別
---
```

**雙向連結語法：**

```markdown
這篇筆記與 [[另一篇筆記]] 有關。
也可以使用別名顯示：[[另一篇筆記|自訂顯示文字]]。
也可以使用標題關聯：[[另一篇筆記#的標題|自訂顯示文字]]。
```

---

### 6.2 公開網站（Astro）

**核心配置 — `astro.config.mjs`：**

```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkWikiLink from 'remark-wiki-link';

export default defineConfig({
  site: 'https://username.github.io',
  // 若未提供自訂域名，改為：
  // site: 'https://username.github.io',
  // base: '/repo-name',
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [
      [remarkWikiLink, {
        hrefTemplate: (permalink) => `/notes/${permalink}`,
        pageResolver: (name) => [name.replace(/ /g, '-').toLowerCase()],
      }]
    ],
    shikiConfig: {
      theme: 'github-dark',
    }
  }
});
```

**文章過濾邏輯 — 僅建構 `public: true` 的頁面：**

```astro
---
// public-site/src/pages/notes/[...slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const allNotes = await getCollection('notes');
  const publicNotes = allNotes.filter(note => note.data.public === true);

  return publicNotes.map(note => ({
    params: { slug: note.slug },
    props: { note },
  }));
}

const { note } = Astro.props;
const { Content } = await note.render();
---

<html>
  <head><title>{note.data.public_title}</title></head>
  <body>
    <article>
      <h1>{note.data.public_title}</h1>
      <time>{note.data.date}</time>
      <div class="tags">
        {note.data.tags.map(tag => <span class="tag">{tag}</span>)}
      </div>
      <Content />
    </article>
  </body>
</html>
```

---

### 6.3 知識圖譜（D3.js）

> 🔒 僅限本地使用，不部署至公開網站。

**Step 1 — 圖譜資料建構腳本 `scripts/build-graph.mjs`：**

```javascript
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
      const target = match[1].trim().replace(/ /g, '-').toLowerCase();
      if (noteMap.has(target)) {
        links.push({ source: id, target });
      }
    }
  }

  const graphData = { nodes, links };
  await fs.writeFile(
    'graph-viewer/data/graph.json',
    JSON.stringify(graphData, null, 2)
  );
  console.log(`✅ Graph built: ${nodes.length} nodes, ${links.length} links`);
}

buildGraph();
```

**Step 2 — 互動式圖譜前端 `graph-viewer/index.html`：**

功能清單：

| 功能       | 實作方式                          |
| ---------- | --------------------------------- |
| 力導向佈局 | `d3.forceSimulation`              |
| 縮放平移   | `d3.zoom`                         |
| 節點拖曳   | `d3.drag`                         |
| 標籤篩選   | 動態生成 tag 按鈕，切換節點透明度 |
| 文字搜尋   | 即時輸入比對節點名稱              |
| Hover 提示 | 顯示標題、標籤、連結數、公開狀態  |
| 點擊高亮   | 聚焦選定節點及其直接關聯          |
| 雙擊重置   | 還原所有節點與邊的顯示狀態        |
| 節點大小   | 依連結數量動態計算半徑            |
| 顏色分組   | 依第一個 tag 分組著色             |

---

### 6.4 GitHub Pages 部署

GitHub Pages 提供免費的靜態網站託管服務，具備以下優勢：

| 優勢             | 說明                                       |
| ---------------- | ------------------------------------------ |
| 零成本           | 完全免費                                   |
| 零伺服器維護     | 無需管理 VM、Nginx、Docker                 |
| 全球 CDN         | GitHub 自動分發至全球節點，存取速度快      |
| 自動 SSL         | 自動配發並續期 HTTPS 憑證，無需設定 Certbot |
| 高可用性         | GitHub SLA 保障                            |

**限制條件：**

| 限制項目           | 說明                           |
| ------------------ | ------------------------------ |
| 網站類型           | 僅限靜態網站（符合本專案需求） |
| Repository 大小    | 建議 < 1 GB                   |
| 單次部署產出物大小 | < 1 GB                        |
| 建構時間           | < 10 分鐘                     |
| 頻寬限制           | 100 GB/月（個人網站綽綽有餘） |

---

### 6.5 CI/CD 自動化（GitHub Actions）

**`.github/workflows/deploy.yml`：**

```yaml
name: Build & Deploy to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'content/**'
      - 'public-site/**'

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      # 建構公開網站
      - name: Build public site
        run: |
          cd public-site
          npm ci
          npm run build

      # 建構知識圖譜資料（commit 回 repo 供本地使用）
      - name: Build graph data
        run: |
          cd scripts
          npm ci
          node build-graph.mjs

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

---

### 6.6 自訂域名與 SSL

**Step 1 — DNS 設定（在 Domain Registrar 操作）：**
// 若未提供自訂域名與SSL 改用 github page預設

| 類型  | 名稱 | 值                  |
| ----- | ---- | ------------------- |
| A     | @    | 185.199.108.153     |
| A     | @    | 185.199.109.153     |
| A     | @    | 185.199.110.153     |
| A     | @    | 185.199.111.153     |
| CNAME | www  | username.github.io  |

**Step 2 — 新增 CNAME 檔案：**

```
# public-site/public/CNAME
your-domain.com
```

> ⚠️ 此檔案放在 Astro 的 `public/` 目錄中，建構時會自動複製到產出物根目錄。

**Step 3 — GitHub 設定：**

1. 進入 repo → **Settings** → **Pages**
2. **Custom domain** 欄位輸入 `your-domain.com`
3. 勾選 **Enforce HTTPS** ✅
4. 等待 DNS 檢查通過，SSL 憑證將自動配發

---

## 七、工作流程

```
日常使用流程：

1. ✍️  在本地使用 VS Code / Obsidian 編輯 Markdown 筆記
         ↓
2. 📝  使用 [[雙向連結]] 關聯筆記，在 frontmatter 設定 public 狀態
         ↓
3. 🔍  本地執行 `node scripts/build-graph.mjs`
        → 開啟 graph-viewer/index.html 查看互動式知識圖譜
         ↓
4. 📤  git push 到 GitHub（版本控制所有筆記）
         ↓
5. 🤖  GitHub Actions 自動觸發
        → 過濾 public: true 的文章
        → 建構 Astro 靜態網站
        → 部署至 GitHub Pages
         ↓
6. 🌐  全球使用者透過 your-domain.com 閱讀公開文章
```

---

## 八、成本預估

| 項目           | 說明                        | 費用                |
| -------------- | --------------------------- | ------------------- |
| GitHub Pages   | 靜態網站託管                | **$0**              |
| GitHub Actions | CI/CD 建構與部署            | **$0**（免費額度內）|
| SSL 憑證       | GitHub 自動配發             | **$0**              |
| 域名           | 依 Domain Registrar         | ~$10–15/年          |
| **合計**       |                             | **~$1/月（僅域名）**|

> ℹ️ 與原 GCP 方案相比，月費從 ~$3–5 降至接近 $0（僅域名年費攤提）。

---

## 九、實作時程

| 階段      | 任務                                                    | 
| --------- | ------------------------------------------------------- | 
| Phase 1   | 建立 GitHub repo、設計目錄結構、撰寫第一批 Markdown 筆記 | 
| Phase 2   | 建構 Astro 公開網站 + frontmatter 過濾機制              | 
| Phase 3   | 開發 `build-graph.mjs` 解析腳本 + D3.js 知識圖譜介面    | 
| Phase 4   | GitHub Actions CI/CD + GitHub Pages 部署設定            | 
| Phase 5   | 自訂域名 + DNS 設定 + SSL 驗證                          | 

> ℹ️ 與原方案相比，移除了 Docker / Nginx / GCP VM 的設定工作，總時程縮短約 1–2 天。

---

## 十、未來擴展

| 方向             | 說明                                                         |
| ---------------- | ------------------------------------------------------------ |
| 全文搜尋         | 整合 Pagefind 或 Fuse.js，為公開網站加入客戶端搜尋功能       |
| RSS 訂閱         | 為公開文章自動生成 RSS feed                                  |
| 深色/淺色主題    | 公開網站支援主題切換                                         |
| 評論系統         | 整合 Giscus（基於 GitHub Discussions 的評論系統）            |
| 圖譜進階功能     | 時間軸篩選、叢集分析、孤立節點偵測                           |
---

> 📌 本文件將隨專案進展持續更新。