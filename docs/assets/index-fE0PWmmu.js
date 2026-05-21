const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/HomeView-CJo4xh--.js","assets/vue-CGH0Fj-A.js","assets/posts-D1IEtzYn.js","assets/gsap-CzGW6FVa.js","assets/lenis-BEW9yqGz.js","assets/HomeView-ly1fK62X.css","assets/PostView-BR_Ybcws.js","assets/PostView-TxfRb_9n.css","assets/PlaygroundView-CAhMJvDF.js","assets/PlaygroundView-eTArX6pP.css","assets/DashboardView-ClCJXfyz.js","assets/DashboardView-QLOZTLWq.css","assets/LibraryView-Rvy9S4Ir.js","assets/LibraryView-ANUdwy8k.css","assets/NotesView-sFR0hFTL.js","assets/NotesView-ClrWPdxR.css","assets/NoteEditView-DcsUgU7G.js","assets/NoteEditView-R5cT4rYv.css","assets/TagsView-_mzoRaTA.js","assets/TagsView-DuUoTcNE.css","assets/GraphView-DdIyDUjS.js","assets/echarts-qCor5qs6.js","assets/GraphView-BpwlWlHG.css","assets/ChatView-DrcM3TCO.js","assets/chat-C9z2VBYi.js","assets/ChatView-CcObtQdQ.css","assets/GuestbookView-BQYQInQL.js","assets/GuestbookView-qXYkJrj0.css","assets/StatsView-DD7NtIpc.js","assets/StatsView-CPv1-0TE.css","assets/SettingsView-DQeMMBdt.js","assets/SettingsView-Bw7XPNjJ.css","assets/NotFoundView-bAf2as9E.js","assets/NotFoundView-OKIYwxCK.css"])))=>i.map(i=>d[i]);
import{H as pt,n as H,u as C,s as K,r as Z,t as k,g as A,d as p,F as V,c as S,B as nt,z as E,A as _,v as ot,p as ht,l as M,I,R as P,k as F,K as ft,J as mt,G as gt,e as B,w as X,C as vt,f as kt,x as yt,a as _t,y as bt,i as wt,m as Mt,b as At,h as $t}from"./vue-CGH0Fj-A.js";import{L as St}from"./lenis-BEW9yqGz.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const a of e)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function n(e){const a={};return e.integrity&&(a.integrity=e.integrity),e.referrerPolicy&&(a.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?a.credentials="include":e.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(e){if(e.ep)return;e.ep=!0;const a=n(e);fetch(e.href,a)}})();const z="apos";function Et(t,o){try{const n=localStorage.getItem(`${z}:${t}`);return n?JSON.parse(n):typeof o=="function"?o():o}catch(n){return console.warn("[apos] loadState failed",t,n),typeof o=="function"?o():o}}function rt(t,o){try{localStorage.setItem(`${z}:${t}`,JSON.stringify(o))}catch(n){console.warn("[apos] saveState failed",t,n)}}function q(t,o,n){const s=Et(t,n);for(const e of Object.keys(o))s&&s[e]!==void 0&&(o[e].value=s[e]);pt(()=>Object.fromEntries(Object.keys(o).map(e=>[e,o[e].value])),e=>rt(t,e),{deep:!0})}function ve(){const t=[];for(let o=0;o<localStorage.length;o++){const n=localStorage.key(o);n&&n.startsWith(`${z}:`)&&t.push(n)}t.forEach(o=>localStorage.removeItem(o))}function ke(){const t={};for(let o=0;o<localStorage.length;o++){const n=localStorage.key(o);if(n&&n.startsWith(`${z}:`))try{t[n.slice(z.length+1)]=JSON.parse(localStorage.getItem(n))}catch{}}return{version:1,exportedAt:new Date().toISOString(),data:t}}function ye(t){if(!t||!t.data)throw new Error("数据格式不正确");Object.entries(t.data).forEach(([o,n])=>{rt(o,n)})}const G=H("settings",()=>{const t=C(295),o=C(16),n=C(!1),s=C([]);q("settings",{hue:t,fontSize:o,reducedMotion:n},()=>({hue:295,fontSize:16,reducedMotion:!1}));function e(){const g=document.documentElement;g.style.setProperty("--accent",`oklch(0.72 0.21 ${t.value})`),g.style.fontSize=o.value+"px"}function a(g){t.value=Math.max(0,Math.min(360,parseInt(g,10)||0)),e()}function r(g){o.value=parseInt(g,10)||16,e()}function l(g,d,f=2800){const c=Math.random().toString(36).slice(2);s.value.push({id:c,type:g,text:d}),setTimeout(()=>{const i=s.value.findIndex(m=>m.id===c);i>=0&&(s.value[i].leaving=!0),setTimeout(()=>{s.value=s.value.filter(m=>m.id!==c)},300)},f)}return{hue:t,fontSize:o,reducedMotion:n,toasts:s,applyTheme:e,setHue:a,setFontSize:r,pushToast:l}}),xt={__name:"AppBackground",setup(t){const o=C(null);let n=null;return K(()=>{const s=o.value?o.value.querySelectorAll(".blob"):[];if(!s.length)return;const e=a=>{const r=a.clientX/window.innerWidth-.5,l=a.clientY/window.innerHeight-.5;s.forEach((g,d)=>{const f=(d+1)*14;g.style.transform=`translate3d(${r*f}px, ${l*f}px, 0)`})};window.addEventListener("mousemove",e,{passive:!0}),n=()=>window.removeEventListener("mousemove",e)}),Z(()=>n&&n()),(s,e)=>(k(),A(V,null,[e[1]||(e[1]=p("div",{class:"app-bg-grain","aria-hidden":"true"},null,-1)),p("div",{ref_key:"blobsEl",ref:o,class:"app-bg-aurora","aria-hidden":"true"},[...e[0]||(e[0]=[p("span",{class:"blob a"},null,-1),p("span",{class:"blob b"},null,-1),p("span",{class:"blob c"},null,-1)])],512)],64))}},Ct={__name:"AppCursor",setup(t){const o=C(null),n=C(null);let s=0,e=null;return K(()=>{if(!matchMedia("(hover: hover)").matches)return;const a={x:innerWidth/2,y:innerHeight/2},r={x:a.x,y:a.y},l=(y,T,j)=>y+(T-y)*j,g=y=>{a.x=y.clientX,a.y=y.clientY};window.addEventListener("mousemove",g,{passive:!0});const d=()=>{r.x=l(r.x,a.x,.16),r.y=l(r.y,a.y,.16),o.value&&(o.value.style.transform=`translate3d(${a.x-3}px, ${a.y-3}px, 0)`),n.value&&(n.value.style.transform=`translate3d(${r.x-18}px, ${r.y-18}px, 0)`),s=requestAnimationFrame(d)};d();const f=()=>document.body.classList.add("cursor-hover"),c=()=>document.body.classList.remove("cursor-hover"),i=()=>{document.querySelectorAll('a, button, .ui-card, .post-card, [data-cursor="link"]').forEach(y=>{y.addEventListener("mouseenter",f),y.addEventListener("mouseleave",c)})};i();const m=new MutationObserver(()=>i());m.observe(document.body,{childList:!0,subtree:!0}),e=()=>{cancelAnimationFrame(s),window.removeEventListener("mousemove",g),m.disconnect(),c()}}),Z(()=>e&&e()),(a,r)=>(k(),A(V,null,[p("div",{ref_key:"dot",ref:o,class:"app-cursor-dot","aria-hidden":"true"},null,512),p("div",{ref_key:"ring",ref:n,class:"app-cursor-ring","aria-hidden":"true"},null,512)],64))}},Lt=[{slug:"odoo-erp-manufacturing-customization",title:"在 Odoo 里做制造业 ERP 二开:销采产存质财全链路笔记",excerpt:"从客户手工 Excel 跑产线,到 Odoo 把销售-采购-库存-生产-质检-财务跑通。这篇拆开几个月里的关键二开决策与踩坑。",tag:"ERP",date:"2026-05-13",readTime:12,external:!1,url:"../../post.html?slug=odoo-erp-manufacturing-customization"},{slug:"industrial-vision-system-pitfalls",title:"工业机器视觉现场交付的 5 个稳定性陷阱",excerpt:"上位机/下位机联调、产线异常定位、通信稳定性优化——实验室能跑、现场就崩的真实原因。",tag:"Vision",date:"2026-04-22",readTime:10,external:!1,url:"../../post.html?slug=industrial-vision-system-pitfalls"},{slug:"springboot-vue-fullstack-craft",title:"Spring Boot + Vue3 全栈工程化:从权限到大屏的实战沉淀",excerpt:"在既有项目上做功能迭代、权限增强、数据可视化大屏。Spring Boot + Vue3 的连接处藏着多少坊。",tag:"Fullstack",date:"2025-09-18",readTime:8,external:!1,url:"../../post.html?slug=springboot-vue-fullstack-craft"},{slug:"python-scraping-pandas-django",title:"用 Selenium + Pandas + Django 做一套招聘数据采集分析",excerpt:"从爬取动态页面,到 Pandas 清洗,再到 Django 可视化展示——一个完整的数据小项目从 0 到 1。",tag:"Data",date:"2025-06-08",readTime:7,external:!1,url:"../../post.html?slug=python-scraping-pandas-django"}],Ot=[{id:"t-erp",name:"ERP",color:"oklch(0.74 0.20 295)"},{id:"t-vision",name:"Vision",color:"oklch(0.80 0.17 220)"},{id:"t-fullstack",name:"Fullstack",color:"oklch(0.84 0.15 60)"},{id:"t-data",name:"Data",color:"oklch(0.80 0.17 160)"},{id:"t-study",name:"学习",color:"oklch(0.77 0.18 320)"},{id:"t-think",name:"思考",color:"oklch(0.80 0.15 30)"},{id:"t-cheat",name:"速查",color:"oklch(0.76 0.17 180)"}],It=[{id:"n-welcome",title:"欢迎使用 APOS 知识库",content:`---
type: meta
status: pinned
date: 2026-05-20
---

