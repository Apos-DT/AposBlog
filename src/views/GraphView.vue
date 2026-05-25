<script setup>
/**
 * 知识图谱 — ECharts 力导向图
 * --------------------------------------------------
 * 节点类型 (4 类不同颜色):
 *   note    — 笔记 (紫色)
 *   tag     — 标签 (黄色,色相跟随每个 tag.color)
 *   post    — 文章 (青色)
 *   missing — 引用了但不存在的笔记 (灰色虚线)
 *
 * 边类型:
 *   wiki    — [[note]] 双向链接 (实线)
 *   tag     — note -> tag (虚线)
 *   article — note -> post  (点线)
 *
 * 交互:
 *   - 鼠标拖拽节点
 *   - 滚轮缩放
 *   - 点击节点 → 跳到对应 Note / Article / 按标签过滤
 *   - 控制面板:节点类型过滤、布局重启
 */
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts/core'
import { GraphChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

import { useNotesStore } from '@/stores/notes'
import { useTagsStore } from '@/stores/tags'
import { usePostsStore } from '@/stores/posts'
import { useSettingsStore } from '@/stores/settings'

import IconBase from '@/components/IconBase.vue'

echarts.use([GraphChart, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const router = useRouter()
const notes = useNotesStore()
const tags = useTagsStore()
const posts = usePostsStore()
const settings = useSettingsStore()

const chartEl = ref(null)
let chart = null

// 显示开关
const showNotes = ref(true)
const showTags = ref(true)
const showPosts = ref(true)
const showMissing = ref(true)
const showOrphans = ref(true)
const repulsion = ref(180)

// 当前 hover 节点详情
const hoverNode = ref(null)

const palette = {
  note: '#7c3aed',
  tag: '#d97706',
  post: '#0891b2',
  missing: '#64748b',
}

/**
 * 构造 ECharts 图数据
 */
const graphData = computed(() => {
  const ns = []
  const ls = []
  const seen = new Set()

  // ---- 笔记节点
  notes.notes.forEach((n) => {
    const out = notes.outLinksByNote[n.id]?.length || 0
    const back = notes.backlinksByNote[n.id]?.length || 0
    const linkCount = out + back
    if (!showOrphans.value && linkCount === 0) return

    ns.push({
      id: `n:${n.id}`,
      name: n.title || '(无题)',
      _type: 'note',
      _ref: n.id,
      symbolSize: 14 + Math.min(28, linkCount * 3),
      itemStyle: { color: palette.note },
      category: 0,
      value: linkCount,
      label: { show: linkCount > 0 || notes.notes.length < 30 },
    })
    seen.add(`n:${n.id}`)
  })

  // ---- 标签节点
  if (showTags.value) {
    tags.all.forEach((t) => {
      const useCount = notes.notes.filter((n) => (n.tagIds || []).includes(t.id)).length
      if (useCount === 0) return
      ns.push({
        id: `t:${t.id}`,
        name: '#' + t.name,
        _type: 'tag',
        _ref: t.id,
        symbolSize: 10 + Math.min(20, useCount * 2),
        itemStyle: { color: t.color || palette.tag },
        category: 1,
        value: useCount,
      })
      seen.add(`t:${t.id}`)
    })
  }

  // ---- 文章节点
  if (showPosts.value) {
    posts.posts.forEach((p) => {
      const refCount = notes.notes.filter((n) => n.articleSlug === p.slug).length
      if (refCount === 0 && !showOrphans.value) return
      ns.push({
        id: `p:${p.slug}`,
        name: p.title,
        _type: 'post',
        _ref: p.slug,
        symbolSize: 12 + Math.min(20, refCount * 4),
        itemStyle: { color: palette.post },
        category: 2,
        value: refCount,
      })
      seen.add(`p:${p.slug}`)
    })
  }

  // ---- missing wiki targets (笔记里 [[X]] 但 X 不存在)
  if (showMissing.value) {
    const missingMap = {}
    notes.notes.forEach((n) => {
      const missings = notes.getMissingLinks(n.id)
      missings.forEach((title) => {
        const key = title.toLowerCase().trim()
        if (!missingMap[key]) missingMap[key] = { title, refs: [] }
        missingMap[key].refs.push(n.id)
      })
    })
    Object.values(missingMap).forEach((m) => {
      ns.push({
        id: `m:${m.title}`,
        name: m.title,
        _type: 'missing',
        _ref: m.title,
        symbolSize: 10,
        itemStyle: {
          color: palette.missing,
          opacity: 0.55,
          borderType: 'dashed',
          borderColor: palette.missing,
          borderWidth: 1,
        },
        category: 3,
        value: m.refs.length,
        label: { color: '#1e293b' },
      })
      seen.add(`m:${m.title}`)
      m.refs.forEach((fromId) => {
        if (seen.has(`n:${fromId}`)) {
          ls.push({
            source: `n:${fromId}`,
            target: `m:${m.title}`,
            lineStyle: { color: palette.missing, type: 'dashed', opacity: 0.4, width: 1 },
            _type: 'wiki-missing',
          })
        }
      })
    })
  }

  // ---- wiki link 边 (note → note)
  if (showNotes.value) {
    Object.entries(notes.outLinksByNote).forEach(([fromId, toIds]) => {
      const fromKey = `n:${fromId}`
      if (!seen.has(fromKey)) return
      toIds.forEach((toId) => {
        const toKey = `n:${toId}`
        if (!seen.has(toKey)) return
        ls.push({
          source: fromKey,
          target: toKey,
          lineStyle: { color: palette.note, opacity: 0.6, width: 1.4 },
          _type: 'wiki',
        })
      })
    })
  }

  // ---- tag 边 (note → tag)
  if (showTags.value) {
    notes.notes.forEach((n) => {
      const fromKey = `n:${n.id}`
      if (!seen.has(fromKey)) return
      ;(n.tagIds || []).forEach((tid) => {
        const toKey = `t:${tid}`
        if (!seen.has(toKey)) return
        ls.push({
          source: fromKey,
          target: toKey,
          lineStyle: { color: palette.tag, type: 'dashed', opacity: 0.35, width: 1 },
          _type: 'tag',
        })
      })
    })
  }

  // ---- article 边 (note → post)
  if (showPosts.value) {
    notes.notes.forEach((n) => {
      if (!n.articleSlug) return
      const fromKey = `n:${n.id}`
      const toKey = `p:${n.articleSlug}`
      if (!seen.has(fromKey) || !seen.has(toKey)) return
      ls.push({
        source: fromKey,
        target: toKey,
        lineStyle: { color: palette.post, type: 'dotted', opacity: 0.45, width: 1.2 },
        _type: 'article',
      })
    })
  }

  return { nodes: ns, links: ls }
})

function buildOption() {
  const { nodes, links } = graphData.value
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'oklch(0.95 0.006 280 / 0.95)',
      borderColor: 'oklch(0.78 0.010 280 / 0.8)',
      borderWidth: 1,
      textStyle: {
        color: '#1e293b',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 12,
      },
      formatter: (p) => {
        if (p.dataType === 'node') {
          const t = p.data._type
          const v = p.data.value || 0
          const cnLabel = ({
            note: '笔记',
            tag: '标签',
            post: '文章',
            missing: '未链接',
          })[t]
          return `<strong>${p.data.name}</strong><br/>${cnLabel} · ${v} 连接`
        }
        return ''
      },
    },
    legend: [
      {
        data: ['笔记', '标签', '文章', '未链接'],
        bottom: 10,
        textStyle: { color: '#1e293b', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 },
        icon: 'circle',
        itemGap: 16,
      },
    ],
    series: [
      {
        name: '知识图谱',
        type: 'graph',
        layout: 'force',
        force: {
          repulsion: repulsion.value,
          edgeLength: [60, 120],
          gravity: 0.05,
          friction: 0.6,
          layoutAnimation: true,
        },
        roam: true,
        draggable: true,
        autoCurveness: true,
        zoom: 1,
        cursor: 'pointer',
        categories: [
          { name: '笔记', itemStyle: { color: palette.note } },
          { name: '标签', itemStyle: { color: palette.tag } },
          { name: '文章', itemStyle: { color: palette.post } },
          { name: '未链接', itemStyle: { color: palette.missing } },
        ],
        label: {
          show: true,
          position: 'right',
          color: '#1e293b',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: 11,
          formatter: (p) => {
            const name = p.name || ''
            return name.length > 18 ? name.slice(0, 18) + '…' : name
          },
        },
        labelLayout: { hideOverlap: true },
        /* Obsidian 风邻接高亮:
           hover/click 节点 → 该节点 + 直接邻接节点和边保持完整 opacity,
           非邻接节点和边变暗(opacity 0.15),产生强对比"焦点视角"。
           拖动期间通过 emphasis.disabled 动态切换关闭,避免鼠标飞过其他节点闪烁。 */
        emphasis: {
          focus: 'adjacency',
          scale: 1.15,
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2,
            shadowBlur: 12,
            shadowColor: 'rgba(124, 58, 237, 0.5)',
          },
          lineStyle: { width: 2.5, opacity: 1, color: 'oklch(0.50 0.22 295)' },
          label: { fontWeight: 700, color: '#1e293b', fontSize: 12 },
        },
        blur: {
          itemStyle: { opacity: 0.18 },
          lineStyle: { opacity: 0.06 },
          label: { opacity: 0.25 },
        },
        lineStyle: { curveness: 0.1 },
        nodes,
        links,
      },
    ],
  }
}

