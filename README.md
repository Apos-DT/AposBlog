# APOS — 赵祥生的个人博客 + Karpathy 风知识库

> Engineering Notes from a Manufacturing Frontline · Local-First Knowledge Graph

一个**完整可本地运行**的全栈前端项目,包含两个互相耦合的模块:

| 模块 | 路径 | 形态 | 用途 |
|---|---|---|---|
| **博客主站** | `/` `/post.html` `/playground.html` | 纯静态 HTML/CSS/JS (零构建) | 长文阅读 / 工程笔记发布 |
| **知识库应用** | `/app/` 源码 → `/app-dist/` 产物 | Vue 3 SPA (Vite + Router + Pinia) | 阅读追踪 + Karpathy 风笔记 CRUD + 双向链接 + 知识图谱 |

线上: <https://apos-dt.github.io/AposBlog/>
应用: <https://apos-dt.github.io/AposBlog/app-dist/>

---

## 🚀 快速开始(本地完整运行)

### 1. 克隆 + 安装

```bash
git clone https://github.com/Apos-DT/AposBlog.git
cd AposBlog
npm run install          # 安装 Vue 应用依赖(博客主站零依赖)
```

要求:**Node ≥ 18** · npm 8+ · Python 3(只为博客主站起静态服务,无 Python 也行,见下)

### 2. 同时跑博客 + 应用(开发模式)

打开**两个终端**:

```bash
# 终端 1 — 博客主站
npm run dev:blog
# → http://localhost:8000/         主页
# → http://localhost:8000/post.html?slug=xxx  文章详情
# → http://localhost:8000/playground.html     CSS3 工具间
```

```bash
# 终端 2 — Vue 知识库应用(热重载)
npm run dev:app
# → http://localhost:5173/         开发模式 Vue 应用
```

### 3. 或者跑生产构建(单端口)

```bash
npm run build            # 构建 Vue 应用 → /app-dist/
npm run serve            # 启动整个项目静态服务器
# → http://localhost:8000/                  博客主页
# → http://localhost:8000/app-dist/         Vue 应用(构建版)
```

### 4. 无 Python 用户

`npm run dev:blog` 用的是 `python3 -m http.server`。如果你没 Python:

```bash
# 用 Node 起的替代:
npx serve . -p 8000

# 或者用 Vite 一键起(已装在 app/node_modules):
cd app && npx vite preview --outDir ../ --port 8000
```

---

## 🧠 知识库特性(亮点)

### Karpathy 风格笔记

`frontmatter + H1 + 编号节 + 速查表 + 关联`,详见博客 §4 三层知识库约定。

- **6 个内置模板**:复盘 / 速查 / 概念 / 读书 / 问题 / 周记
- 新建笔记时自动弹出模板选择器
- frontmatter 可视化编辑(YAML 字段独立面板)

### 双向链接(Obsidian / Roam 风)

```markdown
读完之后参考 [[Odoo BOM 二开:多级拆分]]
                  ↑↑                  ↑↑
              输入 [[ 自动弹出补全
```

- `[[note-title]]` 自动建立链接 + 反向链接
- `[[note-title|别名]]` 自定义显示文本
- 链接到**不存在**的笔记 → 渲染成虚线 + 在图谱里显示成「未链接占位」,**点击可一键创建**
- 笔记编辑器底部自动显示 outLinks / backlinks / missing 三组关联

### 知识图谱(ECharts 力导向图)

`/#/graph` 路由:

- **4 类节点**:笔记(紫)/ 标签(黄)/ 文章(青)/ 未链接占位(灰虚)
- **3 类边**:wiki 链接(实)/ tag 关联(虚)/ article 关联(点)
- **交互**:拖拽 / 缩放 / 点击跳转 / 占位节点一键创建
- **控制面板**:节点类型过滤 / 排斥力调节 / 显示孤儿节点 / 重启布局

### 内联标签 + 行内 markdown 增强

- `#tag-name` 内联标签
- `> [!INFO] / [!TIP] / [!WARNING] / [!NOTE] / [!ERROR]` GitHub 风 admonition
- `![video:caption](url.mp4)` / `![audio:caption](url.ogg)` 自动卡片化媒体

---

## 📁 目录结构