# 欢迎使用 APOS 知识库

> 这是一个 **Karpathy 风格** 的本地优先知识库 — frontmatter + 编号节 + 速查条目 + 双向链接。

## 1. 你能做什么

- 用 [[Karpathy 风格笔记约定]] 写长文复盘 / 速查 / 概念
- 用 \`[[note-title]]\` 在笔记之间建立 [[双向链接说明]]
- 用 \`#tag\` 内联打标签
- 在 [[知识图谱使用指南]] 看所有笔记的关系网
- 在 **文章库** 跟踪 [[阅读追踪原则]]

## 2. 数据存哪里

所有数据存浏览器 \`localStorage\`,**不发送任何服务器**。换浏览器或清缓存会丢,记得定期到 **设置** 导出 JSON 备份。

## 3. 推荐工作流

1. 读到一篇好文章 → 在文章库标记已读 + 评分
2. 立即新建笔记,用「读书笔记」模板
3. 笔记里 \`[[...]]\` 链接到相关概念笔记
4. 没链接到的概念会变成「占位节点」,点 [[知识图谱使用指南]] 里的占位节点可一键创建
5. 每周回到 **统计** 看活跃度,每月在图谱整理孤儿笔记

#学习 #速查`,articleSlug:null,tagIds:["t-study","t-cheat"],pinned:!0,createdAt:"2026-05-20T00:00:00.000Z",updatedAt:"2026-05-20T00:00:00.000Z"},{id:"n-karpathy-style",title:"Karpathy 风格笔记约定",content:`---
type: cheatsheet
status: living
date: 2026-05-20
tags: [速查, 写作]
references: ["Andrej Karpathy blog", "latex notebook tradition"]
---

# Karpathy 风格笔记约定

> 一行总结:**frontmatter + 编号 H 节 + 速查表 + 关联链接**,十年后还能扫一眼搞清。

## 1. 头部 frontmatter

必备字段:

- \`type\`: postmortem / cheatsheet / concept / reading / question / weekly
- \`status\`: draft / living / done / open
- \`date\`: ISO 日期
- \`tags\`: 数组形式 \`[a, b]\`

## 2. H1 + 一行总结引用

\`# 标题\` 之后立刻一行 \`>\` 引用,**一句话说清这篇笔记是什么**。

## 3. 编号节

所有 H2 都用 \`## 1. xxx\` 编号。这是为了:

- 跨笔记引用方便:「见 [[xxx]] § 2.3」
- 视觉锚点稳定

## 4. 速查表 / 关键操作表

用 markdown 表格列「场景 → 应对」,**让读者用 Cmd+F 能立刻找到**。

| 场景 | 应对 |
|---|---|
| 想新建笔记 | 模板选 [[Karpathy 风格笔记约定]] 这个 cheatsheet 模板 |
| 想链接到别处 | 输入 \`[[\` 触发补全 |

## 5. 末尾「关联」段

收尾段列:

- 相关笔记 \`[[]]\`
- 相关文章 \`[[]]\`
- 标签 \`#\`

这是为了帮你和未来的自己**手工织密图谱**。

## 速查

| 想法 | 选哪个模板 |
|---|---|
| 项目刚结束 | 复盘 |
| 学了个新概念 | 概念 |
| 读完一篇文章 | 读书 |
| 想随手记 cheatsheet | 速查 |
| 一周一回顾 | 周记 |
| 没答案的疑问 | 问题 |

## 关联

- 进阶:[[双向链接说明]]
- 工具:[[知识图谱使用指南]]

#速查 #学习`,articleSlug:null,tagIds:["t-cheat","t-study"],pinned:!0,createdAt:"2026-05-20T01:00:00.000Z",updatedAt:"2026-05-20T01:00:00.000Z"},{id:"n-bidirectional-links",title:"双向链接说明",content:`---
type: concept
status: living
date: 2026-05-20
tags: [学习, 速查]
---

# 双向链接说明

> 一句话:在笔记 A 里写 \`[[B]]\`,B 这边自动出现「A 引用了我」的反向链接。

## 1. 语法

\`\`\`
[[note-title]]              单纯链接
[[note-title|显示文本]]      链接显示成别的文字
\`\`\`

## 2. 触发

输入 \`[[\` 后,编辑器弹出现有笔记标题的补全。↑↓ 选择,Enter 确认。

## 3. 目标不存在怎么办

仍然可以写 \`[[不存在的标题]]\`。这会:

- 在预览里显示**红色虚线**
- 在 [[知识图谱使用指南]] 里显示成「未链接占位」灰色节点
- 点占位节点 → 一键创建对应笔记

这是「**先建语义,后填实质**」的写法,Roam / Obsidian / Logseq 同款。

## 4. 反向链接

打开任意一篇笔记,底部会显示:

- **引用了**(outLinks):这篇里写了哪些 \`[[]]\`
- **被引用**(backlinks):哪些笔记 \`[[]]\` 提到了我

## 5. 跟 #tag 的区别

| | wiki 链接 \`[[X]]\` | 标签 \`#x\` |
|---|---|---|
| 目标 | 一篇具体笔记 | 一个分类 |
| 颗粒度 | 强精确 | 弱聚类 |
| 图谱节点 | 笔记节点 | 标签节点 |

## 关联

- 上层:[[Karpathy 风格笔记约定]]
- 可视化:[[知识图谱使用指南]]

#学习`,articleSlug:null,tagIds:["t-study","t-cheat"],pinned:!1,createdAt:"2026-05-20T02:00:00.000Z",updatedAt:"2026-05-20T02:00:00.000Z"},{id:"n-graph-guide",title:"知识图谱使用指南",content:`---
type: cheatsheet
status: living
date: 2026-05-20
tags: [速查]
---

# 知识图谱使用指南

> 力导向图,看清你的笔记之间的真实关系。

## 1. 节点 4 类

| 颜色 | 类型 | 来源 |
|---|---|---|
| 紫色 | 笔记 | \`notes\` store |
| 黄色 | 标签 | \`tags\` store(只显示被用过的) |
| 青色 | 文章 | \`posts\` store(只显示有笔记关联的) |
| 灰色虚线 | 未链接占位 | 笔记里 \`[[X]]\` 但 X 不存在 |

## 2. 边 3 类

- **实线**(紫色):笔记 → 笔记(\`[[wiki-link]]\`)
- **虚线**(黄色):笔记 → 标签
- **点线**(青色):笔记 → 文章(articleSlug 关联)
- **灰虚线**:笔记 → 未链接占位

## 3. 交互

| 想做 | 怎么做 |
|---|---|
| 跳到笔记 | 点笔记节点 |
| 跳到文章 | 点文章节点 |
| 按标签过滤笔记 | 点标签节点 |
| 创建占位笔记 | 点灰色占位节点 |
| 拖动节点 | 鼠标按住拖 |
| 缩放 | 滚轮 |

## 4. 控制面板

右侧控制面板可:

- 切换 4 类节点显示
- 调排斥力(布局松紧)
- 显示/隐藏「孤儿节点」(没任何链接的笔记)
- 重启布局 / 复位缩放

## 5. 健康图谱的特征

按 [[Karpathy 风格笔记约定]] 长期维护后,你的图谱应当:

- **孤儿节点 < 20%** — 多数笔记至少与一篇相连
- **占位节点 < 30%** — 大部分 \`[[]]\` 已经填实
- **核心枢纽** 明显:几篇笔记被多次引用,形成「概念中心」

如果孤儿太多,该回去给每篇笔记的末尾「关联」段加 \`[[]]\`。

## 关联

- 基础:[[双向链接说明]]
- 写法:[[Karpathy 风格笔记约定]]

#速查`,articleSlug:null,tagIds:["t-cheat","t-study"],pinned:!1,createdAt:"2026-05-20T03:00:00.000Z",updatedAt:"2026-05-20T03:00:00.000Z"},{id:"n-reading-protocol",title:"阅读追踪原则",content:`---
type: concept
status: living
date: 2026-05-20
tags: [学习]
---

# 阅读追踪原则

> 一句话:**读 ≠ 读完。** 真正读完=能用自己话复述给别人 + 笔记写完 + 知道还有什么不懂。

## 1. 阅读状态机

- 未读 → 在读 → 已读
- 在读阶段:每次回来 ReaderView 自动累计阅读分钟
- 已读:进度 ≥80% 自动跳转

## 2. 一篇文章读完后该做的

- [ ] 评分(1-5 ★)— 用自己的尺度,不要套别人
- [ ] 决定要不要 **收藏**(⁠3 个月还会回来读吗?)
- [ ] 新建[[读书笔记模板|读书笔记]] — 用 ReaderView 上的「记笔记」按钮一键创建
- [ ] 笔记里用 \`[[]]\` 链接到至少 1 个已有概念

## 3. 不写笔记 = 没读

按 Karpathy 的话:

> Reading without writing is just consuming.

## 关联

- 配套:[[Karpathy 风格笔记约定]]
- 实施:[[双向链接说明]]

#学习`,articleSlug:"odoo-erp-manufacturing-customization",tagIds:["t-study"],pinned:!1,createdAt:"2026-05-20T04:00:00.000Z",updatedAt:"2026-05-20T04:00:00.000Z"},{id:"n-odoo-bom",title:"Odoo BOM 二开:多级拆分",content:`---
type: reading
status: done
date: 2026-05-15
source: 博客《Odoo 制造业二开》
rating: 5
tags: [ERP, 速查]
---

# Odoo BOM 二开:多级拆分

> 读《[[Odoo 制造业二开]]》关键启发:**原生 MO 一对一拆分对组装类产品太粗**。

## 1. 钩子位置

\`sale.order.action_confirm\` 钩子里,遍历 line 的成品 BOM,**递归生成多级 MO**。

\`\`\`python
class SaleOrder(models.Model):
    _inherit = 'sale.order'

    def action_confirm(self):
        res = super().action_confirm()
        for line in self.order_line:
            self._explode_bom_to_mo(line)
        return res
\`\`\`

## 2. 依赖关系

用 \`mrp.production.move_dest_ids\` 串依赖。前序 MO 完工后,后序 MO 自动 ready。

## 3. 已踩的坑

> [!WARNING] Odoo 19 起 \`groups_id\` 改名 \`group_ids\`,旧 inherit 直接报错。

> [!TIP] 先用 \`fields_get\` 探查目标字段,再写 inherit。

## 4. 速查

| 想做 | 用 API |
|---|---|
| 触发拆分 | \`sale.order.action_confirm\` |
| 串依赖 | \`mrp.production.move_dest_ids\` |
| 查工单状态 | \`mrp.production.state\` |

## 关联

- 上层文章:博客文章 → 标签 \`ERP\`
- 相关:[[阅读追踪原则]]、[[Karpathy 风格笔记约定]]

#ERP #速查`,articleSlug:"odoo-erp-manufacturing-customization",tagIds:["t-erp","t-cheat"],pinned:!1,createdAt:"2026-05-15T10:30:00.000Z",updatedAt:"2026-05-15T10:30:00.000Z"},{id:"n-vision-checklist",title:"工业视觉现场交付 checklist",content:`---
type: cheatsheet
status: living
date: 2026-04-22
tags: [Vision, 速查]
---

# 工业视觉现场交付 checklist

> 实验室能跑、现场就崩 — 90% 是这 5 个的某一个。

## 1. 通信稳定性

- [x] 上位机/下位机是否同一物理网段?
- [x] 通信超时重试机制?
- [x] 心跳包确认存活?

## 2. 光照

- [ ] 现场是否有窗户?有 = 不同时段不同光
- [ ] 备用补光灯?

## 3. 异常处理

- [ ] 检测失败 → 报警 + 抓图保存
- [ ] 通信断 → 自动重连 + 日志

## 4. 日志

- [ ] 每天独立日志文件,按时间命名
- [ ] 关键事件 INFO,异常 ERROR,可远程拉取

## 5. 培训

- [ ] 至少 2 个现场工程师能独立处理 80% 异常
- [ ] 留 1 份打印版的「常见异常 → 应对」表

## 关联

- 配套:[[阅读追踪原则]]
- 风格:[[Karpathy 风格笔记约定]]

#Vision #速查`,articleSlug:"industrial-vision-system-pitfalls",tagIds:["t-vision","t-cheat"],pinned:!1,createdAt:"2026-04-22T08:00:00.000Z",updatedAt:"2026-04-22T08:00:00.000Z"}],st={posts:Lt,tags:Ot,notes:It};function at(t){if(typeof t!="string")return{meta:{},body:t||""};const o=t.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);if(!o)return{meta:{},body:t};const n={};return o[1].split(/\r?\n/).forEach(s=>{const e=s.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);if(!e)return;const a=e[1];let r=e[2].trim();if(!r){n[a]="";return}if(/^\[.*\]$/.test(r)){n[a]=r.slice(1,-1).split(",").map(l=>l.trim().replace(/^["']|["']$/g,"")).filter(Boolean);return}if(/^-?\d+(\.\d+)?$/.test(r)){n[a]=Number(r);return}if(r==="true"||r==="false"){n[a]=r==="true";return}n[a]=r.replace(/^["']|["']$/g,"")}),{meta:n,body:o[2]}}function _e(t,o){const n=Object.keys(t||{}).filter(e=>t[e]!==""&&t[e]!=null);if(!n.length)return o||"";const s=["---"];return n.forEach(e=>{const a=t[e];Array.isArray(a)?s.push(`${e}: [${a.map(r=>JSON.stringify(r)).join(", ")}]`):typeof a=="string"&&/[:#\[\]]/.test(a)?s.push(`${e}: ${JSON.stringify(a)}`):s.push(`${e}: ${a}`)}),s.push("---",""),s.join(`
`)+(o||"")}const Q=/\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g,Y=/(^|[\s\(])#([a-zA-Z0-9_\-一-龥]{1,30})\b/g;function tt(t){if(!t)return[];const o=new Set;let n;for(Q.lastIndex=0;(n=Q.exec(t))!==null;)o.add(n[1].trim());return Array.from(o)}function Rt(t){if(!t)return[];const o=new Set;let n;for(Y.lastIndex=0;(n=Y.exec(t))!==null;)o.add(n[2]);return Array.from(o)}function O(t){return String(t).replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}function L(t){return O(t)}function be(t,o={}){const{body:n}=at(t||""),s=o.onLink||(()=>null),e=n.replace(/\r\n/g,`
`).split(`
`),a=[];let r=0;for(;r<e.length;){const l=e[r];if(/^```/.test(l)){const f=l.replace(/^```/,"").trim(),c=[];for(r++;r<e.length&&!/^```/.test(e[r]);)c.push(e[r]),r++;r++,a.push(`<pre><code${f?` data-lang="${L(f)}"`:""}>${O(c.join(`
`))}</code></pre>`);continue}if(/^\s*---+\s*$/.test(l)){a.push("<hr/>"),r++;continue}const g=l.match(/^(#{1,6})\s+(.*)$/);if(g){a.push(`<h${g[1].length}>${N(g[2],s)}</h${g[1].length}>`),r++;continue}if(/^>\s?/.test(l)){const f=[];for(;r<e.length&&/^>\s?/.test(e[r]);)f.push(e[r].replace(/^>\s?/,"")),r++;const c=f.join(" ").trim(),i=c.match(/^\[!(INFO|TIP|SUCCESS|NOTE|WARNING|WARN|ERROR|DANGER)\]\s*(.*)$/i);if(i){const m=i[1].toUpperCase(),y={INFO:"info",TIP:"tip",SUCCESS:"success",NOTE:"note",WARNING:"warning",WARN:"warning",ERROR:"error",DANGER:"error"}[m],T={INFO:"Info",TIP:"Tip",SUCCESS:"Success",NOTE:"Note",WARNING:"Warning",WARN:"Warning",ERROR:"Error",DANGER:"Danger"}[m];a.push(`<aside class="md-admon md-admon-${y}"><strong>${T} ·</strong> ${N(i[2],s)}</aside>`)}else a.push(`<blockquote>${N(c,s)}</blockquote>`);continue}if(/^\s*[-*]\s+/.test(l)){const f=[];for(;r<e.length&&/^\s*[-*]\s+/.test(e[r]);)f.push(`<li>${N(e[r].replace(/^\s*[-*]\s+/,""),s)}</li>`),r++;a.push(`<ul>${f.join("")}</ul>`);continue}if(/^\s*\d+\.\s+/.test(l)){const f=[];for(;r<e.length&&/^\s*\d+\.\s+/.test(e[r]);)f.push(`<li>${N(e[r].replace(/^\s*\d+\.\s+/,""),s)}</li>`),r++;a.push(`<ol>${f.join("")}</ol>`);continue}if(/^\s*$/.test(l)){r++;continue}const d=[l];for(r++;r<e.length&&!/^\s*$/.test(e[r])&&!/^(#{1,6}\s|```|>|\s*[-*]\s|\s*\d+\.\s|---+)/.test(e[r]);)d.push(e[r]),r++;a.push(`<p>${N(d.join(" "),s)}</p>`)}return a.join(`
`)}function N(t,o){if(!t)return"";const n=[];let s=t.replace(/`([^`]+?)`/g,(e,a)=>(n.push(a),`\0CODE${n.length-1}\0`));return s=O(s),s=s.replace(/\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g,(e,a,r)=>{const l=a.trim(),g=(r||a).trim(),d=o({type:"wiki",target:l,label:g});return d==null?`<span class="md-wiki md-wiki-missing" title="未链接的笔记: ${L(l)}">${O(g)}</span>`:`<a class="md-wiki" href="${L(d)}" data-wiki="${L(l)}">${O(g)}</a>`}),s=s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,(e,a,r)=>{const l=a.trim(),g=r.trim(),d=l.match(/^video(?::(.*))?$/i);if(d){const c=(d[1]||"").trim();return`<figure class="md-media"><video controls preload="metadata" src="${L(g)}"></video>${c?`<figcaption>${O(c)}</figcaption>`:""}</figure>`}const f=l.match(/^audio(?::(.*))?$/i);if(f){const c=(f[1]||"").trim();return`<figure class="md-media"><audio controls preload="metadata" src="${L(g)}"></audio>${c?`<figcaption>${O(c)}</figcaption>`:""}</figure>`}return`<img alt="${L(l)}" src="${L(g)}" loading="lazy"/>`}),s=s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,(e,a,r)=>{const l=r.trim(),g=/^https?:\/\//i.test(l),f=o({type:"url",target:l,label:a})||l;return`<a href="${L(f)}"${g?' target="_blank" rel="noopener"':""}>${a}</a>`}),s=s.replace(/(^|\s)#([a-zA-Z0-9_\-一-龥]{1,30})\b/g,(e,a,r)=>{const l=o({type:"tag",target:r,label:r});return l?`${a}<a class="md-tag" href="${L(l)}">#${O(r)}</a>`:`${a}<span class="md-tag">#${O(r)}</span>`}),s=s.replace(/\*\*([^*]+?)\*\*/g,"<strong>$1</strong>"),s=s.replace(/(^|[\s>(])\*([^*\n]+?)\*(?=[\s<.,!?:;)]|$)/g,"$1<em>$2</em>"),s=s.replace(/(^|[\s>(])_([^_\n]+?)_(?=[\s<.,!?:;)]|$)/g,"$1<em>$2</em>"),s=s.replace(/ CODE(\d+) /g,(e,a)=>`<code>${O(n[+a])}</code>`),s}function Tt(){return"n-"+Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4)}const lt=H("notes",()=>{const t=C([]);q("notes",{notes:t},()=>({notes:st.notes}));const o=S(()=>{const u={};return t.value.forEach(h=>{h.title&&(u[h.title.toLowerCase().trim()]=h.id)}),u}),n=S(()=>{const u={};return t.value.forEach(h=>{const v=tt(h.content||"");u[h.id]=v.map(w=>o.value[w.toLowerCase().trim()]).filter(w=>w&&w!==h.id)}),u}),s=S(()=>{const u={};return t.value.forEach(h=>{u[h.id]=[]}),Object.entries(n.value).forEach(([h,v])=>{v.forEach(w=>{u[w]&&!u[w].includes(h)&&u[w].push(h)})}),u}),e=S(()=>{const u={};return t.value.forEach(h=>{u[h.id]=Rt(h.content||"")}),u}),a=S(()=>{const u={};return t.value.forEach(h=>{u[h.id]=at(h.content||"").meta}),u}),r=S(()=>[...t.value].sort((u,h)=>!!u.pinned!=!!h.pinned?u.pinned?-1:1:(h.updatedAt||"").localeCompare(u.updatedAt||"")));function l(u){return t.value.find(h=>h.id===u)}function g(u){if(!u)return null;const h=o.value[u.toLowerCase().trim()];return h?l(h):null}function d(u){return(n.value[u]||[]).map(v=>l(v)).filter(Boolean)}function f(u){return(s.value[u]||[]).map(v=>l(v)).filter(Boolean)}function c(u){const h=l(u);if(!h)return[];const v=tt(h.content||""),w=o.value;return v.filter(x=>!w[x.toLowerCase().trim()])}function i(u={}){const h=new Date().toISOString(),v={id:Tt(),title:u.title||"未命名笔记",content:u.content||"",articleSlug:u.articleSlug||null,tagIds:u.tagIds||[],pinned:!!u.pinned,createdAt:h,updatedAt:h};return t.value.unshift(v),v}function m(u,h){const v=t.value.findIndex(w=>w.id===u);return v<0?null:(t.value[v]={...t.value[v],...h,updatedAt:new Date().toISOString()},t.value[v])}function y(u){t.value=t.value.filter(h=>h.id!==u)}function T(u){const h=l(u);h&&m(u,{pinned:!h.pinned})}function j({keyword:u="",tagId:h=null,articleSlug:v=null,status:w=null}={}){let x=r.value;if(h&&(x=x.filter(R=>(R.tagIds||[]).includes(h))),v&&(x=x.filter(R=>R.articleSlug===v)),w&&(x=x.filter(R=>(a.value[R.id]?.status||"draft")===w)),u){const R=u.toLowerCase();x=x.filter(J=>(J.title||"").toLowerCase().includes(R)||(J.content||"").toLowerCase().includes(R))}return x}const b=S(()=>({total:t.value.length,pinned:t.value.filter(u=>u.pinned).length,withArticle:t.value.filter(u=>u.articleSlug).length,totalLinks:Object.values(n.value).reduce((u,h)=>u+h.length,0),orphans:t.value.filter(u=>{const h=n.value[u.id]?.length||0,v=s.value[u.id]?.length||0;return h+v===0}).length}));return{notes:t,sorted:r,titleIndex:o,outLinksByNote:n,backlinksByNote:s,inlineTagsByNote:e,metaByNote:a,findById:l,findByTitle:g,getOutLinks:d,getBacklinks:f,getMissingLinks:c,create:i,update:m,remove:y,togglePin:T,search:j,stats:b}});function Pt(){return"t-"+Math.random().toString(36).slice(2,9)}const W=["oklch(0.72 0.21 295)","oklch(0.78 0.18 220)","oklch(0.82 0.16 60)","oklch(0.78 0.18 160)","oklch(0.75 0.20 320)","oklch(0.78 0.15 30)","oklch(0.74 0.17 180)","oklch(0.72 0.20 0)"],it=H("tags",()=>{const t=C([]);q("tags",{tags:t},()=>({tags:st.tags}));const o=S(()=>[...t.value]);function n(d){return t.value.find(f=>f.id===d)}function s(d){return t.value.find(f=>f.name===d)}function e({name:d,color:f}){if(!d)throw new Error("标签名不能为空");if(s(d))throw new Error("同名标签已存在");const c={id:Pt(),name:d,color:f||W[t.value.length%W.length]};return t.value.push(c),c}function a(d,f){const c=t.value.findIndex(i=>i.id===d);c<0||(t.value[c]={...t.value[c],...f})}function r(d){t.value=t.value.filter(f=>f.id!==d)}function l(d){return n(d)?.color||"var(--ink-3)"}function g(d){return n(d)?.name||""}return{tags:t,all:o,palette:W,findById:n,findByName:s,create:e,update:a,remove:r,colorOf:l,nameOf:g}}),ct=H("reads",()=>{const t=C([]);q("reads",{records:t},()=>({records:[]}));function o(c){return t.value.find(i=>i.slug===c)}function n(c){let i=o(c);return i||(i={slug:c,status:"unread",progress:0,rating:0,collected:!1,durationMin:0,lastReadAt:null,finishedAt:null},t.value.push(i)),i}function s(c,i){const m=n(c);Object.assign(m,i),m.lastReadAt=new Date().toISOString(),m.status==="done"&&!m.finishedAt&&(m.finishedAt=m.lastReadAt)}function e(c,i){s(c,{status:i})}function a(c){const i=n(c);i.collected=!i.collected,i.lastReadAt=new Date().toISOString()}function r(c,i){s(c,{rating:i})}function l(c,i){const m=n(c);m.progress=Math.max(m.progress,Math.round(i)),m.lastReadAt=new Date().toISOString(),m.progress>=80&&m.status!=="done"?m.status="done":m.progress>0&&m.status==="unread"&&(m.status="reading")}function g(c,i){const m=n(c);m.durationMin=Math.round((m.durationMin||0)+i),m.lastReadAt=new Date().toISOString()}const d=S(()=>{const c=t.value.length,i=t.value.filter(b=>b.status==="done").length,m=t.value.filter(b=>b.status==="reading").length,y=t.value.filter(b=>b.collected).length,T=t.value.reduce((b,u)=>b+(u.durationMin||0),0),j=t.value.filter(b=>b.rating).reduce((b,u)=>b+u.rating,0)/(t.value.filter(b=>b.rating).length||1);return{total:c,done:i,reading:m,collected:y,totalMin:T,avgRating:j}}),f=S(()=>[...t.value].filter(c=>c.lastReadAt).sort((c,i)=>(i.lastReadAt||"").localeCompare(c.lastReadAt||"")).slice(0,5));return{records:t,get:o,ensure:n,patch:s,setStatus:e,toggleCollect:a,setRating:r,setProgress:l,addDuration:g,stats:d,recent:f}}),ut=(t,o)=>{const n=t.__vccOpts||t;for(const[s,e]of o)n[s]=e;return n},Vt={class:"tqp"},Nt={class:"tqp-stat"},jt={class:"tqp-stat"},zt={class:"ok"},Dt={class:"tqp-stat"},Bt={class:"tqp-stat"},Ht={class:"tqp-stat"},qt={class:"tqp-stat"},Ft={class:"tqp tip"},Wt={__name:"ThemeQuickPanel",setup(t){const o=nt(),n=ct(),s=lt(),e=it(),a=S(()=>{const r=o.name;return{dashboard:"在这里看你的阅读与笔记总览。",library:"点右上 + 加文章。点心形收藏。",notes:"新建时挑一个 Karpathy 模板。",tags:"调色板的颜色会同步到笔记标签。",graph:"拖动节点重排,占位灰节点可一键创建。",stats:"所有图表都基于你本地的阅读与笔记数据。",settings:"所有数据本地存储,可一键导出 JSON 备份。",chat:"会话保存在本地,API key 也只在本机存储。"}[r]||"在博客与知识库之间无缝切换。"});return(r,l)=>(k(),A(V,null,[p("div",Vt,[l[6]||(l[6]=p("span",{class:"tqp-label"},"数据快照",-1)),p("div",Nt,[l[0]||(l[0]=p("span",null,"文章",-1)),p("strong",null,E(_(n).stats.total),1)]),p("div",jt,[l[1]||(l[1]=p("span",null,"已读",-1)),p("strong",zt,E(_(n).stats.done),1)]),p("div",Dt,[l[2]||(l[2]=p("span",null,"收藏",-1)),p("strong",null,E(_(n).stats.collected),1)]),p("div",Bt,[l[3]||(l[3]=p("span",null,"笔记",-1)),p("strong",null,E(_(s).stats.total),1)]),p("div",Ht,[l[4]||(l[4]=p("span",null,"双向链接",-1)),p("strong",null,E(_(s).stats.totalLinks),1)]),p("div",qt,[l[5]||(l[5]=p("span",null,"标签",-1)),p("strong",null,E(_(e).tags.length),1)])]),p("div",Ft,[l[7]||(l[7]=p("span",{class:"tqp-label"},"小贴士",-1)),p("p",null,E(a.value),1)])],64))}},Kt=ut(Wt,[["__scopeId","data-v-0a29a32f"]]),Zt={class:"ui-toast-stack","aria-live":"polite","aria-atomic":"true"},Gt=["role"],Ut={__name:"AppToastStack",setup(t){const o=G();return(n,s)=>(k(),A("div",Zt,[(k(!0),A(V,null,ot(_(o).toasts,e=>(k(),A("div",{key:e.id,class:ht(["ui-toast",e.type,{leaving:e.leaving}]),role:e.type==="error"||e.type==="warning"?"alert":"status"},E(e.text),11,Gt))),128))]))}},Jt=["width","height","innerHTML"],D={__name:"IconBase",props:{name:{type:String,required:!0},size:{type:[Number,String],default:16}},setup(t){const o={dashboard:'<path d="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" stroke="currentColor" stroke-width="1.6" fill="none"/>',library:'<path d="M4 19V5a2 2 0 012-2h13v18H6a2 2 0 01-2-2zm0 0a2 2 0 012-2h13" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>',notes:'<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6z" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M14 3v6h6M8 13h8M8 17h5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>',tags:'<path d="M20.59 13.41L13.42 20.58a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/><circle cx="7" cy="7" r="1.5" fill="currentColor"/>',stats:'<path d="M3 3v18h18M7 14l4-4 4 4 5-7" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',settings:'<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 008 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H2a2 2 0 010-4h.09A1.65 1.65 0 003.6 8a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H8a1.65 1.65 0 001-1.51V2a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V8a1.65 1.65 0 001.51 1H22a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" stroke-width="1.6" fill="none"/>',search:'<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',plus:'<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',check:'<path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',close:'<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',trash:'<path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',pin:'<path d="M12 17l-5 4 1.5-6L4 11l6-.5L12 5l2 5.5 6 .5-4.5 4L17 21z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/>',star:'<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/>',"star-filled":'<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" fill="currentColor"/>',heart:'<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" stroke-width="1.6" fill="none"/>',"heart-filled":'<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="currentColor"/>',edit:'<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 113 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6" fill="none"/>',"arrow-left":'<path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',"arrow-right":'<path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',"arrow-up":'<path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',copy:'<rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="1.6" fill="none"/>',download:'<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',upload:'<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',book:'<path d="M4 19.5A2.5 2.5 0 016.5 17H20V2H6.5A2.5 2.5 0 004 4.5v15zM4 19.5V22h16" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',clock:'<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',menu:'<path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',sliders:'<path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14h6M9 8h6M17 16h6" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>',palette:'<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="12" cy="7.5" r="1.5" fill="currentColor"/><circle cx="16.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="15" cy="15.5" r="1.5" fill="currentColor"/>',graph:'<circle cx="6" cy="6" r="2.5" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="18" cy="6" r="2.5" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="6" cy="18" r="2.5" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="18" cy="18" r="2.5" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/><path d="M7.5 7.5L10 10M16.5 7.5L14 10M7.5 16.5L10 14M16.5 16.5L14 14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',link:'<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',chat:'<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',key:'<path d="M15 7a4 4 0 11-8 0 4 4 0 018 0zM21 21l-5-5m-2-3.5L18 16m-4-6h.01" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',lab:'<path d="M9 2v6L4 18a2 2 0 001.8 2.9h12.4A2 2 0 0020 18L15 8V2M9 2h6M9 14h6" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',guestbook:'<path d="M3 8a4 4 0 014-4h10a4 4 0 014 4v6a4 4 0 01-4 4h-4l-5 4v-4H7a4 4 0 01-4-4V8z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/><circle cx="8.5" cy="11" r="1" fill="currentColor"/><circle cx="12" cy="11" r="1" fill="currentColor"/><circle cx="15.5" cy="11" r="1" fill="currentColor"/>'};function n(s){return o[s]||o.close}return(s,e)=>(k(),A("svg",{width:t.size,height:t.size,viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",innerHTML:n(t.name),"aria-hidden":"true"},null,8,Jt))}},Xt={class:"app-nav"},Qt={key:0,class:"nav-links"},Yt={key:0,class:"blog-main"},te={key:1,class:"app-layout"},ee={class:"app-aside"},ne={class:"app-aside-inner"},oe={class:"app-menu"},re={key:0,class:"badge"},se={class:"app-aside-foot"},ae={class:"app-main"},le={class:"app-tools"},ie={class:"app-tools-inner"},ce={__name:"AppLayout",setup(t){const o=nt(),n=vt(),s=lt(),e=it(),a=ct(),r=G(),l=S(()=>o.meta?.layout||"app"),g=C("");function d(){const c=g.value.trim();c&&(n.push({name:"library",query:{q:c}}),r.pushToast("info",`已跳到文章库搜索:"${c}"`))}const f=S(()=>[{to:"/dashboard",label:"仪表板",icon:"dashboard",badge:null},{to:"/library",label:"文章库",icon:"library",badge:null},{to:"/notes",label:"笔记",icon:"notes",badge:s.stats.total},{to:"/tags",label:"标签",icon:"tags",badge:e.tags.length},{to:"/graph",label:"知识图谱",icon:"graph",badge:s.stats.totalLinks||null},{to:"/chat",label:"AI 对话",icon:"chat",badge:null},{to:"/guestbook",label:"留言板",icon:"guestbook",badge:null},{to:"/stats",label:"统计",icon:"stats",badge:null},{to:"/settings",label:"设置",icon:"settings",badge:null}]);return(c,i)=>(k(),A(V,null,[p("header",Xt,[M(_(P),{to:"/",class:"brand"},{default:I(()=>[...i[1]||(i[1]=[p("span",{class:"brand-mark"},null,-1),p("span",{class:"brand-text"},"APOS",-1)])]),_:1}),l.value==="blog"?(k(),A("nav",Qt,[M(_(P),{to:"/"},{default:I(()=>[...i[2]||(i[2]=[F("首页",-1)])]),_:1}),M(_(P),{to:"/dashboard"},{default:I(()=>[...i[3]||(i[3]=[F("知识库",-1)])]),_:1}),M(_(P),{to:"/playground"},{default:I(()=>[...i[4]||(i[4]=[F("工具间",-1)])]),_:1}),i[5]||(i[5]=p("a",{href:"https://github.com/Apos-DT",target:"_blank",rel:"noopener"},"GitHub ↗",-1))])):(k(),A("form",{key:1,class:"nav-search",onSubmit:ft(d,["prevent"])},[M(D,{name:"search",size:14}),mt(p("input",{"onUpdate:modelValue":i[0]||(i[0]=m=>g.value=m),type:"search",placeholder:"搜索文章 / 笔记 / 标签… (回车跳转文章库)","aria-label":"全局搜索"},null,512),[[gt,g.value]])],32)),l.value==="blog"?(k(),B(_(P),{key:2,class:"nav-cta",to:"/dashboard"},{default:I(()=>[i[6]||(i[6]=p("span",null,"进入应用",-1)),M(D,{name:"arrow-right",size:14})]),_:1})):(k(),B(_(P),{key:3,class:"nav-back",to:"/"},{default:I(()=>[M(D,{name:"arrow-left",size:14}),i[7]||(i[7]=p("span",null,"返回首页",-1))]),_:1}))]),l.value==="blog"?(k(),A("main",Yt,[X(c.$slots,"default",{},void 0)])):(k(),A("div",te,[p("aside",ee,[p("div",ne,[i[9]||(i[9]=p("span",{class:"app-aside-label"},"导航",-1)),p("nav",oe,[(k(!0),A(V,null,ot(f.value,m=>(k(),B(_(P),{key:m.to,to:m.to},{default:I(()=>[M(D,{name:m.icon,size:16},null,8,["name"]),p("span",null,E(m.label),1),m.badge!=null?(k(),A("span",re,E(m.badge),1)):kt("",!0)]),_:2},1032,["to"]))),128))]),p("div",se,[i[8]||(i[8]=p("span",{class:"dot live"},null,-1)),p("span",null,E(_(a).stats.done)+" 已读 · "+E(_(a).stats.reading)+" 在读",1)])])]),p("main",ae,[X(c.$slots,"default",{},void 0)]),p("aside",le,[p("div",ie,[i[10]||(i[10]=p("div",{class:"app-tools-mount"},null,-1)),M(Kt)])])])),M(Ut)],64))}},ue=ut(ce,[["__scopeId","data-v-dda07c1f"]]),de={__name:"App",setup(t){const o=G();let n=null,s=0;return K(()=>{if(o.applyTheme(),!matchMedia("(prefers-reduced-motion: reduce)").matches){n=new St({duration:1.15,easing:a=>Math.min(1,1.001-Math.pow(2,-10*a)),smoothWheel:!0,smoothTouch:!1});const e=a=>{n.raf(a),s=requestAnimationFrame(e)};s=requestAnimationFrame(e)}}),Z(()=>{s&&cancelAnimationFrame(s),n&&n.destroy()}),(e,a)=>{const r=yt("router-view");return k(),A(V,null,[M(xt),M(Ct),M(ue,null,{default:I(()=>[M(r,null,{default:I(({Component:l,route:g})=>[M(_t,{name:"page",mode:"out-in"},{default:I(()=>[(k(),B(bt(l),{key:g.fullPath}))]),_:2},1024)]),_:1})]),_:1})],64)}}},pe="modulepreload",he=function(t){return"/AposBlog/"+t},et={},$=function(o,n,s){let e=Promise.resolve();if(n&&n.length>0){let r=function(d){return Promise.all(d.map(f=>Promise.resolve(f).then(c=>({status:"fulfilled",value:c}),c=>({status:"rejected",reason:c}))))};document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),g=l?.nonce||l?.getAttribute("nonce");e=r(n.map(d=>{if(d=he(d),d in et)return;et[d]=!0;const f=d.endsWith(".css"),c=f?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${c}`))return;const i=document.createElement("link");if(i.rel=f?"stylesheet":pe,f||(i.as="script"),i.crossOrigin="",i.href=d,g&&i.setAttribute("nonce",g),document.head.appendChild(i),f)return new Promise((m,y)=>{i.addEventListener("load",m),i.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${d}`)))})}))}function a(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return e.then(r=>{for(const l of r||[])l.status==="rejected"&&a(l.reason);return o().catch(a)})},fe=[{path:"/",name:"home",component:()=>$(()=>import("./HomeView-CJo4xh--.js"),__vite__mapDeps([0,1,2,3,4,5])),meta:{title:"首页",layout:"blog"}},{path:"/post/:slug",name:"post",component:()=>$(()=>import("./PostView-BR_Ybcws.js"),__vite__mapDeps([6,1,2,4,7])),meta:{title:"文章",layout:"blog"}},{path:"/playground",name:"playground",component:()=>$(()=>import("./PlaygroundView-CAhMJvDF.js"),__vite__mapDeps([8,1,4,9])),meta:{title:"工具间",layout:"blog"}},{path:"/dashboard",name:"dashboard",component:()=>$(()=>import("./DashboardView-ClCJXfyz.js"),__vite__mapDeps([10,1,2,4,11])),meta:{title:"仪表板",icon:"dashboard",layout:"app"}},{path:"/library",name:"library",component:()=>$(()=>import("./LibraryView-Rvy9S4Ir.js"),__vite__mapDeps([12,1,2,4,13])),meta:{title:"文章库",icon:"library",layout:"app"}},{path:"/library/:slug",redirect:t=>`/post/${t.params.slug}`},{path:"/notes",name:"notes",component:()=>$(()=>import("./NotesView-sFR0hFTL.js"),__vite__mapDeps([14,1,2,4,15])),meta:{title:"笔记",icon:"notes",layout:"app"}},{path:"/notes/:id",name:"noteEdit",component:()=>$(()=>import("./NoteEditView-DcsUgU7G.js"),__vite__mapDeps([16,1,2,4,17])),meta:{title:"编辑笔记",icon:"notes",layout:"app"}},{path:"/tags",name:"tags",component:()=>$(()=>import("./TagsView-_mzoRaTA.js"),__vite__mapDeps([18,1,4,19])),meta:{title:"标签",icon:"tags",layout:"app"}},{path:"/graph",name:"graph",component:()=>$(()=>import("./GraphView-DdIyDUjS.js"),__vite__mapDeps([20,1,2,21,4,22])),meta:{title:"知识图谱",icon:"graph",layout:"app"}},{path:"/chat",name:"chat",component:()=>$(()=>import("./ChatView-DrcM3TCO.js"),__vite__mapDeps([23,1,24,4,25])),meta:{title:"AI 对话",icon:"chat",layout:"app"}},{path:"/guestbook",name:"guestbook",component:()=>$(()=>import("./GuestbookView-BQYQInQL.js"),__vite__mapDeps([26,1,4,27])),meta:{title:"留言板",icon:"chat",layout:"app"}},{path:"/stats",name:"stats",component:()=>$(()=>import("./StatsView-DD7NtIpc.js"),__vite__mapDeps([28,2,1,21,4,29])),meta:{title:"统计",icon:"stats",layout:"app"}},{path:"/settings",name:"settings",component:()=>$(()=>import("./SettingsView-DQeMMBdt.js"),__vite__mapDeps([30,1,2,24,4,31])),meta:{title:"设置",icon:"settings",layout:"app"}},{path:"/:pathMatch(.*)*",name:"notFound",component:()=>$(()=>import("./NotFoundView-bAf2as9E.js"),__vite__mapDeps([32,1,4,33])),meta:{title:"404",layout:"blog"}}],dt=wt({history:Mt(),routes:fe,scrollBehavior(t,o,n){return n||(t.hash?{el:t.hash,behavior:"smooth"}:{top:0,behavior:"smooth"})}});dt.afterEach(t=>{const o="APOS · 赵祥生";document.title=t.meta?.title?`${t.meta.title} · ${o}`:o});const U=At(de);U.use($t());U.use(dt);U.mount("#app");export{ut as _,D as a,st as b,ve as c,q as d,ke as e,ct as f,G as g,it as h,ye as i,at as p,be as r,_e as s,lt as u};
