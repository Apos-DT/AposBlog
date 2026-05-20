<script setup>
/**
 * 仪表板 — 阅读概览 + 最近活动 + 快捷入口
 * 课程要求"首页展示功能 + 统计/可视化"
 */
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { useReadsStore } from '@/stores/reads'
import { useNotesStore } from '@/stores/notes'
import { useTagsStore } from '@/stores/tags'

import IconBase from '@/components/IconBase.vue'

const posts = usePostsStore()
const reads = useReadsStore()
const notes = useNotesStore()
const tags = useTagsStore()

const readProgress = computed(() => {
  const total = posts.posts.length || 1
  return Math.round((reads.stats.done / total) * 100)
})

const recentReads = computed(() =>
  reads.recent.map((r) => ({
    ...r,
    post: posts.findBySlug(r.slug),
  })).filter((r) => r.post)
)

const recentNotes = computed(() => notes.sorted.slice(0, 4))

const pinnedTags = computed(() => tags.tags.slice(0, 6))

function fmtDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const today = new Date()
  const diff = Math.floor((today - d) / 86400000)
  if (diff === 0) return '今天'
  if (diff === 1) return '昨天'
  if (diff < 7) return `${diff} 天前`
  return d.toISOString().slice(0, 10)
}
</script>

<template>
  <section class="view-dashboard">
    <header class="dash-hero">
      <span class="dash-eyebrow">DASHBOARD · 仪表板</span>
      <h1 class="dash-title">
        欢迎,<em>赵祥生</em>。<br/>
        今天读点<em>什么</em>?
      </h1>
      <p class="dash-sub">
        你已经读完 <strong>{{ reads.stats.done }} / {{ posts.posts.length }}</strong> 篇文章,
        累计 <strong>{{ Math.round(reads.stats.totalMin) }}</strong> 分钟 ·
        写下 <strong>{{ notes.stats.total }}</strong> 条笔记。
      </p>
    </header>

    <!-- 关键指标卡 -->
    <section class="dash-metrics">
      <article class="metric-card">
        <span class="m-label"><IconBase name="book" :size="14" /> 阅读进度</span>
        <strong class="m-value">{{ readProgress }}%</strong>
        <progress class="ui-progress" :value="readProgress" max="100"></progress>
        <span class="m-foot">{{ reads.stats.done }} / {{ posts.posts.length }} 篇已读</span>
      </article>
      <article class="metric-card">
        <span class="m-label"><IconBase name="clock" :size="14" /> 累计时长</span>
        <strong class="m-value">{{ reads.stats.totalMin }} <small>min</small></strong>
        <span class="m-foot">{{ reads.stats.reading }} 篇正在读</span>
      </article>
      <article class="metric-card">
        <span class="m-label"><IconBase name="heart" :size="14" /> 收藏</span>
        <strong class="m-value">{{ reads.stats.collected }} <small>篇</small></strong>
        <span class="m-foot">值得反复读</span>
      </article>
      <article class="metric-card">
        <span class="m-label"><IconBase name="star" :size="14" /> 平均评分</span>
        <strong class="m-value">{{ reads.stats.avgRating.toFixed(1) }} <small>/ 5</small></strong>
        <span class="m-foot">仅统计有评分文章</span>
      </article>
    </section>

    <!-- 双栏 -->
    <div class="dash-grid">
      <!-- 最近阅读 -->
      <section class="dash-block">
        <header class="block-head">
          <h2>最近阅读</h2>
          <RouterLink to="/library" class="block-link">
            <span>全部文章</span>
            <IconBase name="arrow-right" :size="12" />
          </RouterLink>
        </header>
        <div v-if="recentReads.length" class="recent-list">
          <RouterLink
            v-for="r in recentReads"
            :key="r.slug"
            :to="`/library/${r.slug}`"
            class="recent-item"
          >
            <span class="r-tag" :data-tag="r.post.tag">{{ r.post.tag }}</span>
            <div class="r-body">
              <span class="r-title">{{ r.post.title }}</span>
              <div class="r-meta">
                <span>{{ fmtDate(r.lastReadAt) }}</span>
                <span class="dot-sep">·</span>
                <span class="r-status" :data-status="r.status">{{
                  r.status === 'done' ? '已读' : r.status === 'reading' ? '在读' : '未读'
                }}</span>
                <span v-if="r.progress" class="dot-sep">·</span>
                <span v-if="r.progress">{{ r.progress }}%</span>
              </div>
            </div>
            <IconBase name="arrow-right" :size="14" />
          </RouterLink>
        </div>
        <div v-else class="ui-empty">
          <span class="icon"><IconBase name="book" :size="20" /></span>
          <h3>还没有阅读记录</h3>
          <p>到文章库点一篇开始读吧。</p>
          <RouterLink to="/library" class="ui-btn ui-btn-primary">
            去文章库 <IconBase name="arrow-right" :size="14" />
          </RouterLink>
        </div>
      </section>

      <!-- 最近笔记 -->
      <section class="dash-block">
        <header class="block-head">
          <h2>最近笔记</h2>
          <RouterLink to="/notes" class="block-link">
            <span>全部笔记</span>
            <IconBase name="arrow-right" :size="12" />
          </RouterLink>
        </header>
        <div v-if="recentNotes.length" class="recent-notes">
          <RouterLink
            v-for="n in recentNotes"
            :key="n.id"
            :to="`/notes/${n.id}`"
            class="note-card"
          >
            <header class="nc-head">
              <h3 :title="n.title">
                <IconBase v-if="n.pinned" name="pin" :size="13" />
                {{ n.title }}
              </h3>
              <span class="nc-date">{{ fmtDate(n.updatedAt) }}</span>
            </header>
            <p class="nc-snippet">{{ (n.content || '').slice(0, 120) }}{{ (n.content || '').length > 120 ? '…' : '' }}</p>
            <footer class="nc-foot">
              <span
                v-for="tid in (n.tagIds || []).slice(0, 3)"
                :key="tid"
                class="ui-chip"
                :style="{ '--c': tags.colorOf(tid) }"
              >
                <span class="dot"></span>{{ tags.nameOf(tid) }}
              </span>
            </footer>
          </RouterLink>
        </div>
        <div v-else class="ui-empty">
          <span class="icon"><IconBase name="notes" :size="20" /></span>
          <h3>还没有笔记</h3>
          <p>创建第一条笔记吧。</p>
          <RouterLink to="/notes" class="ui-btn ui-btn-primary">
            去写笔记 <IconBase name="arrow-right" :size="14" />
          </RouterLink>
        </div>
      </section>
    </div>

    <!-- 快捷入口 -->
    <section class="dash-quick">
      <h2 class="quick-title">快速入口</h2>
      <div class="quick-grid">
        <RouterLink to="/notes/new" class="quick-card">
          <IconBase name="plus" :size="22" />
          <strong>新建笔记</strong>
          <span>记录灵感或读后感</span>
        </RouterLink>
        <RouterLink to="/library" class="quick-card">
          <IconBase name="library" :size="22" />
          <strong>浏览文章库</strong>
          <span>找一篇值得读的</span>
        </RouterLink>
        <RouterLink to="/tags" class="quick-card">
          <IconBase name="tags" :size="22" />
          <strong>整理标签</strong>
          <span>{{ pinnedTags.length }} 个标签</span>
        </RouterLink>
        <RouterLink to="/stats" class="quick-card">
          <IconBase name="stats" :size="22" />
          <strong>查看统计</strong>
          <span>阅读趋势 / 标签分布</span>
        </RouterLink>
      </div>
    </section>
  </section>
