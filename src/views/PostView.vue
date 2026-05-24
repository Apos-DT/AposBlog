<script setup>
/**
 * PostView — 文章阅读(博客文章详情 + 阅读追踪合并)
 *  - 三栏: 左 TOC + 中正文 + 右工具
 *  - 文章 markdown 从 public/content/posts/<slug>.md 加载
 *  - 阅读工具栏: 进度环 / 字号 / 主色 / 复制链接 / 回顶
 *  - 阅读追踪: 状态 (未读/在读/已读) / 评分 / 收藏 / 计时 / 记笔记
 *  - 关联笔记列表
 */
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { useReadsStore } from '@/stores/reads'
import { useNotesStore } from '@/stores/notes'
import { useSettingsStore } from '@/stores/settings'
import { render as renderMd } from '@/utils/markdown'

import IconBase from '@/components/IconBase.vue'

const route = useRoute()
const router = useRouter()
const posts = usePostsStore()
const reads = useReadsStore()
const notes = useNotesStore()
const settings = useSettingsStore()

const BASE_URL = import.meta.env.BASE_URL
const slug = computed(() => route.params.slug)
const post = computed(() => posts.findBySlug(slug.value))
const record = computed(() => reads.ensure(slug.value))

const mdSource = ref('')
const loadErr = ref('')

const tocItems = ref([])
const activeId = ref('')
const progress = ref(0)
const articleEl = ref(null)

const copyState = ref('idle')

// ===== 加载 markdown =====
async function loadMd(s) {
  if (!s) return
  loadErr.value = ''
  mdSource.value = ''
  try {
    const r = await fetch(`${import.meta.env.BASE_URL}content/posts/${encodeURIComponent(s)}.md`, { cache: 'no-cache' })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    mdSource.value = await r.text()
    // 渲染后从 DOM 提取 TOC
    nextTick(() => {
      extractTOC()
      setupProgressObserver()
      // 标记为在读
      reads.setStatus(slug.value, record.value.status === 'unread' ? 'reading' : record.value.status)
    })
  } catch (e) {
    loadErr.value = e.message || '加载失败'
  }
}

watch(slug, loadMd, { immediate: true })

// ===== 渲染 =====
const rendered = computed(() => {
  if (!mdSource.value) return ''
  return renderMd(mdSource.value, {
    onLink: ({ type, target }) => {
      if (type === 'wiki') {
        const f = notes.findByTitle(target)
        return f ? `#/notes/${f.id}` : null
      }
      if (type === 'tag') return `#/notes?tag=${encodeURIComponent(target)}`
      return null
    },
  })
})

// ===== TOC 提取 =====
function extractTOC() {
  if (!articleEl.value) return
  const headings = Array.from(articleEl.value.querySelectorAll('h2, h3'))
  tocItems.value = headings.map((h, i) => {
    if (!h.id) {
      const slug = (h.textContent || '')
        .toLowerCase()
        .replace(/[^\w一-龥\s-]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 40) || `h-${i}`
      h.id = `${slug}-${i}`
    }
    return { id: h.id, text: h.textContent || '', level: h.tagName.toLowerCase() }
  })
}

// ===== 滚动监听 (进度 + active TOC) =====
let onScroll = null
let io = null
function setupProgressObserver() {
  // 进度
  onScroll = () => {
    const h = document.documentElement
    const total = h.scrollHeight - h.clientHeight
    const pct = total > 0 ? Math.max(0, Math.min(1, h.scrollTop / total)) : 0
    progress.value = Math.round(pct * 100)
    reads.setProgress(slug.value, progress.value)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // active TOC
  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) activeId.value = e.target.id
      })
    },
    { rootMargin: '-25% 0px -60% 0px' }
  )
  articleEl.value?.querySelectorAll('h2, h3').forEach((h) => io.observe(h))
}

