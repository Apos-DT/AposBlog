<script setup>
/**
 * 笔记编辑器 — Karpathy 风格知识库版
 * --------------------------------------------------
 *   - 新建时弹出 Karpathy 模板选择(复盘 / 速查 / 概念 / 读书 / 问题 / 周记 / 空白)
 *   - frontmatter 自动剥离,头部独立编辑(YAML 字段)
 *   - 编辑器 textarea 监听 [[ 触发笔记标题补全
 *   - 实时双向链接渲染([[xxx]] / #tag / admonition)
 *   - 显示 outLinks / backlinks / missing links 三组关联
 *   - 自动保存到 store
 */
import { ref, computed, watch, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useNotesStore } from '@/stores/notes'
import { useTagsStore } from '@/stores/tags'
import { usePostsStore } from '@/stores/posts'
import { useSettingsStore } from '@/stores/settings'

import IconBase from '@/components/IconBase.vue'
import { render as renderMd, parseFrontmatter, stringifyFrontmatter } from '@/utils/markdown'
import { NOTE_TEMPLATES } from '@/utils/templates'

const route = useRoute()
const router = useRouter()
const notes = useNotesStore()
const tags = useTagsStore()
const posts = usePostsStore()
const settings = useSettingsStore()

const noteId = ref(null)

// ===== 表单 =====
const form = ref({
  title: '',
  content: '',      // 完整 markdown,含 frontmatter
  body: '',         // 剥离 frontmatter 后的正文(用于编辑器 textarea)
  meta: {},         // frontmatter 解析结果
  articleSlug: null,
  tagIds: [],
  pinned: false,
})

const previewMode = ref(false)
const showMetaPanel = ref(true)
const dirty = ref(false)

// ===== 模板选择(新建时) =====
const showTemplatePicker = ref(false)

// ===== [[wiki link]] 补全 =====
const textareaEl = ref(null)
const completionState = ref({
  open: false,
  query: '',
  pos: 0,
  candidates: [],
  selectedIdx: 0,
  rect: null,
})

// ===== 路由分发:/notes/new 或 /notes/:id =====
function loadFromRoute() {
  if (route.params.id === 'new') {
    // 显示模板选择,真正创建延后
    showTemplatePicker.value = true
    return
  }
  const n = notes.findById(route.params.id)
  if (!n) {
    settings.pushToast('error', '笔记不存在,跳回列表')
    router.replace('/notes')
    return
  }
  loadNote(n)
}

function loadNote(n) {
  noteId.value = n.id
  const parsed = parseFrontmatter(n.content || '')
  form.value = {
    title: n.title,
    content: n.content,
    body: parsed.body,
    meta: parsed.meta,
    articleSlug: n.articleSlug || null,
    tagIds: [...(n.tagIds || [])],
    pinned: !!n.pinned,
  }
  dirty.value = false
}

watch(() => route.params.id, loadFromRoute, { immediate: true })

// ===== 模板创建 =====
function pickTemplate(tpl) {
  const data = tpl.build({
    articleTitle: '',
  })
  const n = notes.create(data)
  showTemplatePicker.value = false
  router.replace(`/notes/${n.id}`)
}

function cancelTemplate() {
  showTemplatePicker.value = false
  router.replace('/notes')
}

// ===== 自动保存 =====
let saveTimer = 0

watch(
  () => [form.value.title, form.value.body, form.value.meta, form.value.articleSlug, form.value.tagIds, form.value.pinned],
  () => {
    if (!noteId.value) return
    dirty.value = true
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => doSave(), 600)
  },
  { deep: true }
)

function doSave() {
  if (!noteId.value) return
  // 组合 meta + body 写回 content
  const content = stringifyFrontmatter(form.value.meta, form.value.body)
  notes.update(noteId.value, {
    title: form.value.title,
    content,
    articleSlug: form.value.articleSlug,
    tagIds: form.value.tagIds,
    pinned: form.value.pinned,
  })
  form.value.content = content
  dirty.value = false
}

