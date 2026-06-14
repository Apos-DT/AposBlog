> 用户反馈:"切换任何页面后,内容会整体向右移动微小距离。"

第一反应是 scrollbar 出现/消失导致的 layout shift,把这个修了——还在抖。
继续找,以为是 view 的 max-width 不统一——还是抖。
直到用户补了一句关键线索:"只有 `/tags` 不抖,其它还是抖。"
这一句让我两分钟内定位到真因:**Vue `<transition>` 的 transform + Lenis 平滑滚动叠加**。

这篇复盘整个排查过程,7 个假设、6 次修法、1 个真因——把"为什么前 6 个修法都没解决"也写清楚,而不是只展示最后那个 commit。

## 1. 现象

任何路由切换之后,新页面内容像被人拖了一下,**向右抖一两个像素**:

- 100% 缩放下肉眼可见
- 大屏(≥1440px)更明显
- 不是渐进 layout,是"咔"一下

最关键的:**抖在哪一刻?** 用户的描述:"页面已经加载出全部内容了,但就是往右动一下。" 即不是首次渲染时,而是渲染完成后的某一帧。

## 2. 假设链 — 从 scrollbar 一路打到 transform

### H1: scrollbar 出现/消失

最常见的 layout shift——内容长短不同导致滚动条出现/消失,页面宽度跳变。

```css
html { overflow-y: scroll; }
```

✗ 没用。

### H2: scrollbar-gutter 与 overflow-x 冲突

`scrollbar-gutter: stable` 在 html 同时有 `overflow-x: hidden` 时可能不稳生效。把 `overflow-x: hidden` 从 html 移到 body。

✗ 还抖。

### H3: 不同 view 的 max-width 不一致

发现各 view 根容器的 `max-width` 用了不同公式:

```css
.home-page    { max-width: min(1440px, 98vw); }
.post-page    { max-width: min(1500px, 98vw); }
.view-gb      { max-width: min(1080px, 96vw); }
.view-*       { max-width: min(1320px, 98vw); }
.view-graph   { max-width: min(1480px, 98vw); }
```

大屏切换 view 时居中点变化,看似"内容漂移"。

统一为 `min(1320px, calc(100% - 32px))`——用 `100%` 而不是 `vw`,因为 `100%` 是父级宽度(已扣除滚动条),`vw` 包含滚动条会有歧义。

✗ 还抖。

### H4: 水平 padding 上限不一致

继续找,padding-x 的 clamp 上限也不同:

```css
.home-page { padding: 0 clamp(24px, 4vw, 64px); }
.post-page { padding: 30px clamp(24px, 4vw, 56px) 80px; }
.view-gb   { padding: 0 clamp(20px, 4vw, 48px); }
.view-*    { padding: ... clamp(16px, 4vw, 56px) ...; }
```

≥1400 屏上 padding 上限差 8-16px,内容左边距跳变。

统一为 `clamp(20px, 4vw, 48px)`。

✗ 还是抖。这时候开始觉得修法方向错了。

### H5: router scrollBehavior 是 smooth

```js
scrollBehavior(to, from, saved) {
  return { top: 0, behavior: 'smooth' }
}
```

300ms 平滑滚动期间 scrollY 一直在变,可能触发其他副作用。改 instant。

✗ 还抖。

### H6: nav 的 lifted 状态切换

我有个滚动收缩成悬浮岛的 liquid-glass nav。切换页面瞬间 nav 还是 lifted 态,滚到 top 后才慢慢"解除悬浮",1s 过渡看起来像抖。

修法:`watch(() => route.fullPath)` 同步 `lifted = false`,临时加 `.no-transition` 类禁用 nav 几何 transition,两个 `rAF` 后恢复。

✗ nav 不再"回收"动画了,但页面还是右移。

## 3. 关键线索:用户的一句话

> "只有工具分类里标签这个页面不抖动,其它还是抖动。"

`/tags` 不抖,其他都抖。这意味着问题**不是全局的**,而是和**具体路由的某种特性**绑定。

`/tags` 这个 view 比其他特殊在哪?

- ✗ `max-width`:都走同样的通用规则
- ✗ `padding`:都走同样的通用规则
- ✗ 滚动条:全局问题,与 view 无关

`/tags` 唯一的不同是**内容渲染速度**——标签卡片少,挂载快;其他 view 内容多,挂载慢。

如果是挂载速度造成的差异,那只能是**有一个有动画的过渡过程,内容快的看不到末态,内容慢的看到**。

## 4. 回看路由代码

```html
<router-view v-slot="{ Component, route }">
  <transition name="page" mode="out-in">
    <component :is="Component" :key="route.fullPath" />
  </transition>
</router-view>
```

```css
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
```

**就是 transform translateY。**