// ===== 阅读计时 =====
let timer = 0
let lastTick = Date.now()
onMounted(() => {
  timer = setInterval(() => {
    if (document.hidden) return
    const now = Date.now()
    const delta = (now - lastTick) / 60000
    lastTick = now
    if (delta > 0 && delta < 2 && slug.value) {
      reads.addDuration(slug.value, delta)
    } else {
      lastTick = now
    }
  }, 30000)
})

onBeforeUnmount(() => {
  if (onScroll) window.removeEventListener('scroll', onScroll)
  if (io) io.disconnect()
  if (timer) clearInterval(timer)
})

// ===== 操作 =====
function copyLink() {
  navigator.clipboard.writeText(location.origin + location.pathname + '#/post/' + slug.value)
    .then(() => {
      copyState.value = 'copied'
      setTimeout(() => (copyState.value = 'idle'), 1800)
    })
    .catch(() => {
      copyState.value = 'fail'
      setTimeout(() => (copyState.value = 'idle'), 1800)
    })
}

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function setRating(n) {
  reads.setRating(slug.value, n)
  settings.pushToast('success', `已评分 ${n} 星`)
}

function toggleCollect() {
  reads.toggleCollect(slug.value)
  settings.pushToast(
    record.value.collected ? 'success' : 'info',
    record.value.collected ? '已加入收藏' : '已取消收藏'
  )
}

function markStatus(s) {
  reads.setStatus(slug.value, s)
  if (s === 'done') reads.setProgress(slug.value, 100)
  settings.pushToast('info', s === 'done' ? '标记为已读' : s === 'reading' ? '标记为在读' : '已重置')
}

function newNoteForArticle() {
  if (!post.value) return
  router.push({ path: '/notes/new', query: { article: slug.value } })
}

const linkedNotes = computed(() =>
  slug.value ? notes.search({ articleSlug: slug.value }) : []
)

const circumference = 2 * Math.PI * 15.91
const dashOffset = computed(() => circumference * (1 - progress.value / 100))

function fmtDate(d) {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  return `${y}.${m}.${day}`
}
</script>

