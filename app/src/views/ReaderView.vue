<script setup>
/**
 * 阅读器 — 在 iframe 里嵌入博客文章详情页(或外部 URL),侧边操作面板
 *   - 标记状态(未读/在读/已读)
 *   - 评分 0-5 ★
 *   - 收藏
 *   - 累计阅读分钟(打开页面即计时)
 *   - 关联笔记列表 + 一键新建笔记
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { useReadsStore } from '@/stores/reads'
import { useNotesStore } from '@/stores/notes'
import { useSettingsStore } from '@/stores/settings'

import IconBase from '@/components/IconBase.vue'

const route = useRoute()
const router = useRouter()
const posts = usePostsStore()
const reads = useReadsStore()
const notes = useNotesStore()
const settings = useSettingsStore()

const slug = computed(() => route.params.slug)
const post = computed(() => posts.findBySlug(slug.value))
const record = computed(() => reads.ensure(slug.value))

const linkedNotes = computed(() =>
  notes.search({ articleSlug: slug.value })
)

// ===== 阅读计时 =====
let timer = 0
let lastTick = Date.now()
onMounted(() => {
  if (!post.value) return
  reads.setStatus(slug.value, record.value.status === 'unread' ? 'reading' : record.value.status)
  // 每 30 秒累计 0.5 分钟(粗粒度,不影响刷新页计算)
  timer = setInterval(() => {
    if (document.hidden) return
    const now = Date.now()
    const delta = (now - lastTick) / 60000
    lastTick = now
    if (delta > 0 && delta < 2) {
      reads.addDuration(slug.value, delta)
    } else {
      lastTick = now
    }
  }, 30000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

// ===== 操作 =====
function setRating(n) {
  reads.setRating(slug.value, n)
  settings.pushToast('success', `已评分 ${n} 星`)
}

function markStatus(s) {
  reads.setStatus(slug.value, s)
  reads.setProgress(slug.value, s === 'done' ? 100 : s === 'reading' ? Math.max(record.value.progress, 50) : 0)
  settings.pushToast('info', s === 'done' ? '标记为已读' : s === 'reading' ? '标记为在读' : '已重置')
}

function toggleCollect() {
  reads.toggleCollect(slug.value)
  settings.pushToast(record.value.collected ? 'success' : 'info', record.value.collected ? '已加入收藏' : '已取消收藏')
}

function newNoteForArticle() {
  const n = notes.create({
    title: `读《${post.value.title}》笔记`,
    content: `> 文章:${post.value.title}\n> 标签:${post.value.tag}\n\n`,
    articleSlug: slug.value,
  })
  router.push(`/notes/${n.id}`)
}

const iframeSrc = computed(() => post.value?.url || '')
</script>

<template>
  <section v-if="post" class="view-reader">
    <header class="reader-head">
      <RouterLink to="/library" class="back-link">
        <IconBase name="arrow-left" :size="14" />
        <span>文章库</span>
      </RouterLink>

      <div class="head-meta">
        <span class="rh-tag">{{ post.tag }}</span>
        <span class="rh-date">{{ post.date }}</span>
        <span class="rh-time">{{ post.readTime }} min</span>
      </div>

      <h1 class="rh-title">{{ post.title }}</h1>
      <p class="rh-sub">{{ post.excerpt }}</p>

      <!-- 状态条 -->
      <div class="rh-actions">
        <div class="action-group">
          <button
            v-for="s in [
              { key: 'unread', label: '未读' },
              { key: 'reading', label: '在读' },
              { key: 'done', label: '已读' },
            ]"
            :key="s.key"
            type="button"
            :class="['ui-chip', { 'is-active': record.status === s.key }]"
            @click="markStatus(s.key)"
          >{{ s.label }}</button>
        </div>

        <div class="action-group rating">
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

        <button
          type="button"
          class="ui-btn ui-btn-ghost ui-btn-sm"
          :class="{ active: record.collected }"
          @click="toggleCollect"
        >
          <IconBase :name="record.collected ? 'heart-filled' : 'heart'" :size="14" />
          <span>{{ record.collected ? '已收藏' : '收藏' }}</span>
        </button>

        <button
          type="button"
          class="ui-btn ui-btn-accent ui-btn-sm"
          @click="newNoteForArticle"
        >
          <IconBase name="plus" :size="14" />
          <span>记笔记</span>
        </button>
      </div>

      <!-- 进度条 -->
      <div class="rh-progress" v-if="record.progress > 0">
        <progress class="ui-progress" :value="record.progress" max="100"></progress>
        <span class="rh-progress-text">{{ record.progress }}% · 累计 {{ record.durationMin }} 分钟</span>
      </div>
    </header>

    <!-- iframe 嵌入文章 -->
    <iframe
      class="reader-frame"
      :src="iframeSrc"
      :title="post.title"
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      referrerpolicy="no-referrer"
    ></iframe>

    <!-- 相关笔记 -->
    <section v-if="linkedNotes.length" class="rh-notes">
      <h2 class="rh-notes-title">关联笔记 <span>{{ linkedNotes.length }}</span></h2>
      <div class="rh-notes-list">
        <RouterLink
          v-for="n in linkedNotes"
          :key="n.id"
          :to="`/notes/${n.id}`"
          class="rh-note-item"
        >
          <strong>{{ n.title }}</strong>
          <span>{{ (n.content || '').slice(0, 80) }}…</span>
        </RouterLink>
      </div>
    </section>
  </section>

  <div v-else class="ui-empty" style="padding-top:60px">
    <span class="icon"><IconBase name="library" :size="20" /></span>
    <h3>文章不存在</h3>
    <p>找不到 slug=「{{ slug }}」的文章。</p>
    <RouterLink to="/library" class="ui-btn ui-btn-primary">返回文章库</RouterLink>
  </div>
</template>

<style scoped>
.view-reader { display: flex; flex-direction: column; gap: 18px; }

.reader-head {
  padding: 22px 24px 20px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-soft);
  background: linear-gradient(180deg, oklch(0.18 0.014 280 / 0.55), oklch(0.14 0.012 280 / 0.4));
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 14px;
  transition: color 0.3s;
}
.back-link:hover { color: var(--ink); }
.back-link svg { transition: transform 0.3s var(--ease-out); }
.back-link:hover svg { transform: translateX(-3px); }

.head-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--ink-3);
  margin-bottom: 12px;
}
.rh-tag {
  padding: 3px 9px;
  border-radius: 999px;
  background: oklch(0.18 0.06 295 / 0.4);
  color: var(--accent);
  border: 1px solid var(--line-soft);
  text-transform: uppercase;
}

.rh-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(22px, 2.6vw, 30px);
  line-height: 1.2;
  letter-spacing: -0.018em;
  margin: 0 0 10px;
}
.rh-sub {
  font-size: 14px;
  line-height: 1.6;
  color: var(--ink-2);
  margin: 0 0 18px;
}

.rh-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.action-group {
  display: flex;
  align-items: center;
  gap: 4px;
}
.action-group .ui-chip { cursor: pointer; }

/* 评分 */
.rating {
  padding: 4px 10px;
  border-radius: 999px;
  background: oklch(0.10 0.012 280 / 0.5);
  border: 1px solid var(--line-soft);
}
.star {
  padding: 4px;
  color: var(--ink-3);
  border-radius: 4px;
  transition: color 0.3s, transform 0.2s var(--ease-out);
}
.star:hover { transform: scale(1.15); color: var(--accent-warm); }
.star.filled { color: var(--accent-warm); }
.star:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.ui-btn-sm.active {
  border-color: var(--accent);
  color: var(--accent);
}

.rh-progress {
  margin-top: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.rh-progress .ui-progress { flex: 1; }
.rh-progress-text {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink-3);
  white-space: nowrap;
}

/* iframe */
.reader-frame {
  width: 100%;
  height: 70vh;
  min-height: 480px;
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-lg);
  background: var(--bg);
  box-shadow: var(--shadow-card);
}

/* 关联笔记 */
.rh-notes {
  padding: 20px 22px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-soft);
  background: oklch(0.14 0.012 280 / 0.45);
}
.rh-notes-title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.rh-notes-title span {
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: oklch(0.20 0.10 295 / 0.4);
  color: var(--accent);
}
.rh-notes-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(260px, 100%), 1fr));
  gap: 10px;
}
.rh-note-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid var(--line-soft);
  background: oklch(0.16 0.014 280 / 0.5);
  transition: border-color 0.3s, transform 0.3s var(--ease-out);
}
.rh-note-item:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}
.rh-note-item strong {
  font-family: var(--font-display);
  font-size: 13.5px;
  color: var(--ink);
}
.rh-note-item span {
  font-size: 12px;
  color: var(--ink-2);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