- `/tags` 内容简单:挂载 + enter 动画(`translateY(12px → 0)`)在用户感知前完成 → 看不到位移
- 其他 view 内容多:挂载延迟,enter 动画的 12px → 0 被用户**亲眼看到** → 视觉上"内容下移了一下"

但是用户报的是"右移"不是"下移"?

第二个真因:**Lenis 全站平滑滚动**。

```js
const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf) }
requestAnimationFrame(raf)
```

Lenis 通过对页面应用 `transform` 来模拟平滑滚动,**它劫持了原生 scroll**。router 的 `scrollBehavior: { top: 0 }` 给的是 `window.scrollTo`,而 Lenis 拦截了——所以"瞬间滚到 top"实际经 Lenis 走自己的 ~1.15s 平滑动画。

动画期间页面有一个持续变化的 transform。和 page transition 的 translateY 叠加,在某些屏幕尺寸下视觉感被解读成"右移幻觉"(实际是上下加滚动的复合 transform)。

## 5. 真因 + 修复

### 真因 1: page transition 的 translateY

```css
/* 之前 */
.page-enter-from { opacity: 0; transform: translateY(12px); }
.page-leave-to   { opacity: 0; transform: translateY(-12px); }

/* 修后 */
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
```

去掉 transform,只保留 opacity 渐变。时长 0.4s → 0.25s,过渡感更轻。

### 真因 2: Lenis 不与 router 联动

```js
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(() => route.fullPath, () => {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true, force: true })
  } else {
    window.scrollTo(0, 0)
  }
})
```

- `immediate: true`:跳过 Lenis 自己的平滑动画,瞬间到 top
- `force: true`:即使 Lenis 正在播放其他动画也强制执行

## 6. 复盘 5 条原则

### (1) 用户的具体反馈是 debug 黄金线索

"只有 `/tags` 不抖"比"页面抖动"信息密度高 10 倍。**用户告诉你哪里不一样,你就找哪里不一样的根因。**

调试时要主动诱导用户做对比报告:不要问"还抖吗",问"改完之后哪些页面不抖了"。

### (2) 假设链不要在一个方向死磕

H1 到 H6 我都在改 CSS 几何属性(scrollbar / max-width / padding)。第 7 个假设才跳到 JS 行为。

经验法则:**同方向修两次都没好,换一类原因。** 不要被"再调一调就好了"的幻觉骗到。

### (3) transform 是 layout shift 的常见隐藏元凶

`<transition>` 用 translateY 看起来温柔无害,但:

- transform 创建 stacking context,影响 fixed/sticky 子元素
- 与平滑滚动库叠加产生视觉幻觉
- `mode: out-in` 下 leave 400ms + enter 400ms 共 800ms 都在 transform 状态

**纯 opacity 渐变足够告诉用户"页面切换了",别滥用 transform。**

### (4) 平滑滚动库与 SPA router 不天然兼容

Lenis / Locomotive Scroll / Smooth Scrollbar 这类库都拦截原生 scroll。`router.scrollBehavior` 不一定生效,需要手动联动:

```js
watch(() => route.fullPath, () => {
  lenis.scrollTo(0, { immediate: true })
})
```

**任何 router-based 项目集成平滑滚动库,这一行必加。**

### (5) "ABCDE 都不抖,只 F 抖"比"全抖"好排查

如果用户报"整站都抖",basically 等于 reset 重排查。如果用户能指出"只有 X 不抖",立刻能锁定差异维度 = 真因方向。

**好的 bug 复现报告 = 差异点描述,不是症状描述。**

## 7. 修复 PR 改动清单

| 文件 | 改动 |
|---|---|
| `src/App.vue` | page transition 去 transform,只保留 opacity 0.25s |
| `src/App.vue` | watch route → `lenis.scrollTo(0, immediate, force)` |
| `src/router/index.js` | scrollBehavior 改 instant |
| `src/styles/base.css` | `html { overflow-y: scroll }`,`overflow-x: hidden` 移到 body |
| `src/views/*View.vue` | 统一 max-width 为 `min(XXXpx, calc(100% - 32px))` |
| `src/views/*View.vue` | 统一 padding-x 为 `clamp(20px, 4vw, 48px)` |
| `src/components/AppLayout.vue` | watch route → nav lifted 同步重置 + `.no-transition` 临时类 |

前 6 处是"以为是问题"的修法——**它们本身也是合理改进**(滚动条 gutter / 容器统一 / nav 状态同步都是好的工程实践),但**不是这次 bug 的根因**。真因在第 7 处(transition + Lenis)。

留下前 6 处不删,是因为这些改善能让全站更稳。但要清楚:**修了"看起来像 bug 的代码"≠ 修了真 bug。**

#Web #Debug #Vue