<template>
  <div class="post-page">
    <!-- 加载失败 -->
    <div v-if="loadErr || !post" class="ui-empty" style="padding-top:80px">
      <span class="icon"><IconBase name="library" :size="20" /></span>
      <h3>{{ !post ? '文章不存在' : '加载失败' }}</h3>
      <p>{{ loadErr || `找不到 slug = ${slug}` }}</p>
      <RouterLink to="/" class="ui-btn ui-btn-primary">返回首页</RouterLink>
    </div>

    <!-- 主体三栏 -->
    <div v-else class="post-grid">
      <!-- 左 TOC -->
      <aside class="post-toc">
        <div class="ptc-inner">
          <span class="ptc-label">CONTENTS</span>
          <nav v-if="tocItems.length" class="ptc-nav">
            <a
              v-for="t in tocItems"
              :key="t.id"
              :href="`#${t.id}`"
              :class="['toc-link', `toc-${t.level}`, { active: activeId === t.id }]"
              @click.prevent="document.getElementById(t.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })"
            >{{ t.text }}</a>
          </nav>
          <span v-else class="ptc-empty">加载中…</span>
        </div>
      </aside>

      <!-- 中 正文 -->
      <article class="post-wrap" ref="articleEl">
        <RouterLink class="post-back" to="/">
          <IconBase name="arrow-left" :size="14" />
          <span>ALL POSTS</span>
        </RouterLink>

        <header class="post-head">
          <div class="post-meta">
            <span>{{ fmtDate(post.date) }}</span>
            <span class="post-tag">{{ post.tag }}</span>
            <span>{{ post.readTime }} min read</span>
          </div>
          <h1>{{ post.title }}</h1>
          <p v-if="post.excerpt" class="post-sub">{{ post.excerpt }}</p>
        </header>

        <div class="post-body md" v-html="rendered"></div>

        <footer class="post-footer">
          <RouterLink to="/" class="back-home">
            <IconBase name="arrow-left" :size="14" />
            <span>返回首页</span>
          </RouterLink>
        </footer>

        <!-- 关联笔记 -->
        <section v-if="linkedNotes.length" class="linked-notes">
          <h2 class="ln-title">
            <IconBase name="notes" :size="16" />
            <span>关联笔记 ({{ linkedNotes.length }})</span>
          </h2>
          <div class="ln-list">
            <RouterLink
              v-for="n in linkedNotes"
              :key="n.id"
              :to="`/notes/${n.id}`"
              class="ln-item"
            >
              <strong>{{ n.title }}</strong>
              <span>{{ (n.content || '').replace(/^---[\s\S]*?---\n?/, '').slice(0, 100) }}…</span>
            </RouterLink>
          </div>
        </section>
      </article>

      <!-- 右 工具 -->
      <aside class="post-tools">
        <div class="ptt-inner">
          <!-- 进度环 -->
          <div class="rp-card">
            <div class="rp-ring">
              <svg viewBox="0 0 36 36" aria-hidden="true">
                <circle class="rp-bg" cx="18" cy="18" r="15.91"/>
                <circle
                  class="rp-fg"
                  cx="18" cy="18" r="15.91"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="dashOffset"
                />
              </svg>
              <span class="rp-text">{{ progress }}%</span>
            </div>
            <span class="rp-cap">阅读进度</span>
            <span class="rp-extra">累计 {{ Math.round(record.durationMin || 0) }} 分钟</span>
          </div>

          <!-- 阅读追踪 -->
          <div class="ptt-card">
            <span class="ptt-label">阅读状态</span>
            <div class="ptt-tabs">
              <button
                v-for="s in [
                  { key: 'unread', label: '未读' },
                  { key: 'reading', label: '在读' },
                  { key: 'done', label: '已读' },
                ]"
                :key="s.key"
                type="button"
                :class="['ptt-tab', { active: record.status === s.key }]"
                @click="markStatus(s.key)"
              >{{ s.label }}</button>
            </div>
          </div>

          <div class="ptt-card">
            <span class="ptt-label">评分</span>
            <div class="ptt-stars">
              <button
                v-for="n in 5"
                :key="n"
                type="button"
                class="star"
                :class="{ filled: record.rating >= n }"
                @click="setRating(n)"
                :title="`${n} 星`"
              >
                <IconBase :name="record.rating >= n ? 'star-filled' : 'star'" :size="18" />
              </button>
            </div>
          </div>

          <!-- 快捷操作 -->
          <div class="ptt-card">
            <span class="ptt-label">操作</span>
            <button class="ptt-btn" :class="{ 'is-active': record.collected }" @click="toggleCollect">
              <IconBase :name="record.collected ? 'heart-filled' : 'heart'" :size="14" />
              <span>{{ record.collected ? '已收藏' : '加入收藏' }}</span>
            </button>
            <button class="ptt-btn ptt-btn-accent" @click="newNoteForArticle">
              <IconBase name="plus" :size="14" />
              <span>记笔记</span>
            </button>
            <button
              class="ptt-btn"
              :class="{ 'is-active': copyState === 'copied' }"
              @click="copyLink"
            >
              <IconBase name="copy" :size="14" />
              <span>{{ copyState === 'copied' ? '已复制 ✓' : copyState === 'fail' ? '复制失败' : '复制链接' }}</span>
            </button>
            <button class="ptt-btn" @click="toTop">
              <IconBase name="arrow-up" :size="14" />
              <span>回到顶部</span>
            </button>
          </div>

          <!-- 作者卡 -->
          <div class="ptt-card author-card">
            <span class="ptt-label">作者</span>
            <div class="author-row">
              <img class="author-avatar" :src="`${BASE_URL}hoshinoai.jpg`" alt="赵祥生" />
              <div class="author-meta">
                <strong>赵祥生 (Apos)</strong>
                <span>青岛 · 工程笔记</span>
              </div>
            </div>
            <RouterLink to="/#about" class="author-link">关于我 →</RouterLink>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.post-page { width: 100%; }

