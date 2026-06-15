import{n as C,u as Z,c as A}from"./vue-DuDYKpJ_.js";import{p as B}from"./index-Clo8JgYP.js";const j=[{id:"t-erp",name:"ERP",color:"oklch(0.74 0.20 295)"},{id:"t-vision",name:"Vision",color:"oklch(0.80 0.17 220)"},{id:"t-fullstack",name:"Fullstack",color:"oklch(0.84 0.15 60)"},{id:"t-data",name:"Data",color:"oklch(0.80 0.17 160)"},{id:"t-web",name:"Web",color:"oklch(0.78 0.16 260)"},{id:"t-study",name:"学习",color:"oklch(0.77 0.18 320)"},{id:"t-think",name:"思考",color:"oklch(0.80 0.15 30)"},{id:"t-cheat",name:"速查",color:"oklch(0.76 0.17 180)"}],K=[{id:"n-welcome",title:"欢迎使用 APOS 知识库",content:`---
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
- 在 **文章列表** 跟踪 [[阅读追踪原则]]

## 2. 数据存哪里

所有数据存浏览器 \`localStorage\`,**不发送任何服务器**。换浏览器或清缓存会丢,记得定期到 **设置** 导出 JSON 备份。

## 3. 推荐工作流

1. 读到一篇好文章 → 在文章列表标记已读 + 评分
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

#Vision #速查`,articleSlug:"industrial-vision-system-pitfalls",tagIds:["t-vision","t-cheat"],pinned:!1,createdAt:"2026-04-22T08:00:00.000Z",updatedAt:"2026-04-22T08:00:00.000Z"}],L={tags:j,notes:K};function _(i){if(typeof i!="string")return{meta:{},body:i||""};const c=i.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);if(!c)return{meta:{},body:i};const l={};return c[1].split(/\r?\n/).forEach(r=>{const o=r.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);if(!o)return;const s=o[1];let t=o[2].trim();if(!t){l[s]="";return}if(/^\[.*\]$/.test(t)){l[s]=t.slice(1,-1).split(",").map(a=>a.trim().replace(/^["']|["']$/g,"")).filter(Boolean);return}if(/^-?\d+(\.\d+)?$/.test(t)){l[s]=Number(t);return}if(t==="true"||t==="false"){l[s]=t==="true";return}l[s]=t.replace(/^["']|["']$/g,"")}),{meta:l,body:c[2]}}function F(i,c){const l=Object.keys(i||{}).filter(o=>i[o]!==""&&i[o]!=null);if(!l.length)return c||"";const r=["---"];return l.forEach(o=>{const s=i[o];Array.isArray(s)?r.push(`${o}: [${s.map(t=>JSON.stringify(t)).join(", ")}]`):typeof s=="string"&&/[:#\[\]]/.test(s)?r.push(`${o}: ${JSON.stringify(s)}`):r.push(`${o}: ${s}`)}),r.push("---",""),r.join(`
`)+(c||"")}const E=/\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g,R=/(^|[\s\(])#([a-zA-Z0-9_\-一-龥]{1,30})\b/g;function N(i){if(!i)return[];const c=new Set;let l;for(E.lastIndex=0;(l=E.exec(i))!==null;)c.add(l[1].trim());return Array.from(c)}function P(i){if(!i)return[];const c=new Set;let l;for(R.lastIndex=0;(l=R.exec(i))!==null;)c.add(l[2]);return Array.from(c)}function $(i){return String(i).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c])}function y(i){return $(i)}function G(i,c={}){const{body:l}=_(i||""),r=c.onLink||(()=>null),o=l.replace(/\r\n/g,`
`).split(`
`),s=[];let t=0;for(;t<o.length;){const a=o[t];if(/^```/.test(a)){const d=a.replace(/^```/,"").trim(),f=[];for(t++;t<o.length&&!/^```/.test(o[t]);)f.push(o[t]),t++;t++,s.push(`<pre><code${d?` data-lang="${y(d)}"`:""}>${$(f.join(`
`))}</code></pre>`);continue}if(/^\s*---+\s*$/.test(a)){s.push("<hr/>"),t++;continue}const p=a.match(/^(#{1,6})\s+(.*)$/);if(p){s.push(`<h${p[1].length}>${k(p[2],r)}</h${p[1].length}>`),t++;continue}if(/^>\s?/.test(a)){const d=[];for(;t<o.length&&/^>\s?/.test(o[t]);)d.push(o[t].replace(/^>\s?/,"")),t++;const f=d.join(" ").trim(),S=f.match(/^\[!(INFO|TIP|SUCCESS|NOTE|WARNING|WARN|ERROR|DANGER)\]\s*(.*)$/i);if(S){const w=S[1].toUpperCase(),O={INFO:"info",TIP:"tip",SUCCESS:"success",NOTE:"note",WARNING:"warning",WARN:"warning",ERROR:"error",DANGER:"error"}[w],I={INFO:"Info",TIP:"Tip",SUCCESS:"Success",NOTE:"Note",WARNING:"Warning",WARN:"Warning",ERROR:"Error",DANGER:"Danger"}[w];s.push(`<aside class="md-admon md-admon-${O}"><strong>${I} ·</strong> ${k(S[2],r)}</aside>`)}else s.push(`<blockquote>${k(f,r)}</blockquote>`);continue}if(/^\s*[-*]\s+/.test(a)){const d=[];for(;t<o.length&&/^\s*[-*]\s+/.test(o[t]);)d.push(`<li>${k(o[t].replace(/^\s*[-*]\s+/,""),r)}</li>`),t++;s.push(`<ul>${d.join("")}</ul>`);continue}if(/^\s*\d+\.\s+/.test(a)){const d=[];for(;t<o.length&&/^\s*\d+\.\s+/.test(o[t]);)d.push(`<li>${k(o[t].replace(/^\s*\d+\.\s+/,""),r)}</li>`),t++;s.push(`<ol>${d.join("")}</ol>`);continue}if(/^\s*$/.test(a)){t++;continue}const h=[a];for(t++;t<o.length&&!/^\s*$/.test(o[t])&&!/^(#{1,6}\s|```|>|\s*[-*]\s|\s*\d+\.\s|---+)/.test(o[t]);)h.push(o[t]),t++;s.push(`<p>${k(h.join(" "),r)}</p>`)}return s.join(`
`)}function k(i,c){if(!i)return"";const l=[];let r=i.replace(/`([^`]+?)`/g,(o,s)=>(l.push(s),`\0CODE${l.length-1}\0`));return r=$(r),r=r.replace(/\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g,(o,s,t)=>{const a=s.trim(),p=(t||s).trim(),h=c({type:"wiki",target:a,label:p});return h==null?`<span class="md-wiki md-wiki-missing" title="未链接的笔记: ${y(a)}">${$(p)}</span>`:`<a class="md-wiki" href="${y(h)}" data-wiki="${y(a)}">${$(p)}</a>`}),r=r.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,(o,s,t)=>{const a=s.trim(),p=t.trim(),h=a.match(/^video(?::(.*))?$/i);if(h){const f=(h[1]||"").trim();return`<figure class="md-media"><video controls preload="metadata" src="${y(p)}"></video>${f?`<figcaption>${$(f)}</figcaption>`:""}</figure>`}const d=a.match(/^audio(?::(.*))?$/i);if(d){const f=(d[1]||"").trim();return`<figure class="md-media"><audio controls preload="metadata" src="${y(p)}"></audio>${f?`<figcaption>${$(f)}</figcaption>`:""}</figure>`}return`<img alt="${y(a)}" src="${y(p)}" loading="lazy"/>`}),r=r.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,(o,s,t)=>{const a=t.trim(),p=/^(https?:|mailto:|#|\/)/i.test(a),h=/^https?:\/\//i.test(a),f=c({type:"url",target:a,label:s})||(p?a:null);return f?`<a href="${y(f)}"${h?' target="_blank" rel="noopener"':""}>${s}</a>`:$(s)}),r=r.replace(/(^|\s)#([a-zA-Z0-9_\-一-龥]{1,30})\b/g,(o,s,t)=>{const a=c({type:"tag",target:t,label:t});return a?`${s}<a class="md-tag" href="${y(a)}">#${$(t)}</a>`:`${s}<span class="md-tag">#${$(t)}</span>`}),r=r.replace(/\*\*([^*]+?)\*\*/g,"<strong>$1</strong>"),r=r.replace(/(^|[\s>(])\*([^*\n]+?)\*(?=[\s<.,!?:;)]|$)/g,"$1<em>$2</em>"),r=r.replace(/(^|[\s>(])_([^_\n]+?)_(?=[\s<.,!?:;)]|$)/g,"$1<em>$2</em>"),r=r.replace(/ CODE(\d+) /g,(o,s)=>`<code>${$(l[+s])}</code>`),r}function W(){return"n-"+Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4)}const z=C("notes",()=>{const i=Z([]);B("notes",{notes:i},()=>({notes:L.notes}));const c=A(()=>{const n={};return i.value.forEach(e=>{e.title&&(n[e.title.toLowerCase().trim()]=e.id)}),n}),l=A(()=>{const n={};return i.value.forEach(e=>{const u=N(e.content||"");n[e.id]=u.map(g=>c.value[g.toLowerCase().trim()]).filter(g=>g&&g!==e.id)}),n}),r=A(()=>{const n={};return i.value.forEach(e=>{n[e.id]=[]}),Object.entries(l.value).forEach(([e,u])=>{u.forEach(g=>{n[g]&&!n[g].includes(e)&&n[g].push(e)})}),n}),o=A(()=>{const n={};return i.value.forEach(e=>{n[e.id]=P(e.content||"")}),n}),s=A(()=>{const n={};return i.value.forEach(e=>{n[e.id]=_(e.content||"").meta}),n}),t=A(()=>[...i.value].sort((n,e)=>!!n.pinned!=!!e.pinned?n.pinned?-1:1:(e.updatedAt||"").localeCompare(n.updatedAt||"")));function a(n){return i.value.find(e=>e.id===n)}function p(n){if(!n)return null;const e=c.value[n.toLowerCase().trim()];return e?a(e):null}function h(n){return(l.value[n]||[]).map(u=>a(u)).filter(Boolean)}function d(n){return(r.value[n]||[]).map(u=>a(u)).filter(Boolean)}function f(n){const e=a(n);if(!e)return[];const u=N(e.content||""),g=c.value;return u.filter(m=>!g[m.toLowerCase().trim()])}function S(n={}){const e=new Date().toISOString(),u={id:W(),title:n.title||"未命名笔记",content:n.content||"",articleSlug:n.articleSlug||null,tagIds:n.tagIds||[],pinned:!!n.pinned,createdAt:e,updatedAt:e};return i.value.unshift(u),u}function w(n,e){const u=i.value.findIndex(g=>g.id===n);return u<0?null:(i.value[u]={...i.value[u],...e,updatedAt:new Date().toISOString()},i.value[u])}function O(n){i.value=i.value.filter(e=>e.id!==n)}function I(n){const e=a(n);e&&w(n,{pinned:!e.pinned})}function T({keyword:n="",tagId:e=null,articleSlug:u=null,status:g=null}={}){let m=t.value;if(e&&(m=m.filter(v=>(v.tagIds||[]).includes(e))),u&&(m=m.filter(v=>v.articleSlug===u)),g&&(m=m.filter(v=>(s.value[v.id]?.status||"draft")===g)),n){const v=n.toLowerCase();m=m.filter(b=>(b.title||"").toLowerCase().includes(v)||(b.content||"").toLowerCase().includes(v))}return m}const x=A(()=>({total:i.value.length,pinned:i.value.filter(n=>n.pinned).length,withArticle:i.value.filter(n=>n.articleSlug).length,totalLinks:Object.values(l.value).reduce((n,e)=>n+e.length,0),orphans:i.value.filter(n=>{const e=l.value[n.id]?.length||0,u=r.value[n.id]?.length||0;return e+u===0}).length}));return{notes:i,sorted:t,titleIndex:c,outLinksByNote:l,backlinksByNote:r,inlineTagsByNote:o,metaByNote:s,findById:a,findByTitle:p,getOutLinks:h,getBacklinks:d,getMissingLinks:f,create:S,update:w,remove:O,togglePin:I,search:T,stats:x}});export{L as i,_ as p,G as r,F as s,z as u};
