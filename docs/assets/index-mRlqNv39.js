const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/HomeView-Ducqygol.js","assets/vue-CGH0Fj-A.js","assets/posts-DcWWKw1j.js","assets/gsap-CzGW6FVa.js","assets/lenis-BEW9yqGz.js","assets/HomeView-BCd8p7az.css","assets/PostView-B1ZefJM6.js","assets/PostView-CAcPI8Nl.css","assets/PlaygroundView-ZTzptv_U.js","assets/PlaygroundView-D0Mwo-Nr.css","assets/DashboardView-DPk0yc8Z.js","assets/DashboardView-DQUfWHMU.css","assets/LibraryView-B5gvcwjM.js","assets/LibraryView-DJHzmBB7.css","assets/NotesView-B7J84jAO.js","assets/NotesView-DBjOkyW8.css","assets/NoteEditView-BVwkSd1v.js","assets/NoteEditView-T6FnXX2o.css","assets/TagsView-CqHGVlt7.js","assets/TagsView-CMfmAfeD.css","assets/GraphView-BmA_CQ0M.js","assets/echarts-qCor5qs6.js","assets/GraphView-lVZpT7kV.css","assets/StatsView-Co7fF8aj.js","assets/StatsView-Bt2yPTD4.css","assets/SettingsView-BH4eViZI.js","assets/SettingsView-CBvFO3le.css","assets/NotFoundView-EUSDyxxV.js","assets/NotFoundView-OKIYwxCK.css"])))=>i.map(i=>d[i]);
import{H as pt,n as B,u as C,s as K,r as G,t as y,g as w,d,F as T,c as A,A as k,q as ht,z as M,v as U,p as ot,l as S,I,R as N,k as W,K as ft,J as mt,G as gt,e as q,w as Q,B as vt,C as kt,f as yt,x as _t,a as wt,y as bt,i as $t,m as St,b as Mt,h as At}from"./vue-CGH0Fj-A.js";import{L as Et}from"./lenis-BEW9yqGz.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function o(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerPolicy&&(s.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?s.credentials="include":e.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(e){if(e.ep)return;e.ep=!0;const s=o(e);fetch(e.href,s)}})();const z="apos";function xt(t,n){try{const o=localStorage.getItem(`${z}:${t}`);return o?JSON.parse(o):typeof n=="function"?n():n}catch(o){return console.warn("[apos] loadState failed",t,o),typeof n=="function"?n():n}}function rt(t,n){try{localStorage.setItem(`${z}:${t}`,JSON.stringify(n))}catch(o){console.warn("[apos] saveState failed",t,o)}}function H(t,n,o){const a=xt(t,o);for(const e of Object.keys(n))a&&a[e]!==void 0&&(n[e].value=a[e]);pt(()=>Object.fromEntries(Object.keys(n).map(e=>[e,n[e].value])),e=>rt(t,e),{deep:!0})}function Se(){const t=[];for(let n=0;n<localStorage.length;n++){const o=localStorage.key(n);o&&o.startsWith(`${z}:`)&&t.push(o)}t.forEach(n=>localStorage.removeItem(n))}function Me(){const t={};for(let n=0;n<localStorage.length;n++){const o=localStorage.key(n);if(o&&o.startsWith(`${z}:`))try{t[o.slice(z.length+1)]=JSON.parse(localStorage.getItem(o))}catch{}}return{version:1,exportedAt:new Date().toISOString(),data:t}}function Ae(t){if(!t||!t.data)throw new Error("数据格式不正确");Object.entries(t.data).forEach(([n,o])=>{rt(n,o)})}const F=B("settings",()=>{const t=C(295),n=C(16),o=C(!1),a=C([]);H("settings",{hue:t,fontSize:n,reducedMotion:o},()=>({hue:295,fontSize:16,reducedMotion:!1}));function e(){const p=document.documentElement;p.style.setProperty("--accent",`oklch(0.72 0.21 ${t.value})`),p.style.fontSize=n.value+"px"}function s(p){t.value=Math.max(0,Math.min(360,parseInt(p,10)||0)),e()}function r(p){n.value=parseInt(p,10)||16,e()}function l(p,h,m=2800){const c=Math.random().toString(36).slice(2);a.value.push({id:c,type:p,text:h}),setTimeout(()=>{const i=a.value.findIndex(g=>g.id===c);i>=0&&(a.value[i].leaving=!0),setTimeout(()=>{a.value=a.value.filter(g=>g.id!==c)},300)},m)}return{hue:t,fontSize:n,reducedMotion:o,toasts:a,applyTheme:e,setHue:s,setFontSize:r,pushToast:l}}),Ct={__name:"AppBackground",setup(t){const n=C(null);let o=null;return K(()=>{const a=n.value?n.value.querySelectorAll(".blob"):[];if(!a.length)return;const e=s=>{const r=s.clientX/window.innerWidth-.5,l=s.clientY/window.innerHeight-.5;a.forEach((p,h)=>{const m=(h+1)*14;p.style.transform=`translate3d(${r*m}px, ${l*m}px, 0)`})};window.addEventListener("mousemove",e,{passive:!0}),o=()=>window.removeEventListener("mousemove",e)}),G(()=>o&&o()),(a,e)=>(y(),w(T,null,[e[1]||(e[1]=d("div",{class:"app-bg-grain","aria-hidden":"true"},null,-1)),d("div",{ref_key:"blobsEl",ref:n,class:"app-bg-aurora","aria-hidden":"true"},[...e[0]||(e[0]=[d("span",{class:"blob a"},null,-1),d("span",{class:"blob b"},null,-1),d("span",{class:"blob c"},null,-1)])],512)],64))}},Ot={__name:"AppCursor",setup(t){const n=C(null),o=C(null);let a=0,e=null;return K(()=>{if(!matchMedia("(hover: hover)").matches)return;const s={x:innerWidth/2,y:innerHeight/2},r={x:s.x,y:s.y},l=(_,P,j)=>_+(P-_)*j,p=_=>{s.x=_.clientX,s.y=_.clientY};window.addEventListener("mousemove",p,{passive:!0});const h=()=>{r.x=l(r.x,s.x,.16),r.y=l(r.y,s.y,.16),n.value&&(n.value.style.transform=`translate3d(${s.x-3}px, ${s.y-3}px, 0)`),o.value&&(o.value.style.transform=`translate3d(${r.x-18}px, ${r.y-18}px, 0)`),a=requestAnimationFrame(h)};h();const m=()=>document.body.classList.add("cursor-hover"),c=()=>document.body.classList.remove("cursor-hover"),i=()=>{document.querySelectorAll('a, button, .ui-card, .post-card, [data-cursor="link"]').forEach(_=>{_.addEventListener("mouseenter",m),_.addEventListener("mouseleave",c)})};i();const g=new MutationObserver(()=>i());g.observe(document.body,{childList:!0,subtree:!0}),e=()=>{cancelAnimationFrame(a),window.removeEventListener("mousemove",p),g.disconnect(),c()}}),G(()=>e&&e()),(s,r)=>(y(),w(T,null,[d("div",{ref_key:"dot",ref:n,class:"app-cursor-dot","aria-hidden":"true"},null,512),d("div",{ref_key:"ring",ref:o,class:"app-cursor-ring","aria-hidden":"true"},null,512)],64))}},Lt=[{slug:"odoo-erp-manufacturing-customization",title:"在 Odoo 里做制造业 ERP 二开:销采产存质财全链路笔记",excerpt:"从客户手工 Excel 跑产线,到 Odoo 把销售-采购-库存-生产-质检-财务跑通。这篇拆开几个月里的关键二开决策与踩坑。",tag:"ERP",date:"2026-05-13",readTime:12,external:!1,url:"../../post.html?slug=odoo-erp-manufacturing-customization"},{slug:"industrial-vision-system-pitfalls",title:"工业机器视觉现场交付的 5 个稳定性陷阱",excerpt:"上位机/下位机联调、产线异常定位、通信稳定性优化——实验室能跑、现场就崩的真实原因。",tag:"Vision",date:"2026-04-22",readTime:10,external:!1,url:"../../post.html?slug=industrial-vision-system-pitfalls"},{slug:"springboot-vue-fullstack-craft",title:"Spring Boot + Vue3 全栈工程化:从权限到大屏的实战沉淀",excerpt:"在既有项目上做功能迭代、权限增强、数据可视化大屏。Spring Boot + Vue3 的连接处藏着多少坊。",tag:"Fullstack",date:"2025-09-18",readTime:8,external:!1,url:"../../post.html?slug=springboot-vue-fullstack-craft"},{slug:"python-scraping-pandas-django",title:"用 Selenium + Pandas + Django 做一套招聘数据采集分析",excerpt:"从爬取动态页面,到 Pandas 清洗,再到 Django 可视化展示——一个完整的数据小项目从 0 到 1。",tag:"Data",date:"2025-06-08",readTime:7,external:!1,url:"../../post.html?slug=python-scraping-pandas-django"}],It=[{id:"t-erp",name:"ERP",color:"oklch(0.74 0.20 295)"},{id:"t-vision",name:"Vision",color:"oklch(0.80 0.17 220)"},{id:"t-fullstack",name:"Fullstack",color:"oklch(0.84 0.15 60)"},{id:"t-data",name:"Data",color:"oklch(0.80 0.17 160)"},{id:"t-study",name:"学习",color:"oklch(0.77 0.18 320)"},{id:"t-think",name:"思考",color:"oklch(0.80 0.15 30)"},{id:"t-cheat",name:"速查",color:"oklch(0.76 0.17 180)"}],Rt=[{id:"n-welcome",title:"欢迎使用 APOS 知识库",content:`---
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

