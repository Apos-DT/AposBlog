# APOS · 赵祥生的个人博客 + Karpathy 风知识库

> Engineering Notes from a Manufacturing Frontline
> Personal Blog · Knowledge Base · Knowledge Graph — built with **Vue 3**.

[![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vue.js)](https://vuejs.org)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite)](https://vitejs.dev)
[![Pinia](https://img.shields.io/badge/Pinia-2-ffd43b)](https://pinia.vuejs.org)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

线上:**<https://apos-dt.github.io/AposBlog/>**

一个**完整的 Vue 3 单页应用**,把"个人博客 + Karpathy 风知识库 + 知识图谱"整合为同一个站点 —— 顶部 nav 在博客与应用之间无缝切换。

---

## 🚀 本地运行(3 步)

```bash
git clone https://github.com/Apos-DT/AposBlog.git
cd AposBlog
npm install
npm run dev          # → http://localhost:5173/
```

要求:**Node ≥ 18** · npm 8+。**纯前端,无后端依赖,数据全存浏览器 localStorage。**

### 其他命令

```bash
npm run build        # 构建到 ./docs/ (供 GitHub Pages 服务)
npm run preview      # 预览生产构建 → http://localhost:4173/AposBlog/
npm run clean        # 清空 dist / docs / node_modules
```

---

## 🗺 站点地图

12 条路由,通过顶部 nav 与左侧菜单切换:

### 博客部分(全宽布局)

| 路由 | 视图 | 说明 |
|---|---|---|
| `#/` | HomeView | 首页 — Hero + 最新文章 + 技能矩阵 + 工作经历 + 归档 + 联系表单 |
| `#/post/:slug` | PostView | **三栏阅读**:左 TOC + 中正文 + 右工具(进度环/字号/主色/收藏/评分/计时/记笔记) |
| `#/playground` | PlaygroundView | CSS3 / HTML5 组件工具间(按钮/表单/Canvas/SVG/视频/上传/定位/Toast) |

### 知识库部分(三栏布局:菜单 + 主区 + 工具栏)

| 路由 | 视图 | 功能 |
|---|---|---|
| `#/dashboard` | DashboardView | 阅读统计 + 最近活动 + 快捷入口 |
| `#/library` | LibraryView | 文章库 CRUD + 搜索 + 筛选 + 排序 + 收藏 |
| `#/notes` | NotesView | 笔记列表 + 搜索 + 标签筛选 + 双向链接计数 |
| `#/notes/:id` | NoteEditView | **Karpathy 模板** + frontmatter + `[[wiki-link]]` 补全 + 反向链接 |
| `#/tags` | TagsView | 标签 CRUD + 调色板 |
| `#/graph` | **GraphView** | **ECharts 知识图谱** — 笔记/标签/文章节点 + 双向链接边,可拖拽缩放 |
| `#/stats` | StatsView | ECharts 4 种图表(状态/标签/活跃度/评分) |
| `#/settings` | SettingsView | 主题色 + 字号 + 数据导出导入清空 |

---

## 🧠 知识库亮点

### Karpathy 风格笔记

`frontmatter + H1 + 一句话总结 + 编号节 + 速查表 + 关联段`,长期可读。

- **6 个内置模板**:复盘 / 速查 / 概念 / 读书 / 问题 / 周记 —— 新建时弹模板选择器
- **frontmatter 可视化编辑**:YAML 字段独立面板,自动识别数组 / 数字 / 布尔
- **GitHub 风 admonition**:`> [!INFO] / [!TIP] / [!WARNING] / [!NOTE] / [!ERROR]`
- **媒体内嵌**:`![video:caption](url.mp4)` / `![audio](url.ogg)` 自动卡片化

### 双向链接(Obsidian / Roam 风)

```markdown
读完《[[Odoo BOM 二开]]》启发我重新理解 #ERP 流程...
              ↑↑                       ↑↑
       输入 [[ 自动补全            内联标签
```

- `[[note-title]]` / `[[note-title|别名]]`
- 笔记底部自动显示:**引用了 / 被引用 / 占位**(未创建)三组关联
- 链接到不存在笔记 → 渲染成红色虚线 + 在图谱里显示成"未链接占位",点击可一键创建

### 知识图谱(ECharts 力导向图)

`/#/graph` 路由 —— 类似 Obsidian Graph View 的可视化:

- **4 类节点**:笔记(紫)/ 标签(黄)/ 文章(青)/ 未链接占位(灰虚)
- **3 类边**:wiki 实线 / tag 虚线 / article 点线
- **交互**:拖拽布局 / 滚轮缩放 / 点击跳转 / 占位节点一键创建
- **控制面板**:节点类型过滤 / 排斥力调节 / 显示孤儿节点 / 重启布局

---

## 📁 目录结构(典型 Vue 项目)

```
AposBlog/
├── package.json              # 唯一的 npm 项目
├── vite.config.js            # Vite 配置 (base, outDir, alias)
├── index.html                # Vite 入口
├── public/                   # 静态资源(原样复制到产物)
│   └── content/
│       ├── manifest.json     # 文章索引
│       └── posts/*.md        # 4 篇博客文章 markdown 源
├── src/
│   ├── main.js               # 应用入口
│   ├── App.vue               # 根组件(背景 + 光标 + Lenis + 布局)
│   ├── router/index.js       # 12 条路由,blog/app 双布局
│   ├── stores/               # 5 个 Pinia store
│   │   ├── _persist.js       # localStorage 自动持久化
│   │   ├── posts.js          # 文章库
│   │   ├── reads.js          # 阅读记录(状态/进度/评分/时长)
│   │   ├── notes.js          # 笔记 + 双向链接索引 + 反向链接
│   │   ├── tags.js           # 标签
│   │   └── settings.js       # 主题 + toast
│   ├── components/           # 公共组件
│   │   ├── AppBackground.vue # 极光 + 噪点背景层
│   │   ├── AppCursor.vue     # 自定义光标(dot + lerp ring)
│   │   ├── AppLayout.vue     # 双布局:blog 全宽 / app 三栏
│   │   ├── AppToastStack.vue # 全局 toast 容器
│   │   ├── IconBase.vue      # 统一 SVG 图标集
│   │   └── ThemeQuickPanel.vue # 右栏默认工具
│   ├── views/                # 路由视图(12 个)
│   │   ├── HomeView.vue          (博客首页)
│   │   ├── PostView.vue          (文章阅读 + 追踪合一)
│   │   ├── PlaygroundView.vue    (CSS3 工具间)
│   │   ├── DashboardView.vue
│   │   ├── LibraryView.vue
│   │   ├── NotesView.vue
│   │   ├── NoteEditView.vue
│   │   ├── TagsView.vue
│   │   ├── GraphView.vue         (知识图谱)
│   │   ├── StatsView.vue
│   │   ├── SettingsView.vue
│   │   └── NotFoundView.vue
│   ├── utils/
│   │   ├── markdown.js       # frontmatter + [[wiki]] + #tag + 渲染
│   │   └── templates.js      # 6 个 Karpathy 模板
│   ├── styles/
│   │   ├── tokens.css        # 设计 token (oklch / 字体 / 间距)
│   │   ├── base.css          # 重置 + 默认元素
│   │   ├── layout.css        # nav + 三栏 grid + 背景 + 光标
│   │   └── components.css    # 通用 ui-* 组件
│   └── data/initial.json     # 应用初始 seed (7 篇互相链接的笔记)
└── docs/                     # Vite 构建产物 (GitHub Pages 服务)
```

---

## 🛠 技术栈

| 层 | 技术 | 用途 |
|---|---|---|
| 框架 | **Vue 3** Composition API + `<script setup>` | 组件化 |
| 路由 | **Vue Router 4** + Hash mode | 12 路由 / Pages 深链不 404 |
| 状态 | **Pinia 2** + 自写 `_persist.js` | 5 store 自动 localStorage 同步 |
| 构建 | **Vite 6** | dev HMR / 生产构建 / chunk 拆分 |
| 可视化 | **ECharts 5** | 知识图谱 + 4 种统计图表 |
| 动效 | **GSAP 3** | Hero 字符 stagger 入场 |
| 滚动 | **Lenis** | 全站平滑滚动 |
| 样式 | 原生 CSS3 + oklch 设计 token | 不依赖任何 UI 框架 |
| 字体 | Space Grotesk · Plus Jakarta Sans · Fraunces · JetBrains Mono | 反 AI Slop |

---

## 💾 数据持久化

所有数据存储于浏览器 `localStorage`,key 前缀 `apos:`:

- `apos:posts` — 文章库(预装 4 篇博客文章 + 用户自定义)
- `apos:reads` — 阅读记录(状态 / 进度 / 评分 / 时长)
- `apos:notes` — 笔记(7 篇 Karpathy 风预装互链示例)
- `apos:tags`  — 标签(7 个预设 + 用户自定义)
- `apos:settings` — 主题色 / 字号

**支持 JSON 一键导出 / 导入**(`#/settings` 页),换设备只需导出 → 导入。

---

## 🚢 部署到 GitHub Pages

仓库 → Settings → Pages 配置:
- **Source**: Deploy from a branch
- **Branch**: `main` / `/docs`

构建并提交即自动部署:

```bash
npm run build           # → docs/ 更新
git add docs
git commit -m "build"
git push origin main
# 约 1 分钟后访问 https://apos-dt.github.io/AposBlog/
```

也可以部署到任何静态服务器(Nginx / Netlify / Vercel / Cloudflare Pages):
**整个 docs/ 目录直接当静态站点服务即可。**

---

## ✍️ 作者

**赵祥生 (Apos)** · 山东科技大学软件工程在读 · 青岛火一五信息科技

- 邮箱: <2411447661@qq.com>
- GitHub: [@Apos-DT](https://github.com/Apos-DT)
- 博客: <https://apos-dt.github.io/AposBlog/>

## 📜 License

[MIT](./LICENSE)