// ===== frontmatter UI 操作 =====
const metaKeys = computed(() => Object.keys(form.value.meta || {}))

function updateMetaKey(oldKey, newKey) {
  if (!newKey || newKey === oldKey) return
  const v = form.value.meta[oldKey]
  const nm = { ...form.value.meta }
  delete nm[oldKey]
  nm[newKey] = v
  form.value.meta = nm
}

function updateMetaValue(key, val) {
  form.value.meta = { ...form.value.meta, [key]: val }
}

function removeMetaKey(key) {
  const nm = { ...form.value.meta }
  delete nm[key]
  form.value.meta = nm
}

function addMetaField() {
  let i = 1
  let k = 'field'
  while (form.value.meta[k]) k = `field${++i}`
  form.value.meta = { ...form.value.meta, [k]: '' }
}

// ===== 渲染预览(支持 wiki link 点击) =====
const rendered = computed(() =>
  renderMd(stringifyFrontmatter(form.value.meta, form.value.body), {
    onLink: ({ type, target, label }) => {
      if (type === 'wiki') {
        const found = notes.findByTitle(target)
        if (found) return `#/notes/${found.id}`
        return null // missing → 渲染成红色
      }
      if (type === 'tag') {
        return `#/notes?tag=${encodeURIComponent(target)}`
      }
      return null
    },
  })
)

// ===== [[wiki]] 补全检测 =====
function onTextareaInput(e) {
  const el = e.target
  const pos = el.selectionStart
  const before = el.value.slice(0, pos)
  // 匹配最近的未闭合 [[
  const m = before.match(/\[\[([^\]\n]*)$/)
  if (!m) {
    completionState.value.open = false
    return
  }
  const query = m[1].toLowerCase()
  const candidates = notes.notes
    .filter((n) => n.id !== noteId.value)
    .filter((n) => (n.title || '').toLowerCase().includes(query))
    .slice(0, 8)
  completionState.value = {
    open: candidates.length > 0,
    query,
    pos,
    candidates,
    selectedIdx: 0,
    rect: el.getBoundingClientRect(),
  }
}

function onTextareaKeydown(e) {
  if (!completionState.value.open) return
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    completionState.value.selectedIdx =
      (completionState.value.selectedIdx + 1) % completionState.value.candidates.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    completionState.value.selectedIdx =
      (completionState.value.selectedIdx - 1 + completionState.value.candidates.length) %
      completionState.value.candidates.length
  } else if (e.key === 'Enter' || e.key === 'Tab') {
    e.preventDefault()
    insertCompletion(completionState.value.candidates[completionState.value.selectedIdx])
  } else if (e.key === 'Escape') {
    completionState.value.open = false
  }
}

