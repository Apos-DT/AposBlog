<script setup>
/**
 * 文章库 — 列表 + 搜索 + 标签筛选 + 排序 + 添加自定义文章
 * 课程要求"列表展示 + 搜索筛选 + 添加/删除"
 */
import { ref, computed, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { useReadsStore } from '@/stores/reads'
import { useSettingsStore } from '@/stores/settings'

import IconBase from '@/components/IconBase.vue'

const route = useRoute()
const posts = usePostsStore()
const reads = useReadsStore()
const settings = useSettingsStore()

const keyword = ref(route.query.q || '')
const tagFilter = ref('')
const statusFilter = ref('all') // all | unread | reading | done | collected
const sort = ref('date-desc') // date-desc | date-asc | read-time | rating-desc

// 初始化时如果 url 带 ?q 同步
watch(
  () => route.query.q,
  (q) => {
    if (q) keyword.value = q
  }
)

const tagsAvailable = computed(() => {
  const set = new Set(posts.posts.map((p) => p.tag).filter(Boolean))
  return Array.from(set)
})

const filtered = computed(() => {
  let list = posts.search(keyword.value, tagFilter.value)
  if (statusFilter.value !== 'all') {
    list = list.filter((p) => {
      const r = reads.get(p.slug)
      if (statusFilter.value === 'collected') return r?.collected
      return (r?.status || 'unread') === statusFilter.value
    })
  }
  switch (sort.value) {
    case 'date-asc':
      list = [...list].sort((a, b) => a.date.localeCompare(b.date))
      break
    case 'read-time':
      list = [...list].sort((a, b) => (a.readTime || 0) - (b.readTime || 0))
      break
    case 'rating-desc':
      list = [...list].sort((a, b) => (reads.get(b.slug)?.rating || 0) - (reads.get(a.slug)?.rating || 0))
      break
    case 'date-desc':
    default:
      list = [...list].sort((a, b) => b.date.localeCompare(a.date))
  }
  return list
})

// ===== 添加文章模态 =====
const showAdd = ref(false)
const addForm = ref({ title: '', excerpt: '', tag: '', url: '', readTime: 5 })
const addErr = ref('')

function openAdd() {
  addForm.value = { title: '', excerpt: '', tag: '', url: '', readTime: 5 }
  addErr.value = ''
  showAdd.value = true
}

function submitAdd() {
  addErr.value = ''
  try {
    if (!addForm.value.title) throw new Error('请填写标题')
    if (!addForm.value.url) throw new Error('请填写文章 URL')
    posts.add({
      title: addForm.value.title,
      excerpt: addForm.value.excerpt,
      tag: addForm.value.tag || 'Custom',
      url: addForm.value.url,
      readTime: parseInt(addForm.value.readTime, 10) || 5,
      date: new Date().toISOString().slice(0, 10),
    })
    showAdd.value = false
    settings.pushToast('success', '已加入文章库')
  } catch (e) {
    addErr.value = e.message
  }
}

function removeCustom(slug, title) {
  if (!confirm(`确定删除「${title}」?\n(只能删除自定义添加的文章,博客自带文章不会被删除)`)) return
  const p = posts.findBySlug(slug)
  if (!p?.external) {
    settings.pushToast('warning', '博客自带文章不可删除')
    return
  }
  posts.remove(slug)
  settings.pushToast('success', '已从文章库移除')
}

function toggleCollect(slug, e) {
  e.preventDefault()
  e.stopPropagation()
  reads.toggleCollect(slug)
  settings.pushToast(
    reads.get(slug)?.collected ? 'success' : 'info',
    reads.get(slug)?.collected ? '已加入收藏' : '已取消收藏'
  )
}

function getStatusLabel(slug) {
  const r = reads.get(slug)
  if (!r || r.status === 'unread') return '未读'
  if (r.status === 'reading') return `在读 ${r.progress}%`
  return '已读'
}
</script>

<template>
  <section class="view-library">
    <!-- 顶部:标题 + 添加按钮 -->
    <header class="ui-section-head">
      <div class="left">
        <span class="no">02 / Library</span>
        <h2>文章库</h2>
        <p>共 {{ posts.posts.length }} 篇 · {{ filtered.length }} 篇符合当前筛选 ·
          已读 {{ reads.stats.done }} 收藏 {{ reads.stats.collected }}</p>
      </div>
      <button class="ui-btn ui-btn-accent" @click="openAdd">
        <IconBase name="plus" :size="14" />
        <span>加文章</span>
      </button>
    </header>

    <!-- 筛选条 -->
    <section class="lib-filters">
      <div class="lib-search">
        <IconBase name="search" :size="14" />
        <input
          v-model="keyword"
          type="search"
          class="ui-input"
          placeholder="搜索标题 / 摘要 / 标签…"
        />
      </div>

      <div class="lib-tags">
        <button
          :class="['ui-chip', { 'is-active': tagFilter === '' }]"
          @click="tagFilter = ''"
        >全部</button>
        <button
          v-for="t in tagsAvailable"
          :key="t"
          :class="['ui-chip', { 'is-active': tagFilter === t }]"
          @click="tagFilter = tagFilter === t ? '' : t"
        >{{ t }}</button>
      </div>

      <div class="lib-controls">
        <select v-model="statusFilter" class="ui-select">
          <option value="all">全部状态</option>
          <option value="unread">未读</option>
          <option value="reading">在读</option>
          <option value="done">已读</option>
          <option value="collected">收藏</option>
        </select>

        <select v-model="sort" class="ui-select">
          <option value="date-desc">日期 ↓ 新</option>
          <option value="date-asc">日期 ↑ 旧</option>
          <option value="read-time">阅读时长 ↑</option>
          <option value="rating-desc">评分 ↓</option>
        </select>
      </div>
    </section>

    <!-- 文章列表 -->
    <section v-if="filtered.length" class="lib-grid">
      <article
        v-for="p in filtered"
        :key="p.slug"
        class="lib-card"
        :data-status="(reads.get(p.slug)?.status) || 'unread'"
      >
        <header class="lc-meta">
          <span class="lc-tag">{{ p.tag }}</span>
          <span class="lc-date">{{ p.date }}</span>
          <button
            v-if="p.external"
            class="lc-del"
            :title="'移除「'+p.title+'」'"
            @click.prevent="removeCustom(p.slug, p.title)"
          >
            <IconBase name="trash" :size="13" />
          </button>
        </header>

        <h3 class="lc-title">{{ p.title }}</h3>
        <p class="lc-excerpt">{{ p.excerpt }}</p>

        <footer class="lc-foot">
          <span class="lc-status" :data-status="(reads.get(p.slug)?.status) || 'unread'">
            {{ getStatusLabel(p.slug) }}
          </span>
          <span class="lc-time">{{ p.readTime }} min</span>
          <span class="lc-spacer"></span>
          <button
            type="button"
            class="lc-icon-btn"
            :title="reads.get(p.slug)?.collected ? '取消收藏' : '加入收藏'"
            @click="toggleCollect(p.slug, $event)"
          >
            <IconBase :name="reads.get(p.slug)?.collected ? 'heart-filled' : 'heart'" :size="15" />
          </button>
          <RouterLink :to="`/library/${p.slug}`" class="lc-open">
            打开 <IconBase name="arrow-right" :size="13" />
          </RouterLink>
        </footer>

        <!-- 进度条 -->
        <div v-if="reads.get(p.slug)?.progress" class="lc-prog">
          <progress class="ui-progress" :value="reads.get(p.slug).progress" max="100"></progress>
        </div>
      </article>
    </section>

    <div v-else class="ui-empty">
      <span class="icon"><IconBase name="search" :size="20" /></span>
      <h3>没有符合条件的文章</h3>
      <p>试试换个关键词,或清空筛选。</p>
      <button class="ui-btn ui-btn-ghost" @click="keyword = ''; tagFilter = ''; statusFilter = 'all'">
        重置筛选
      </button>
    </div>

    <!-- 添加文章 modal -->
    <Teleport to="body">
      <div v-if="showAdd" class="ui-modal-mask" @click.self="showAdd = false">
        <form class="ui-modal" @submit.prevent="submitAdd">
          <h3 class="ui-modal-title">加入一篇文章</h3>
          <p class="ui-modal-desc">可以是任何 URL —— 博客内的、外部博客、官方文档等。</p>

          <div v-if="addErr" class="ui-alert error" style="margin-bottom:14px"><strong>错误·</strong> {{ addErr }}</div>

          <div class="ui-field">
            <label class="ui-field-label">标题 <em>*</em></label>
            <input v-model="addForm.title" class="ui-input" required placeholder="如:Vue 3 组合式 API 深度指南" />
          </div>
          <div class="ui-field">
            <label class="ui-field-label">URL <em>*</em></label>
            <input v-model="addForm.url" type="url" class="ui-input" required placeholder="https://..." />
          </div>
          <div class="ui-field">
            <label class="ui-field-label">摘要</label>
            <textarea v-model="addForm.excerpt" class="ui-textarea" rows="3" placeholder="一两句话概括内容" />
          </div>
          <div class="ui-field" style="display:grid;grid-template-columns:1fr 120px;gap:16px;">
            <div>
              <label class="ui-field-label">标签</label>
              <input v-model="addForm.tag" class="ui-input" placeholder="如:Vue / Java" />
            </div>
            <div>
              <label class="ui-field-label">时长 (min)</label>
              <input v-model.number="addForm.readTime" type="number" class="ui-input" min="1" max="120" />
            </div>
          </div>

          <div class="ui-modal-actions">
            <button type="button" class="ui-btn ui-btn-ghost" @click="showAdd = false">取消</button>
            <button type="submit" class="ui-btn ui-btn-primary">加入</button>
          </div>
        </form>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.view-library {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* 筛选条 */
.lib-filters {
  display: grid;
  gap: 14px;
}
.lib-search {
  position: relative;
}
.lib-search svg {
  position: absolute;
  left: 14px; top: 50%;
  transform: translateY(-50%);
  color: var(--ink-3);
  pointer-events: none;
}
.lib-search .ui-input {
  padding-left: 38px;
}
.lib-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.lib-tags .ui-chip {
  cursor: pointer;
  font-family: var(--font-display);
  font-size: 12px;
  letter-spacing: 0.01em;
}
.lib-controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.lib-controls .ui-select {
  width: auto;
  min-width: 160px;
  padding-top: 8px;
  padding-bottom: 8px;
}

/* 卡片网格 */
.lib-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
  gap: 16px;
}
.lib-card {
  position: relative;
  padding: 20px 22px 18px;
  border-radius: var(--radius);
  border: 1px solid var(--line-soft);
  background: linear-gradient(180deg, oklch(0.18 0.014 280 / 0.5), oklch(0.14 0.012 280 / 0.4));
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 220px;
  transition: border-color 0.4s, transform 0.4s var(--ease-out);
}
.lib-card:hover {
  border-color: var(--accent);
  transform: translateY(-3px);
}
.lib-card[data-status="done"] {
  border-color: oklch(0.78 0.18 160 / 0.4);
}

.lc-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 11px;
}
.lc-tag {
  padding: 3px 9px;
  border-radius: 999px;
  background: oklch(0.18 0.06 295 / 0.4);
  color: var(--accent);
  border: 1px solid var(--line-soft);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.lc-date { color: var(--ink-3); }
.lc-del {
  margin-left: auto;
  padding: 4px;
  border-radius: 6px;
  color: var(--ink-3);
  transition: color 0.3s, background 0.3s;
}
.lc-del:hover {
  color: var(--error);
  background: oklch(0.22 0.10 25 / 0.3);
}

.lc-title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 17px;
  line-height: 1.3;
  letter-spacing: -0.01em;
  margin: 0;
  color: var(--ink);
}
.lc-excerpt {
  font-size: 13.5px;
  color: var(--ink-2);
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.lc-foot {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 11px;
  margin-top: auto;
}
.lc-status {
  padding: 3px 9px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: oklch(0.10 0.012 280 / 0.5);
  color: var(--ink-2);
}
.lc-status[data-status="done"]    { color: var(--success); border-color: oklch(0.78 0.18 160 / 0.4); }
.lc-status[data-status="reading"] { color: var(--accent-2); border-color: oklch(0.78 0.18 220 / 0.4); }
.lc-time { color: var(--ink-3); }
.lc-spacer { flex: 1; }

.lc-icon-btn {
  width: 28px; height: 28px;
  border-radius: 6px;
  color: var(--ink-3);
  transition: color 0.3s, background 0.3s, transform 0.3s;
}
.lc-icon-btn:hover {
  color: var(--error);
  background: oklch(0.20 0.10 25 / 0.3);
  transform: scale(1.1);
}

.lc-open {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--ink);
  color: var(--bg-deep);
  font-size: 11px;
  font-weight: 500;
  transition: background 0.3s, transform 0.3s var(--ease-out);
}
.lc-open:hover {
  background: var(--accent);
  color: #fff;
  transform: translateX(2px);
}

.lc-prog {
  margin-top: 2px;
}
.lc-prog .ui-progress {
  height: 4px;
}
</style>
