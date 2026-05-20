<script setup>
/**
 * 标签管理 — 创建 / 重命名 / 改色 / 删除
 */
import { ref, computed } from 'vue'
import { useTagsStore } from '@/stores/tags'
import { useNotesStore } from '@/stores/notes'
import { useSettingsStore } from '@/stores/settings'

import IconBase from '@/components/IconBase.vue'

const tags = useTagsStore()
const notes = useNotesStore()
const settings = useSettingsStore()

const newName = ref('')
const newColor = ref(tags.palette[0])

// 每个标签关联的笔记数
const usage = computed(() => {
  const m = {}
  notes.notes.forEach((n) => {
    ;(n.tagIds || []).forEach((tid) => {
      m[tid] = (m[tid] || 0) + 1
    })
  })
  return m
})

function addTag() {
  const name = newName.value.trim()
  if (!name) return
  try {
    tags.create({ name, color: newColor.value })
    newName.value = ''
    newColor.value = tags.palette[tags.tags.length % tags.palette.length]
    settings.pushToast('success', `标签 "${name}" 已创建`)
  } catch (e) {
    settings.pushToast('error', e.message)
  }
}

function renameTag(id) {
  const t = tags.findById(id)
  const newName = prompt('修改标签名:', t.name)
  if (newName == null) return
  if (!newName.trim()) {
    settings.pushToast('error', '标签名不能为空')
    return
  }
  tags.update(id, { name: newName.trim() })
  settings.pushToast('success', '已重命名')
}

function pickColor(id, color) {
  tags.update(id, { color })
}

function removeTag(id, name, count) {
  const msg = count
    ? `「${name}」被 ${count} 条笔记使用,删除后那些笔记的此标签也会被移除。确定删除?`
    : `确定删除「${name}」?`
  if (!confirm(msg)) return
  // 先从所有笔记里移除这个 tagId
  notes.notes.forEach((n) => {
    if ((n.tagIds || []).includes(id)) {
      notes.update(n.id, { tagIds: n.tagIds.filter((t) => t !== id) })
    }
  })
  tags.remove(id)
  settings.pushToast('success', '标签已删除')
}
</script>

<template>
  <section class="view-tags">
    <header class="ui-section-head">
      <div class="left">
        <span class="no">04 / Tags</span>
        <h2>标签</h2>
        <p>用标签把笔记分类。共 {{ tags.tags.length }} 个标签 · 被 {{ Object.values(usage).reduce((s, n) => s + n, 0) }} 次引用</p>
      </div>
    </header>

    <!-- 添加表单 -->
    <form class="tag-add" @submit.prevent="addTag">
      <div class="tag-add-row">
        <label class="ui-field" style="flex:1;margin:0;">
          <span class="ui-field-label">新标签名</span>
          <input v-model="newName" type="text" class="ui-input" placeholder="如:Vue / Java / Odoo" maxlength="20" />
        </label>
        <div class="ui-field" style="margin:0;">
          <span class="ui-field-label">颜色</span>
          <div class="palette">
            <button
              v-for="c in tags.palette"
              :key="c"
              type="button"
              :class="['p-swatch', { active: newColor === c }]"
              :style="{ background: c, boxShadow: `0 0 8px ${c}` }"
              @click="newColor = c"
              :title="c"
              :aria-label="c"
            ></button>
          </div>
        </div>
        <button type="submit" class="ui-btn ui-btn-primary" :disabled="!newName.trim()">
          <IconBase name="plus" :size="14" />
          <span>创建</span>
        </button>
      </div>
    </form>

    <!-- 标签卡片 -->
    <section class="tag-grid">
      <article v-for="t in tags.all" :key="t.id" class="tag-card" :style="{ '--c': t.color }">
        <header class="tg-head">
          <span class="tg-name">
            <span class="dot" :style="{ background: t.color, boxShadow: `0 0 8px ${t.color}` }"></span>
            {{ t.name }}
          </span>
          <span class="tg-count">{{ usage[t.id] || 0 }} 条笔记</span>
        </header>

        <div class="tg-palette">
          <button
            v-for="c in tags.palette"
            :key="c"
            type="button"
            :class="['p-swatch', { active: t.color === c }]"
            :style="{ background: c }"
            @click="pickColor(t.id, c)"
            :aria-label="c"
          ></button>
        </div>

        <footer class="tg-actions">
          <button class="ui-btn ui-btn-ghost ui-btn-sm" @click="renameTag(t.id)">
            <IconBase name="edit" :size="13" />
            <span>重命名</span>
          </button>
          <button class="ui-btn ui-btn-danger ui-btn-sm" @click="removeTag(t.id, t.name, usage[t.id])">
            <IconBase name="trash" :size="13" />
            <span>删除</span>
          </button>
        </footer>
      </article>
    </section>

    <div v-if="!tags.tags.length" class="ui-empty">
      <span class="icon"><IconBase name="tags" :size="20" /></span>
      <h3>还没有标签</h3>
      <p>在上方输入标签名创建第一个</p>
    </div>
  </section>
</template>

<style scoped>
.view-tags { display: flex; flex-direction: column; gap: 24px; }

/* 添加表单 */
.tag-add {
  padding: 22px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-soft);
  background: oklch(0.14 0.012 280 / 0.45);
}
.tag-add-row {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
}
.tag-add-row .ui-btn { height: 40px; }

/* palette */
.palette {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
.p-swatch {
  width: 22px; height: 22px;
  border-radius: 6px;
  border: 1px solid var(--line-soft);
  cursor: pointer;
  transition: transform 0.2s var(--ease-out),
              border-color 0.2s;
  padding: 0;
}
.p-swatch:hover { transform: scale(1.15); }
.p-swatch.active {
  transform: scale(1.2);
  border: 2px solid var(--ink);
  box-shadow: 0 0 0 2px var(--bg-deep), 0 0 12px var(--accent);
}

/* 标签卡 */
.tag-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(260px, 100%), 1fr));
  gap: 14px;
}
.tag-card {
  padding: 18px 20px 16px;
  border-radius: var(--radius);
  border: 1px solid var(--line-soft);
  background: linear-gradient(180deg, oklch(0.18 0.014 280 / 0.5), oklch(0.14 0.012 280 / 0.4));
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: border-color 0.4s, transform 0.4s var(--ease-out);
}
.tag-card:hover {
  border-color: var(--c);
  transform: translateY(-2px);
}

.tg-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tg-name {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 16px;
  color: var(--ink);
}
.tg-name .dot {
  width: 12px; height: 12px;
  border-radius: 50%;
}
.tg-count {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-3);
  padding: 3px 9px;
  border-radius: 999px;
  background: oklch(0.18 0.014 280 / 0.6);
  border: 1px solid var(--line-soft);
}

.tg-palette {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.tg-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}
</style>