</template>

<style scoped>
.view-dashboard {
  display: flex;
  flex-direction: column;
  gap: 36px;
}

/* hero */
.dash-hero { padding: 0 0 20px; }
.dash-eyebrow {
  display: block;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  color: var(--ink-3);
  text-transform: uppercase;
  margin-bottom: 16px;
}
.dash-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(28px, 4vw, 48px);
  line-height: 1.15;
  letter-spacing: -0.022em;
  margin: 0 0 14px;
}
.dash-title em {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  color: var(--accent-warm);
}
.dash-sub {
  font-size: 15px;
  color: var(--ink-2);
  max-width: 640px;
  line-height: 1.65;
}
.dash-sub strong { color: var(--ink); }

/* metrics */
.dash-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
}
.metric-card {
  padding: 18px 20px 16px;
  border-radius: var(--radius);
  border: 1px solid var(--line-soft);
  background: linear-gradient(180deg, oklch(0.22 0.014 280 / 0.5), oklch(0.17 0.014 280 / 0.4));
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.4s, transform 0.4s var(--ease-out);
}
.metric-card:hover { border-color: var(--line); transform: translateY(-2px); }
.m-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.m-value {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 28px;
  color: var(--ink);
}
.m-value small {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 400;
  color: var(--ink-3);
  margin-left: 2px;
}
.m-foot {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-3);
}