#Vision #速查`,articleSlug:"industrial-vision-system-pitfalls",tagIds:["t-vision","t-cheat"],pinned:!1,createdAt:"2026-04-22T08:00:00.000Z",updatedAt:"2026-04-22T08:00:00.000Z"}],st={posts:Lt,tags:It,notes:Rt};function at(t){if(typeof t!="string")return{meta:{},body:t||""};const n=t.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);if(!n)return{meta:{},body:t};const o={};return n[1].split(/\r?\n/).forEach(a=>{const e=a.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);if(!e)return;const s=e[1];let r=e[2].trim();if(!r){o[s]="";return}if(/^\[.*\]$/.test(r)){o[s]=r.slice(1,-1).split(",").map(l=>l.trim().replace(/^["']|["']$/g,"")).filter(Boolean);return}if(/^-?\d+(\.\d+)?$/.test(r)){o[s]=Number(r);return}if(r==="true"||r==="false"){o[s]=r==="true";return}o[s]=r.replace(/^["']|["']$/g,"")}),{meta:o,body:n[2]}}function Ee(t,n){const o=Object.keys(t||{}).filter(e=>t[e]!==""&&t[e]!=null);if(!o.length)return n||"";const a=["---"];return o.forEach(e=>{const s=t[e];Array.isArray(s)?a.push(`${e}: [${s.map(r=>JSON.stringify(r)).join(", ")}]`):typeof s=="string"&&/[:#\[\]]/.test(s)?a.push(`${e}: ${JSON.stringify(s)}`):a.push(`${e}: ${s}`)}),a.push("---",""),a.join(`
`)+(n||"")}const Y=/\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g,tt=/(^|[\s\(])#([a-zA-Z0-9_\-一-龥]{1,30})\b/g;function et(t){if(!t)return[];const n=new Set;let o;for(Y.lastIndex=0;(o=Y.exec(t))!==null;)n.add(o[1].trim());return Array.from(n)}function Tt(t){if(!t)return[];const n=new Set;let o;for(tt.lastIndex=0;(o=tt.exec(t))!==null;)n.add(o[2]);return Array.from(n)}function L(t){return String(t).replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n])}function O(t){return L(t)}function xe(t,n={}){const{body:o}=at(t||""),a=n.onLink||(()=>null),e=o.replace(/\r\n/g,`
`).split(`
`),s=[];let r=0;for(;r<e.length;){const l=e[r];if(/^```/.test(l)){const m=l.replace(/^```/,"").trim(),c=[];for(r++;r<e.length&&!/^```/.test(e[r]);)c.push(e[r]),r++;r++,s.push(`<pre><code${m?` data-lang="${O(m)}"`:""}>${L(c.join(`
`))}</code></pre>`);continue}if(/^\s*---+\s*$/.test(l)){s.push("<hr/>"),r++;continue}const p=l.match(/^(#{1,6})\s+(.*)$/);if(p){s.push(`<h${p[1].length}>${V(p[2],a)}</h${p[1].length}>`),r++;continue}if(/^>\s?/.test(l)){const m=[];for(;r<e.length&&/^>\s?/.test(e[r]);)m.push(e[r].replace(/^>\s?/,"")),r++;const c=m.join(" ").trim(),i=c.match(/^\[!(INFO|TIP|SUCCESS|NOTE|WARNING|WARN|ERROR|DANGER)\]\s*(.*)$/i);if(i){const g=i[1].toUpperCase(),_={INFO:"info",TIP:"tip",SUCCESS:"success",NOTE:"note",WARNING:"warning",WARN:"warning",ERROR:"error",DANGER:"error"}[g],P={INFO:"Info",TIP:"Tip",SUCCESS:"Success",NOTE:"Note",WARNING:"Warning",WARN:"Warning",ERROR:"Error",DANGER:"Danger"}[g];s.push(`<aside class="md-admon md-admon-${_}"><strong>${P} ·</strong> ${V(i[2],a)}</aside>`)}else s.push(`<blockquote>${V(c,a)}</blockquote>`);continue}if(/^\s*[-*]\s+/.test(l)){const m=[];for(;r<e.length&&/^\s*[-*]\s+/.test(e[r]);)m.push(`<li>${V(e[r].replace(/^\s*[-*]\s+/,""),a)}</li>`),r++;s.push(`<ul>${m.join("")}</ul>`);continue}if(/^\s*\d+\.\s+/.test(l)){const m=[];for(;r<e.length&&/^\s*\d+\.\s+/.test(e[r]);)m.push(`<li>${V(e[r].replace(/^\s*\d+\.\s+/,""),a)}</li>`),r++;s.push(`<ol>${m.join("")}</ol>`);continue}if(/^\s*$/.test(l)){r++;continue}const h=[l];for(r++;r<e.length&&!/^\s*$/.test(e[r])&&!/^(#{1,6}\s|```|>|\s*[-*]\s|\s*\d+\.\s|---+)/.test(e[r]);)h.push(e[r]),r++;s.push(`<p>${V(h.join(" "),a)}</p>`)}return s.join(`
`)}function V(t,n){if(!t)return"";const o=[];let a=t.replace(/`([^`]+?)`/g,(e,s)=>(o.push(s),`\0CODE${o.length-1}\0`));return a=L(a),a=a.replace(/\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g,(e,s,r)=>{const l=s.trim(),p=(r||s).trim(),h=n({type:"wiki",target:l,label:p});return h==null?`<span class="md-wiki md-wiki-missing" title="未链接的笔记: ${O(l)}">${L(p)}</span>`:`<a class="md-wiki" href="${O(h)}" data-wiki="${O(l)}">${L(p)}</a>`}),a=a.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,(e,s,r)=>{const l=s.trim(),p=r.trim(),h=l.match(/^video(?::(.*))?$/i);if(h){const c=(h[1]||"").trim();return`<figure class="md-media"><video controls preload="metadata" src="${O(p)}"></video>${c?`<figcaption>${L(c)}</figcaption>`:""}</figure>`}const m=l.match(/^audio(?::(.*))?$/i);if(m){const c=(m[1]||"").trim();return`<figure class="md-media"><audio controls preload="metadata" src="${O(p)}"></audio>${c?`<figcaption>${L(c)}</figcaption>`:""}</figure>`}return`<img alt="${O(l)}" src="${O(p)}" loading="lazy"/>`}),a=a.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,(e,s,r)=>{const l=r.trim(),p=/^https?:\/\//i.test(l),m=n({type:"url",target:l,label:s})||l;return`<a href="${O(m)}"${p?' target="_blank" rel="noopener"':""}>${s}</a>`}),a=a.replace(/(^|\s)#([a-zA-Z0-9_\-一-龥]{1,30})\b/g,(e,s,r)=>{const l=n({type:"tag",target:r,label:r});return l?`${s}<a class="md-tag" href="${O(l)}">#${L(r)}</a>`:`${s}<span class="md-tag">#${L(r)}</span>`}),a=a.replace(/\*\*([^*]+?)\*\*/g,"<strong>$1</strong>"),a=a.replace(/(^|[\s>(])\*([^*\n]+?)\*(?=[\s<.,!?:;)]|$)/g,"$1<em>$2</em>"),a=a.replace(/(^|[\s>(])_([^_\n]+?)_(?=[\s<.,!?:;)]|$)/g,"$1<em>$2</em>"),a=a.replace(/ CODE(\d+) /g,(e,s)=>`<code>${L(o[+s])}</code>`),a}function Pt(){return"n-"+Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4)}const lt=B("notes",()=>{const t=C([]);H("notes",{notes:t},()=>({notes:st.notes}));const n=A(()=>{const u={};return t.value.forEach(f=>{f.title&&(u[f.title.toLowerCase().trim()]=f.id)}),u}),o=A(()=>{const u={};return t.value.forEach(f=>{const v=et(f.content||"");u[f.id]=v.map($=>n.value[$.toLowerCase().trim()]).filter($=>$&&$!==f.id)}),u}),a=A(()=>{const u={};return t.value.forEach(f=>{u[f.id]=[]}),Object.entries(o.value).forEach(([f,v])=>{v.forEach($=>{u[$]&&!u[$].includes(f)&&u[$].push(f)})}),u}),e=A(()=>{const u={};return t.value.forEach(f=>{u[f.id]=Tt(f.content||"")}),u}),s=A(()=>{const u={};return t.value.forEach(f=>{u[f.id]=at(f.content||"").meta}),u}),r=A(()=>[...t.value].sort((u,f)=>!!u.pinned!=!!f.pinned?u.pinned?-1:1:(f.updatedAt||"").localeCompare(u.updatedAt||"")));function l(u){return t.value.find(f=>f.id===u)}function p(u){if(!u)return null;const f=n.value[u.toLowerCase().trim()];return f?l(f):null}function h(u){return(o.value[u]||[]).map(v=>l(v)).filter(Boolean)}function m(u){return(a.value[u]||[]).map(v=>l(v)).filter(Boolean)}function c(u){const f=l(u);if(!f)return[];const v=et(f.content||""),$=n.value;return v.filter(x=>!$[x.toLowerCase().trim()])}function i(u={}){const f=new Date().toISOString(),v={id:Pt(),title:u.title||"未命名笔记",content:u.content||"",articleSlug:u.articleSlug||null,tagIds:u.tagIds||[],pinned:!!u.pinned,createdAt:f,updatedAt:f};return t.value.unshift(v),v}function g(u,f){const v=t.value.findIndex($=>$.id===u);return v<0?null:(t.value[v]={...t.value[v],...f,updatedAt:new Date().toISOString()},t.value[v])}function _(u){t.value=t.value.filter(f=>f.id!==u)}function P(u){const f=l(u);f&&g(u,{pinned:!f.pinned})}function j({keyword:u="",tagId:f=null,articleSlug:v=null,status:$=null}={}){let x=r.value;if(f&&(x=x.filter(R=>(R.tagIds||[]).includes(f))),v&&(x=x.filter(R=>R.articleSlug===v)),$&&(x=x.filter(R=>(s.value[R.id]?.status||"draft")===$)),u){const R=u.toLowerCase();x=x.filter(X=>(X.title||"").toLowerCase().includes(R)||(X.content||"").toLowerCase().includes(R))}return x}const b=A(()=>({total:t.value.length,pinned:t.value.filter(u=>u.pinned).length,withArticle:t.value.filter(u=>u.articleSlug).length,totalLinks:Object.values(o.value).reduce((u,f)=>u+f.length,0),orphans:t.value.filter(u=>{const f=o.value[u.id]?.length||0,v=a.value[u.id]?.length||0;return f+v===0}).length}));return{notes:t,sorted:r,titleIndex:n,outLinksByNote:o,backlinksByNote:a,inlineTagsByNote:e,metaByNote:s,findById:l,findByTitle:p,getOutLinks:h,getBacklinks:m,getMissingLinks:c,create:i,update:g,remove:_,togglePin:P,search:j,stats:b}});function Nt(){return"t-"+Math.random().toString(36).slice(2,9)}const Z=["oklch(0.72 0.21 295)","oklch(0.78 0.18 220)","oklch(0.82 0.16 60)","oklch(0.78 0.18 160)","oklch(0.75 0.20 320)","oklch(0.78 0.15 30)","oklch(0.74 0.17 180)","oklch(0.72 0.20 0)"],it=B("tags",()=>{const t=C([]);H("tags",{tags:t},()=>({tags:st.tags}));const n=A(()=>[...t.value]);function o(h){return t.value.find(m=>m.id===h)}function a(h){return t.value.find(m=>m.name===h)}function e({name:h,color:m}){if(!h)throw new Error("标签名不能为空");if(a(h))throw new Error("同名标签已存在");const c={id:Nt(),name:h,color:m||Z[t.value.length%Z.length]};return t.value.push(c),c}function s(h,m){const c=t.value.findIndex(i=>i.id===h);c<0||(t.value[c]={...t.value[c],...m})}function r(h){t.value=t.value.filter(m=>m.id!==h)}function l(h){return o(h)?.color||"var(--ink-3)"}function p(h){return o(h)?.name||""}return{tags:t,all:n,palette:Z,findById:o,findByName:a,create:e,update:s,remove:r,colorOf:l,nameOf:p}}),ct=B("reads",()=>{const t=C([]);H("reads",{records:t},()=>({records:[]}));function n(c){return t.value.find(i=>i.slug===c)}function o(c){let i=n(c);return i||(i={slug:c,status:"unread",progress:0,rating:0,collected:!1,durationMin:0,lastReadAt:null,finishedAt:null},t.value.push(i)),i}function a(c,i){const g=o(c);Object.assign(g,i),g.lastReadAt=new Date().toISOString(),g.status==="done"&&!g.finishedAt&&(g.finishedAt=g.lastReadAt)}function e(c,i){a(c,{status:i})}function s(c){const i=o(c);i.collected=!i.collected,i.lastReadAt=new Date().toISOString()}function r(c,i){a(c,{rating:i})}function l(c,i){const g=o(c);g.progress=Math.max(g.progress,Math.round(i)),g.lastReadAt=new Date().toISOString(),g.progress>=80&&g.status!=="done"?g.status="done":g.progress>0&&g.status==="unread"&&(g.status="reading")}function p(c,i){const g=o(c);g.durationMin=Math.round((g.durationMin||0)+i),g.lastReadAt=new Date().toISOString()}const h=A(()=>{const c=t.value.length,i=t.value.filter(b=>b.status==="done").length,g=t.value.filter(b=>b.status==="reading").length,_=t.value.filter(b=>b.collected).length,P=t.value.reduce((b,u)=>b+(u.durationMin||0),0),j=t.value.filter(b=>b.rating).reduce((b,u)=>b+u.rating,0)/(t.value.filter(b=>b.rating).length||1);return{total:c,done:i,reading:g,collected:_,totalMin:P,avgRating:j}}),m=A(()=>[...t.value].filter(c=>c.lastReadAt).sort((c,i)=>(i.lastReadAt||"").localeCompare(c.lastReadAt||"")).slice(0,5));return{records:t,get:n,ensure:o,patch:a,setStatus:e,toggleCollect:s,setRating:r,setProgress:l,addDuration:p,stats:h,recent:m}}),ut=(t,n)=>{const o=t.__vccOpts||t;for(const[a,e]of n)o[a]=e;return o},Vt={class:"tqp"},jt=["value"],zt={class:"tqp-hue"},Dt={class:"value"},qt={class:"tqp"},Bt={class:"tqp-tabs"},Ht=["onClick"],Ft={class:"tqp"},Wt={class:"tqp-stat"},Zt={class:"tqp-stat"},Kt={class:"ok"},Gt={class:"tqp-stat"},Ut={class:"tqp-stat"},Jt={class:"tqp-stat"},Xt={class:"tqp-stat"},Qt={__name:"ThemeQuickPanel",setup(t){const n=F(),o=ct(),a=lt(),e=it(),s=A(()=>`oklch(0.72 0.21 ${n.hue})`);return(r,l)=>(y(),w(T,null,[d("div",Vt,[l[1]||(l[1]=d("span",{class:"tqp-label"},"主题色相",-1)),d("input",{type:"range",min:"0",max:"360",value:k(n).hue,onInput:l[0]||(l[0]=p=>k(n).setHue(p.target.value)),"aria-label":"主题色相",class:"tqp-range"},null,40,jt),d("div",zt,[d("span",{class:"swatch",style:ht({background:s.value,boxShadow:`0 0 10px ${s.value}`})},null,4),d("span",Dt,M(k(n).hue)+"°",1)])]),d("div",qt,[l[2]||(l[2]=d("span",{class:"tqp-label"},"字号",-1)),d("div",Bt,[(y(),w(T,null,U([14,16,18],p=>d("button",{key:p,type:"button",class:ot(["tab",{active:k(n).fontSize===p}]),onClick:h=>k(n).setFontSize(p)},M(p===14?"紧凑":p===16?"标准":"舒适"),11,Ht)),64))])]),d("div",Ft,[l[9]||(l[9]=d("span",{class:"tqp-label"},"数据快照",-1)),d("div",Wt,[l[3]||(l[3]=d("span",null,"文章",-1)),d("strong",null,M(k(o).stats.total),1)]),d("div",Zt,[l[4]||(l[4]=d("span",null,"已读",-1)),d("strong",Kt,M(k(o).stats.done),1)]),d("div",Gt,[l[5]||(l[5]=d("span",null,"在读",-1)),d("strong",null,M(k(o).stats.reading),1)]),d("div",Ut,[l[6]||(l[6]=d("span",null,"收藏",-1)),d("strong",null,M(k(o).stats.collected),1)]),d("div",Jt,[l[7]||(l[7]=d("span",null,"笔记",-1)),d("strong",null,M(k(a).stats.total),1)]),d("div",Xt,[l[8]||(l[8]=d("span",null,"标签",-1)),d("strong",null,M(k(e).tags.length),1)])])],64))}},Yt=ut(Qt,[["__scopeId","data-v-30e73e03"]]),te={class:"ui-toast-stack","aria-live":"polite","aria-atomic":"true"},ee=["role"],ne={__name:"AppToastStack",setup(t){const n=F();return(o,a)=>(y(),w("div",te,[(y(!0),w(T,null,U(k(n).toasts,e=>(y(),w("div",{key:e.id,class:ot(["ui-toast",e.type,{leaving:e.leaving}]),role:e.type==="error"||e.type==="warning"?"alert":"status"},M(e.text),11,ee))),128))]))}},oe=["width","height","innerHTML"],D={__name:"IconBase",props:{name:{type:String,required:!0},size:{type:[Number,String],default:16}},setup(t){const n={dashboard:'<path d="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" stroke="currentColor" stroke-width="1.6" fill="none"/>',library:'<path d="M4 19V5a2 2 0 012-2h13v18H6a2 2 0 01-2-2zm0 0a2 2 0 012-2h13" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>',notes:'<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6z" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M14 3v6h6M8 13h8M8 17h5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>',tags:'<path d="M20.59 13.41L13.42 20.58a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/><circle cx="7" cy="7" r="1.5" fill="currentColor"/>',stats:'<path d="M3 3v18h18M7 14l4-4 4 4 5-7" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',settings:'<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 008 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H2a2 2 0 010-4h.09A1.65 1.65 0 003.6 8a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H8a1.65 1.65 0 001-1.51V2a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V8a1.65 1.65 0 001.51 1H22a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" stroke-width="1.6" fill="none"/>',search:'<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',plus:'<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',check:'<path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',close:'<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',trash:'<path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',pin:'<path d="M12 17l-5 4 1.5-6L4 11l6-.5L12 5l2 5.5 6 .5-4.5 4L17 21z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/>',star:'<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/>',"star-filled":'<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" fill="currentColor"/>',heart:'<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" stroke-width="1.6" fill="none"/>',"heart-filled":'<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="currentColor"/>',edit:'<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 113 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6" fill="none"/>',"arrow-left":'<path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',"arrow-right":'<path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',"arrow-up":'<path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',copy:'<rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="1.6" fill="none"/>',download:'<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',upload:'<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',book:'<path d="M4 19.5A2.5 2.5 0 016.5 17H20V2H6.5A2.5 2.5 0 004 4.5v15zM4 19.5V22h16" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',clock:'<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',menu:'<path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',sliders:'<path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14h6M9 8h6M17 16h6" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>',palette:'<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="12" cy="7.5" r="1.5" fill="currentColor"/><circle cx="16.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="15" cy="15.5" r="1.5" fill="currentColor"/>',graph:'<circle cx="6" cy="6" r="2.5" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="18" cy="6" r="2.5" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="6" cy="18" r="2.5" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="18" cy="18" r="2.5" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/><path d="M7.5 7.5L10 10M16.5 7.5L14 10M7.5 16.5L10 14M16.5 16.5L14 14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',link:'<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'};function o(a){return n[a]||n.close}return(a,e)=>(y(),w("svg",{width:t.size,height:t.size,viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",innerHTML:o(t.name),"aria-hidden":"true"},null,8,oe))}},re={class:"app-nav"},se={key:0,class:"nav-links"},ae={key:0,class:"blog-main"},le={key:1,class:"app-layout"},ie={class:"app-aside"},ce={class:"app-aside-inner"},ue={class:"app-menu"},de={key:0,class:"badge"},pe={class:"app-aside-foot"},he={class:"app-main"},fe={class:"app-tools"},me={class:"app-tools-inner"},ge={__name:"AppLayout",setup(t){const n=vt(),o=kt(),a=lt(),e=it(),s=ct(),r=F(),l=A(()=>n.meta?.layout||"app"),p=C("");function h(){const c=p.value.trim();c&&(o.push({name:"library",query:{q:c}}),r.pushToast("info",`已跳到文章库搜索:"${c}"`))}const m=A(()=>[{to:"/dashboard",label:"仪表板",icon:"dashboard",badge:null},{to:"/library",label:"文章库",icon:"library",badge:null},{to:"/notes",label:"笔记",icon:"notes",badge:a.stats.total},{to:"/tags",label:"标签",icon:"tags",badge:e.tags.length},{to:"/graph",label:"知识图谱",icon:"graph",badge:a.stats.totalLinks||null},{to:"/stats",label:"统计",icon:"stats",badge:null},{to:"/settings",label:"设置",icon:"settings",badge:null}]);return(c,i)=>(y(),w(T,null,[d("header",re,[S(k(N),{to:"/",class:"brand"},{default:I(()=>[...i[1]||(i[1]=[d("span",{class:"brand-mark"},null,-1),d("span",{class:"brand-text"},"APOS",-1)])]),_:1}),l.value==="blog"?(y(),w("nav",se,[S(k(N),{to:"/"},{default:I(()=>[...i[2]||(i[2]=[W("首页",-1)])]),_:1}),S(k(N),{to:"/dashboard"},{default:I(()=>[...i[3]||(i[3]=[W("知识库",-1)])]),_:1}),S(k(N),{to:"/playground"},{default:I(()=>[...i[4]||(i[4]=[W("工具间",-1)])]),_:1}),i[5]||(i[5]=d("a",{href:"https://github.com/Apos-DT",target:"_blank",rel:"noopener"},"GitHub ↗",-1))])):(y(),w("form",{key:1,class:"nav-search",onSubmit:ft(h,["prevent"])},[S(D,{name:"search",size:14}),mt(d("input",{"onUpdate:modelValue":i[0]||(i[0]=g=>p.value=g),type:"search",placeholder:"搜索文章 / 笔记 / 标签… (回车跳转文章库)","aria-label":"全局搜索"},null,512),[[gt,p.value]])],32)),l.value==="blog"?(y(),q(k(N),{key:2,class:"nav-cta",to:"/dashboard"},{default:I(()=>[i[6]||(i[6]=d("span",null,"进入应用",-1)),S(D,{name:"arrow-right",size:14})]),_:1})):(y(),q(k(N),{key:3,class:"nav-back",to:"/"},{default:I(()=>[S(D,{name:"arrow-left",size:14}),i[7]||(i[7]=d("span",null,"返回首页",-1))]),_:1}))]),l.value==="blog"?(y(),w("main",ae,[Q(c.$slots,"default",{},void 0)])):(y(),w("div",le,[d("aside",ie,[d("div",ce,[i[9]||(i[9]=d("span",{class:"app-aside-label"},"导航",-1)),d("nav",ue,[(y(!0),w(T,null,U(m.value,g=>(y(),q(k(N),{key:g.to,to:g.to},{default:I(()=>[S(D,{name:g.icon,size:16},null,8,["name"]),d("span",null,M(g.label),1),g.badge!=null?(y(),w("span",de,M(g.badge),1)):yt("",!0)]),_:2},1032,["to"]))),128))]),d("div",pe,[i[8]||(i[8]=d("span",{class:"dot live"},null,-1)),d("span",null,M(k(s).stats.done)+" 已读 · "+M(k(s).stats.reading)+" 在读",1)])])]),d("main",he,[Q(c.$slots,"default",{},void 0)]),d("aside",fe,[d("div",me,[i[10]||(i[10]=d("div",{class:"app-tools-mount"},null,-1)),S(Yt)])])])),S(ne)],64))}},ve=ut(ge,[["__scopeId","data-v-17dd8782"]]),ke={__name:"App",setup(t){const n=F();let o=null,a=0;return K(()=>{if(n.applyTheme(),!matchMedia("(prefers-reduced-motion: reduce)").matches){o=new Et({duration:1.15,easing:s=>Math.min(1,1.001-Math.pow(2,-10*s)),smoothWheel:!0,smoothTouch:!1});const e=s=>{o.raf(s),a=requestAnimationFrame(e)};a=requestAnimationFrame(e)}}),G(()=>{a&&cancelAnimationFrame(a),o&&o.destroy()}),(e,s)=>{const r=_t("router-view");return y(),w(T,null,[S(Ct),S(Ot),S(ve,null,{default:I(()=>[S(r,null,{default:I(({Component:l,route:p})=>[S(wt,{name:"page",mode:"out-in"},{default:I(()=>[(y(),q(bt(l),{key:p.fullPath}))]),_:2},1024)]),_:1})]),_:1})],64)}}},ye="modulepreload",_e=function(t){return"/AposBlog/"+t},nt={},E=function(n,o,a){let e=Promise.resolve();if(o&&o.length>0){let r=function(h){return Promise.all(h.map(m=>Promise.resolve(m).then(c=>({status:"fulfilled",value:c}),c=>({status:"rejected",reason:c}))))};document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),p=l?.nonce||l?.getAttribute("nonce");e=r(o.map(h=>{if(h=_e(h),h in nt)return;nt[h]=!0;const m=h.endsWith(".css"),c=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${h}"]${c}`))return;const i=document.createElement("link");if(i.rel=m?"stylesheet":ye,m||(i.as="script"),i.crossOrigin="",i.href=h,p&&i.setAttribute("nonce",p),document.head.appendChild(i),m)return new Promise((g,_)=>{i.addEventListener("load",g),i.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${h}`)))})}))}function s(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return e.then(r=>{for(const l of r||[])l.status==="rejected"&&s(l.reason);return n().catch(s)})},we=[{path:"/",name:"home",component:()=>E(()=>import("./HomeView-Ducqygol.js"),__vite__mapDeps([0,1,2,3,4,5])),meta:{title:"首页",layout:"blog"}},{path:"/post/:slug",name:"post",component:()=>E(()=>import("./PostView-B1ZefJM6.js"),__vite__mapDeps([6,1,2,4,7])),meta:{title:"文章",layout:"blog"}},{path:"/playground",name:"playground",component:()=>E(()=>import("./PlaygroundView-ZTzptv_U.js"),__vite__mapDeps([8,1,4,9])),meta:{title:"工具间",layout:"blog"}},{path:"/dashboard",name:"dashboard",component:()=>E(()=>import("./DashboardView-DPk0yc8Z.js"),__vite__mapDeps([10,1,2,4,11])),meta:{title:"仪表板",icon:"dashboard",layout:"app"}},{path:"/library",name:"library",component:()=>E(()=>import("./LibraryView-B5gvcwjM.js"),__vite__mapDeps([12,1,2,4,13])),meta:{title:"文章库",icon:"library",layout:"app"}},{path:"/library/:slug",redirect:t=>`/post/${t.params.slug}`},{path:"/notes",name:"notes",component:()=>E(()=>import("./NotesView-B7J84jAO.js"),__vite__mapDeps([14,1,2,4,15])),meta:{title:"笔记",icon:"notes",layout:"app"}},{path:"/notes/:id",name:"noteEdit",component:()=>E(()=>import("./NoteEditView-BVwkSd1v.js"),__vite__mapDeps([16,1,2,4,17])),meta:{title:"编辑笔记",icon:"notes",layout:"app"}},{path:"/tags",name:"tags",component:()=>E(()=>import("./TagsView-CqHGVlt7.js"),__vite__mapDeps([18,1,4,19])),meta:{title:"标签",icon:"tags",layout:"app"}},{path:"/graph",name:"graph",component:()=>E(()=>import("./GraphView-BmA_CQ0M.js"),__vite__mapDeps([20,1,2,21,4,22])),meta:{title:"知识图谱",icon:"graph",layout:"app"}},{path:"/stats",name:"stats",component:()=>E(()=>import("./StatsView-Co7fF8aj.js"),__vite__mapDeps([23,2,1,21,4,24])),meta:{title:"统计",icon:"stats",layout:"app"}},{path:"/settings",name:"settings",component:()=>E(()=>import("./SettingsView-BH4eViZI.js"),__vite__mapDeps([25,2,1,4,26])),meta:{title:"设置",icon:"settings",layout:"app"}},{path:"/:pathMatch(.*)*",name:"notFound",component:()=>E(()=>import("./NotFoundView-EUSDyxxV.js"),__vite__mapDeps([27,1,4,28])),meta:{title:"404",layout:"blog"}}],dt=$t({history:St(),routes:we,scrollBehavior(t,n,o){return o||(t.hash?{el:t.hash,behavior:"smooth"}:{top:0,behavior:"smooth"})}});dt.afterEach(t=>{const n="APOS · 赵祥生";document.title=t.meta?.title?`${t.meta.title} · ${n}`:n});const J=Mt(ke);J.use(At());J.use(dt);J.mount("#app");export{ut as _,D as a,st as b,Se as c,H as d,Me as e,ct as f,F as g,it as h,Ae as i,at as p,xe as r,Ee as s,lt as u};
