# APOS · 阅读追踪与知识库 (Vue 应用)

博客配套的 Vue 3 单页应用,实现阅读追踪、笔记 CRUD、标签管理、ECharts 统计与本地数据持久化。

线上地址:<https://apos-dt.github.io/AposBlog/app-dist/>

## 技术栈

| 层 | 选型 | 用途 |
|---|---|---|
| 框架 | **Vue 3** Composition API + `<script setup>` | 组件化 |
| 路由 | **Vue Router 4** (Hash mode) | 7 个路由,适配 GitHub Pages 静态托管 |
| 状态 | **Pinia** + 自写 `_persist.js` | 5 个 store,自动 localStorage 持久化 |
| 构建 | **Vite 6** | 开发与生产构建 |
| 可视化 | **ECharts 5** | 4 种图表(饼/柱/折线/柱) |
| 样式 | 原生 CSS3 + 设计 token | 不依赖任何 UI 框架,与博客主站视觉对齐 |
| 数据 | localStorage + JSON 初始 seed | 纯前端,刷新保留 |

## 7 个路由 / 功能模块

| 路径 | 视图 | 功能 |
|---|---|---|
| `#/` | DashboardView | 阅读统计 + 最近文章 + 最近笔记 + 快捷入口 |
| `#/library` | LibraryView | 文章库列表 / 搜索 / 标签筛选 / 状态筛选 / 排序 / **添加**自定义文章 / **删除** / **收藏** |
| `#/library/:slug` | ReaderView | iframe 嵌入博客文章,侧栏标记状态 / 评分 / 收藏 / 计时 / 关联笔记 |
| `#/notes` | NotesView | 笔记列表 / 搜索 / 标签筛选 / 置顶 / 删除 |
| `#/notes/:id` | NoteEditView | 笔记编辑器,Markdown 实时预览 / 关联文章 / 多标签 / 自动保存 |
| `#/tags` | TagsView | 标签创建 / 重命名 / 调色 / 删除 |
| `#/stats` | StatsView | ECharts 可视化:状态分布饼图 / 标签柱状 / 30 天活跃折线 / 评分柱状 |
| `#/settings` | SettingsView | 主题色相 / 字号 / 数据导出 / 导入 / 清空 |

## 数据结构

```js
// Posts (来自博客 manifest + 用户自定义)
{ slug, title, excerpt, tag, date, readTime, external, url }

// Reads (阅读记录)
{ slug, status, progress, rating, collected, durationMin, lastReadAt, finishedAt }

// Notes (笔记)
{ id, title, content, articleSlug, tagIds[], pinned, createdAt, updatedAt }

// Tags (标签)
{ id, name, color }

// Settings
{ hue, fontSize, reducedMotion }
```

所有数据存储于 `localStorage`,key 前缀 `apos:`。可一键导出 JSON 备份/导入。

## 本地开发

```bash
cd app
npm install
npm run dev     # http://localhost:5173
```

## 生产构建

```bash
npm run build       # 输出到 ./dist
npm run deploy      # 构建 + 复制到 ../app-dist (供 GitHub Pages 服务)
```

构建产物拆分:
- `vue-*.js` (~106 KB) — Vue + Router + Pinia
- `echarts-*.js` (~556 KB) — 仅 Stats 页按需加载
- 每个 view 独立 chunk (~5 KB 左右)

## 目录结构

```
app/
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── main.js              # 入口
    ├── App.vue              # 根组件
    ├── router/index.js      # Vue Router
    ├── stores/              # 5 个 Pinia store
    │   ├── _persist.js      # localStorage 持久化辅助
    │   ├── posts.js
    │   ├── reads.js
    │   ├── notes.js
    │   ├── tags.js
    │   └── settings.js
    ├── components/          # 公共组件
    │   ├── AppBackground.vue
    │   ├── AppCursor.vue
    │   ├── AppLayout.vue
    │   ├── AppToastStack.vue
    │   ├── IconBase.vue
    │   └── ThemeQuickPanel.vue
    ├── views/               # 路由组件
    │   ├── DashboardView.vue
    │   ├── LibraryView.vue
    │   ├── ReaderView.vue
    │   ├── NotesView.vue
    │   ├── NoteEditView.vue
    │   ├── TagsView.vue
    │   ├── StatsView.vue
    │   ├── SettingsView.vue
    │   └── NotFoundView.vue
    ├── styles/              # 全局样式
    │   ├── tokens.css       # design token (颜色 / 字体 / 间距)
    │   ├── base.css         # 重置 + 默认
    │   ├── layout.css       # 三栏 grid + nav + 背景层
    │   └── components.css   # 通用 ui-* 组件
    └── data/initial.json    # 初始 seed
```

## 与博客主站的关系

- 视觉风格 / 设计 token 完全继承博客主站,无第三方 UI 框架
- 博客主页 nav 加 "应用 NEW" 链接指向 `/app-dist/`
- ReaderView 通过 iframe 嵌入博客的 `post.html?slug=xxx` 渲染文章正文
- 数据独立,博客静态页不感知应用状态
