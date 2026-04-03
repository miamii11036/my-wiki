# my-wiki

個人知識倉儲系統 — Markdown 筆記 + Astro 公開網站 + 知識圖譜

## 專案目的

`my-wiki` 是一個以 Markdown 為核心的個人知識倉儲系統，支援 Obsidian 筆記管理，並透過 Astro 框架將公開筆記發佈至 GitHub Pages。

## 目錄結構

```
my-wiki/
├── content/
│   └── notes/
│       └── Algorithm-DataStructure/   # Markdown 筆記
├── public-site/                        # Astro 公開網站
│   ├── src/
│   │   ├── content/config.ts
│   │   ├── pages/
│   │   │   ├── index.astro
│   │   │   └── notes/[...slug].astro
│   │   ├── layouts/BaseLayout.astro
│   │   └── components/
│   ├── scripts/copy-content.mjs
│   ├── astro.config.mjs
│   └── package.json
├── graph-viewer/                       # 知識圖譜（本地使用）
│   ├── data/graph.json                 # 自動生成，勿手動編輯
│   └── index.html                      # D3.js 互動式知識圖譜
├── scripts/                            # 工具腳本
│   ├── build-graph.mjs                 # 解析 wikilink，生成 graph.json
│   └── package.json
└── .github/
    └── workflows/
        └── deploy.yml  # CI/CD：自動建構並部署至 GitHub Pages
```

## 本地開發

```bash
cd public-site
npm install
npm run build
```

`npm run build` 會先執行 `prebuild`，將 `content/notes/` 複製到 `src/content/notes/`，再由 Astro 進行靜態網站建置。

## 知識圖譜

### 建構圖譜資料

```bash
cd scripts && npm install && cd .. && node scripts/build-graph.mjs
```

執行後會在 `graph-viewer/data/graph.json` 生成圖譜資料（包含節點與 wikilink 邊）。

### 查看知識圖譜
```bash
cd my-wiki
npx http-server ./graph-viewer -p 8080 --cors
```

在瀏覽器中直接開啟 `graph-viewer/index.html`（本地使用，不部署至公開網站）。

> **注意**：`graph-viewer/data/graph.json` 為自動生成檔案，每次新增或修改筆記後需重新執行建構腳本。

## 技術棧

- **Astro v5** — 靜態網站框架
- **remark-wiki-link** — Wikilink 語法支援
- **D3.js v7** — 知識圖譜視覺化（`graph-viewer/index.html`）
- **GitHub Pages** — 部署至 `miamii11036.github.io/my-wiki`

## CI/CD 與部署

### 自動部署

每當推送到 `main` 分支，且 `content/` 或 `public-site/` 有變更時，GitHub Actions 會自動執行以下流程：

1. 安裝 `public-site` 依賴（`npm ci`）
2. 建構公開網站（`npm run build`，含 `prebuild` 複製筆記）
3. 建構知識圖譜資料（`node scripts/build-graph.mjs`）
4. 上傳產出物並部署至 GitHub Pages

部署完成後可透過以下網址瀏覽：**https://miamii11036.github.io/my-wiki**

### 手動觸發部署

若需要手動觸發部署，請前往 GitHub 的 **Actions** 頁面，找到 `Build & Deploy to GitHub Pages` workflow，點擊 **Run workflow** 按鈕。
