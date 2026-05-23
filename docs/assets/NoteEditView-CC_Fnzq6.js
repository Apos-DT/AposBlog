import{H as X,r as ke,g as o,e as V,L as Q,d as n,F as f,v as b,A as S,f as E,T as be,l as d,z as u,p as P,J as W,G as Z,I as q,k as y,R as U,E as ye,u as h,c as L,o as G,C as he,B as we,t as a,q as $e}from"./vue-DuDYKpJ_.js";import{u as _e,s as ee,r as Ie,p as Ce}from"./notes-Cqbp-brO.js";import{u as Se}from"./tags-Bnse_Gob.js";import{u as xe}from"./posts-CibHAiOH.js";import{_ as Te,u as Ne,a as c}from"./index-DFNcnIGa.js";import"./initial-BqkmhB2L.js";import"./lenis-BEW9yqGz.js";const ze=[{id:"blank",name:"空白",desc:"完全自由,无任何预设结构",icon:"plus",build:()=>({title:"未命名笔记",content:""})},{id:"postmortem",name:"项目复盘",desc:"Karpathy 风:背景 / 我做了什么 / 工作的 / 不工作的 / 教训 / 下一步",icon:"book",build:()=>({title:"复盘:[项目名]",content:`---
type: postmortem
status: draft
date: ${w()}
project:
tags: [复盘]
---

# 复盘:[项目名]

> 一句话:这次做了什么,结果如何

## 1. 背景

为什么做这件事?当时知道什么、不知道什么?

## 2. 我做了什么

按时间线列具体动作。

1.
2.
3.

## 3. 工作的(What worked)

-

## 4. 不工作的(What didn't)

-

## 5. 关键教训

> 用一句话能讲明白的 takeaway。

- **教训 1**:
- **教训 2**:

## 6. 下一步

如果重来 / 接下来要做什么。

- [ ]
- [ ]

## 速查

| 触发情况 | 应对 |
|---|---|
|  |  |

## 关联

- 文章:[[]]
- 标签:#
`})},{id:"cheatsheet",name:"速查表",desc:"某个工具/语言/框架的速查条目,适合快速查阅",icon:"sliders",build:()=>({title:"速查:[主题]",content:`---
type: cheatsheet
status: living
date: ${w()}
tags: [速查]
---

# 速查:[主题]

> 用途:一句话说清楚这份速查是关于什么

## 1. 核心命令 / API

\`\`\`
# 示例
\`\`\`

## 2. 常见操作

| 场景 | 命令 / 代码 |
|---|---|
|  |  |

## 3. 已踩的坑

> [!WARNING]

## 4. 参考

- [[]]
-

`})},{id:"concept",name:"概念笔记",desc:"解释一个概念,带定义 / 直觉 / 例子 / 关联",icon:"book",build:()=>({title:"概念:[名词]",content:`---
type: concept
status: learning
date: ${w()}
tags: [学习]
---

# 概念:[名词]

> 一句话定义:

## 1. 直觉

用类比 / 比喻 / 反例,讲清楚"它到底是什么"。

## 2. 严格定义

更正式的定义,带必要的前提与边界条件。

## 3. 例子

具体例子 1-3 个,从简单到复杂。

\`\`\`
\`\`\`

## 4. 关联

- 前置:[[]]
- 衍生:[[]]
- 容易混淆:[[]]
- 相关 #
`})},{id:"reading",name:"读书 / 文章笔记",desc:"读 X 后的笔记:作者主张 / 我同意的 / 我不同意的 / 行动项",icon:"book",build:({articleTitle:p=""}={})=>({title:`读《${p||"[书名/文章名]"}》笔记`,content:`---
type: reading
status: done
date: ${w()}
source:
rating:
tags: [读书]
---

# 读《${p||"[书名/文章名]"}》笔记

> 一句话总结作者主张:

## 1. 作者的核心观点

按重要性排,3-5 条。

1.
2.
3.

## 2. 我同意的

-

## 3. 我不同意的 / 存疑的

-

## 4. 金句摘抄

>

## 5. 行动项

- [ ]

## 关联

- 文章:[[]]
- 类似主题:[[]]
- 标签:#
`})},{id:"question",name:"开放问题",desc:"一个还没答案的问题,留给以后追踪",icon:"search",build:()=>({title:"问题:[一句话问题]",content:`---
type: question
status: open
date: ${w()}
tags: [思考]
---

# 问题:[一句话问题]

## 1. 背景

为什么会想这个问题?触发点是什么?

## 2. 目前的假设

我当前的猜测,以及它的理由。

-

## 3. 已读的相关材料

-

## 4. 反证 / 反例

什么样的事实会推翻我的假设?

-

## 5. 下一步如何验证

- [ ]

## 关联

- 相关问题:[[]]
- 相关笔记:[[]]
`})},{id:"weekly",name:"周记",desc:"本周做了什么 / 学到什么 / 下周计划",icon:"clock",build:()=>({title:`周记:${w()}`,content:`---
type: weekly
status: draft
date: ${w()}
week: ${Me()}
tags: [周记]
---

# 周记:${w()}

> 本周关键词:

## 1. 本周做了什么

- [x]
- [ ]

## 2. 学到了什么

-

## 3. 卡在哪

-

## 4. 下周计划

- [ ]

## 5. 想读 / 想看

-

## 关联

- 上周:[[周记:]]
- 项目:[[]]
`})}];function w(){const p=new Date;return`${p.getFullYear()}-${String(p.getMonth()+1).padStart(2,"0")}-${String(p.getDate()).padStart(2,"0")}`}function Me(){const p=new Date,$=new Date(p.getFullYear(),0,1),g=Math.floor((p-$)/864e5);return Math.ceil((g+$.getDay()+1)/7)}const Re={class:"ui-modal",style:{"max-width":"640px"}},Ee={class:"tpl-grid"},Le=["onClick"],De={key:0,class:"view-note-edit"},Oe={class:"ne-head"},Ae={class:"ne-head-actions"},Be={key:0,class:"ne-saved"},Fe={key:1,class:"ne-saving"},Ve=["open"],Pe={class:"ne-meta-grid"},We=["value","onChange"],qe=["value","onInput"],Ue=["onClick","title"],Ge={class:"ne-row"},Ke={class:"ne-field"},je={class:"ne-tag-row"},He=["onClick"],Ye={class:"ne-field",style:{"min-width":"200px"}},Je=["value"],Xe={key:0,class:"ne-toolbar"},Qe={class:"ne-body"},Ze={key:0,class:"ne-textarea-wrap"},et={key:0,class:"ne-completion"},tt={class:"ne-comp-head"},nt=["onMousedown"],lt=["innerHTML"],st={class:"ne-relations"},at={class:"rel-group"},ot={key:0,class:"rel-list"},it={key:1,class:"rel-empty"},ut={class:"rel-group"},rt={key:0,class:"rel-list"},dt={key:1,class:"rel-empty"},ct={key:0,class:"rel-group"},vt={class:"rel-list"},pt=["onClick","title"],mt={class:"ne-tip"},ft={__name:"NoteEditView",setup(p){const $=we(),g=he(),m=_e(),te=Se(),ne=xe(),K=Ne(),v=h(null),s=h({title:"",content:"",body:"",meta:{},articleSlug:null,tagIds:[],pinned:!1}),_=h(!1),x=h(!0),T=h(!1),D=h(!1),N=h(null),r=h({open:!1,query:"",pos:0,candidates:[],selectedIdx:0,rect:null});function le(){if($.params.id==="new"){D.value=!0;return}const l=m.findById($.params.id);if(!l){K.pushToast("error","笔记不存在,跳回列表"),g.replace("/notes");return}se(l)}function se(l){v.value=l.id;const e=Ce(l.content||"");s.value={title:l.title,content:l.content,body:e.body,meta:e.meta,articleSlug:l.articleSlug||null,tagIds:[...l.tagIds||[]],pinned:!!l.pinned},T.value=!1}X(()=>$.params.id,le,{immediate:!0});function ae(l){const e=l.build({articleTitle:""}),t=m.create(e);D.value=!1,g.replace(`/notes/${t.id}`)}function j(){D.value=!1,g.replace("/notes")}let z=0;X(()=>[s.value.title,s.value.body,s.value.meta,s.value.articleSlug,s.value.tagIds,s.value.pinned],()=>{v.value&&(T.value=!0,z&&clearTimeout(z),z=setTimeout(()=>B(),600))},{deep:!0});function B(){if(!v.value)return;const l=ee(s.value.meta,s.value.body);m.update(v.value,{title:s.value.title,content:l,articleSlug:s.value.articleSlug,tagIds:s.value.tagIds,pinned:s.value.pinned}),s.value.content=l,T.value=!1}const H=L(()=>Object.keys(s.value.meta||{}));function oe(l,e){if(!e||e===l)return;const t=s.value.meta[l],i={...s.value.meta};delete i[l],i[e]=t,s.value.meta=i}function ie(l,e){s.value.meta={...s.value.meta,[l]:e}}function ue(l){const e={...s.value.meta};delete e[l],s.value.meta=e}function re(){let l=1,e="field";for(;s.value.meta[e];)e=`field${++l}`;s.value.meta={...s.value.meta,[e]:""}}const de=L(()=>Ie(ee(s.value.meta,s.value.body),{onLink:({type:l,target:e,label:t})=>{if(l==="wiki"){const i=m.findByTitle(e);return i?`#/notes/${i.id}`:null}return l==="tag"?`#/notes?tag=${encodeURIComponent(e)}`:null}}));function Y(l){const e=l.target,t=e.selectionStart,k=e.value.slice(0,t).match(/\[\[([^\]\n]*)$/);if(!k){r.value.open=!1;return}const I=k[1].toLowerCase(),R=m.notes.filter(C=>C.id!==v.value).filter(C=>(C.title||"").toLowerCase().includes(I)).slice(0,8);r.value={open:R.length>0,query:I,pos:t,candidates:R,selectedIdx:0,rect:e.getBoundingClientRect()}}function ce(l){r.value.open&&(l.key==="ArrowDown"?(l.preventDefault(),r.value.selectedIdx=(r.value.selectedIdx+1)%r.value.candidates.length):l.key==="ArrowUp"?(l.preventDefault(),r.value.selectedIdx=(r.value.selectedIdx-1+r.value.candidates.length)%r.value.candidates.length):l.key==="Enter"||l.key==="Tab"?(l.preventDefault(),J(r.value.candidates[r.value.selectedIdx])):l.key==="Escape"&&(r.value.open=!1))}function J(l){if(!l||!N.value)return;const e=N.value,t=e.value.slice(0,r.value.pos),i=e.value.slice(r.value.pos),k=t.replace(/\[\[[^\]\n]*$/,`[[${l.title}]]`);s.value.body=k+i,r.value.open=!1,G(()=>{e.focus();const I=k.length;e.setSelectionRange(I,I)})}const O=L(()=>v.value?m.getOutLinks(v.value):[]),A=L(()=>v.value?m.getBacklinks(v.value):[]),F=L(()=>v.value?m.getMissingLinks(v.value):[]);function ve(l){const e=m.create({title:l,content:`---
type: stub
date: ${new Date().toISOString().slice(0,10)}
---

# ${l}

> 这篇笔记是从 [[${s.value.title}]] 链接而来的占位。
`});g.push(`/notes/${e.id}`)}function pe(l){const e=s.value.tagIds.indexOf(l);e>=0?s.value.tagIds.splice(e,1):s.value.tagIds.push(l)}function me(){confirm(`确定删除「${s.value.title}」?`)&&(m.remove(v.value),K.pushToast("success","已删除"),g.push("/notes"))}function fe(){v.value&&B(),g.push("/notes")}function ge(){const l=N.value;if(!l)return;const e=l.selectionStart,t=s.value.body.slice(0,e),i=s.value.body.slice(e);s.value.body=t+"[["+i,G(()=>{l.focus(),l.setSelectionRange(e+2,e+2),Y({target:l})})}function M(l){const e=N.value;if(!e)return;const t=e.selectionStart,i=s.value.body.slice(0,t),k=s.value.body.slice(t),R=`${i.endsWith(`
`)||i===""?"":`
`}> [!${l}] `;s.value.body=i+R+k,G(()=>{e.focus();const C=t+R.length;e.setSelectionRange(C,C)})}return ke(()=>{z&&clearTimeout(z),v.value&&T.value&&B()}),(l,e)=>(a(),o(f,null,[(a(),V(be,{to:"body"},[D.value?(a(),o("div",{key:0,class:"ui-modal-mask",onClick:Q(j,["self"])},[n("div",Re,[e[12]||(e[12]=n("h3",{class:"ui-modal-title"},"选择笔记模板",-1)),e[13]||(e[13]=n("p",{class:"ui-modal-desc"},"Karpathy 风格 —— frontmatter + 编号节 + 速查条目。挑一个开始,可以随时改。",-1)),n("div",Ee,[(a(!0),o(f,null,b(S(ze),t=>(a(),o("button",{key:t.id,class:"tpl-card",onClick:i=>ae(t)},[d(c,{name:t.icon,size:20},null,8,["name"]),n("strong",null,u(t.name),1),n("span",null,u(t.desc),1)],8,Le))),128))]),n("div",{class:"ui-modal-actions"},[n("button",{class:"ui-btn ui-btn-ghost",onClick:j},"取消")])])])):E("",!0)])),v.value?(a(),o("section",De,[n("header",Oe,[n("button",{class:"ui-btn ui-btn-ghost ui-btn-sm",onClick:fe},[d(c,{name:"arrow-left",size:14}),e[14]||(e[14]=n("span",null,"返回笔记列表",-1))]),n("div",Ae,[T.value?(a(),o("span",Fe,"保存中…")):(a(),o("span",Be,"✓ 已自动保存")),n("button",{class:"ui-btn ui-btn-ghost ui-btn-sm",onClick:e[0]||(e[0]=t=>x.value=!x.value)},[d(c,{name:"sliders",size:14}),n("span",null,u(x.value?"收起元信息":"展开元信息"),1)]),n("button",{class:"ui-btn ui-btn-ghost ui-btn-sm",onClick:e[1]||(e[1]=t=>_.value=!_.value)},[d(c,{name:_.value?"edit":"eye",size:14},null,8,["name"]),n("span",null,u(_.value?"编辑":"预览"),1)]),n("button",{class:P(["ui-btn ui-btn-ghost ui-btn-sm",{active:s.value.pinned}]),onClick:e[2]||(e[2]=t=>s.value.pinned=!s.value.pinned)},[d(c,{name:"pin",size:14}),n("span",null,u(s.value.pinned?"已置顶":"置顶"),1)],2),n("button",{class:"ui-btn ui-btn-danger ui-btn-sm",onClick:me},[d(c,{name:"trash",size:14}),e[15]||(e[15]=n("span",null,"删除",-1))])])]),W(n("input",{"onUpdate:modelValue":e[3]||(e[3]=t=>s.value.title=t),class:"ne-title-input",placeholder:"笔记标题…",maxlength:"120"},null,512),[[Z,s.value.title]]),n("details",{class:"ne-meta-panel",open:x.value,onToggle:e[4]||(e[4]=t=>x.value=t.target.open)},[n("summary",null,[d(c,{name:"sliders",size:13}),n("span",null,"frontmatter · "+u(H.value.length)+" 个字段",1)]),n("div",Pe,[(a(!0),o(f,null,b(H.value,t=>(a(),o("div",{key:t,class:"ne-meta-row"},[n("input",{class:"ne-meta-key",value:t,onChange:i=>oe(t,i.target.value)},null,40,We),n("input",{class:"ne-meta-val",value:Array.isArray(s.value.meta[t])?s.value.meta[t].join(", "):s.value.meta[t],onInput:i=>ie(t,i.target.value),placeholder:"值(数组用逗号分隔)"},null,40,qe),n("button",{class:"ne-meta-del",onClick:i=>ue(t),title:"移除 "+t},[d(c,{name:"close",size:12})],8,Ue)]))),128)),n("button",{class:"ne-meta-add",onClick:re},[d(c,{name:"plus",size:12}),e[16]||(e[16]=n("span",null,"添加字段",-1))])])],40,Ve),n("div",Ge,[n("div",Ke,[e[19]||(e[19]=n("span",{class:"ne-field-label"},"标签",-1)),n("div",je,[(a(!0),o(f,null,b(S(te).all,t=>(a(),o("button",{key:t.id,type:"button",class:P(["ui-chip",{"is-active":s.value.tagIds.includes(t.id)}]),style:$e({"--c":t.color}),onClick:i=>pe(t.id)},[e[17]||(e[17]=n("span",{class:"dot"},null,-1)),y(u(t.name),1)],14,He))),128)),d(S(U),{to:"/tags",class:"ui-chip",style:{opacity:"0.7"}},{default:q(()=>[d(c,{name:"plus",size:11}),e[18]||(e[18]=y(" 管理 ",-1))]),_:1})])]),n("div",Ye,[e[21]||(e[21]=n("span",{class:"ne-field-label"},"关联文章",-1)),W(n("select",{"onUpdate:modelValue":e[5]||(e[5]=t=>s.value.articleSlug=t),class:"ui-select"},[e[20]||(e[20]=n("option",{value:null},"— 无 —",-1)),(a(!0),o(f,null,b(S(ne).sorted,t=>(a(),o("option",{key:t.slug,value:t.slug},u(t.title),9,Je))),128))],512),[[ye,s.value.articleSlug]])])]),_.value?E("",!0):(a(),o("div",Xe,[n("button",{class:"ne-tool",onClick:ge,title:"插入 [[wiki-link]]"},[d(c,{name:"link",size:13}),e[22]||(e[22]=y(" [[link]] ",-1))]),n("button",{class:"ne-tool",onClick:e[6]||(e[6]=t=>M("INFO"))},"[!INFO]"),n("button",{class:"ne-tool",onClick:e[7]||(e[7]=t=>M("TIP"))},"[!TIP]"),n("button",{class:"ne-tool",onClick:e[8]||(e[8]=t=>M("WARNING"))},"[!WARNING]"),n("button",{class:"ne-tool",onClick:e[9]||(e[9]=t=>M("NOTE"))},"[!NOTE]"),n("button",{class:"ne-tool",onClick:e[10]||(e[10]=t=>M("ERROR"))},"[!ERROR]")])),n("div",Qe,[_.value?(a(),o("div",{key:1,class:"ne-preview md",innerHTML:de.value},null,8,lt)):(a(),o("div",Ze,[W(n("textarea",{ref_key:"textareaEl",ref:N,"onUpdate:modelValue":e[11]||(e[11]=t=>s.value.body=t),class:"ne-textarea",placeholder:`支持 markdown + Karpathy 风:
# 标题  **粗体**  \`code\`  > 引用
- 列表  1. 有序  --- 分隔线
[[note-title]] 双向链接(输入 [[ 触发补全)
#tag 内联标签
> [!INFO] 提示卡片`,onInput:Y,onKeydown:ce,spellcheck:"false"},null,544),[[Z,s.value.body]]),r.value.open?(a(),o("div",et,[n("div",tt,[d(c,{name:"search",size:11}),n("span",null,"笔记标题补全 · 「"+u(r.value.query)+"」",1)]),n("ul",null,[(a(!0),o(f,null,b(r.value.candidates,(t,i)=>(a(),o("li",{key:t.id,class:P({active:i===r.value.selectedIdx}),onMousedown:Q(k=>J(t),["prevent"])},[n("strong",null,u(t.title),1),n("span",null,u((t.content||"").replace(/^---[\s\S]*?---\n?/,"").slice(0,40))+"…",1)],42,nt))),128))]),e[23]||(e[23]=n("div",{class:"ne-comp-foot"},"↑↓ 选择 · Enter 插入 · Esc 关闭",-1))])):E("",!0)]))]),n("section",st,[n("div",at,[n("h4",null,[d(c,{name:"arrow-right",size:14}),n("span",null,"引用了 ("+u(O.value.length)+")",1)]),O.value.length?(a(),o("div",ot,[(a(!0),o(f,null,b(O.value,t=>(a(),V(S(U),{key:t.id,to:`/notes/${t.id}`,class:"rel-item"},{default:q(()=>[n("strong",null,u(t.title),1)]),_:2},1032,["to"]))),128))])):(a(),o("p",it,[...e[24]||(e[24]=[y("这篇笔记里没有 ",-1),n("code",null,"[[wiki-link]]",-1),y("。",-1)])]))]),n("div",ut,[n("h4",null,[d(c,{name:"arrow-left",size:14}),n("span",null,"被引用 ("+u(A.value.length)+")",1)]),A.value.length?(a(),o("div",rt,[(a(!0),o(f,null,b(A.value,t=>(a(),V(S(U),{key:t.id,to:`/notes/${t.id}`,class:"rel-item"},{default:q(()=>[n("strong",null,u(t.title),1)]),_:2},1032,["to"]))),128))])):(a(),o("p",dt,[e[25]||(e[25]=y("还没有别的笔记引用它。试着在别处写 ",-1)),n("code",null,"[["+u(s.value.title)+"]]",1),e[26]||(e[26]=y("。",-1))]))]),F.value.length?(a(),o("div",ct,[n("h4",null,[d(c,{name:"plus",size:14}),n("span",null,"占位(未创建) ("+u(F.value.length)+")",1)]),n("div",vt,[(a(!0),o(f,null,b(F.value,t=>(a(),o("button",{key:t,class:"rel-item missing",onClick:i=>ve(t),title:"创建 "+t},[n("strong",null,u(t),1),e[27]||(e[27]=n("span",null,"+ 创建",-1))],8,pt))),128))])])):E("",!0)]),n("p",mt,[d(c,{name:"check",size:12}),y(" 字数 "+u(s.value.body.length)+" · 引用 "+u(O.value.length)+" · 被引 "+u(A.value.length),1)])])):E("",!0)],64))}},_t=Te(ft,[["__scopeId","data-v-b75ed650"]]);export{_t as default};