/* 三栏 */
.post-grid {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr) 260px;
  gap: clamp(24px, 3vw, 48px);
  max-width: min(1320px, calc(100% - 32px));
  margin: 0 auto;
  padding: 30px clamp(24px, 4vw, 56px) 80px;
}

.post-toc, .post-tools {
  position: sticky;
  top: calc(var(--nav-h) + 20px);
  align-self: start;
  max-height: calc(100vh - var(--nav-h) - 40px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--line) transparent;
}
.post-toc::-webkit-scrollbar,
.post-tools::-webkit-scrollbar { width: 6px; }
.post-toc::-webkit-scrollbar-thumb,
.post-tools::-webkit-scrollbar-thumb { background: var(--line); border-radius: 3px; }

.ptc-inner, .ptt-inner {
  padding: 20px 18px;
  border-radius: 16px;
  border: 1px solid var(--line-soft);
  background: oklch(0.93 0.008 280 / 0.55);
  backdrop-filter: blur(12px) saturate(140%);
}

/* ===== TOC ===== */
.ptc-label, .ptt-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 12px;
}
.ptc-nav { display: flex; flex-direction: column; gap: 2px; }
.ptc-empty {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink-3);
  padding: 6px 0;
}
.toc-link {
  display: block;
  padding: 7px 10px 7px 14px;
  font-size: 12.5px;
  color: var(--ink-3);
  border-radius: 6px;
  border-left: 2px solid transparent;
  line-height: 1.4;
  transition: color 0.3s, background 0.3s, border-left-color 0.3s, padding-left 0.3s var(--ease-out);
  cursor: pointer;
}
.toc-h3 { padding-left: 26px; font-size: 12px; }
.toc-link:hover {
  color: var(--ink);
  background: oklch(0.88 0.04 295 / 0.3);
  padding-left: 18px;
}
.toc-link.active {
  color: var(--accent);
  border-left-color: var(--accent);
  background: oklch(0.82 0.07 295 / 0.32);
}

/* ===== 文章主体 ===== */
.post-wrap {
  min-width: 0;
  max-width: 720px;
  margin: 0 auto;
  width: 100%;
}

.post-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 30px;
  transition: color 0.3s;
}
.post-back:hover { color: var(--ink); }
.post-back svg { transition: transform 0.3s var(--ease-out); }
.post-back:hover svg { transform: translateX(-4px); }

.post-head {
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--line-soft);
}
.post-meta {
  display: flex;
  gap: 14px;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 24px;
}
.post-tag {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--line);
  color: var(--ink-2);
}
.post-head h1 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(30px, 5vw, 56px);
  letter-spacing: -0.025em;
  line-height: 1.1;
  margin: 0 0 18px;
}
.post-sub {
  color: var(--ink-2);
  font-size: 17px;
  margin: 0;
  line-height: 1.5;
}

