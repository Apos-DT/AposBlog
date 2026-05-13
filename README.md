# APOS — 赵祥生的工程笔记

> Engineering Notes from a Manufacturing Frontline

赵祥生(Apos)的个人博客。深色主题 + Lenis 平滑滚动 + GSAP 字符 stagger + 自定义光标 + 卡片 spotlight。

**线上**:https://apos-dt.github.io/AposBlog/

## 关于作者

20 岁,青岛。山东科技大学软件工程在读。目前在**青岛火一五信息科技**做 Odoo ERP 二开与工业机器视觉。

- 手机:189 6352 2393
- 邮箱:2411447661@qq.com
- 微信:Xs2411447661
- GitHub:[Apos-DT](https://github.com/Apos-DT)

## 视觉参考

- [trae.ai](https://www.trae.ai) — 深色紫色科技感的设计语言
- [jiejoe.com](https://www.jiejoe.com) — 平滑滚动 / 入场动效

## 技术栈

纯静态。零构建。HTML + CSS + 一个 ~600 行的 JS。

- **GSAP 3** + **ScrollTrigger** + **SplitText**(CDN)
- **Lenis** 平滑滚动(CDN)
- **IntersectionObserver** 滚动揭示
- 客户端轻量 Markdown 渲染(零依赖)

部署在 GitHub Pages,根目录服务。

## 目录结构

```
AposBlog/
├── index.html              # 首页(hero / 文章 / 技能 / 经历 / 归档 / 关于)
├── post.html               # 文章详情页(?slug=xxx)
├── assets/
│   ├── styles.css          # 设计 tokens + 所有样式
│   └── main.js             # 动效 + 路由 + markdown 渲染
├── content/
│   ├── manifest.json       # 文章索引(标题/日期/tag/excerpt)
│   └── posts/
│       ├── odoo-erp-manufacturing-customization.md
│       ├── industrial-vision-system-pitfalls.md
│       ├── springboot-vue-fullstack-craft.md
│       └── python-scraping-pandas-django.md
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

支持的 Markdown:`# 标题`、`**粗体**`、`*斜体*`、`` `行内代码` ``、 ```代码块```、`> 引用`、`- 列表` / `1. 有序`、`[链接](url)`、`![图片](url)`、`---` 分隔线。

## 本地预览

```bash
python3 -m http.server 8000
# 或
npx serve .
```

打开 http://localhost:8000

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