/* 双栏 grid */
.dash-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
}
@media (max-width: 900px) {
  .dash-grid { grid-template-columns: 1fr; }
}
.dash-block {
  padding: 22px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-soft);
  background: oklch(0.17 0.014 280 / 0.45);
}
.block-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.block-head h2 {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}
.block-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink-3);
  letter-spacing: 0.04em;
  transition: color 0.3s;
}
.block-link:hover { color: var(--accent); }

/* 最近阅读列表 */
.recent-list { display: flex; flex-direction: column; gap: 6px; }
.recent-item {
  display: grid;
  grid-template-columns: 70px 1fr 16px;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid transparent;
  transition: border-color 0.3s, background 0.3s,
              transform 0.3s var(--ease-out);
}
.recent-item:hover {
  border-color: var(--line);
  background: oklch(0.18 0.06 295 / 0.25);
  transform: translateX(3px);
}
.r-tag {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-align: center;
  padding: 4px 8px;
  border-radius: 999px;
  background: oklch(0.18 0.06 295 / 0.4);
  color: var(--accent);
  border: 1px solid var(--line-soft);
}
.r-title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 14px;
  color: var(--ink);
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.r-meta {
  display: flex;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-3);
  margin-top: 3px;
}
.r-status[data-status="done"] { color: var(--success); }
.r-status[data-status="reading"] { color: var(--accent-2); }
.dot-sep { color: var(--line); }

/* 最近笔记卡片 */
.recent-notes { display: grid; gap: 10px; }
.note-card {
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid var(--line-soft);
  background: oklch(0.20 0.014 280 / 0.5);
  transition: border-color 0.3s, transform 0.3s var(--ease-out);
}
.note-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}
.nc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  gap: 10px;
}
.nc-head h3 {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.nc-date {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--ink-3);
  white-space: nowrap;
}
.nc-snippet {
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--ink-2);
  margin: 0 0 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.nc-foot { display: flex; gap: 6px; flex-wrap: wrap; }

/* quick */
.dash-quick { margin-top: 6px; }
.quick-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 14px;
}
.quick-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}
.quick-card {
  padding: 22px 20px;
  border-radius: var(--radius);
  border: 1px solid var(--line-soft);
  background: linear-gradient(180deg, oklch(0.22 0.014 280 / 0.5), oklch(0.17 0.014 280 / 0.4));
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
  color: var(--ink-2);
  transition: border-color 0.4s, transform 0.4s var(--ease-out), background 0.4s;
}
.quick-card:hover {
  border-color: var(--accent);
  transform: translateY(-3px);
  background: oklch(0.20 0.08 295 / 0.35);
}
.quick-card svg { color: var(--accent); margin-bottom: 4px; }
.quick-card strong {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 15px;
  color: var(--ink);
}
.quick-card span {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-3);
}
</style>