/* ===== Markdown body ===== */
.post-body {
  line-height: 1.85;
  color: var(--ink);
}
.post-body :deep(p) { margin: 0 0 1.4em; color: var(--ink-2); }
.post-body :deep(h2) {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(22px, 3vw, 30px);
  letter-spacing: -0.015em;
  margin: 2em 0 0.6em;
  color: var(--ink);
  scroll-margin-top: 90px;
}
.post-body :deep(h3) {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(17px, 2.2vw, 21px);
  margin: 1.8em 0 0.5em;
  color: var(--ink);
  scroll-margin-top: 90px;
}
.post-body :deep(strong) { color: var(--ink); font-weight: 600; }
.post-body :deep(em) {
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--accent-warm);
  font-weight: 400;
}
.post-body :deep(a) {
  color: var(--accent);
  border-bottom: 1px solid var(--line);
  padding-bottom: 1px;
  transition: color 0.3s, border-color 0.3s;
}
.post-body :deep(a:hover) { color: var(--accent-warm); border-color: currentColor; }
.post-body :deep(ul), .post-body :deep(ol) {
  padding-left: 1.3em;
  color: var(--ink-2);
  margin: 0 0 1.4em;
}
.post-body :deep(li) { margin: 0.4em 0; }
.post-body :deep(blockquote) {
  margin: 1.6em 0;
  padding: 4px 0 4px 22px;
  border-left: 2px solid var(--accent);
  color: var(--ink-2);
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.05em;
}
.post-body :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.88em;
  background: var(--bg-soft);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid var(--line-soft);
  color: var(--accent-2);
}
.post-body :deep(pre) {
  background: var(--bg-deep);
  border: 1px solid var(--line-soft);
  border-radius: 12px;
  padding: 22px;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 13.5px;
  line-height: 1.7;
  margin: 1.6em 0;
}
.post-body :deep(pre code) { background: transparent; padding: 0; border: 0; color: var(--ink-2); }
.post-body :deep(hr) { border: 0; border-top: 1px solid var(--line-soft); margin: 2.4em 0; }
.post-body :deep(.md-admon) {
  display: flex;
  gap: 12px;
  padding: 14px 18px;
  margin: 1.6em 0;
  border-radius: 10px;
  border-left: 3px solid;
}
.post-body :deep(.md-admon-info) { background: oklch(0.90 0.05 220 / 0.32); border-left-color: var(--accent-2); }
.post-body :deep(.md-admon-tip), .post-body :deep(.md-admon-success) { background: oklch(0.90 0.05 160 / 0.32); border-left-color: var(--success); }
.post-body :deep(.md-admon-warning) { background: oklch(0.88 0.07 60 / 0.32); border-left-color: var(--warning); }
.post-body :deep(.md-admon-error) { background: oklch(0.88 0.07 25 / 0.30); border-left-color: var(--error); }
.post-body :deep(.md-admon-note) { background: oklch(0.86 0.010 280 / 0.5); border-left-color: var(--ink-3); }
.post-body :deep(.md-wiki) {
  display: inline-flex;
  align-items: center;
  padding: 0 6px;
  border-radius: 4px;
  background: oklch(0.85 0.06 295 / 0.4);
  border: 1px solid oklch(0.50 0.22 295 / 0.4);
  color: var(--accent);
  font-weight: 500;
}
.post-body :deep(.md-wiki:hover) { background: oklch(0.78 0.08 295 / 0.5); color: var(--ink); }
.post-body :deep(.md-tag) {
  display: inline-block;
  padding: 0 6px;
  border-radius: 4px;
  background: oklch(0.88 0.07 60 / 0.4);
  color: var(--warning);
  font-family: var(--font-mono);
  font-size: 0.9em;
}

.post-footer {
  margin-top: 80px;
  padding-top: 40px;
  border-top: 1px solid var(--line-soft);
  display: flex;
  justify-content: space-between;
}
.back-home {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-2);
  transition: color 0.3s;
}
.back-home:hover { color: var(--accent); }