function init() {
  if (!chartEl.value) return
  if (chart) {
    chart.dispose()
    chart = null
  }
  chart = echarts.init(chartEl.value)
  chart.setOption(buildOption())

  chart.on('click', (e) => {
    if (e.dataType !== 'node') return
    const t = e.data._type
    const ref = e.data._ref
    if (t === 'note') {
      router.push(`/notes/${ref}`)
    } else if (t === 'post') {
      router.push(`/library/${ref}`)
    } else if (t === 'tag') {
      router.push({ path: '/notes', query: { tag: ref } })
    } else if (t === 'missing') {
      // 创建一个占位笔记
      if (confirm(`「${ref}」还没有对应的笔记。立即创建?`)) {
        const n = notes.create({
          title: ref,
          content: `---\ntype: stub\ndate: ${new Date().toISOString().slice(0, 10)}\n---\n\n# ${ref}\n\n> 这篇笔记从图谱占位生成。\n`,
        })
        router.push(`/notes/${n.id}`)
      }
    }
  })

  chart.on('mouseover', (e) => {
    if (e.dataType === 'node') hoverNode.value = e.data
  })
  chart.on('mouseout', () => {
    hoverNode.value = null
  })

  // 拖动期间动态禁用 emphasis,避免鼠标飞过其他节点触发邻接高亮闪烁
  // 拖动结束立即恢复,鼠标在哪个节点上就触发该节点的邻接高亮(自然)
  function setEmphasisDisabled(disabled) {
    if (!chart) return
    chart.setOption({
      series: [{ emphasis: { disabled } }],
    }, { lazyUpdate: false, silent: true })
  }

  // ECharts force layout 节点拖动事件
  chart.on('dragstart', () => {
    isDragging = true
    setEmphasisDisabled(true)
  })
  chart.on('dragend', () => {
    isDragging = false
    setEmphasisDisabled(false)
  })

  // 兜底:ZRender 底层事件,某些情况下 dragstart 不触发(快速点击拖动)
  chart.getZr().on('mousedown', (e) => {
    if (isDragging) return
    if (e.target && e.target.dataIndex !== undefined && e.target.type === 'circle') {
      isDragging = true
      setEmphasisDisabled(true)
    }
  })
  chart.getZr().on('mouseup', () => {
    if (isDragging) {
      isDragging = false
      setEmphasisDisabled(false)
    }
  })
  chart.getZr().on('globalout', () => {
    if (isDragging) {
      isDragging = false
      setEmphasisDisabled(false)
    }
  })
}

