<script setup>
/**
 * 统计 — ECharts 可视化
 *   - 阅读状态分布 (饼图)
 *   - 标签分布 (柱状)
 *   - 最近 30 天阅读时长 (折线)
 *   - 评分分布 (柱状)
 */
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import * as echarts from 'echarts/core'
import { PieChart, BarChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

import { usePostsStore } from '@/stores/posts'
import { useReadsStore } from '@/stores/reads'
import { useNotesStore } from '@/stores/notes'
import { useTagsStore } from '@/stores/tags'
import { useSettingsStore } from '@/stores/settings'

echarts.use([
  PieChart,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  CanvasRenderer,
])

const posts = usePostsStore()
const reads = useReadsStore()
const notes = useNotesStore()
const tags = useTagsStore()
const settings = useSettingsStore()

const refStatus = ref(null)
const refTag = ref(null)
const refTimeline = ref(null)
const refRating = ref(null)

let charts = []

const palette = ['#7c3aed', '#0891b2', '#d97706', '#16a34a', '#e11d48', '#8b5cf6']

function commonTheme() {
  return {
    textStyle: {
      fontFamily: 'JetBrains Mono, monospace',
      color: '#1e293b',
    },
    backgroundColor: 'transparent',
    color: palette,
  }
}

// 阅读状态分布
function statusOption() {
  const data = [
    { value: reads.stats.done, name: '已读' },
    { value: reads.stats.reading, name: '在读' },
    { value: posts.posts.length - reads.stats.done - reads.stats.reading, name: '未读' },
  ].filter((d) => d.value > 0)
  return {
    ...commonTheme(),
    title: { text: '阅读状态分布', left: 'left', textStyle: { color: '#0f172a', fontSize: 14, fontFamily: 'Space Grotesk' } },
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
    legend: { bottom: 0, textStyle: { color: '#475569' } },
    series: [
      {
        name: '状态',
        type: 'pie',
        radius: ['38%', '64%'],
        center: ['50%', '46%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: '#ffffff', borderWidth: 2 },
        label: { color: '#1e293b', formatter: '{b}\n{c}' },
        data,
      },
    ],
  }
}

// 标签分布
function tagOption() {
  const data = tags.all
    .map((t) => ({
      name: t.name,
      value: notes.notes.filter((n) => (n.tagIds || []).includes(t.id)).length,
    }))
    .sort((a, b) => b.value - a.value)
  return {
    ...commonTheme(),
    title: { text: '标签使用频次 (笔记)', left: 'left', textStyle: { color: '#0f172a', fontSize: 14, fontFamily: 'Space Grotesk' } },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 20, right: 20, top: 50, bottom: 36, containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.name),
      axisLabel: { color: '#475569', fontSize: 11 },
      axisLine: { lineStyle: { color: '#cbd5e1' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#475569' },
      splitLine: { lineStyle: { color: 'rgba(15,23,42,0.08)' } },
    },
    series: [
      {
        type: 'bar',
        data: data.map((d) => d.value),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#7c3aed' },
              { offset: 1, color: '#0891b2' },
            ],
          },
          borderRadius: [6, 6, 0, 0],
        },
        barWidth: '50%',
      },
    ],
  }
}

// 最近 30 天阅读
function timelineOption() {
  const days = 30
  const today = new Date()
  const labels = []
  const buckets = {}
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000)
    const k = d.toISOString().slice(0, 10)
    labels.push(k.slice(5))
    buckets[k] = 0
  }
  reads.records.forEach((r) => {
    if (r.lastReadAt) {
      const k = r.lastReadAt.slice(0, 10)
      if (k in buckets) buckets[k] += (r.durationMin || 0) / (reads.records.length || 1) || 1
    }
  })
  return {
    ...commonTheme(),
    title: { text: '最近 30 天阅读活跃度', left: 'left', textStyle: { color: '#0f172a', fontSize: 14, fontFamily: 'Space Grotesk' } },
    tooltip: { trigger: 'axis' },
    grid: { left: 20, right: 20, top: 50, bottom: 30, containLabel: true },
    xAxis: {
      type: 'category',
      data: labels,
      boundaryGap: false,
      axisLabel: { color: '#475569', fontSize: 10 },
      axisLine: { lineStyle: { color: '#cbd5e1' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#475569' },
      splitLine: { lineStyle: { color: 'rgba(15,23,42,0.08)' } },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: Object.values(buckets),
        lineStyle: { color: '#7c3aed', width: 2 },
        itemStyle: { color: '#7c3aed' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(124,58,237,0.35)' },
              { offset: 1, color: 'rgba(124,58,237,0)' },
            ],
          },
        },
      },
    ],
  }
}

