<script setup>
/**
 * 笔记编辑器 — 标题 + 标签 + 关联文章 + Markdown 正文
 * 支持 /notes/new 创建新笔记
 */
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notes'
import { useTagsStore } from '@/stores/tags'
import { usePostsStore } from '@/stores/posts'
import { useSettingsStore } from '@/stores/settings'

import IconBase from '@/components/IconBase.vue'

const route = useRoute()
const router = useRouter()
const notes = useNotesStore()
const tags = useTagsStore()
const posts = usePostsStore()
const settings = useSettingsStore()

// 创建模式:/notes/new
const isNew = computed(() => route.params.id === 'new')
const noteId = ref(null)

const form = ref({
  title: '',
  content: '',
  articleSlug: null,
  tagIds: [],
  pinned: false,
})

const previewMode = ref(false)
const dirty = ref(false)

function loadNote() {
  if (isNew.value) {
    // 新建一条空笔记并跳到带 id 的路径
    const n = notes.create({ title: '未命名笔记' })
    router.replace(`/notes/${n.id}`)
    return
  }
  const n = notes.findById(route.params.id)
  if (!n) {
    settings.pushToast('error', '笔记不存在,跳回列表')
    router.replace('/notes')
    return
  }
  noteId.value = n.id
  form.value = {
    title: n.title,
    content: n.content,
    articleSlug: n.articleSlug || null,
    tagIds: [...(n.tagIds || [])],
    pinned: !!n.pinned,
  }
  dirty.value = false
}

watch(() => route.params.id, loadNote, { immediate: true })

// 自动保存(debounce 600ms)
let saveTimer = 0
watch(
  () => form.value,
  () => {
    dirty.value = true
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      if (!noteId.value) return
      notes.update(noteId.value, form.value)
      dirty.value = false
    }, 600)
  },
  { deep: true }
)

function toggleTag(tid) {
  const i = form.value.tagIds.indexOf(tid)
  if (i >= 0) form.value.tagIds.splice(i, 1)
  else form.value.tagIds.push(tid)
}

function removeNote() {
  if (!confirm(`确定删除「${form.value.title}」?`)) return
  notes.remove(noteId.value)
  settings.pushToast('success', '已删除')
  router.push('/notes')
}

function back() {
  // 保存最新
  if (noteId.value) notes.update(noteId.value, form.value)
  router.push('/notes')
}

// 极简 markdown 预览
const rendered = computed(() => simpleMarkdown(form.value.content || ''))