let isDragging = false

function refresh() {
  if (chart) chart.setOption(buildOption(), { notMerge: false })
}

function resetZoom() {
  if (!chart) return
  chart.dispatchAction({ type: 'restore' })
}

function onResize() {
  if (chart) chart.resize()
}

onMounted(() => {
  init()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  if (chart) chart.dispose()
  window.removeEventListener('resize', onResize)
})

watch(
  [
    () => notes.notes,
    () => tags.tags,
    () => posts.posts,
    showNotes,
    showTags,
    showPosts,
    showMissing,
    showOrphans,
    repulsion,
  ],
  () => refresh(),
  { deep: true }
)

// 概览统计
const overview = computed(() => {
  const totalLinks = Object.values(notes.outLinksByNote).reduce((s, a) => s + a.length, 0)
  const missing = new Set()
  notes.notes.forEach((n) => {
    notes.getMissingLinks(n.id).forEach((t) => missing.add(t.toLowerCase()))
  })
  return {
    notes: notes.notes.length,
    tags: tags.tags.length,
    posts: posts.posts.length,
    links: totalLinks,
    missing: missing.size,
    orphans: notes.stats.orphans,
  }
})
</script>

<template>
  <section class="view-graph">
    <header class="ui-section-head">
      <div class="left">
        <span class="no">07 / Graph</span>
        <h2>知识图谱</h2>
        <p>笔记 / 标签 / 文章构成的双向链接网络。点击节点跳转,拖拽布局,滚轮缩放。</p>
      </div>
    </header>

    <!-- 概览数据条 -->
    <section class="graph-overview">
      <div class="ov-card"><span>笔记</span><strong style="color:#7c3aed">{{ overview.notes }}</strong></div>
      <div class="ov-card"><span>标签</span><strong style="color:#d97706">{{ overview.tags }}</strong></div>
      <div class="ov-card"><span>文章</span><strong style="color:#0891b2">{{ overview.posts }}</strong></div>
      <div class="ov-card"><span>双向链接</span><strong>{{ overview.links }}</strong></div>
      <div class="ov-card"><span>未链接占位</span><strong style="color:#64748b">{{ overview.missing }}</strong></div>
      <div class="ov-card"><span>孤儿节点</span><strong>{{ overview.orphans }}</strong></div>
    </section>

    <!-- 主区:图 + 控制面板
         data-lenis-prevent:让 Lenis 不拦截这两个区域的 wheel/scroll,
         避免鼠标在图谱上滚轮触发整页滚动,以及在控制面板内滚动触发整页滚动 -->
    <section class="graph-stage">
      <div ref="chartEl" class="graph-canvas" data-lenis-prevent></div>

      <aside class="graph-controls" data-lenis-prevent>
        <h3 class="gc-title">控制</h3>

        <div class="gc-block">
          <span class="gc-label">显示节点</span>
          <label class="gc-toggle">
            <input type="checkbox" v-model="showNotes" />
            <span class="dot" :style="{ background: palette.note }"></span>
            <span>笔记 ({{ overview.notes }})</span>
          </label>
          <label class="gc-toggle">
            <input type="checkbox" v-model="showTags" />
            <span class="dot" :style="{ background: palette.tag }"></span>
            <span>标签 ({{ overview.tags }})</span>
          </label>
          <label class="gc-toggle">
            <input type="checkbox" v-model="showPosts" />
            <span class="dot" :style="{ background: palette.post }"></span>
            <span>文章 ({{ overview.posts }})</span>
          </label>
          <label class="gc-toggle">
            <input type="checkbox" v-model="showMissing" />
            <span class="dot" :style="{ background: palette.missing }"></span>
            <span>未链接占位 ({{ overview.missing }})</span>
          </label>
        </div>

        <div class="gc-block">
          <span class="gc-label">布局参数</span>
          <label class="gc-range">
            <span>排斥力 <strong>{{ repulsion }}</strong></span>
            <input type="range" min="60" max="500" step="10" v-model.number="repulsion" />
          </label>
          <label class="gc-toggle">
            <input type="checkbox" v-model="showOrphans" />
            <span>显示孤儿节点</span>
          </label>
        </div>

        <div class="gc-block">
          <span class="gc-label">操作</span>
          <button class="ui-btn ui-btn-ghost ui-btn-sm" @click="refresh">
            <IconBase name="check" :size="13" />
            <span>重启布局</span>
          </button>
          <button class="ui-btn ui-btn-ghost ui-btn-sm" @click="resetZoom">
            <IconBase name="search" :size="13" />
            <span>复位缩放</span>
          </button>
        </div>

        <div v-if="hoverNode" class="gc-hover">
          <span class="gc-label">当前节点</span>
          <strong>{{ hoverNode.name }}</strong>
          <small>{{
            ({
              note: '🟪 笔记',
              tag: '🟨 标签',
              post: '🟦 文章',
              missing: '⬜ 未链接占位 — 点击创建',
            })[hoverNode._type]
          }}</small>
          <small>{{ hoverNode.value }} 个连接</small>
        </div>

        <div class="gc-tips">
          <strong>使用提示</strong>
          <ul>
            <li>拖拽节点重排</li>
            <li>滚轮缩放</li>
            <li>点击笔记/文章直接跳转</li>
            <li>点击未链接占位可创建该笔记</li>
            <li>在笔记里写 <code>[[标题]]</code> 即自动建链</li>
          </ul>
        </div>
      </aside>
    </section>
  </section>