function insertCompletion(note) {
  if (!note || !textareaEl.value) return
  const el = textareaEl.value
  const before = el.value.slice(0, completionState.value.pos)
  const after = el.value.slice(completionState.value.pos)
  // 替换 before 末尾的 [[query
  const newBefore = before.replace(/\[\[[^\]\n]*$/, `[[${note.title}]]`)
  form.value.body = newBefore + after
  completionState.value.open = false
  nextTick(() => {
    el.focus()
    const newPos = newBefore.length
    el.setSelectionRange(newPos, newPos)
  })
}

// ===== outLinks / backlinks / missing =====
const outLinks = computed(() => (noteId.value ? notes.getOutLinks(noteId.value) : []))
const backlinks = computed(() => (noteId.value ? notes.getBacklinks(noteId.value) : []))
const missingLinks = computed(() => (noteId.value ? notes.getMissingLinks(noteId.value) : []))

function createMissingNote(title) {
  const n = notes.create({
    title,
    content: `---\ntype: stub\ndate: ${new Date().toISOString().slice(0, 10)}\n---\n\n# ${title}\n\n> 这篇笔记是从 [[${form.value.title}]] 链接而来的占位。\n`,
  })
  router.push(`/notes/${n.id}`)
}

// ===== tag 操作 =====
function toggleTag(tid) {
  const i = form.value.tagIds.indexOf(tid)
  if (i >= 0) form.value.tagIds.splice(i, 1)
  else form.value.tagIds.push(tid)
}

// ===== 顶部操作 =====
function removeNote() {
  if (!confirm(`确定删除「${form.value.title}」?`)) return
  notes.remove(noteId.value)
  settings.pushToast('success', '已删除')
  router.push('/notes')
}

function back() {
  if (noteId.value) doSave()
  router.push('/notes')
}

function insertWikiLink() {
  const el = textareaEl.value
  if (!el) return
  const pos = el.selectionStart
  const before = form.value.body.slice(0, pos)
  const after = form.value.body.slice(pos)
  form.value.body = before + '[[' + after
  nextTick(() => {
    el.focus()
    el.setSelectionRange(pos + 2, pos + 2)
    // 触发补全
    onTextareaInput({ target: el })
  })
}

function insertAdmonition(type) {
  const el = textareaEl.value
  if (!el) return
  const pos = el.selectionStart
  const before = form.value.body.slice(0, pos)
  const after = form.value.body.slice(pos)
  const prefix = before.endsWith('\n') || before === '' ? '' : '\n'
  const snip = `${prefix}> [!${type}] `
  form.value.body = before + snip + after
  nextTick(() => {
    el.focus()
    const np = pos + snip.length
    el.setSelectionRange(np, np)
  })
}

onBeforeUnmount(() => {
  if (saveTimer) clearTimeout(saveTimer)
  if (noteId.value && dirty.value) doSave()
})
</script>

<template>
  <!-- 模板选择模态 -->
  <Teleport to="body">
    <div v-if="showTemplatePicker" class="ui-modal-mask" @click.self="cancelTemplate">
      <div class="ui-modal" style="max-width: 640px">
        <h3 class="ui-modal-title">选择笔记模板</h3>
        <p class="ui-modal-desc">Karpathy 风格 —— frontmatter + 编号节 + 速查条目。挑一个开始,可以随时改。</p>

        <div class="tpl-grid">
          <button
            v-for="tpl in NOTE_TEMPLATES"
            :key="tpl.id"
            class="tpl-card"
            @click="pickTemplate(tpl)"
          >
            <IconBase :name="tpl.icon" :size="20" />
            <strong>{{ tpl.name }}</strong>
            <span>{{ tpl.desc }}</span>
          </button>
        </div>

        <div class="ui-modal-actions">
          <button class="ui-btn ui-btn-ghost" @click="cancelTemplate">取消</button>
        </div>
      </div>
    </div>
  </Teleport>

  <section v-if="noteId" class="view-note-edit">
    <header class="ne-head">
      <button class="ui-btn ui-btn-ghost ui-btn-sm" @click="back">
        <IconBase name="arrow-left" :size="14" />
        <span>返回笔记列表</span>
      </button>

      <div class="ne-head-actions">
        <span class="ne-saved" v-if="!dirty">✓ 已自动保存</span>
        <span class="ne-saving" v-else>保存中…</span>

        <button class="ui-btn ui-btn-ghost ui-btn-sm" @click="showMetaPanel = !showMetaPanel">
          <IconBase name="sliders" :size="14" />
          <span>{{ showMetaPanel ? '收起元信息' : '展开元信息' }}</span>
        </button>

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

    <!-- frontmatter 折叠面板 -->
    <details class="ne-meta-panel" :open="showMetaPanel" @toggle="showMetaPanel = $event.target.open">
      <summary>
        <IconBase name="sliders" :size="13" />
        <span>frontmatter · {{ metaKeys.length }} 个字段</span>
      </summary>
      <div class="ne-meta-grid">
        <div v-for="key in metaKeys" :key="key" class="ne-meta-row">
          <input
            class="ne-meta-key"
            :value="key"
            @change="updateMetaKey(key, $event.target.value)"
          />
          <input
            class="ne-meta-val"
            :value="Array.isArray(form.meta[key]) ? form.meta[key].join(', ') : form.meta[key]"
            @input="updateMetaValue(key, $event.target.value)"
            placeholder="值(数组用逗号分隔)"
          />
          <button class="ne-meta-del" @click="removeMetaKey(key)" :title="'移除 ' + key">
            <IconBase name="close" :size="12" />
          </button>
        </div>
        <button class="ne-meta-add" @click="addMetaField">
          <IconBase name="plus" :size="12" />
          <span>添加字段</span>
        </button>
      </div>
    </details>

    <!-- tags + article -->
    <div class="ne-row">
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
            <IconBase name="plus" :size="11" /> 管理
          </RouterLink>
        </div>
      </div>

      <div class="ne-field" style="min-width: 200px">
        <span class="ne-field-label">关联文章</span>
        <select v-model="form.articleSlug" class="ui-select">
          <option :value="null">— 无 —</option>
          <option v-for="p in posts.sorted" :key="p.slug" :value="p.slug">
            {{ p.title }}
          </option>
        </select>
      </div>
    </div>

    <!-- 工具栏(快捷插入) -->
    <div class="ne-toolbar" v-if="!previewMode">
      <button class="ne-tool" @click="insertWikiLink" title="插入 [[wiki-link]]">
        <IconBase name="link" :size="13" /> [[link]]
      </button>
      <button class="ne-tool" @click="insertAdmonition('INFO')">[!INFO]</button>
      <button class="ne-tool" @click="insertAdmonition('TIP')">[!TIP]</button>
      <button class="ne-tool" @click="insertAdmonition('WARNING')">[!WARNING]</button>
      <button class="ne-tool" @click="insertAdmonition('NOTE')">[!NOTE]</button>
      <button class="ne-tool" @click="insertAdmonition('ERROR')">[!ERROR]</button>
    </div>

    <!-- 编辑器 / 预览 -->
    <div class="ne-body">
      <div v-if="!previewMode" class="ne-textarea-wrap">
        <textarea
          ref="textareaEl"
          v-model="form.body"
          class="ne-textarea"
          placeholder="支持 markdown + Karpathy 风:
# 标题  **粗体**  `code`  > 引用
- 列表  1. 有序  --- 分隔线
[[note-title]] 双向链接(输入 [[ 触发补全)
#tag 内联标签
> [!INFO] 提示卡片"
          @input="onTextareaInput"
          @keydown="onTextareaKeydown"
          spellcheck="false"
        ></textarea>

        <!-- wiki 补全弹窗 -->
        <div
          v-if="completionState.open"
          class="ne-completion"
        >
          <div class="ne-comp-head">
            <IconBase name="search" :size="11" />
            <span>笔记标题补全 · 「{{ completionState.query }}」</span>
          </div>
          <ul data-lenis-prevent>
            <li
              v-for="(c, i) in completionState.candidates"
              :key="c.id"
              :class="{ active: i === completionState.selectedIdx }"
              @mousedown.prevent="insertCompletion(c)"
            >
              <strong>{{ c.title }}</strong>
              <span>{{ (c.content || '').replace(/^---[\s\S]*?---\n?/, '').slice(0, 40) }}…</span>
            </li>
          </ul>
          <div class="ne-comp-foot">↑↓ 选择 · Enter 插入 · Esc 关闭</div>
        </div>
      </div>

      <div v-else class="ne-preview md" v-html="rendered"></div>
    </div>

    <!-- 关联(outLinks / backlinks / missing) -->
    <section class="ne-relations">
      <div class="rel-group">
        <h4>
          <IconBase name="arrow-right" :size="14" />
          <span>引用了 ({{ outLinks.length }})</span>
        </h4>
        <div v-if="outLinks.length" class="rel-list">
          <RouterLink v-for="n in outLinks" :key="n.id" :to="`/notes/${n.id}`" class="rel-item">
            <strong>{{ n.title }}</strong>
          </RouterLink>
        </div>
        <p v-else class="rel-empty">这篇笔记里没有 <code>[[wiki-link]]</code>。</p>
      </div>

      <div class="rel-group">
        <h4>
          <IconBase name="arrow-left" :size="14" />
          <span>被引用 ({{ backlinks.length }})</span>
        </h4>
        <div v-if="backlinks.length" class="rel-list">
          <RouterLink v-for="n in backlinks" :key="n.id" :to="`/notes/${n.id}`" class="rel-item">
            <strong>{{ n.title }}</strong>
          </RouterLink>
        </div>
        <p v-else class="rel-empty">还没有别的笔记引用它。试着在别处写 <code>[[{{ form.title }}]]</code>。</p>
      </div>

      <div v-if="missingLinks.length" class="rel-group">
        <h4>
          <IconBase name="plus" :size="14" />
          <span>占位(未创建) ({{ missingLinks.length }})</span>
        </h4>
        <div class="rel-list">
          <button
            v-for="t in missingLinks"
            :key="t"
            class="rel-item missing"
            @click="createMissingNote(t)"
            :title="'创建 ' + t"
          >
            <strong>{{ t }}</strong>
            <span>+ 创建</span>
          </button>
        </div>
      </div>
    </section>

    <p class="ne-tip">
      <IconBase name="check" :size="12" />
      字数 {{ form.body.length }} · 引用 {{ outLinks.length }} · 被引 {{ backlinks.length }}
    </p>
  </section>
</template>

<style scoped>
.view-note-edit {
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
}

/* 模板选择 grid */
.tpl-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(180px, 100%), 1fr));
  gap: 10px;
  margin: 4px 0 8px;
}
.tpl-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 14px 12px;
  border-radius: 12px;
  border: 1px solid var(--line-soft);
  background: oklch(0.90 0.010 280 / 0.5);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.3s, background 0.3s, transform 0.3s var(--ease-out);
}
.tpl-card:hover {
  border-color: var(--accent);
  background: oklch(0.90 0.06 295 / 0.32);
  transform: translateY(-2px);
}
.tpl-card svg { color: var(--accent); margin-bottom: 4px; }
.tpl-card strong { font-family: var(--font-display); font-size: 14px; color: var(--ink); }
.tpl-card span { font-size: 11.5px; color: var(--ink-3); line-height: 1.5; }

