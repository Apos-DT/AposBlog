<script setup>
/**
 * 文章库 — 列表 + 搜索 + 标签筛选 + 排序
 * 管理员登录后可写 / 编辑 / 删除站内文章（带 markdown 正文）
 */
import { ref, computed, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { useReadsStore } from '@/stores/reads'
import { useSettingsStore } from '@/stores/settings'
import { useAdminStore } from '@/stores/admin'

import IconBase from '@/components/IconBase.vue'

const route = useRoute()
const posts = usePostsStore()
const reads = useReadsStore()
const settings = useSettingsStore()
const admin = useAdminStore()

const keyword = ref(route.query.q || '')
const tagFilter = ref('')
const statusFilter = ref('all') // all | unread | reading | done | collected
const sort = ref('date-desc')

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
      list = [...list].sort((a, b) => (a.date || '').localeCompare(b.date || ''))
      break
    case 'read-time':
      list = [...list].sort((a, b) => (a.readTime || 0) - (b.readTime || 0))
      break
    case 'rating-desc':
      list = [...list].sort((a, b) => (reads.get(b.slug)?.rating || 0) - (reads.get(a.slug)?.rating || 0))
      break
    case 'date-desc':
    default:
      list = [...list].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  }
  return list
})

// ===== 文章编辑器（新增 / 编辑，仅管理员）=====
const showEditor = ref(false)
const editingSlug = ref(null)
const busy = ref(false)
const form = ref({ slug: '', title: '', excerpt: '', tag: '', readTime: 5, content: '' })
const formErr = ref('')

function openAdd() {
  editingSlug.value = null
  form.value = { slug: '', title: '', excerpt: '', tag: '', readTime: 5, content: '' }
  formErr.value = ''
  showEditor.value = true
}

async function openEdit(p) {
  editingSlug.value = p.slug
  formErr.value = ''
  busy.value = true
  showEditor.value = true
  form.value = { slug: p.slug, title: p.title, excerpt: p.excerpt || '', tag: p.tag || '', readTime: parseInt(p.readTime, 10) || 5, content: '' }
  try {
    const full = await posts.fetchPost(p.slug)
    form.value.content = full.content || ''
  } catch (e) {
    formErr.value = '加载正文失败：' + (e.message || '')
  } finally {
    busy.value = false
  }
}

async function submitEditor() {
  formErr.value = ''
  if (!form.value.title.trim()) {
    formErr.value = '请填写标题'
    return
  }
  busy.value = true
  try {
    const payload = {
      title: form.value.title.trim(),
      excerpt: form.value.excerpt,
      tag: form.value.tag || 'Note',
      readTime: parseInt(form.value.readTime, 10) || 5,
      content: form.value.content,
    }
    if (editingSlug.value) {
      await posts.update(editingSlug.value, payload)
      settings.pushToast('success', '文章已更新')
    } else {
      if (form.value.slug.trim()) payload.slug = form.value.slug.trim()
      await posts.add(payload)
      settings.pushToast('success', '文章已发布')
    }
    showEditor.value = false
  } catch (e) {
    formErr.value = e.status === 401 ? '管理员登录已失效，请到「设置」重新登录' : (e.message || '保存失败')
  } finally {
    busy.value = false
  }
}

