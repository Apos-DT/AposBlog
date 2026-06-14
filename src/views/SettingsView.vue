<script setup>
/**
 * 设置 — 主题 / 数据导出 / 数据导入 / 重置
 */
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { usePostsStore } from '@/stores/posts'
import { useReadsStore } from '@/stores/reads'
import { useNotesStore } from '@/stores/notes'
import { useTagsStore } from '@/stores/tags'
import { useAdminStore } from '@/stores/admin'
import { exportAll, importAll, clearAll } from '@/stores/_persist'

import IconBase from '@/components/IconBase.vue'

const settings = useSettingsStore()
const posts = usePostsStore()
const reads = useReadsStore()
const notes = useNotesStore()
const tags = useTagsStore()
const admin = useAdminStore()

const importFile = ref(null)
const adminPw = ref('')
const adminBusy = ref(false)

async function doAdminLogin() {
  if (!adminPw.value.trim()) return
  adminBusy.value = true
  try {
    await admin.login(adminPw.value.trim())
    adminPw.value = ''
    settings.pushToast('success', '管理员已登录，现在可以增删改文章、删除留言')
  } catch (e) {
    settings.pushToast('error', e.message || '登录失败')
  } finally {
    adminBusy.value = false
  }
}
function doAdminLogout() {
  admin.logout()
  settings.pushToast('info', '已退出管理员')
}

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
  if (!confirm('确定清空本地数据?\n这将删除浏览器本地的笔记、阅读记录、自定义标签。服务器上的文章与留言不受影响,此操作不可撤销。')) return
  if (!confirm('再次确认:真的要清空全部本地数据?')) return
  clearAll()
  settings.pushToast('warning', '已清空,刷新页面')
  setTimeout(() => location.reload(), 800)
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
        <p>AI · 数据 · 应用信息</p>
      </div>
    </header>

    <!-- 管理员 -->
    <article class="set-card" id="admin">
      <header><h3><IconBase name="key" :size="16" /> 管理员</h3></header>

      <div class="ui-alert info" style="margin-bottom:18px">
        <span>
          登录后才能在「文章」页增删改文章、在「留言板」删除留言。口令由站长持有，仅本次会话有效（关闭标签页即退出）。
        </span>
      </div>

      <template v-if="!admin.isAdmin">
        <label class="ui-field" style="margin-bottom: 14px">
          <span class="ui-field-label">管理口令</span>
          <input
            v-model="adminPw"
            type="password"
            class="ui-input"
            placeholder="输入管理口令"
            autocomplete="off"
            spellcheck="false"
            @keydown.enter="doAdminLogin"
          />
        </label>
        <div class="set-actions">
          <button class="ui-btn ui-btn-primary" :disabled="adminBusy || !adminPw.trim()" @click="doAdminLogin">
            <IconBase name="key" :size="14" />
            <span>{{ adminBusy ? '登录中…' : '登录' }}</span>
          </button>
        </div>
      </template>
      <template v-else>
        <div class="ui-field-tip" style="margin-bottom:14px; color: var(--success); font-size: 13px">
          ✓ 已登录为管理员，可去「文章 / 留言板」管理内容
        </div>
        <div class="set-actions">
          <RouterLink to="/library" class="ui-btn ui-btn-primary">
            <IconBase name="library" :size="14" />
            <span>去管理文章</span>
          </RouterLink>
          <button class="ui-btn ui-btn-ghost" @click="doAdminLogout">
            <IconBase name="close" :size="14" />
            <span>退出管理员</span>
          </button>
        </div>
      </template>
    </article>

    <!-- 数据管理 -->
    <article class="set-card">
      <header><h3><IconBase name="sliders" :size="16" /> 数据管理</h3></header>

      <div class="ui-alert info">
        <span>
          建议定期导出 JSON 备份 —— 换浏览器或清除缓存时数据可能丢失。
          当前占用约 <strong>{{ storageSize() }}</strong>。
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

    <!-- 管理工具(下沉自原左侧菜单) -->
    <article class="set-card">
      <header><h3><IconBase name="dashboard" :size="16" /> 管理工具</h3></header>
      <div class="tool-grid">
        <RouterLink to="/dashboard" class="tool-tile">
          <IconBase name="dashboard" :size="18" />
          <strong>仪表板</strong>
          <span>阅读总览 / 最近活动</span>
        </RouterLink>
        <RouterLink to="/stats" class="tool-tile">
          <IconBase name="stats" :size="18" />
          <strong>统计</strong>
          <span>阅读 / 笔记 / 标签 4 张图</span>
        </RouterLink>
        <RouterLink to="/tags" class="tool-tile">
          <IconBase name="tags" :size="18" />
          <strong>标签</strong>
          <span>笔记标签管理与调色</span>
        </RouterLink>
      </div>
    </article>

    <!-- 关于 -->
    <article class="set-card">
      <header><h3><IconBase name="book" :size="16" /> 关于应用</h3></header>
      <dl class="about-dl">
        <dt>项目名</dt><dd>APOS · 阅读追踪与知识库</dd>
        <dt>作者</dt><dd>赵祥生 (Apos)</dd>
        <dt>技术栈</dt><dd>Vue 3 · Vue Router 4 · Pinia · Vite 6 · ECharts</dd>
        <dt>数据存储</dt><dd>文章 / 留言：服务器 · 笔记 / 标签：浏览器本地</dd>
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
  background: oklch(0.93 0.008 280 / 0.45);
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
  box-shadow: 0 0 0 6px oklch(0.50 0.22 295 / 0.2);
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

.ai-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 14px;
  margin-bottom: 14px;
}
@media (max-width: 720px) {
  .ai-grid { grid-template-columns: 1fr; }
}
.ui-field-tip {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink-3);
  margin-top: 4px;
}
.ui-input, .ui-select, .ui-textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--bg-deep);
  font-size: 14px;
  color: var(--ink);
  transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
}
.ui-input:focus, .ui-select:focus, .ui-textarea:focus {
  outline: none;
  border-color: var(--accent);
  background: var(--bg);
  box-shadow: 0 0 0 3px oklch(0.50 0.22 295 / 0.15);
}
.ui-textarea {
  resize: vertical;
  min-height: 70px;
  font-family: var(--font-body);
  line-height: 1.6;
}
.ui-input::placeholder, .ui-textarea::placeholder { color: var(--ink-3); }
.ui-select {
  appearance: none;
  cursor: pointer;
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
  background: oklch(0.90 0.010 280 / 0.5);
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
  background: oklch(0.87 0.010 280 / 0.6);
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
  background: oklch(0.87 0.010 280 / 0.6);
  border: 1px solid var(--line-soft);
  color: var(--accent-2);
}

/* 管理工具瓦片 */
.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
  gap: 12px;
}
.tool-tile {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
  padding: 16px 18px;
  border-radius: var(--radius);
  border: 1px solid var(--line-soft);
  background: var(--bg);
  color: inherit;
  transition: border-color 0.3s, transform 0.3s var(--ease-out), background 0.3s;
}
.tool-tile:hover {
  border-color: var(--accent);
  background: oklch(0.94 0.04 295 / 0.4);
  transform: translateY(-2px);
}
.tool-tile svg { color: var(--accent); margin-bottom: 4px; }
.tool-tile strong {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 14.5px;
  color: var(--ink);
}
.tool-tile span {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-3);
}
</style>
