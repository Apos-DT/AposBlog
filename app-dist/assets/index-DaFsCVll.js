const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./DashboardView-BNVBX4Ag.js","./vue-BNKyQ4Sq.js","./posts-DN9P4Iaa.js","./DashboardView-DQUfWHMU.css","./LibraryView-wRrQb_fo.js","./LibraryView-DJHzmBB7.css","./ReaderView-4QZcniIr.js","./ReaderView-B19QlHo7.css","./NotesView-NXm5mT30.js","./NotesView-DBjOkyW8.css","./NoteEditView-BLeMZM2q.js","./NoteEditView-T6FnXX2o.css","./TagsView-Dii7jvAi.js","./TagsView-CMfmAfeD.css","./GraphView-B3pL1o8H.js","./echarts-qCor5qs6.js","./GraphView-lVZpT7kV.css","./StatsView-Bwe5yRBF.js","./StatsView-Bt2yPTD4.css","./SettingsView-BRuegmzA.js","./SettingsView-CBvFO3le.css","./NotFoundView-CrdcwaHn.js","./NotFoundView-OKIYwxCK.css"])))=>i.map(i=>d[i]);
import{I as ct,n as z,v as C,s as F,r as Y,u as b,g as A,d,F as N,c as M,B as _,q as ut,A as S,w as W,p as tt,C as dt,D as pt,l as x,J as V,R as U,L as ht,K as ft,H as mt,e as et,f as gt,x as vt,t as kt,y as _t,a as yt,z as wt,i as bt,m as $t,b as St,h as Mt}from"./vue-BNKyQ4Sq.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const a of e)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function o(e){const a={};return e.integrity&&(a.integrity=e.integrity),e.referrerPolicy&&(a.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?a.credentials="include":e.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(e){if(e.ep)return;e.ep=!0;const a=o(e);fetch(e.href,a)}})();const j="apos";function At(t,n){try{const o=localStorage.getItem(`${j}:${t}`);return o?JSON.parse(o):typeof n=="function"?n():n}catch(o){return console.warn("[apos] loadState failed",t,o),typeof n=="function"?n():n}}function nt(t,n){try{localStorage.setItem(`${j}:${t}`,JSON.stringify(n))}catch(o){console.warn("[apos] saveState failed",t,o)}}function D(t,n,o){const s=At(t,o);for(const e of Object.keys(n))s&&s[e]!==void 0&&(n[e].value=s[e]);ct(()=>Object.fromEntries(Object.keys(n).map(e=>[e,n[e].value])),e=>nt(t,e),{deep:!0})}function ye(){const t=[];for(let n=0;n<localStorage.length;n++){const o=localStorage.key(n);o&&o.startsWith(`${j}:`)&&t.push(o)}t.forEach(n=>localStorage.removeItem(n))}function we(){const t={};for(let n=0;n<localStorage.length;n++){const o=localStorage.key(n);if(o&&o.startsWith(`${j}:`))try{t[o.slice(j.length+1)]=JSON.parse(localStorage.getItem(o))}catch{}}return{version:1,exportedAt:new Date().toISOString(),data:t}}function be(t){if(!t||!t.data)throw new Error("数据格式不正确");Object.entries(t.data).forEach(([n,o])=>{nt(n,o)})}const B=z("settings",()=>{const t=C(295),n=C(16),o=C(!1),s=C([]);D("settings",{hue:t,fontSize:n,reducedMotion:o},()=>({hue:295,fontSize:16,reducedMotion:!1}));function e(){const h=document.documentElement;h.style.setProperty("--accent",`oklch(0.72 0.21 ${t.value})`),h.style.fontSize=n.value+"px"}function a(h){t.value=Math.max(0,Math.min(360,parseInt(h,10)||0)),e()}function r(h){n.value=parseInt(h,10)||16,e()}function l(h,f,c=2800){const i=Math.random().toString(36).slice(2);s.value.push({id:i,type:h,text:f}),setTimeout(()=>{const m=s.value.findIndex(g=>g.id===i);m>=0&&(s.value[m].leaving=!0),setTimeout(()=>{s.value=s.value.filter(g=>g.id!==i)},300)},c)}return{hue:t,fontSize:n,reducedMotion:o,toasts:s,applyTheme:e,setHue:a,setFontSize:r,pushToast:l}}),Et={__name:"AppBackground",setup(t){const n=C(null);let o=null;return F(()=>{const s=n.value?n.value.querySelectorAll(".blob"):[];if(!s.length)return;const e=a=>{const r=a.clientX/window.innerWidth-.5,l=a.clientY/window.innerHeight-.5;s.forEach((h,f)=>{const c=(f+1)*14;h.style.transform=`translate3d(${r*c}px, ${l*c}px, 0)`})};window.addEventListener("mousemove",e,{passive:!0}),o=()=>window.removeEventListener("mousemove",e)}),Y(()=>o&&o()),(s,e)=>(b(),A(N,null,[e[1]||(e[1]=d("div",{class:"app-bg-grain","aria-hidden":"true"},null,-1)),d("div",{ref_key:"blobsEl",ref:n,class:"app-bg-aurora","aria-hidden":"true"},[...e[0]||(e[0]=[d("span",{class:"blob a"},null,-1),d("span",{class:"blob b"},null,-1),d("span",{class:"blob c"},null,-1)])],512)],64))}},xt={__name:"AppCursor",setup(t){const n=C(null),o=C(null);let s=0,e=null;return F(()=>{if(!matchMedia("(hover: hover)").matches)return;const a={x:innerWidth/2,y:innerHeight/2},r={x:a.x,y:a.y},l=(v,$,O)=>v+($-v)*O,h=v=>{a.x=v.clientX,a.y=v.clientY};window.addEventListener("mousemove",h,{passive:!0});const f=()=>{r.x=l(r.x,a.x,.16),r.y=l(r.y,a.y,.16),n.value&&(n.value.style.transform=`translate3d(${a.x-3}px, ${a.y-3}px, 0)`),o.value&&(o.value.style.transform=`translate3d(${r.x-18}px, ${r.y-18}px, 0)`),s=requestAnimationFrame(f)};f();const c=()=>document.body.classList.add("cursor-hover"),i=()=>document.body.classList.remove("cursor-hover"),m=()=>{document.querySelectorAll('a, button, .ui-card, .post-card, [data-cursor="link"]').forEach(v=>{v.addEventListener("mouseenter",c),v.addEventListener("mouseleave",i)})};m();const g=new MutationObserver(()=>m());g.observe(document.body,{childList:!0,subtree:!0}),e=()=>{cancelAnimationFrame(s),window.removeEventListener("mousemove",h),g.disconnect(),i()}}),Y(()=>e&&e()),(a,r)=>(b(),A(N,null,[d("div",{ref_key:"dot",ref:n,class:"app-cursor-dot","aria-hidden":"true"},null,512),d("div",{ref_key:"ring",ref:o,class:"app-cursor-ring","aria-hidden":"true"},null,512)],64))}},Ct=[{slug:"odoo-erp-manufacturing-customization",title:"在 Odoo 里做制造业 ERP 二开:销采产存质财全链路笔记",excerpt:"从客户手工 Excel 跑产线,到 Odoo 把销售-采购-库存-生产-质检-财务跑通。这篇拆开几个月里的关键二开决策与踩坑。",tag:"ERP",date:"2026-05-13",readTime:12,external:!1,url:"../../post.html?slug=odoo-erp-manufacturing-customization"},{slug:"industrial-vision-system-pitfalls",title:"工业机器视觉现场交付的 5 个稳定性陷阱",excerpt:"上位机/下位机联调、产线异常定位、通信稳定性优化——实验室能跑、现场就崩的真实原因。",tag:"Vision",date:"2026-04-22",readTime:10,external:!1,url:"../../post.html?slug=industrial-vision-system-pitfalls"},{slug:"springboot-vue-fullstack-craft",title:"Spring Boot + Vue3 全栈工程化:从权限到大屏的实战沉淀",excerpt:"在既有项目上做功能迭代、权限增强、数据可视化大屏。Spring Boot + Vue3 的连接处藏着多少坊。",tag:"Fullstack",date:"2025-09-18",readTime:8,external:!1,url:"../../post.html?slug=springboot-vue-fullstack-craft"},{slug:"python-scraping-pandas-django",title:"用 Selenium + Pandas + Django 做一套招聘数据采集分析",excerpt:"从爬取动态页面,到 Pandas 清洗,再到 Django 可视化展示——一个完整的数据小项目从 0 到 1。",tag:"Data",date:"2025-06-08",readTime:7,external:!1,url:"../../post.html?slug=python-scraping-pandas-django"}],Ot=[{id:"t-erp",name:"ERP",color:"oklch(0.74 0.20 295)"},{id:"t-vision",name:"Vision",color:"oklch(0.80 0.17 220)"},{id:"t-fullstack",name:"Fullstack",color:"oklch(0.84 0.15 60)"},{id:"t-data",name:"Data",color:"oklch(0.80 0.17 160)"},{id:"t-study",name:"学习",color:"oklch(0.77 0.18 320)"},{id:"t-think",name:"思考",color:"oklch(0.80 0.15 30)"},{id:"t-cheat",name:"速查",color:"oklch(0.76 0.17 180)"}],Lt=[{id:"n-welcome",title:"欢迎使用 APOS 知识库",content:`---
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