```
AposBlog/
├── package.json                 # 根 — 一键 dev / build / serve 脚本
├── README.md                    # 你正在看的这份
│
├── index.html                   # 博客主页(静态)
├── post.html                    # 文章详情(?slug=xxx,markdown 客户端渲染)
├── playground.html              # CSS3 / HTML5 工具间(组件库)
├── assets/styles.css            # 博客主站全局样式
├── assets/playground.css        # 工具间样式
├── assets/main.js               # 博客主站脚本(GSAP + Lenis + Markdown)
├── content/manifest.json        # 博客文章索引
├── content/posts/*.md           # 博客文章 markdown 源
│
├── app/                         # Vue 应用源码
│   ├── package.json             # Vue/Router/Pinia/Vite/ECharts
│   ├── vite.config.js
│   ├── index.html               # Vite 入口
│   └── src/
│       ├── main.js              # Vue 应用入口
│       ├── App.vue              # 根组件(背景+光标+布局+路由)
│       ├── router/index.js      # 8 路由 (Hash mode)
│       ├── stores/              # 5 Pinia store
│       │   ├── _persist.js      # localStorage 自动持久化
│       │   ├── posts.js         # 文章库
│       │   ├── reads.js         # 阅读记录(状态/进度/评分/时长)
│       │   ├── notes.js         # 笔记 + 双向链接索引 + backlinks
│       │   ├── tags.js          # 标签
│       │   └── settings.js      # 主题 + toast
│       ├── components/          # 7 公共组件
│       │   ├── AppBackground.vue
│       │   ├── AppCursor.vue
│       │   ├── AppLayout.vue
│       │   ├── AppToastStack.vue
│       │   ├── IconBase.vue
│       │   ├── ThemeQuickPanel.vue
│       │   └── (各 view 私有用 scoped style)
│       ├── views/               # 9 路由组件
│       │   ├── DashboardView.vue
│       │   ├── LibraryView.vue
│       │   ├── ReaderView.vue
│       │   ├── NotesView.vue
│       │   ├── NoteEditView.vue
│       │   ├── TagsView.vue
│       │   ├── GraphView.vue    ← 知识图谱
│       │   ├── StatsView.vue
│       │   ├── SettingsView.vue
│       │   └── NotFoundView.vue
│       ├── utils/
│       │   ├── markdown.js      # frontmatter + [[wiki]] + #tag + 渲染
│       │   └── templates.js     # 6 个 Karpathy 模板
│       ├── styles/              # 4 全局样式
│       │   ├── tokens.css
│       │   ├── base.css
│       │   ├── layout.css
│       │   └── components.css
│       └── data/initial.json    # seed(预装 7 篇互相链接的笔记)
│
└── app-dist/                    # Vite 构建产物(git 跟踪,Pages 直接服务)
```

---

## 🎯 8 个路由 / 9 个功能模块

| 路径 | 视图 | 功能 |
|---|---|---|
| `#/` | Dashboard | 阅读统计 + 最近活动 + 快捷入口 |
| `#/library` | Library | 文章库 CRUD + 搜索 + 筛选 + 排序 + 收藏 |
| `#/library/:slug` | Reader | iframe 嵌博客文章 + 状态/评分/计时/关联笔记 |
| `#/notes` | Notes | 笔记列表 + 搜索 + 标签筛选 + 链接数显示 |
| `#/notes/:id` | NoteEdit | **Karpathy 模板 + frontmatter + [[wiki]] 补全 + 反向链接** |
| `#/tags` | Tags | 标签 CRUD + 调色板 |
| `#/graph` | **Graph** | **ECharts 力导向知识图谱** |
| `#/stats` | Stats | ECharts 4 种统计图表 |
| `#/settings` | Settings | 主题 + 数据导入导出 + 清空 |

---

## 💾 数据持久化

所有数据存储在浏览器 `localStorage`,前缀 `apos:`:

- `apos:posts` — 文章库(初始 4 篇 + 用户自定义)
- `apos:reads` — 阅读记录
- `apos:notes` — 笔记
- `apos:tags`  — 标签
- `apos:settings` — 主题 / 字号

**支持 JSON 一键导入/导出**(`#/settings` 页)。换机器只需导出 → 导入。

---

## 🛠 技术栈

| 层 | 技术 | 用途 |
|---|---|---|
| 博客静态 | 原生 HTML/CSS/JS | 零构建,GitHub Pages 直接服务 |
| 博客动效 | GSAP + Lenis (CDN) | 滚动 + 字符 stagger |
| Vue 应用 | **Vue 3** Composition API | 组件化 |
| 路由 | **Vue Router 4** Hash mode | Pages 静态托管深链不 404 |
| 状态 | **Pinia 2** + 自写 _persist | localStorage 自动同步 |
| 构建 | **Vite 6** | 开发 HMR + 生产构建 chunk 拆分 |
| 可视化 | **ECharts 5** | 知识图谱(力导向)+ 4 种统计图 |
| 设计 | **oklch + 设计 token** | 不依赖 UI 框架,深色主题 |
| 字体 | Space Grotesk / Plus Jakarta Sans / Fraunces / JetBrains Mono | 反 AI Slop |

---

## 🚢 部署(GitHub Pages)

仓库已配 Pages,推送 main 分支即自动部署。

```bash
npm run build           # build Vue 应用 + 复制到 /app-dist/
git add -A
git commit -m "..."
git push origin main
# 1 分钟后访问 https://apos-dt.github.io/AposBlog/
```

也可以部署到任何静态服务器(Nginx / Netlify / Vercel):**整个仓库直接静态服务**,无需后端。

---

## 📜 License

MIT — 见 [LICENSE](./LICENSE)。

---

## ✍️ 作者

**赵祥生 (Apos)** · 山东科技大学软件工程在读 · 青岛火一五信息科技

- 邮箱: 2411447661@qq.com
- GitHub: [@Apos-DT](https://github.com/Apos-DT)