/* ===== 关联笔记 ===== */
.linked-notes {
  margin-top: 60px;
  padding: 22px 24px;
  border-radius: 14px;
  border: 1px solid var(--line-soft);
  background: oklch(0.93 0.008 280 / 0.45);
}
.ln-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px;
}
.ln-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(240px, 100%), 1fr));
  gap: 10px;
}
.ln-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid var(--line-soft);
  background: oklch(0.90 0.010 280 / 0.5);
  color: inherit;
  transition: border-color 0.3s, transform 0.3s var(--ease-out);
}
.ln-item:hover { border-color: var(--accent); transform: translateY(-2px); }
.ln-item strong {
  font-family: var(--font-display);
  font-size: 13.5px;
  color: var(--ink);
}
.ln-item span {
  font-size: 12px;
  color: var(--ink-2);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== 右栏工具 ===== */
.ptt-inner > * + * { margin-top: 12px; }
.ptt-card {
  padding: 14px;
  border-radius: 10px;
  border: 1px solid var(--line-soft);
  background: oklch(0.90 0.010 280 / 0.45);
  transition: border-color 0.4s;
}
.ptt-card:hover { border-color: var(--line); }

.rp-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 14px;
  border-radius: 10px;
  border: 1px solid var(--line-soft);
  background: oklch(0.90 0.010 280 / 0.45);
}
.rp-ring { position: relative; width: 84px; height: 84px; }
.rp-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.rp-bg { fill: none; stroke: var(--line-soft); stroke-width: 2.5; }
.rp-fg {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2.5;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.2s linear, stroke 0.3s;
}
.rp-text {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
}
.rp-cap {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--ink-3);
  text-transform: uppercase;
}
.rp-extra {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--accent-2);
}

.ptt-tabs { display: flex; gap: 5px; }
.ptt-tab {
  flex: 1;
  padding: 7px 8px;
  border-radius: 6px;
  border: 1px solid var(--line);
  background: transparent;
  font-family: var(--font-display);
  font-size: 12px;
  color: var(--ink-2);
  cursor: pointer;
  transition: color 0.3s, background 0.3s, border-color 0.3s;
}
.ptt-tab:hover { color: var(--ink); border-color: var(--ink-3); }
.ptt-tab.active {
  color: #fff;
  background: var(--accent);
  border-color: var(--accent);
}

.ptt-stars { display: flex; gap: 2px; justify-content: space-between; }
.star {
  padding: 4px;
  color: var(--ink-3);
  background: transparent;
  border-radius: 4px;
  transition: color 0.3s, transform 0.2s var(--ease-out);
}
.star:hover { transform: scale(1.15); color: var(--accent-warm); }
.star.filled { color: var(--accent-warm); }

.ptt-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  border-radius: 7px;
  border: 1px solid var(--line-soft);
  background: oklch(0.97 0.005 280 / 0.55);
  font-size: 13px;
  color: var(--ink-2);
  cursor: pointer;
  text-align: left;
  transition: color 0.3s, background 0.3s, border-color 0.3s, transform 0.3s var(--ease-out);
}
.ptt-btn + .ptt-btn { margin-top: 5px; }
.ptt-btn:hover {
  color: var(--ink);
  border-color: var(--accent);
  background: oklch(0.85 0.06 295 / 0.4);
  transform: translateX(3px);
}
.ptt-btn.ptt-btn-accent {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
.ptt-btn.ptt-btn-accent:hover {
  background: oklch(0.65 0.22 295);
}
.ptt-btn.is-active {
  color: var(--accent);
  border-color: var(--accent);
}

.author-card .author-row {
  display: grid;
  grid-template-columns: 36px 1fr;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}
.author-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--line);
  box-shadow: 0 2px 10px -2px oklch(0.50 0.22 295 / 0.30);
}
.author-meta { display: flex; flex-direction: column; min-width: 0; }
.author-meta strong {
  font-family: var(--font-display);
  font-size: 13.5px;
  color: var(--ink);
}
.author-meta span {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-3);
}
.author-link {
  display: inline-block;
  margin-top: 4px;
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--accent);
  letter-spacing: 0.04em;
}
.author-link:hover { color: var(--accent-warm); }

/* 响应式 */
@media (max-width: 1100px) {
  .post-grid { grid-template-columns: 1fr; gap: 20px; }
  .post-toc, .post-tools {
    position: static;
    max-height: none;
  }
  .post-wrap { order: 1; max-width: 720px; }
  .post-toc { order: 2; }
  .post-tools { order: 3; }
}
</style>