</template>

<style scoped>
.view-graph {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* 概览条 */
.graph-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}
.ov-card {
  padding: 12px 14px;
  border-radius: var(--radius);
  border: 1px solid var(--line-soft);
  background: oklch(0.87 0.010 280 / 0.45);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.4s, transform 0.4s var(--ease-out);
}
.ov-card:hover {
  border-color: var(--line);
  transform: translateY(-2px);
}
.ov-card span {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.ov-card strong {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 20px;
  color: var(--ink);
}

/* 主区 */
.graph-stage {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 16px;
  height: 72vh;
  min-height: 540px;
}
@media (max-width: 1100px) {
  .graph-stage { grid-template-columns: 1fr; height: auto; }
  .graph-canvas { height: 60vh; min-height: 460px; }
}

.graph-canvas {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-soft);
  background:
    radial-gradient(closest-side at 30% 30%, oklch(0.90 0.06 295 / 0.18), transparent 60%),
    radial-gradient(closest-side at 70% 70%, oklch(0.90 0.05 220 / 0.15), transparent 60%),
    oklch(0.97 0.005 280);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

/* 控制面板 */
.graph-controls {
  padding: 16px 16px 12px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-soft);
  background: oklch(0.93 0.008 280 / 0.55);
  backdrop-filter: blur(12px) saturate(140%);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.gc-title {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--line-soft);
}
.gc-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.gc-label {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 4px;
}