/* head */
.ne-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
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
  font-size: clamp(22px, 2.8vw, 32px);
  letter-spacing: -0.02em;
  color: var(--ink);
  padding: 8px 0;
  border-bottom: 1px solid var(--line-soft);
  transition: border-color 0.3s;
}
.ne-title-input::placeholder { color: var(--ink-3); }
.ne-title-input:focus { border-bottom-color: var(--accent); }

/* frontmatter 折叠面板 */
.ne-meta-panel {
  border: 1px solid var(--line-soft);
  border-radius: var(--radius);
  background: oklch(0.93 0.008 280 / 0.45);
  padding: 0;
  overflow: hidden;
}
.ne-meta-panel summary {
  cursor: pointer;
  padding: 12px 16px;
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-2);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s, color 0.3s;
}
.ne-meta-panel summary:hover {
  background: oklch(0.87 0.010 280 / 0.5);
  color: var(--ink);
}
.ne-meta-panel summary svg { color: var(--accent); }
.ne-meta-panel[open] summary { border-bottom: 1px solid var(--line-soft); }

.ne-meta-grid {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ne-meta-row {
  display: grid;
  grid-template-columns: 140px 1fr 32px;
  gap: 8px;
  align-items: center;
}
.ne-meta-key, .ne-meta-val {
  background: oklch(0.97 0.005 280 / 0.7);
  border: 1px solid var(--line-soft);
  border-radius: 6px;
  padding: 7px 10px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--ink);
  outline: none;
  transition: border-color 0.3s, background 0.3s;
}
.ne-meta-key { color: var(--accent-2); }
.ne-meta-key:focus, .ne-meta-val:focus {
  border-color: var(--accent);
  background: oklch(0.94 0.04 295 / 0.5);
}
.ne-meta-del {
  width: 32px; height: 32px;
  border-radius: 6px;
  color: var(--ink-3);
  background: transparent;
  transition: color 0.3s, background 0.3s;
}
.ne-meta-del:hover {
  color: var(--error);
  background: oklch(0.90 0.06 25 / 0.3);
}
.ne-meta-add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 6px;
  border: 1px dashed var(--line-soft);
  background: transparent;
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink-3);
  cursor: pointer;
  align-self: flex-start;
  transition: color 0.3s, border-color 0.3s;
}
.ne-meta-add:hover {
  color: var(--accent);
  border-color: var(--accent);
}

