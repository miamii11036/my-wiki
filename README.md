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
├── graph-viewer/     # Phase 3：知識圖譜（待實作）
├── scripts/          # Phase 3：解析腳本（待實作）
└── .github/
    └── workflows/    # Phase 4：CI/CD（待實作）
```

## 本地開發

```bash
cd public-site
npm install
npm run dev
```

## 建置

```bash
cd public-site
npm run build
```

`npm run build` 會先執行 `prebuild`，將 `content/notes/` 複製到 `src/content/notes/`，再由 Astro 進行靜態網站建置。

## 技術棧

- **Astro v4** — 靜態網站框架
- **remark-wiki-link** — Wikilink 語法支援
- **D3.js** — 知識圖譜視覺化（Phase 3）
- **GitHub Pages** — 部署至 `miamii11036.github.io/my-wiki`