.gc-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 12.5px;
  color: var(--ink-2);
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}
.gc-toggle:hover { background: oklch(0.87 0.010 280 / 0.5); color: var(--ink); }
.gc-toggle input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 14px; height: 14px;
  border: 1px solid var(--line);
  border-radius: 3px;
  background: oklch(0.97 0.005 280 / 0.7);
  cursor: pointer;
  position: relative;
}
.gc-toggle input[type="checkbox"]:checked {
  background: var(--accent);
  border-color: var(--accent);
}
.gc-toggle input[type="checkbox"]:checked::after {
  content: "";
  position: absolute;
  left: 4px; top: 0;
  width: 4px; height: 8px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.gc-toggle .dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.gc-range {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: var(--ink-2);
}
.gc-range span { display: flex; justify-content: space-between; }
.gc-range strong {
  font-family: var(--font-mono);
  color: var(--accent);
}
.gc-range input[type="range"] {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  background: var(--line);
  border-radius: 999px;
  outline: none;
  cursor: pointer;
}
.gc-range input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.gc-range input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 0 5px oklch(0.50 0.22 295 / 0.2);
}

.gc-block .ui-btn { width: 100%; justify-content: flex-start; }

.gc-hover {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--line-soft);
  background: oklch(0.87 0.010 280 / 0.55);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.gc-hover strong {
  font-family: var(--font-display);
  font-size: 13.5px;
  color: var(--ink);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.gc-hover small {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-3);
}

.gc-tips {
  padding: 12px;
  border-radius: 10px;
  background: oklch(0.90 0.010 280 / 0.4);
  border: 1px dashed var(--line-soft);
  font-size: 11.5px;
  color: var(--ink-3);
}
.gc-tips strong {
  display: block;
  font-family: var(--font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-2);
  margin-bottom: 6px;
  font-size: 10.5px;
}
.gc-tips ul {
  margin: 0;
  padding-left: 16px;
  line-height: 1.6;
}
.gc-tips code {
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 0 4px;
  border-radius: 3px;
  background: oklch(0.97 0.005 280 / 0.7);
  border: 1px solid var(--line-soft);
  color: var(--accent-2);
}
</style>