/* row(tags + article) */
.ne-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  align-items: start;
}
@media (max-width: 720px) {
  .ne-row { grid-template-columns: 1fr; }
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

/* 工具栏 */
.ne-toolbar {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding: 8px 10px;
  border-radius: 8px;
  background: oklch(0.90 0.010 280 / 0.5);
  border: 1px solid var(--line-soft);
}
.ne-tool {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid var(--line-soft);
  background: oklch(0.93 0.008 280 / 0.6);
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink-2);
  cursor: pointer;
  transition: color 0.3s, border-color 0.3s, background 0.3s;
}
.ne-tool:hover {
  color: var(--ink);
  border-color: var(--accent);
  background: oklch(0.90 0.06 295 / 0.4);
}

/* body */
.ne-body {
  position: relative;
  border-radius: var(--radius);
  border: 1px solid var(--line-soft);
  background: oklch(0.97 0.005 280 / 0.55);
  overflow: visible;
}
.ne-textarea-wrap {
  position: relative;
}
.ne-textarea {
  width: 100%;
  min-height: 420px;
  padding: 20px;
  background: transparent;
  border: 0;
  outline: 0;
  font-family: var(--font-mono);
  font-size: 13.5px;
  line-height: 1.75;
  color: var(--ink);
  resize: vertical;
}
.ne-textarea::placeholder { color: var(--ink-3); }