// 评分分布
function ratingOption() {
  const counts = [0, 0, 0, 0, 0]
  reads.records.forEach((r) => {
    if (r.rating && r.rating >= 1 && r.rating <= 5) counts[r.rating - 1]++
  })
  return {
    ...commonTheme(),
    title: { text: '评分分布', left: 'left', textStyle: { color: '#0f172a', fontSize: 14, fontFamily: 'Space Grotesk' } },
    tooltip: { trigger: 'axis' },
    grid: { left: 20, right: 20, top: 50, bottom: 36, containLabel: true },
    xAxis: {
      type: 'category',
      data: ['1 ★', '2 ★', '3 ★', '4 ★', '5 ★'],
      axisLabel: { color: '#475569' },
      axisLine: { lineStyle: { color: '#cbd5e1' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#475569' },
      splitLine: { lineStyle: { color: 'rgba(15,23,42,0.08)' } },
    },
    series: [
      {
        type: 'bar',
        data: counts,
        itemStyle: {
          color: '#d97706',
          borderRadius: [6, 6, 0, 0],
        },
        barWidth: '55%',
      },
    ],
  }
}

function initAll() {
  if (!refStatus.value) return
  charts.forEach((c) => c && c.dispose())
  charts = []

  const opts = [
    [refStatus.value, statusOption()],
    [refTag.value, tagOption()],
    [refTimeline.value, timelineOption()],
    [refRating.value, ratingOption()],
  ]
  opts.forEach(([el, opt]) => {
    if (!el) return
    const c = echarts.init(el)
    c.setOption(opt)
    charts.push(c)
  })
}

function onResize() {
  charts.forEach((c) => c && c.resize())
}

onMounted(() => {
  initAll()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  charts.forEach((c) => c && c.dispose())
  window.removeEventListener('resize', onResize)
})

// reactive update
watch(
  () => [reads.records, notes.notes, tags.tags, posts.posts],
  () => initAll(),
  { deep: true }
)

const empty = computed(() => {
  return reads.records.length === 0 && notes.notes.length === 0
})
</script>

<template>
  <section class="view-stats">
    <header class="ui-section-head">
      <div class="left">
        <span class="no">05 / Stats</span>
        <h2>统计</h2>
        <p>ECharts 可视化:阅读状态分布 / 标签频次 / 30 天活跃度 / 评分分布。</p>
      </div>
    </header>

    <div v-if="empty" class="ui-empty">
      <span class="icon">📊</span>
      <h3>暂无数据可视化</h3>
      <p>开始阅读和写笔记后,这里会出现图表。</p>
    </div>

    <div v-else class="stats-grid">
      <div class="chart-card"><div ref="refStatus" class="chart"></div></div>
      <div class="chart-card"><div ref="refTag" class="chart"></div></div>
      <div class="chart-card span-2"><div ref="refTimeline" class="chart"></div></div>
      <div class="chart-card"><div ref="refRating" class="chart"></div></div>
      <div class="chart-card summary">
        <h3>数据快照</h3>
        <ul>
          <li><span>总文章</span><strong>{{ posts.posts.length }}</strong></li>
          <li><span>已读</span><strong class="ok">{{ reads.stats.done }}</strong></li>
          <li><span>在读</span><strong>{{ reads.stats.reading }}</strong></li>
          <li><span>收藏</span><strong>{{ reads.stats.collected }}</strong></li>
          <li><span>笔记</span><strong>{{ notes.stats.total }}</strong></li>
          <li><span>标签</span><strong>{{ tags.tags.length }}</strong></li>
          <li><span>累计时长</span><strong>{{ reads.stats.totalMin }} min</strong></li>
          <li><span>平均评分</span><strong>{{ reads.stats.avgRating.toFixed(2) }}</strong></li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.view-stats { display: flex; flex-direction: column; gap: 22px; }

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 880px) {
  .stats-grid { grid-template-columns: 1fr; }
}

.chart-card {
  padding: 18px 20px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-soft);
  background: linear-gradient(180deg, oklch(0.90 0.010 280 / 0.5), oklch(0.95 0.006 280 / 0.4));
  transition: border-color 0.4s;
}
.chart-card:hover { border-color: var(--line); }
.chart-card.span-2 { grid-column: 1 / -1; }
.chart {
  width: 100%;
  height: 280px;
}

.chart-card.summary { display: flex; flex-direction: column; }
.chart-card.summary h3 {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 14px;
  color: var(--ink);
}
.chart-card.summary ul {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 24px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--font-mono);
  font-size: 12.5px;
}
.chart-card.summary li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid var(--line-soft);
}
.chart-card.summary li span { color: var(--ink-2); }
.chart-card.summary li strong { color: var(--ink); font-weight: 500; }
.chart-card.summary li strong.ok { color: var(--success); }
</style>