function simpleMarkdown(md) {
  if (!md) return ''
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
  const lines = md.split('\n')
  const out = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (/^```/.test(line)) {
      const buf = []
      i++
      while (i < lines.length && !/^```/.test(lines[i])) {
        buf.push(lines[i])
        i++
      }
      i++
      out.push(`<pre><code>${esc(buf.join('\n'))}</code></pre>`)
      continue
    }
    const h = line.match(/^(#{1,3})\s+(.*)$/)
    if (h) {
      out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`)
      i++
      continue
    }
    if (/^>\s?/.test(line)) {
      const buf = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      out.push(`<blockquote>${inline(buf.join(' '))}</blockquote>`)
      continue
    }
    if (/^\s*[-*]\s/.test(line)) {
      const buf = []
      while (i < lines.length && /^\s*[-*]\s/.test(lines[i])) {
        buf.push(`<li>${inline(lines[i].replace(/^\s*[-*]\s+/, ''))}</li>`)
        i++
      }
      out.push(`<ul>${buf.join('')}</ul>`)
      continue
    }
    if (/^\s*$/.test(line)) { i++; continue }
    const buf = [line]
    i++
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,3}\s|```|>|\s*[-*]\s)/.test(lines[i])) {
      buf.push(lines[i]); i++
    }
    out.push(`<p>${inline(buf.join(' '))}</p>`)
  }
  return out.join('\n')

  function inline(s) {
    s = esc(s)
    s = s.replace(/`([^`]+?)`/g, (_, c) => `<code>${c}</code>`)
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    return s
  }
}

onBeforeUnmount(() => {
  if (saveTimer) clearTimeout(saveTimer)
  if (noteId.value && dirty.value) notes.update(noteId.value, form.value)
})
</script>

<template>
  <section class="view-note-edit" v-if="noteId">
    <header class="ne-head">
      <button class="ui-btn ui-btn-ghost ui-btn-sm" @click="back">
        <IconBase name="arrow-left" :size="14" />
        <span>返回笔记列表</span>
      </button>

      <div class="ne-head-actions">
        <span class="ne-saved" v-if="!dirty">✓ 已自动保存</span>
        <span class="ne-saving" v-else>保存中…</span>

        <button class="ui-btn ui-btn-ghost ui-btn-sm" @click="previewMode = !previewMode">
          <IconBase :name="previewMode ? 'edit' : 'eye'" :size="14" />
          <span>{{ previewMode ? '编辑' : '预览' }}</span>
        </button>

        <button class="ui-btn ui-btn-ghost ui-btn-sm" :class="{ active: form.pinned }" @click="form.pinned = !form.pinned">
          <IconBase name="pin" :size="14" />
          <span>{{ form.pinned ? '已置顶' : '置顶' }}</span>
        </button>

        <button class="ui-btn ui-btn-danger ui-btn-sm" @click="removeNote">
          <IconBase name="trash" :size="14" />
          <span>删除</span>
        </button>
      </div>
    </header>

    <input
      v-model="form.title"
      class="ne-title-input"
      placeholder="笔记标题…"
      maxlength="120"
    />

    <div class="ne-meta">
      <div class="ne-field">
        <span class="ne-field-label">标签</span>
        <div class="ne-tag-row">
          <button
            v-for="t in tags.all"
            :key="t.id"
            type="button"
            :class="['ui-chip', { 'is-active': form.tagIds.includes(t.id) }]"
            :style="{ '--c': t.color }"
            @click="toggleTag(t.id)"
          >
            <span class="dot"></span>{{ t.name }}
          </button>
          <RouterLink to="/tags" class="ui-chip" style="opacity:0.7">
            <IconBase name="plus" :size="11" /> 管理标签
          </RouterLink>
        </div>
      </div>

      <div class="ne-field">
        <span class="ne-field-label">关联文章</span>
        <select v-model="form.articleSlug" class="ui-select">
          <option :value="null">— 无 —</option>
          <option v-for="p in posts.sorted" :key="p.slug" :value="p.slug">
            {{ p.title }}
          </option>
        </select>
      </div>
    </div>

    <!-- 编辑 / 预览 -->
    <div class="ne-body">
      <textarea
        v-if="!previewMode"
        v-model="form.content"
        class="ne-textarea"
        placeholder="支持 markdown 语法 — # 标题 / **粗体** / `代码` / > 引用 / - 列表"
      ></textarea>

      <div v-else class="ne-preview" v-html="rendered"></div>
    </div>

    <p class="ne-tip">
      <IconBase name="check" :size="12" />
      自动保存到本地 localStorage · 字数 {{ form.content.length }}
    </p>
  </section>
</template>

<style scoped>
.view-note-edit {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ne-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.ne-head-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.ne-saved, .ne-saving {
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.04em;
}
.ne-saved { color: var(--success); }
.ne-saving { color: var(--accent-2); }

.ne-title-input {
  width: 100%;
  background: transparent;
  border: 0;
  outline: 0;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(24px, 3vw, 36px);
  letter-spacing: -0.02em;
  color: var(--ink);
  padding: 8px 0;
  border-bottom: 1px solid var(--line-soft);
  transition: border-color 0.3s;
}
.ne-title-input::placeholder { color: var(--ink-3); }
.ne-title-input:focus { border-bottom-color: var(--accent); }

.ne-meta {
  display: grid;
  grid-template-columns: 1fr 240px;
  gap: 16px;
}
@media (max-width: 720px) {
  .ne-meta { grid-template-columns: 1fr; }
}
.ne-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ne-field-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.ne-tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.ne-tag-row .ui-chip {
  cursor: pointer;
  font-family: var(--font-display);
  font-size: 12px;
}

/* body */
.ne-body {
  border-radius: var(--radius);
  border: 1px solid var(--line-soft);
  background: oklch(0.13 0.014 280 / 0.55);
  overflow: hidden;
}
.ne-textarea {
  width: 100%;
  min-height: 380px;
  padding: 20px;
  background: transparent;
  border: 0;
  outline: 0;
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.75;
  color: var(--ink);
  resize: vertical;
}
.ne-textarea::placeholder { color: var(--ink-3); }

.ne-preview {
  min-height: 380px;
  padding: 22px 24px;
  font-size: 14.5px;
  line-height: 1.8;
  color: var(--ink-2);
}
.ne-preview :deep(h1),
.ne-preview :deep(h2),
.ne-preview :deep(h3) {
  font-family: var(--font-display);
  color: var(--ink);
  margin: 1.4em 0 0.5em;
  line-height: 1.25;
}
.ne-preview :deep(h1) { font-size: 22px; }
.ne-preview :deep(h2) { font-size: 18px; }
.ne-preview :deep(h3) { font-size: 15px; }
.ne-preview :deep(p) { margin: 0 0 1em; }
.ne-preview :deep(blockquote) {
  margin: 1em 0;
  padding: 4px 0 4px 14px;
  border-left: 2px solid var(--accent);
  color: var(--ink-2);
  font-family: var(--font-serif);
  font-style: italic;
}
.ne-preview :deep(code) {
  font-family: var(--font-mono);
  font-size: 12.5px;
  padding: 1px 5px;
  border-radius: 3px;
  background: oklch(0.22 0.014 280 / 0.6);
  color: var(--accent-2);
  border: 1px solid var(--line-soft);
}
.ne-preview :deep(pre) {
  background: var(--bg-deep);
  border: 1px solid var(--line-soft);
  border-radius: 10px;
  padding: 14px 18px;
  margin: 1em 0;
  overflow-x: auto;
}
.ne-preview :deep(pre code) {
  background: transparent;
  border: 0;
  padding: 0;
  color: var(--ink);
}
.ne-preview :deep(ul) { padding-left: 1.2em; }
.ne-preview :deep(li) { margin: 0.3em 0; }
.ne-preview :deep(a) { color: var(--accent); border-bottom: 1px solid var(--line); }

.ne-tip {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink-3);
  display: flex;
  align-items: center;
  gap: 6px;
}
.ne-tip svg { color: var(--success); }

.ui-btn.active {
  color: var(--accent);
  border-color: var(--accent);
}
</style>