/* 补全弹窗 */
.ne-completion {
  position: absolute;
  left: 20px;
  bottom: 12px;
  width: min(420px, calc(100% - 40px));
  max-height: 300px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: oklch(0.97 0.005 280 / 0.96);
  backdrop-filter: blur(14px);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  z-index: 50;
  display: flex;
  flex-direction: column;
}
.ne-comp-head {
  padding: 8px 12px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-3);
  background: oklch(0.90 0.010 280 / 0.7);
  display: flex;
  align-items: center;
  gap: 6px;
  border-bottom: 1px solid var(--line-soft);
}
.ne-completion ul {
  list-style: none;
  margin: 0;
  padding: 4px 0;
  max-height: 220px;
  overflow-y: auto;
}
.ne-completion li {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 14px;
  cursor: pointer;
  transition: background 0.2s, padding 0.2s;
}
.ne-completion li:hover,
.ne-completion li.active {
  background: oklch(0.90 0.06 295 / 0.5);
  padding-left: 18px;
}
.ne-completion li strong {
  font-family: var(--font-display);
  font-size: 13px;
  color: var(--ink);
}
.ne-completion li span {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-3);
}
.ne-comp-foot {
  padding: 6px 12px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--ink-3);
  background: oklch(0.93 0.008 280 / 0.6);
  border-top: 1px solid var(--line-soft);
  text-align: center;
}

/* 预览 */
.ne-preview {
  min-height: 420px;
  padding: 24px 26px;
  font-size: 14.5px;
  line-height: 1.8;
  color: var(--ink-2);
}
.ne-preview :deep(h1),
.ne-preview :deep(h2),
.ne-preview :deep(h3),
.ne-preview :deep(h4) {
  font-family: var(--font-display);
  color: var(--ink);
  margin: 1.4em 0 0.5em;
  line-height: 1.25;
}
.ne-preview :deep(h1) { font-size: 26px; }
.ne-preview :deep(h2) { font-size: 20px; }
.ne-preview :deep(h3) { font-size: 16px; }
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
  background: oklch(0.87 0.010 280 / 0.6);
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
.ne-preview :deep(ul), .ne-preview :deep(ol) { padding-left: 1.2em; }
.ne-preview :deep(li) { margin: 0.3em 0; }
.ne-preview :deep(a) { color: var(--accent); border-bottom: 1px solid var(--line); padding-bottom: 1px; }
.ne-preview :deep(a:hover) { color: var(--accent-warm); }

