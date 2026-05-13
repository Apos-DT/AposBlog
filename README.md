# APOS — Notes from the Edge of Code

Apos 的个人博客。深色主题、glass nav、Lenis 平滑滚动、GSAP 字符 stagger、自定义光标 + spotlight 卡片。

参考:
- [trae.ai](https://www.trae.ai) — 深色紫色科技感的设计语言
- [jiejoe.com](https://www.jiejoe.com) — 平滑滚动 / 入场动效

## 技术栈

纯静态。零构建。HTML + CSS + 一个 ~600 行的 JS。

- **GSAP 3** + **ScrollTrigger** + **SplitText**(CDN 引入)
- **Lenis** 平滑滚动(CDN 引入)
- **IntersectionObserver** 滚动揭示
- 客户端轻量 Markdown 渲染(零依赖)

部署在 GitHub Pages,根目录服务。

## 目录结构

```
AposBlog/
├── index.html              # 首页(hero / 最新 / 归档 / 关于)
├── post.html               # 文章详情页(?slug=xxx)
├── assets/
│   ├── styles.css          # 设计 tokens + 所有样式
│   └── main.js             # 动效 + 路由 + markdown 渲染
├── content/
│   ├── manifest.json       # 文章索引(标题/日期/tag/excerpt)
│   └── posts/
│       ├── hello-apos-blog.md
│       ├── static-site-as-craft.md
│       └── ai-tooling-thoughts-2026.md
├── .nojekyll               # 关闭 Pages Jekyll
├── LICENSE
└── README.md
```

## 写新文章

1. 在 `content/posts/<slug>.md` 写 Markdown 正文。
2. 在 `content/manifest.json` 的 `posts` 数组顶部插入一条:

   ```json
   {
     "slug": "your-slug",
     "title": "文章标题",
     "excerpt": "首页卡片摘要,2 行内。",
     "tag": "Note",
     "date": "2026-05-13",
     "readTime": "6"
   }
   ```

3. commit & push,GitHub Pages 自动更新。

支持的 Markdown 语法:`# 标题`、`**粗体**`、`*斜体*`、`` `行内代码` ``、 ```代码块```、`> 引用`、`- 列表` / `1. 有序`、`[链接](url)`、`![图片](url)`、`---` 分隔线。

## 本地预览

```bash
# 任一种方式起 HTTP 静态服务即可(不能用 file://,fetch 会被 CORS 拒)
python3 -m http.server 8000
# 或
npx serve .
```

打开 http://localhost:8000

## 部署到 GitHub Pages

仓库 → Settings → Pages:
- Source: `Deploy from a branch`
- Branch: `main` / 根目录 `/ (root)`
- 几分钟后访问 `https://apos-dt.github.io/AposBlog/`

## 设计 tokens 速查

| Token | Value | 用途 |
|---|---|---|
| `--bg` | oklch(0.14 0.012 280) | 主背景 |
| `--accent` | oklch(0.72 0.21 295) | violet 主色 |
| `--accent-2` | oklch(0.78 0.18 220) | cyan 副色 |
| `--accent-warm` | oklch(0.82 0.16 60) | amber 强调(serif italic) |
| `--font-display` | Space Grotesk | 标题 |
| `--font-body` | Plus Jakarta Sans | 正文 |
| `--font-serif` | Fraunces | 斜体强调 |
| `--font-mono` | JetBrains Mono | 元信息 / 代码 |

## License

MIT
