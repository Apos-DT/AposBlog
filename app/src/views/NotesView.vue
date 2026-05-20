<script setup>
/**
 * 笔记 — 列表 + 搜索 + 标签筛选 + 排序 + 新建
 */
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notes'
import { useTagsStore } from '@/stores/tags'
import { usePostsStore } from '@/stores/posts'
import { useSettingsStore } from '@/stores/settings'

import IconBase from '@/components/IconBase.vue'

const router = useRouter()
const notes = useNotesStore()
const tags = useTagsStore()
const posts = usePostsStore()
const settings = useSettingsStore()

const keyword = ref('')
const tagFilter = ref('')

const filtered = computed(() =>
  notes.search({ keyword: keyword.value, tagId: tagFilter.value })
)

function createNew() {
  const n = notes.create({ title: '未命名笔记' })
  router.push(`/notes/${n.id}`)
}

function removeNote(id, title, e) {
  e.preventDefault()
  e.stopPropagation()
  if (!confirm(`确定删除「${title}」?\n此操作不可撤销`)) return
  notes.remove(id)
  settings.pushToast('success', '笔记已删除')
}

function togglePin(id, e) {
  e.preventDefault()
  e.stopPropagation()
  notes.togglePin(id)
  settings.pushToast('info', notes.findById(id).pinned ? '已置顶' : '已取消置顶')
}

function fmtDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}
</script>

<template>
  <section class="view-notes">
    <header class="ui-section-head">
      <div class="left">
        <span class="no">03 / Notes</span>
        <h2>笔记</h2>
        <p>共 {{ notes.stats.total }} 条 · 置顶 {{ notes.stats.pinned }} · 关联文章 {{ notes.stats.withArticle }}</p>
      </div>
      <button class="ui-btn ui-btn-accent" @click="createNew">
        <IconBase name="plus" :size="14" />
        <span>新建笔记</span>
      </button>
    </header>

    <section class="notes-filters">
      <div class="notes-search">
        <IconBase name="search" :size="14" />
        <input v-model="keyword" type="search" class="ui-input" placeholder="搜索标题与正文…" />
      </div>
      <div class="notes-tag-row">
        <button
          :class="['ui-chip', { 'is-active': tagFilter === '' }]"
          @click="tagFilter = ''"
        >全部</button>
        <button
          v-for="t in tags.all"
          :key="t.id"
          :class="['ui-chip', { 'is-active': tagFilter === t.id }]"
          :style="{ '--c': t.color }"
          @click="tagFilter = tagFilter === t.id ? '' : t.id"
        >
          <span class="dot"></span>{{ t.name }}
        </button>
      </div>
    </section>

    <section v-if="filtered.length" class="notes-grid">
      <RouterLink
        v-for="n in filtered"
        :key="n.id"
        :to="`/notes/${n.id}`"
        class="note-card"
      >
        <header class="nc-head">
          <button class="nc-pin" @click="togglePin(n.id, $event)" :title="n.pinned ? '取消置顶' : '置顶'">
            <IconBase name="pin" :size="14" />
          </button>
          <h3 class="nc-title" :title="n.title">{{ n.title }}</h3>
          <button class="nc-del" @click="removeNote(n.id, n.title, $event)" :title="'删除'">
            <IconBase name="trash" :size="13" />
          </button>
        </header>

        <p class="nc-body">{{ (n.content || '').slice(0, 180) || '(空内容)' }}{{ (n.content || '').length > 180 ? '…' : '' }}</p>

        <footer class="nc-foot">
          <span class="nc-tags">
            <span
              v-for="tid in (n.tagIds || []).slice(0, 3)"
              :key="tid"
              class="ui-chip"
              :style="{ '--c': tags.colorOf(tid) }"
            >
              <span class="dot"></span>{{ tags.nameOf(tid) }}
            </span>
          </span>
          <span class="nc-meta">
            <span v-if="n.articleSlug" class="article-link" :title="posts.findBySlug(n.articleSlug)?.title">
              <IconBase name="book" :size="12" /> {{ posts.findBySlug(n.articleSlug)?.tag || '关联' }}
            </span>
            <span class="nc-date">{{ fmtDate(n.updatedAt) }}</span>
          </span>
        </footer>
      </RouterLink>
    </section>

    <div v-else class="ui-empty">
      <span class="icon"><IconBase name="notes" :size="20" /></span>
      <h3>{{ keyword || tagFilter ? '没有符合条件的笔记' : '还没有笔记' }}</h3>
      <p>{{ keyword || tagFilter ? '试试换个关键词或清空筛选' : '点右上角"新建笔记"开始记录' }}</p>
      <button v-if="!keyword && !tagFilter" class="ui-btn ui-btn-primary" @click="createNew">
        新建第一条笔记 <IconBase name="arrow-right" :size="14" />
      </button>
      <button v-else class="ui-btn ui-btn-ghost" @click="keyword = ''; tagFilter = ''">
        重置筛选
      </button>
    </div>
  </section>
</template>

<style scoped>
.view-notes { display: flex; flex-direction: column; gap: 22px; }

.notes-filters { display: flex; flex-direction: column; gap: 12px; }
.notes-search { position: relative; }
.notes-search svg {
  position: absolute;
  left: 14px; top: 50%;
  transform: translateY(-50%);
  color: var(--ink-3);
  pointer-events: none;
}
.notes-search .ui-input { padding-left: 38px; }
.notes-tag-row { display: flex; flex-wrap: wrap; gap: 6px; }
.notes-tag-row .ui-chip { cursor: pointer; font-family: var(--font-display); font-size: 12px; }

/* 卡片网格 */
.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
  gap: 14px;
}
.note-card {
  display: flex;
  flex-direction: column;
  padding: 18px 20px;
  border-radius: var(--radius);
  border: 1px solid var(--line-soft);
  background: linear-gradient(180deg, oklch(0.22 0.014 280 / 0.5), oklch(0.17 0.014 280 / 0.4));
  min-height: 180px;
  transition: border-color 0.4s, transform 0.4s var(--ease-out);
}
.note-card:hover {
  border-color: var(--accent);
  transform: translateY(-3px);
}

.nc-head {
  display: grid;
  grid-template-columns: 24px 1fr 24px;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
}
.nc-pin, .nc-del {
  padding: 4px;
  border-radius: 6px;
  color: var(--ink-3);
  transition: color 0.3s, background 0.3s, transform 0.3s var(--ease-out);
}
.nc-pin:hover { color: var(--accent-warm); background: oklch(0.20 0.10 60 / 0.3); transform: rotate(-15deg); }
.nc-del:hover { color: var(--error); background: oklch(0.20 0.10 25 / 0.3); transform: rotate(15deg); }

.note-card:has(.nc-pin):hover .nc-pin {
  /* idle: dim */
}

/* pinned 状态: 标题旁边显示 pin 高亮 */
/* 由父 a 上的 class 不便,这里直接基于 store 给图标本身 */

.nc-title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 15px;
  margin: 0;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nc-body {
  font-size: 13px;
  line-height: 1.65;
  color: var(--ink-2);
  margin: 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-wrap;
}

.nc-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--line-soft);
}
.nc-tags { display: flex; flex-wrap: wrap; gap: 4px; min-width: 0; }
.nc-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--ink-3);
}
.article-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--accent-2);
}
.nc-date { color: var(--ink-3); }
</style>