async function removePost(slug, title) {
  if (!confirm(`确定删除「${title}」？此操作不可撤销。`)) return
  try {
    await posts.remove(slug)
    settings.pushToast('success', '已删除文章')
  } catch (e) {
    settings.pushToast('error', e.status === 401 ? '管理员登录已失效' : (e.message || '删除失败'))
  }
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
    <!-- 顶部:标题 + 写文章按钮(管理员) -->
    <header class="ui-section-head">
      <div class="left">
        <span class="no">02 / Library</span>
        <h2>文章</h2>
        <p>共 {{ posts.posts.length }} 篇 · {{ filtered.length }} 篇符合当前筛选 ·
          已读 {{ reads.stats.done }} 收藏 {{ reads.stats.collected }}</p>
      </div>
      <button v-if="admin.isAdmin" class="ui-btn ui-btn-accent" @click="openAdd">
        <IconBase name="plus" :size="14" />
        <span>写文章</span>
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
          <span v-if="admin.isAdmin" class="lc-admin">
            <button class="lc-act" title="编辑" @click.prevent="openEdit(p)">
              <IconBase name="edit" :size="13" />
            </button>
            <button class="lc-act lc-act-danger" title="删除" @click.prevent="removePost(p.slug, p.title)">
              <IconBase name="trash" :size="13" />
            </button>
          </span>
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
          <RouterLink :to="`/post/${p.slug}`" class="lc-open">
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

    <!-- 文章编辑器 modal -->
    <Teleport to="body">
      <div v-if="showEditor" class="ui-modal-mask" @click.self="showEditor = false">
        <form class="ui-modal ui-modal-wide" @submit.prevent="submitEditor">
          <h3 class="ui-modal-title">{{ editingSlug ? '编辑文章' : '写一篇文章' }}</h3>
          <p class="ui-modal-desc">正文支持 Markdown（标题 # / 列表 - / 代码块 ``` / 引用 &gt; 等）。</p>

          <div v-if="formErr" class="ui-alert error" style="margin-bottom:14px"><strong>错误·</strong> {{ formErr }}</div>

          <div class="ui-field">
            <label class="ui-field-label">标题 <em>*</em></label>
            <input v-model="form.title" class="ui-input" required placeholder="如:在 Odoo 里做制造业 ERP 二开" />
          </div>

          <div class="ed-grid">
            <div class="ui-field">
              <label class="ui-field-label">标签</label>
              <input v-model="form.tag" class="ui-input" placeholder="如:ERP / Vue / Data" />
            </div>
            <div class="ui-field">
              <label class="ui-field-label">时长 (min)</label>
              <input v-model.number="form.readTime" type="number" class="ui-input" min="1" max="120" />
            </div>
            <div v-if="!editingSlug" class="ui-field">
              <label class="ui-field-label">Slug (选填)</label>
              <input v-model="form.slug" class="ui-input" placeholder="留空自动生成" />
            </div>
          </div>

          <div class="ui-field">
            <label class="ui-field-label">摘要</label>
            <textarea v-model="form.excerpt" class="ui-textarea" rows="2" placeholder="一两句话概括内容" />
          </div>

          <div class="ui-field">
            <label class="ui-field-label">正文 (Markdown)</label>
            <textarea v-model="form.content" class="ui-textarea ed-content" rows="12" placeholder="# 开始写...\n\n正文支持 Markdown。" />
          </div>

          <div class="ui-modal-actions">
            <button type="button" class="ui-btn ui-btn-ghost" @click="showEditor = false">取消</button>
            <button type="submit" class="ui-btn ui-btn-primary" :disabled="busy">
              {{ busy ? '保存中…' : (editingSlug ? '保存修改' : '发布') }}
            </button>
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
  background: linear-gradient(180deg, oklch(0.87 0.010 280 / 0.5), oklch(0.93 0.008 280 / 0.4));
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
  border-color: oklch(0.55 0.16 160 / 0.4);
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
  background: oklch(0.92 0.05 295 / 0.4);
  color: var(--accent);
  border: 1px solid var(--line-soft);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.lc-date { color: var(--ink-3); }
.lc-admin {
  margin-left: auto;
  display: flex;
  gap: 4px;
}
.lc-act {
  padding: 4px;
  border-radius: 6px;
  color: var(--ink-3);
  transition: color 0.3s, background 0.3s;
}
.lc-act:hover {
  color: var(--accent);
  background: oklch(0.92 0.05 295 / 0.3);
}
.lc-act-danger:hover {
  color: var(--error);
  background: oklch(0.90 0.06 25 / 0.3);
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
  background: oklch(0.97 0.005 280 / 0.5);
  color: var(--ink-2);
}
.lc-status[data-status="done"]    { color: var(--success); border-color: oklch(0.55 0.16 160 / 0.4); }
.lc-status[data-status="reading"] { color: var(--accent-2); border-color: oklch(0.55 0.18 220 / 0.4); }
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
  background: oklch(0.92 0.06 25 / 0.3);
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

/* 编辑器 */
.ed-grid {
  display: grid;
  grid-template-columns: 1fr 120px 1fr;
  gap: 14px;
}
@media (max-width: 640px) {
  .ed-grid { grid-template-columns: 1fr; }
}
.ed-content {
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
}
</style>
