<script setup>
/**
 * 设置 — 主题 / 数据导出 / 数据导入 / 重置
 */
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { usePostsStore } from '@/stores/posts'
import { useReadsStore } from '@/stores/reads'
import { useNotesStore } from '@/stores/notes'
import { useTagsStore } from '@/stores/tags'
import { exportAll, importAll, clearAll } from '@/stores/_persist'

import IconBase from '@/components/IconBase.vue'

const settings = useSettingsStore()
const posts = usePostsStore()
const reads = useReadsStore()
const notes = useNotesStore()
const tags = useTagsStore()

const importFile = ref(null)

function doExport() {
  const payload = exportAll()
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `apos-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
  settings.pushToast('success', '已导出 JSON 备份')
}

async function doImport(e) {
  const file = e.target.files[0]
  if (!file) return
  if (!confirm(`即将从「${file.name}」导入数据,会覆盖当前数据。确定?`)) {
    e.target.value = ''
    return
  }
  try {
    const text = await file.text()
    const payload = JSON.parse(text)
    importAll(payload)
    settings.pushToast('success', '导入成功,刷新页面应用')
    setTimeout(() => location.reload(), 800)
  } catch (err) {
    settings.pushToast('error', '导入失败:' + err.message)
  } finally {
    e.target.value = ''
  }
}

function doClear() {
  if (!confirm('确定清空所有数据?\n这将删除所有笔记、阅读记录、自定义标签和文章。此操作不可撤销。')) return
  if (!confirm('再次确认:真的要清空全部本地数据?')) return
  clearAll()
  settings.pushToast('warning', '已清空,刷新页面')
  setTimeout(() => location.reload(), 800)
}

function resetPostsToInitial() {
  if (!confirm('恢复文章库到初始 4 篇博客文章,你添加的自定义文章会被清除。确定?')) return
  posts.resetToInitial()
  settings.pushToast('success', '文章库已恢复初始')
}

const storageSize = () => {
  let total = 0
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && k.startsWith('apos:')) {
      total += (k.length + (localStorage.getItem(k) || '').length) * 2
    }
  }
  if (total < 1024) return total + ' B'
  if (total < 1024 * 1024) return (total / 1024).toFixed(1) + ' KB'
  return (total / 1024 / 1024).toFixed(2) + ' MB'
}
</script>

<template>
  <section class="view-settings">
    <header class="ui-section-head">
      <div class="left">
        <span class="no">06 / Settings</span>
        <h2>设置</h2>
        <p>主题外观 · 数据管理 · 应用信息</p>
      </div>
    </header>

    <!-- 主题 -->
    <article class="set-card">
      <header><h3><IconBase name="palette" :size="16" /> 主题外观</h3></header>
      <div class="set-row">
        <label class="ui-field" style="flex:1;">
          <span class="ui-field-label">主题色相 ({{ settings.hue }}°)</span>
          <input
            type="range"
            min="0" max="360"
            :value="settings.hue"
            @input="settings.setHue($event.target.value)"
            class="ui-range"
          />
        </label>
      </div>
      <div class="set-row">
        <span class="ui-field-label">正文字号</span>
        <div class="size-tabs">
          <button
            v-for="fz in [14, 16, 18]"
            :key="fz"
            :class="['size-tab', { active: settings.fontSize === fz }]"
            @click="settings.setFontSize(fz)"
          >
            {{ fz === 14 ? '紧凑 (14)' : fz === 16 ? '标准 (16)' : '舒适 (18)' }}
          </button>
        </div>
      </div>
    </article>

    <!-- 数据管理 -->
    <article class="set-card">
      <header><h3><IconBase name="sliders" :size="16" /> 数据管理</h3></header>

      <div class="ui-alert info">
        <span>
          <strong>说明 ·</strong> 所有数据存储在浏览器 <code>localStorage</code>,
          换浏览器 / 清除缓存会丢失。建议定期导出 JSON 备份。当前占用空间约
          <strong>{{ storageSize() }}</strong>。
        </span>
      </div>

      <div class="set-actions">
        <button class="ui-btn ui-btn-primary" @click="doExport">
          <IconBase name="download" :size="14" />
          <span>导出 JSON 备份</span>
        </button>

        <label class="ui-btn ui-btn-ghost" style="cursor:pointer">
          <IconBase name="upload" :size="14" />
          <span>导入备份</span>
          <input type="file" accept="application/json,.json" ref="importFile" hidden @change="doImport" />
        </label>

        <button class="ui-btn ui-btn-ghost" @click="resetPostsToInitial">
          <IconBase name="library" :size="14" />
          <span>恢复初始文章库</span>
        </button>

        <button class="ui-btn ui-btn-danger" @click="doClear">
          <IconBase name="trash" :size="14" />
          <span>清空所有数据</span>
        </button>
      </div>

      <div class="data-summary">
        <div><span>文章</span><strong>{{ posts.posts.length }}</strong></div>
        <div><span>阅读记录</span><strong>{{ reads.records.length }}</strong></div>
        <div><span>笔记</span><strong>{{ notes.notes.length }}</strong></div>
        <div><span>标签</span><strong>{{ tags.tags.length }}</strong></div>
      </div>
    </article>

    <!-- 关于 -->
    <article class="set-card">
      <header><h3><IconBase name="book" :size="16" /> 关于应用</h3></header>
      <dl class="about-dl">
        <dt>项目名</dt><dd>APOS · 阅读追踪与知识库</dd>
        <dt>作者</dt><dd>赵祥生 (Apos)</dd>
        <dt>技术栈</dt><dd>Vue 3 · Vue Router 4 · Pinia · Vite 6 · ECharts</dd>
        <dt>数据存储</dt><dd>浏览器 localStorage (前缀 <code>apos:</code>)</dd>
        <dt>源码</dt><dd><a href="https://github.com/Apos-DT/AposBlog" target="_blank" rel="noopener">github.com/Apos-DT/AposBlog</a></dd>
        <dt>博客主站</dt><dd><a href="../../" target="_blank">apos-dt.github.io/AposBlog/</a></dd>
      </dl>
    </article>
  </section>
</template>

<style scoped>
.view-settings { display: flex; flex-direction: column; gap: 22px; }

.set-card {
  padding: 22px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-soft);
  background: oklch(0.14 0.012 280 / 0.45);
}
.set-card > header {
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line-soft);
}
.set-card > header h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.set-row {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 16px;
}
.set-row:last-child { margin-bottom: 0; }

.ui-range {
  appearance: none; -webkit-appearance: none;
  width: 100%; height: 4px;
  background: var(--line);
  border-radius: 999px;
  outline: none;
  cursor: pointer;
}
.ui-range::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 18px; height: 18px;
  border-radius: 50%; background: var(--accent);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.ui-range::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 0 0 6px oklch(0.72 0.21 295 / 0.2);
}

.size-tabs {
  display: flex;
  gap: 6px;
  flex: 1;
}
.size-tab {
  flex: 1;
  padding: 9px 14px;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: transparent;
  font-family: var(--font-display);
  font-size: 13px;
  color: var(--ink-2);
  cursor: pointer;
  transition: color 0.3s, background 0.3s, border-color 0.3s;
}
.size-tab:hover { color: var(--ink); border-color: var(--ink-3); }
.size-tab.active {
  color: #fff;
  background: var(--accent);
  border-color: var(--accent);
}

.set-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
  margin-bottom: 18px;
}

.data-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 10px;
  padding-top: 14px;
  border-top: 1px solid var(--line-soft);
}
.data-summary > div {
  padding: 10px 14px;
  border-radius: 8px;
  background: oklch(0.16 0.014 280 / 0.5);
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 12.5px;
}
.data-summary span { color: var(--ink-2); }
.data-summary strong { color: var(--ink); font-weight: 500; }

/* about dl */
.about-dl {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 10px 18px;
  margin: 0;
  font-size: 13.5px;
}
.about-dl dt {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.about-dl dd {
  margin: 0;
  color: var(--ink);
}
.about-dl dd code {
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 1px 6px;
  border-radius: 4px;
  background: oklch(0.18 0.014 280 / 0.6);
  border: 1px solid var(--line-soft);
  color: var(--accent-2);
}
.about-dl dd a {
  color: var(--accent);
  border-bottom: 1px solid var(--line);
}
.about-dl dd a:hover { color: var(--accent-warm); }

code {
  font-family: var(--font-mono);
  font-size: 12.5px;
  padding: 1px 6px;
  border-radius: 4px;
  background: oklch(0.18 0.014 280 / 0.6);
  border: 1px solid var(--line-soft);
  color: var(--accent-2);
}
</style>