.ne-preview :deep(.md-wiki) {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 0 6px;
  border-radius: 4px;
  background: oklch(0.90 0.06 295 / 0.4);
  border: 1px solid oklch(0.50 0.22 295 / 0.4);
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
}
.ne-preview :deep(.md-wiki:hover) {
  background: oklch(0.80 0.08 295 / 0.5);
  color: var(--ink);
}
.ne-preview :deep(.md-wiki-missing) {
  background: oklch(0.87 0.010 280 / 0.4);
  border: 1px dashed var(--ink-3);
  color: var(--ink-3);
  cursor: help;
}
.ne-preview :deep(.md-tag) {
  display: inline-block;
  padding: 0 6px;
  border-radius: 4px;
  background: oklch(0.90 0.06 60 / 0.4);
  color: var(--warning);
  font-family: var(--font-mono);
  font-size: 0.9em;
  text-decoration: none;
}
.ne-preview :deep(.md-tag:hover) {
  background: oklch(0.85 0.12 60 / 0.5);
}
.ne-preview :deep(.md-admon) {
  display: block;
  padding: 12px 16px;
  margin: 1em 0;
  border-radius: 8px;
  border-left: 3px solid;
}
.ne-preview :deep(.md-admon-info) { background: oklch(0.92 0.05 220 / 0.32); border-left-color: var(--accent-2); }
.ne-preview :deep(.md-admon-tip) { background: oklch(0.92 0.05 160 / 0.32); border-left-color: var(--success); }
.ne-preview :deep(.md-admon-success) { background: oklch(0.92 0.05 160 / 0.32); border-left-color: var(--success); }
.ne-preview :deep(.md-admon-warning) { background: oklch(0.92 0.06 60 / 0.32); border-left-color: var(--warning); }
.ne-preview :deep(.md-admon-error) { background: oklch(0.92 0.06 25 / 0.30); border-left-color: var(--error); }
.ne-preview :deep(.md-admon-note) { background: oklch(0.90 0.010 280 / 0.5); border-left-color: var(--ink-3); }

/* 关联区 */
.ne-relations {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
  gap: 14px;
  margin-top: 14px;
  padding-top: 18px;
  border-top: 1px solid var(--line-soft);
}
.rel-group {
  padding: 14px 16px;
  border-radius: var(--radius);
  border: 1px solid var(--line-soft);
  background: oklch(0.90 0.010 280 / 0.45);
}
.rel-group h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 13px;
  color: var(--ink-2);
  margin: 0 0 10px;
}
.rel-group h4 svg { color: var(--accent); }
.rel-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.rel-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 7px;
  border: 1px solid transparent;
  background: oklch(0.93 0.008 280 / 0.55);
  font-size: 13px;
  color: var(--ink);
  cursor: pointer;
  transition: border-color 0.3s, background 0.3s, transform 0.3s var(--ease-out);
  text-align: left;
}
.rel-item:hover {
  border-color: var(--accent);
  background: oklch(0.90 0.06 295 / 0.4);
  transform: translateX(3px);
}
.rel-item strong {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 13px;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rel-item.missing {
  border-style: dashed;
  border-color: var(--line-soft);
}
.rel-item.missing strong { color: var(--ink-3); }
.rel-item.missing span {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--accent);
}
.rel-empty {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink-3);
  margin: 0;
  line-height: 1.6;
}
.rel-empty code {
  font-size: 11px;
  padding: 1px 5px;
  border-radius: 3px;
  background: oklch(0.97 0.005 280 / 0.7);
  border: 1px solid var(--line-soft);
  color: var(--accent-2);
}

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
