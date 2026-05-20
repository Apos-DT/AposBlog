/**
 * Karpathy 风格笔记模板
 * frontmatter + H1 + 编号节 + 速查条目
 * 来自 CLAUDE.md §4 "本地卡帕西风格" 约定
 */

export const NOTE_TEMPLATES = [
  {
    id: 'blank',
    name: '空白',
    desc: '完全自由,无任何预设结构',
    icon: 'plus',
    build: () => ({
      title: '未命名笔记',
      content: '',
    }),
  },
  {
    id: 'postmortem',
    name: '项目复盘',
    desc: 'Karpathy 风:背景 / 我做了什么 / 工作的 / 不工作的 / 教训 / 下一步',
    icon: 'book',
    build: () => ({
      title: '复盘:[项目名]',
      content: `---
type: postmortem
status: draft
date: ${today()}
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
`,
    }),
  },
  {
    id: 'cheatsheet',
    name: '速查表',
    desc: '某个工具/语言/框架的速查条目,适合快速查阅',
    icon: 'sliders',
    build: () => ({
      title: '速查:[主题]',
      content: `---
type: cheatsheet
status: living
date: ${today()}
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

`,
    }),
  },
  {
    id: 'concept',
    name: '概念笔记',
    desc: '解释一个概念,带定义 / 直觉 / 例子 / 关联',
    icon: 'book',
    build: () => ({
      title: '概念:[名词]',
      content: `---
type: concept
status: learning
date: ${today()}
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
`,
    }),
  },
  {
    id: 'reading',
    name: '读书 / 文章笔记',
    desc: '读 X 后的笔记:作者主张 / 我同意的 / 我不同意的 / 行动项',
    icon: 'book',
    build: ({ articleTitle = '' } = {}) => ({
      title: `读《${articleTitle || '[书名/文章名]'}》笔记`,
      content: `---
type: reading
status: done
date: ${today()}
source:
rating:
tags: [读书]
---

# 读《${articleTitle || '[书名/文章名]'}》笔记

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
`,
    }),
  },
  {
    id: 'question',
    name: '开放问题',
    desc: '一个还没答案的问题,留给以后追踪',
    icon: 'search',
    build: () => ({
      title: '问题:[一句话问题]',
      content: `---
type: question
status: open
date: ${today()}
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
`,
    }),
  },
  {
    id: 'weekly',
    name: '周记',
    desc: '本周做了什么 / 学到什么 / 下周计划',
    icon: 'clock',
    build: () => ({
      title: `周记:${today()}`,
      content: `---
type: weekly
status: draft
date: ${today()}
week: ${weekNum()}
tags: [周记]
---

# 周记:${today()}

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
`,
    }),
  },
]

function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function weekNum() {
  const d = new Date()
  const start = new Date(d.getFullYear(), 0, 1)
  const days = Math.floor((d - start) / 86400000)
  return Math.ceil((days + start.getDay() + 1) / 7)
}