#Vision #速查`,articleSlug:"industrial-vision-system-pitfalls",tagIds:["t-vision","t-cheat"],pinned:!1,createdAt:"2026-04-22T08:00:00.000Z",updatedAt:"2026-04-22T08:00:00.000Z"}],ot={posts:Ct,tags:Ot,notes:Lt};function rt(t){if(typeof t!="string")return{meta:{},body:t||""};const n=t.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);if(!n)return{meta:{},body:t};const o={};return n[1].split(/\r?\n/).forEach(s=>{const e=s.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);if(!e)return;const a=e[1];let r=e[2].trim();if(!r){o[a]="";return}if(/^\[.*\]$/.test(r)){o[a]=r.slice(1,-1).split(",").map(l=>l.trim().replace(/^["']|["']$/g,"")).filter(Boolean);return}if(/^-?\d+(\.\d+)?$/.test(r)){o[a]=Number(r);return}if(r==="true"||r==="false"){o[a]=r==="true";return}o[a]=r.replace(/^["']|["']$/g,"")}),{meta:o,body:n[2]}}function $e(t,n){const o=Object.keys(t||{}).filter(e=>t[e]!==""&&t[e]!=null);if(!o.length)return n||"";const s=["---"];return o.forEach(e=>{const a=t[e];Array.isArray(a)?s.push(`${e}: [${a.map(r=>JSON.stringify(r)).join(", ")}]`):typeof a=="string"&&/[:#\[\]]/.test(a)?s.push(`${e}: ${JSON.stringify(a)}`):s.push(`${e}: ${a}`)}),s.push("---",""),s.join(`
`)+(n||"")}const G=/\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g,J=/(^|[\s\(])#([a-zA-Z0-9_\-一-龥]{1,30})\b/g;function X(t){if(!t)return[];const n=new Set;let o;for(G.lastIndex=0;(o=G.exec(t))!==null;)n.add(o[1].trim());return Array.from(n)}function It(t){if(!t)return[];const n=new Set;let o;for(J.lastIndex=0;(o=J.exec(t))!==null;)n.add(o[2]);return Array.from(n)}function R(t){return String(t).replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n])}function I(t){return R(t)}function Se(t,n={}){const{body:o}=rt(t||""),s=n.onLink||(()=>null),e=o.replace(/\r\n/g,`
`).split(`
`),a=[];let r=0;for(;r<e.length;){const l=e[r];if(/^```/.test(l)){const c=l.replace(/^```/,"").trim(),i=[];for(r++;r<e.length&&!/^```/.test(e[r]);)i.push(e[r]),r++;r++,a.push(`<pre><code${c?` data-lang="${I(c)}"`:""}>${R(i.join(`
`))}</code></pre>`);continue}if(/^\s*---+\s*$/.test(l)){a.push("<hr/>"),r++;continue}const h=l.match(/^(#{1,6})\s+(.*)$/);if(h){a.push(`<h${h[1].length}>${P(h[2],s)}</h${h[1].length}>`),r++;continue}if(/^>\s?/.test(l)){const c=[];for(;r<e.length&&/^>\s?/.test(e[r]);)c.push(e[r].replace(/^>\s?/,"")),r++;const i=c.join(" ").trim(),m=i.match(/^\[!(INFO|TIP|SUCCESS|NOTE|WARNING|WARN|ERROR|DANGER)\]\s*(.*)$/i);if(m){const g=m[1].toUpperCase(),v={INFO:"info",TIP:"tip",SUCCESS:"success",NOTE:"note",WARNING:"warning",WARN:"warning",ERROR:"error",DANGER:"error"}[g],$={INFO:"Info",TIP:"Tip",SUCCESS:"Success",NOTE:"Note",WARNING:"Warning",WARN:"Warning",ERROR:"Error",DANGER:"Danger"}[g];a.push(`<aside class="md-admon md-admon-${v}"><strong>${$} ·</strong> ${P(m[2],s)}</aside>`)}else a.push(`<blockquote>${P(i,s)}</blockquote>`);continue}if(/^\s*[-*]\s+/.test(l)){const c=[];for(;r<e.length&&/^\s*[-*]\s+/.test(e[r]);)c.push(`<li>${P(e[r].replace(/^\s*[-*]\s+/,""),s)}</li>`),r++;a.push(`<ul>${c.join("")}</ul>`);continue}if(/^\s*\d+\.\s+/.test(l)){const c=[];for(;r<e.length&&/^\s*\d+\.\s+/.test(e[r]);)c.push(`<li>${P(e[r].replace(/^\s*\d+\.\s+/,""),s)}</li>`),r++;a.push(`<ol>${c.join("")}</ol>`);continue}if(/^\s*$/.test(l)){r++;continue}const f=[l];for(r++;r<e.length&&!/^\s*$/.test(e[r])&&!/^(#{1,6}\s|```|>|\s*[-*]\s|\s*\d+\.\s|---+)/.test(e[r]);)f.push(e[r]),r++;a.push(`<p>${P(f.join(" "),s)}</p>`)}return a.join(`
`)}function P(t,n){if(!t)return"";const o=[];let s=t.replace(/`([^`]+?)`/g,(e,a)=>(o.push(a),`\0CODE${o.length-1}\0`));return s=R(s),s=s.replace(/\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g,(e,a,r)=>{const l=a.trim(),h=(r||a).trim(),f=n({type:"wiki",target:l,label:h});return f==null?`<span class="md-wiki md-wiki-missing" title="未链接的笔记: ${I(l)}">${R(h)}</span>`:`<a class="md-wiki" href="${I(f)}" data-wiki="${I(l)}">${R(h)}</a>`}),s=s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,(e,a,r)=>{const l=a.trim(),h=r.trim(),f=l.match(/^video(?::(.*))?$/i);if(f){const i=(f[1]||"").trim();return`<figure class="md-media"><video controls preload="metadata" src="${I(h)}"></video>${i?`<figcaption>${R(i)}</figcaption>`:""}</figure>`}const c=l.match(/^audio(?::(.*))?$/i);if(c){const i=(c[1]||"").trim();return`<figure class="md-media"><audio controls preload="metadata" src="${I(h)}"></audio>${i?`<figcaption>${R(i)}</figcaption>`:""}</figure>`}return`<img alt="${I(l)}" src="${I(h)}" loading="lazy"/>`}),s=s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,(e,a,r)=>{const l=r.trim(),h=/^https?:\/\//i.test(l),c=n({type:"url",target:l,label:a})||l;return`<a href="${I(c)}"${h?' target="_blank" rel="noopener"':""}>${a}</a>`}),s=s.replace(/(^|\s)#([a-zA-Z0-9_\-一-龥]{1,30})\b/g,(e,a,r)=>{const l=n({type:"tag",target:r,label:r});return l?`${a}<a class="md-tag" href="${I(l)}">#${R(r)}</a>`:`${a}<span class="md-tag">#${R(r)}</span>`}),s=s.replace(/\*\*([^*]+?)\*\*/g,"<strong>$1</strong>"),s=s.replace(/(^|[\s>(])\*([^*\n]+?)\*(?=[\s<.,!?:;)]|$)/g,"$1<em>$2</em>"),s=s.replace(/(^|[\s>(])_([^_\n]+?)_(?=[\s<.,!?:;)]|$)/g,"$1<em>$2</em>"),s=s.replace(/ CODE(\d+) /g,(e,a)=>`<code>${R(o[+a])}</code>`),s}function Rt(){return"n-"+Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4)}const st=z("notes",()=>{const t=C([]);D("notes",{notes:t},()=>({notes:ot.notes}));const n=M(()=>{const u={};return t.value.forEach(p=>{p.title&&(u[p.title.toLowerCase().trim()]=p.id)}),u}),o=M(()=>{const u={};return t.value.forEach(p=>{const k=X(p.content||"");u[p.id]=k.map(w=>n.value[w.toLowerCase().trim()]).filter(w=>w&&w!==p.id)}),u}),s=M(()=>{const u={};return t.value.forEach(p=>{u[p.id]=[]}),Object.entries(o.value).forEach(([p,k])=>{k.forEach(w=>{u[w]&&!u[w].includes(p)&&u[w].push(p)})}),u}),e=M(()=>{const u={};return t.value.forEach(p=>{u[p.id]=It(p.content||"")}),u}),a=M(()=>{const u={};return t.value.forEach(p=>{u[p.id]=rt(p.content||"").meta}),u}),r=M(()=>[...t.value].sort((u,p)=>!!u.pinned!=!!p.pinned?u.pinned?-1:1:(p.updatedAt||"").localeCompare(u.updatedAt||"")));function l(u){return t.value.find(p=>p.id===u)}function h(u){if(!u)return null;const p=n.value[u.toLowerCase().trim()];return p?l(p):null}function f(u){return(o.value[u]||[]).map(k=>l(k)).filter(Boolean)}function c(u){return(s.value[u]||[]).map(k=>l(k)).filter(Boolean)}function i(u){const p=l(u);if(!p)return[];const k=X(p.content||""),w=n.value;return k.filter(E=>!w[E.toLowerCase().trim()])}function m(u={}){const p=new Date().toISOString(),k={id:Rt(),title:u.title||"未命名笔记",content:u.content||"",articleSlug:u.articleSlug||null,tagIds:u.tagIds||[],pinned:!!u.pinned,createdAt:p,updatedAt:p};return t.value.unshift(k),k}function g(u,p){const k=t.value.findIndex(w=>w.id===u);return k<0?null:(t.value[k]={...t.value[k],...p,updatedAt:new Date().toISOString()},t.value[k])}function v(u){t.value=t.value.filter(p=>p.id!==u)}function $(u){const p=l(u);p&&g(u,{pinned:!p.pinned})}function O({keyword:u="",tagId:p=null,articleSlug:k=null,status:w=null}={}){let E=r.value;if(p&&(E=E.filter(T=>(T.tagIds||[]).includes(p))),k&&(E=E.filter(T=>T.articleSlug===k)),w&&(E=E.filter(T=>(a.value[T.id]?.status||"draft")===w)),u){const T=u.toLowerCase();E=E.filter(K=>(K.title||"").toLowerCase().includes(T)||(K.content||"").toLowerCase().includes(T))}return E}const y=M(()=>({total:t.value.length,pinned:t.value.filter(u=>u.pinned).length,withArticle:t.value.filter(u=>u.articleSlug).length,totalLinks:Object.values(o.value).reduce((u,p)=>u+p.length,0),orphans:t.value.filter(u=>{const p=o.value[u.id]?.length||0,k=s.value[u.id]?.length||0;return p+k===0}).length}));return{notes:t,sorted:r,titleIndex:n,outLinksByNote:o,backlinksByNote:s,inlineTagsByNote:e,metaByNote:a,findById:l,findByTitle:h,getOutLinks:f,getBacklinks:c,getMissingLinks:i,create:m,update:g,remove:v,togglePin:$,search:O,stats:y}}),at=z("reads",()=>{const t=C([]);D("reads",{records:t},()=>({records:[]}));function n(i){return t.value.find(m=>m.slug===i)}function o(i){let m=n(i);return m||(m={slug:i,status:"unread",progress:0,rating:0,collected:!1,durationMin:0,lastReadAt:null,finishedAt:null},t.value.push(m)),m}function s(i,m){const g=o(i);Object.assign(g,m),g.lastReadAt=new Date().toISOString(),g.status==="done"&&!g.finishedAt&&(g.finishedAt=g.lastReadAt)}function e(i,m){s(i,{status:m})}function a(i){const m=o(i);m.collected=!m.collected,m.lastReadAt=new Date().toISOString()}function r(i,m){s(i,{rating:m})}function l(i,m){const g=o(i);g.progress=Math.max(g.progress,Math.round(m)),g.lastReadAt=new Date().toISOString(),g.progress>=80&&g.status!=="done"?g.status="done":g.progress>0&&g.status==="unread"&&(g.status="reading")}function h(i,m){const g=o(i);g.durationMin=Math.round((g.durationMin||0)+m),g.lastReadAt=new Date().toISOString()}const f=M(()=>{const i=t.value.length,m=t.value.filter(y=>y.status==="done").length,g=t.value.filter(y=>y.status==="reading").length,v=t.value.filter(y=>y.collected).length,$=t.value.reduce((y,u)=>y+(u.durationMin||0),0),O=t.value.filter(y=>y.rating).reduce((y,u)=>y+u.rating,0)/(t.value.filter(y=>y.rating).length||1);return{total:i,done:m,reading:g,collected:v,totalMin:$,avgRating:O}}),c=M(()=>[...t.value].filter(i=>i.lastReadAt).sort((i,m)=>(m.lastReadAt||"").localeCompare(i.lastReadAt||"")).slice(0,5));return{records:t,get:n,ensure:o,patch:s,setStatus:e,toggleCollect:a,setRating:r,setProgress:l,addDuration:h,stats:f,recent:c}});function Tt(){return"t-"+Math.random().toString(36).slice(2,9)}const q=["oklch(0.72 0.21 295)","oklch(0.78 0.18 220)","oklch(0.82 0.16 60)","oklch(0.78 0.18 160)","oklch(0.75 0.20 320)","oklch(0.78 0.15 30)","oklch(0.74 0.17 180)","oklch(0.72 0.20 0)"],lt=z("tags",()=>{const t=C([]);D("tags",{tags:t},()=>({tags:ot.tags}));const n=M(()=>[...t.value]);function o(f){return t.value.find(c=>c.id===f)}function s(f){return t.value.find(c=>c.name===f)}function e({name:f,color:c}){if(!f)throw new Error("标签名不能为空");if(s(f))throw new Error("同名标签已存在");const i={id:Tt(),name:f,color:c||q[t.value.length%q.length]};return t.value.push(i),i}function a(f,c){const i=t.value.findIndex(m=>m.id===f);i<0||(t.value[i]={...t.value[i],...c})}function r(f){t.value=t.value.filter(c=>c.id!==f)}function l(f){return o(f)?.color||"var(--ink-3)"}function h(f){return o(f)?.name||""}return{tags:t,all:n,palette:q,findById:o,findByName:s,create:e,update:a,remove:r,colorOf:l,nameOf:h}}),Nt=(t,n)=>{const o=t.__vccOpts||t;for(const[s,e]of n)o[s]=e;return o},Pt={class:"tqp"},Vt=["value"],jt={class:"tqp-hue"},zt={class:"value"},Dt={class:"tqp"},Bt={class:"tqp-tabs"},qt=["onClick"],Ht={class:"tqp"},Ft={class:"tqp-stat"},Wt={class:"tqp-stat"},Zt={class:"ok"},Kt={class:"tqp-stat"},Ut={class:"tqp-stat"},Gt={class:"tqp-stat"},Jt={class:"tqp-stat"},Xt={__name:"ThemeQuickPanel",setup(t){const n=B(),o=at(),s=st(),e=lt(),a=M(()=>`oklch(0.72 0.21 ${n.hue})`);return(r,l)=>(b(),A(N,null,[d("div",Pt,[l[1]||(l[1]=d("span",{class:"tqp-label"},"主题色相",-1)),d("input",{type:"range",min:"0",max:"360",value:_(n).hue,onInput:l[0]||(l[0]=h=>_(n).setHue(h.target.value)),"aria-label":"主题色相",class:"tqp-range"},null,40,Vt),d("div",jt,[d("span",{class:"swatch",style:ut({background:a.value,boxShadow:`0 0 10px ${a.value}`})},null,4),d("span",zt,S(_(n).hue)+"°",1)])]),d("div",Dt,[l[2]||(l[2]=d("span",{class:"tqp-label"},"字号",-1)),d("div",Bt,[(b(),A(N,null,W([14,16,18],h=>d("button",{key:h,type:"button",class:tt(["tab",{active:_(n).fontSize===h}]),onClick:f=>_(n).setFontSize(h)},S(h===14?"紧凑":h===16?"标准":"舒适"),11,qt)),64))])]),d("div",Ht,[l[9]||(l[9]=d("span",{class:"tqp-label"},"数据快照",-1)),d("div",Ft,[l[3]||(l[3]=d("span",null,"文章",-1)),d("strong",null,S(_(o).stats.total),1)]),d("div",Wt,[l[4]||(l[4]=d("span",null,"已读",-1)),d("strong",Zt,S(_(o).stats.done),1)]),d("div",Kt,[l[5]||(l[5]=d("span",null,"在读",-1)),d("strong",null,S(_(o).stats.reading),1)]),d("div",Ut,[l[6]||(l[6]=d("span",null,"收藏",-1)),d("strong",null,S(_(o).stats.collected),1)]),d("div",Gt,[l[7]||(l[7]=d("span",null,"笔记",-1)),d("strong",null,S(_(s).stats.total),1)]),d("div",Jt,[l[8]||(l[8]=d("span",null,"标签",-1)),d("strong",null,S(_(e).tags.length),1)])])],64))}},Qt=Nt(Xt,[["__scopeId","data-v-30e73e03"]]),Yt={class:"ui-toast-stack","aria-live":"polite","aria-atomic":"true"},te=["role"],ee={__name:"AppToastStack",setup(t){const n=B();return(o,s)=>(b(),A("div",Yt,[(b(!0),A(N,null,W(_(n).toasts,e=>(b(),A("div",{key:e.id,class:tt(["ui-toast",e.type,{leaving:e.leaving}]),role:e.type==="error"||e.type==="warning"?"alert":"status"},S(e.text),11,te))),128))]))}},ne=["width","height","innerHTML"],H={__name:"IconBase",props:{name:{type:String,required:!0},size:{type:[Number,String],default:16}},setup(t){const n={dashboard:'<path d="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" stroke="currentColor" stroke-width="1.6" fill="none"/>',library:'<path d="M4 19V5a2 2 0 012-2h13v18H6a2 2 0 01-2-2zm0 0a2 2 0 012-2h13" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>',notes:'<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6z" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M14 3v6h6M8 13h8M8 17h5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>',tags:'<path d="M20.59 13.41L13.42 20.58a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/><circle cx="7" cy="7" r="1.5" fill="currentColor"/>',stats:'<path d="M3 3v18h18M7 14l4-4 4 4 5-7" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',settings:'<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 008 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H2a2 2 0 010-4h.09A1.65 1.65 0 003.6 8a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H8a1.65 1.65 0 001-1.51V2a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V8a1.65 1.65 0 001.51 1H22a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" stroke-width="1.6" fill="none"/>',search:'<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',plus:'<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',check:'<path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',close:'<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',trash:'<path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',pin:'<path d="M12 17l-5 4 1.5-6L4 11l6-.5L12 5l2 5.5 6 .5-4.5 4L17 21z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/>',star:'<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/>',"star-filled":'<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" fill="currentColor"/>',heart:'<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" stroke-width="1.6" fill="none"/>',"heart-filled":'<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="currentColor"/>',edit:'<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 113 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6" fill="none"/>',"arrow-left":'<path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',"arrow-right":'<path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',"arrow-up":'<path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',copy:'<rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="1.6" fill="none"/>',download:'<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',upload:'<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',book:'<path d="M4 19.5A2.5 2.5 0 016.5 17H20V2H6.5A2.5 2.5 0 004 4.5v15zM4 19.5V22h16" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',clock:'<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',menu:'<path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',sliders:'<path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14h6M9 8h6M17 16h6" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>',palette:'<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="12" cy="7.5" r="1.5" fill="currentColor"/><circle cx="16.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="15" cy="15.5" r="1.5" fill="currentColor"/>',graph:'<circle cx="6" cy="6" r="2.5" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="18" cy="6" r="2.5" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="6" cy="18" r="2.5" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="18" cy="18" r="2.5" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/><path d="M7.5 7.5L10 10M16.5 7.5L14 10M7.5 16.5L10 14M16.5 16.5L14 14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',link:'<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'};function o(s){return n[s]||n.close}return(s,e)=>(b(),A("svg",{width:t.size,height:t.size,viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",innerHTML:o(t.name),"aria-hidden":"true"},null,8,ne))}},oe={class:"app-nav"},re={href:"../../",class:"nav-back","data-cursor":"link"},se={class:"app-layout"},ae={class:"app-aside","aria-label":"侧边导航"},le={class:"app-aside-inner"},ie={class:"app-menu"},ce={key:0,class:"badge"},ue={class:"app-aside-foot"},de={class:"app-main"},pe={class:"app-tools","aria-label":"工具面板"},he={class:"app-tools-inner"},fe={__name:"AppLayout",setup(t){dt();const n=pt(),o=st(),s=at(),e=lt(),a=B(),r=C("");function l(){const f=r.value.trim();f&&(n.push({name:"library",query:{q:f}}),a.pushToast("info",`已跳到文章库搜索:"${f}"`))}const h=M(()=>[{to:"/",label:"仪表板",icon:"dashboard",badge:null},{to:"/library",label:"文章库",icon:"library",badge:null},{to:"/notes",label:"笔记",icon:"notes",badge:o.stats.total},{to:"/tags",label:"标签",icon:"tags",badge:e.tags.length},{to:"/graph",label:"知识图谱",icon:"graph",badge:o.stats.totalLinks||null},{to:"/stats",label:"统计",icon:"stats",badge:null},{to:"/settings",label:"设置",icon:"settings",badge:null}]);return(f,c)=>(b(),A(N,null,[d("header",oe,[x(_(U),{to:"/",class:"brand"},{default:V(()=>[...c[1]||(c[1]=[d("span",{class:"brand-mark"},null,-1),d("span",null,"APOS · 阅读与笔记",-1)])]),_:1}),d("form",{class:"nav-search",onSubmit:ht(l,["prevent"])},[x(H,{name:"search",size:14}),ft(d("input",{"onUpdate:modelValue":c[0]||(c[0]=i=>r.value=i),type:"search",placeholder:"搜索文章 / 笔记 / 标签… (回车跳转文章库)","aria-label":"全局搜索"},null,512),[[mt,r.value]])],32),d("a",re,[x(H,{name:"arrow-left",size:14}),c[2]||(c[2]=d("span",null,"返回博客",-1))])]),d("div",se,[d("aside",ae,[d("div",le,[c[4]||(c[4]=d("span",{class:"app-aside-label"},"导航",-1)),d("nav",ie,[(b(!0),A(N,null,W(h.value,i=>(b(),et(_(U),{key:i.to,to:i.to},{default:V(()=>[x(H,{name:i.icon,size:16},null,8,["name"]),d("span",null,S(i.label),1),i.badge!=null?(b(),A("span",ce,S(i.badge),1)):gt("",!0)]),_:2},1032,["to"]))),128))]),d("div",ue,[c[3]||(c[3]=d("span",{class:"dot live"},null,-1)),d("span",null,S(_(s).stats.done)+" 已读 · "+S(_(s).stats.reading)+" 在读",1)])])]),d("main",de,[vt(f.$slots,"default")]),d("aside",pe,[d("div",he,[c[5]||(c[5]=d("div",{class:"app-tools-mount"},null,-1)),x(Qt)])])]),x(ee)],64))}},me={__name:"App",setup(t){const n=B();return F(()=>{n.applyTheme()}),kt(()=>{}),(o,s)=>{const e=_t("router-view");return b(),A(N,null,[x(Et),x(xt),x(fe,null,{default:V(()=>[x(e,null,{default:V(({Component:a,route:r})=>[x(yt,{name:"page",mode:"out-in"},{default:V(()=>[(b(),et(wt(a),{key:r.fullPath}))]),_:2},1024)]),_:1})]),_:1})],64)}}},ge="modulepreload",ve=function(t,n){return new URL(t,n).href},Q={},L=function(n,o,s){let e=Promise.resolve();if(o&&o.length>0){let r=function(c){return Promise.all(c.map(i=>Promise.resolve(i).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};const l=document.getElementsByTagName("link"),h=document.querySelector("meta[property=csp-nonce]"),f=h?.nonce||h?.getAttribute("nonce");e=r(o.map(c=>{if(c=ve(c,s),c in Q)return;Q[c]=!0;const i=c.endsWith(".css"),m=i?'[rel="stylesheet"]':"";if(!!s)for(let $=l.length-1;$>=0;$--){const O=l[$];if(O.href===c&&(!i||O.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${c}"]${m}`))return;const v=document.createElement("link");if(v.rel=i?"stylesheet":ge,i||(v.as="script"),v.crossOrigin="",v.href=c,f&&v.setAttribute("nonce",f),document.head.appendChild(v),i)return new Promise(($,O)=>{v.addEventListener("load",$),v.addEventListener("error",()=>O(new Error(`Unable to preload CSS for ${c}`)))})}))}function a(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return e.then(r=>{for(const l of r||[])l.status==="rejected"&&a(l.reason);return n().catch(a)})},ke=[{path:"/",name:"dashboard",component:()=>L(()=>import("./DashboardView-BNVBX4Ag.js"),__vite__mapDeps([0,1,2,3]),import.meta.url),meta:{title:"仪表板",icon:"dashboard"}},{path:"/library",name:"library",component:()=>L(()=>import("./LibraryView-wRrQb_fo.js"),__vite__mapDeps([4,1,2,5]),import.meta.url),meta:{title:"文章库",icon:"library"}},{path:"/library/:slug",name:"reader",component:()=>L(()=>import("./ReaderView-4QZcniIr.js"),__vite__mapDeps([6,1,2,7]),import.meta.url),meta:{title:"阅读器",icon:"library",hideInNav:!0}},{path:"/notes",name:"notes",component:()=>L(()=>import("./NotesView-NXm5mT30.js"),__vite__mapDeps([8,1,2,9]),import.meta.url),meta:{title:"笔记",icon:"notes"}},{path:"/notes/:id",name:"noteEdit",component:()=>L(()=>import("./NoteEditView-BLeMZM2q.js"),__vite__mapDeps([10,1,2,11]),import.meta.url),meta:{title:"编辑笔记",icon:"notes",hideInNav:!0}},{path:"/tags",name:"tags",component:()=>L(()=>import("./TagsView-Dii7jvAi.js"),__vite__mapDeps([12,1,13]),import.meta.url),meta:{title:"标签",icon:"tags"}},{path:"/graph",name:"graph",component:()=>L(()=>import("./GraphView-B3pL1o8H.js"),__vite__mapDeps([14,1,2,15,16]),import.meta.url),meta:{title:"知识图谱",icon:"graph"}},{path:"/stats",name:"stats",component:()=>L(()=>import("./StatsView-Bwe5yRBF.js"),__vite__mapDeps([17,2,1,15,18]),import.meta.url),meta:{title:"统计",icon:"stats"}},{path:"/settings",name:"settings",component:()=>L(()=>import("./SettingsView-BRuegmzA.js"),__vite__mapDeps([19,2,1,20]),import.meta.url),meta:{title:"设置",icon:"settings"}},{path:"/:pathMatch(.*)*",name:"notFound",component:()=>L(()=>import("./NotFoundView-CrdcwaHn.js"),__vite__mapDeps([21,1,22]),import.meta.url),meta:{hideInNav:!0}}],it=bt({history:$t(),routes:ke,scrollBehavior(t,n,o){return o||{top:0,behavior:"smooth"}}});it.afterEach(t=>{const n="APOS · 阅读追踪与知识库";document.title=t.meta?.title?`${t.meta.title} · ${n}`:n});const Z=St(me);Z.use(Mt());Z.use(it);Z.mount("#app");export{Nt as _,H as a,ot as b,ye as c,D as d,we as e,at as f,B as g,lt as h,be as i,rt as p,Se as r,$e as s,st as u};
