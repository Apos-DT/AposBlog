<script setup>
/**
 * AI 对话视图 — 基于 DeepSeek API
 * 三栏:左会话列表 / 中消息流 / 右配置面板
 * 在 AppLayout 的"app"布局内,但本视图通过 :class 自身控制内部分栏
 */
import { ref, computed, nextTick, watch, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import { useSettingsStore } from '@/stores/settings'

import IconBase from '@/components/IconBase.vue'

const chat = useChatStore()
const settings = useSettingsStore()
const router = useRouter()

const input = ref('')
const messagesEl = ref(null)
const textareaEl = ref(null)

// 没有会话时自动新建一个
onMounted(() => {
  if (!chat.current && chat.conversations.length === 0) {
    chat.newConversation()
  } else if (!chat.current && chat.conversations.length > 0) {
    chat.openConversation(chat.conversations[0].id)
  }
  nextTick(scrollToBottom)
})

// 切换会话时滚到底
watch(() => chat.currentId, () => {
  nextTick(scrollToBottom)
})

// 消息更新时滚到底
watch(
  () => chat.current?.messages?.length,
  () => nextTick(scrollToBottom)
)
watch(
  () => chat.current?.messages?.at(-1)?.content,
  () => nextTick(scrollToBottom)
)

function scrollToBottom() {
  const el = messagesEl.value
  if (el) el.scrollTop = el.scrollHeight
}

// 发送
async function onSubmit() {
  const text = input.value.trim()
  if (!text || chat.streaming) return
  input.value = ''
  // 立刻把 textarea 高度收回去
  autoResize()
  try {
    await chat.send(text)
  } catch (e) {
    settings.pushToast('error', e.message)
  }
}

function onKeyDown(e) {
  // Cmd/Ctrl + Enter 提交
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault()
    onSubmit()
  } else if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
    // 单 Enter 提交,Shift+Enter 换行
    e.preventDefault()
    onSubmit()
  }
}

function autoResize() {
  const el = textareaEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 200) + 'px'
}

function newChat() {
  chat.newConversation()
  nextTick(() => textareaEl.value?.focus())
}

function deleteChat(id, e) {
  e.preventDefault()
  e.stopPropagation()
  if (!confirm('确定删除这个对话?')) return
  chat.removeConversation(id)
  settings.pushToast('info', '对话已删除')
}

function clearCurrent() {
  if (!chat.current) return
  if (!confirm('清空当前对话的所有消息?')) return
  chat.current.messages = []
  chat.current.updatedAt = new Date().toISOString()
  settings.pushToast('info', '已清空消息')
}

// markdown 行内渲染(轻量,避免引入 utils/markdown 复杂规则,聊天用更安全)
function renderMessage(content) {
  if (!content) return ''
  // 基础 XSS 转义
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const out = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    // 代码块
    if (/^```/.test(line)) {
      const lang = line.replace(/^```/, '').trim()
      const buf = []
      i++
      while (i < lines.length && !/^```/.test(lines[i])) {
        buf.push(lines[i])
        i++
      }
      i++
      out.push(`<pre><code data-lang="${esc(lang)}">${esc(buf.join('\n'))}</code></pre>`)
      continue
    }
    if (/^#{1,3}\s/.test(line)) {
      const m = line.match(/^(#{1,3})\s+(.*)/)
      out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`)
      i++
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
    if (/^\s*\d+\.\s/.test(line)) {
      const buf = []
      while (i < lines.length && /^\s*\d+\.\s/.test(lines[i])) {
        buf.push(`<li>${inline(lines[i].replace(/^\s*\d+\.\s+/, ''))}</li>`)
        i++
      }
      out.push(`<ol>${buf.join('')}</ol>`)
      continue
    }
    if (/^\s*$/.test(line)) {
      i++
      continue
    }
    const buf = [line]
    i++
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,3}\s|```|\s*[-*]\s|\s*\d+\.\s)/.test(lines[i])) {
      buf.push(lines[i])
      i++
    }
    out.push(`<p>${inline(buf.join(' '))}</p>`)
  }
  return out.join('\n')

  function inline(s) {
    s = esc(s)
    s = s.replace(/`([^`]+?)`/g, '<code>$1</code>')
    s = s.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
    s = s.replace(/(^|\s)\*([^*\s][^*]*?)\*(?=\s|$)/g, '$1<em>$2</em>')
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    return s
  }
}

const sentinelTime = computed(() => new Date().toLocaleTimeString())
</script>

<template>
  <section class="view-chat">
    <header class="ui-section-head">
      <div class="left">
        <span class="no">AI · DeepSeek</span>
        <h2>AI 对话</h2>
        <p v-if="chat.hasKey">和你的工程问题、灵感、笔记起草过过一遍 —— 基于 <strong>{{ chat.model }}</strong>。</p>
        <p v-else style="color: var(--error)">
          <IconBase name="close" :size="13" />
          需要先在
          <RouterLink to="/settings#ai" style="color: var(--accent); text-decoration: underline">设置</RouterLink>
          配置 API。
        </p>
      </div>
      <div class="head-actions">
        <button class="ui-btn ui-btn-ghost ui-btn-sm" @click="clearCurrent" :disabled="!chat.current || !chat.current.messages.length">
          <IconBase name="trash" :size="13" />
          <span>清空消息</span>
        </button>
        <button class="ui-btn ui-btn-accent ui-btn-sm" @click="newChat">
          <IconBase name="plus" :size="13" />
          <span>新对话</span>
        </button>
      </div>
    </header>

    <div class="chat-grid">
      <!-- 左侧:会话列表 -->
      <aside class="conv-list">
        <div class="cl-head">
          <span>会话历史</span>
          <span class="cl-count">{{ chat.conversations.length }}</span>
        </div>
        <ul v-if="chat.conversations.length">
          <li
            v-for="c in chat.sorted"
            :key="c.id"
            :class="['conv-item', { active: c.id === chat.currentId }]"
            @click="chat.openConversation(c.id)"
          >
            <div class="ci-title">{{ c.title || '未命名对话' }}</div>
            <div class="ci-meta">
              <span>{{ c.messages.length }} 条</span>
              <span>{{ (c.updatedAt || '').slice(5, 16).replace('T', ' ') }}</span>
            </div>
            <button class="ci-del" @click="deleteChat(c.id, $event)" title="删除">
              <IconBase name="trash" :size="12" />
            </button>
          </li>
        </ul>
        <div v-else class="cl-empty">
          <p>还没有对话</p>
          <button class="ui-btn ui-btn-accent ui-btn-sm" @click="newChat">
            <IconBase name="plus" :size="13" />
            <span>新建第一个对话</span>
          </button>
        </div>
      </aside>

      <!-- 中间:消息流 -->
      <div class="messages-pane">
        <div ref="messagesEl" class="messages">
          <div v-if="!chat.current || !chat.current.messages.length" class="msg-empty">
            <div class="me-icon">
              <svg width="46" height="46" viewBox="0 0 24 24" fill="none">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" stroke-width="1.6"/>
              </svg>
            </div>
            <h3>开始一段对话</h3>
            <p>
              {{ chat.hasKey ? '从下面输入框开始一段对话' : '前往设置完成 API 配置' }}
            </p>
            <div v-if="chat.hasKey" class="me-suggest">
              <button @click="input = '请用一句话总结 Karpathy 笔记法的核心'">Karpathy 笔记法一句话总结</button>
              <button @click="input = '帮我把这段 Odoo 二开思路梳理成 checklist'">Odoo 二开思路 → checklist</button>
              <button @click="input = '帮我审视这篇博客的工程逻辑'">审视博客工程逻辑</button>
            </div>
          </div>

          <div
            v-for="(m, i) in (chat.current?.messages || [])"
            :key="i"
            :class="['msg', `msg-${m.role}`]"
          >
            <div class="msg-avatar">
              <span v-if="m.role === 'user'">你</span>
              <span v-else>AI</span>
            </div>
            <div class="msg-bubble">
              <div class="msg-content" v-html="renderMessage(m.content)"></div>
              <span v-if="m.streaming" class="cursor-blink">▋</span>
            </div>
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="chat.error" class="chat-error">
          <span><strong>错误 ·</strong> {{ chat.error }}</span>
          <button @click="chat.clearError">✕</button>
        </div>

        <!-- 输入区 -->
        <form class="composer" @submit.prevent="onSubmit">
          <textarea
            ref="textareaEl"
            v-model="input"
            class="composer-input"
            :placeholder="chat.hasKey ? '问点什么... (Enter 发送,Shift+Enter 换行)' : '请先到设置填入 API Key 再使用 AI 对话'"
            :disabled="!chat.hasKey"
            @input="autoResize"
            @keydown="onKeyDown"
            rows="2"
          ></textarea>
          <div class="composer-foot">
            <span class="composer-hint">
              <span v-if="chat.streaming">
                <span class="dot-blink"></span>
                正在生成…
              </span>
              <span v-else-if="chat.hasKey">{{ chat.model }} · Enter 发送 · Shift+Enter 换行</span>
              <span v-else>未配置 API Key</span>
            </span>
            <div class="composer-actions">
              <button
                v-if="chat.streaming"
                type="button"
                class="ui-btn ui-btn-ghost ui-btn-sm"
                @click="chat.abort"
              >
                中止
              </button>
              <button
                v-else
                type="submit"
                class="ui-btn ui-btn-accent ui-btn-sm"
                :disabled="!chat.hasKey || !input.trim()"
              >
                <IconBase name="arrow-up" :size="13" />
                <span>发送</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.view-chat {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.head-actions {
  display: flex;
  gap: 10px;
}

.chat-grid {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 14px;
  height: calc(100vh - var(--nav-h) - 200px);
  min-height: 540px;
}
@media (max-width: 900px) {
  .chat-grid { grid-template-columns: 1fr; height: auto; }
  .conv-list { max-height: 240px; }
}

/* ===== 左侧会话列表 ===== */
.conv-list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-lg);
  background: oklch(0.985 0.003 80 / 0.6);
  overflow: hidden;
}
.cl-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid var(--line-soft);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-3);
  background: oklch(0.94 0.008 80 / 0.7);
}
.cl-count {
  padding: 1px 7px;
  border-radius: 999px;
  border: 1px solid var(--line-soft);
  color: var(--ink-2);
  font-size: 10.5px;
}
.conv-list ul {
  list-style: none;
  margin: 0;
  padding: 6px;
  overflow-y: auto;
  flex: 1;
}
.conv-item {
  position: relative;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s var(--ease-out);
}
.conv-item:hover { background: oklch(0.92 0.04 295 / 0.4); transform: translateX(2px); }
.conv-item.active {
  background: oklch(0.88 0.07 295 / 0.5);
  border-left: 2px solid var(--accent);
  padding-left: 14px;
}
.ci-title {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 22px;
}
.ci-meta {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--ink-3);
}
.ci-del {
  position: absolute;
  right: 8px; top: 8px;
  width: 22px; height: 22px;
  border-radius: 5px;
  color: var(--ink-3);
  background: transparent;
  opacity: 0;
  transition: opacity 0.3s, color 0.3s, background 0.3s;
}
.conv-item:hover .ci-del { opacity: 1; }
.ci-del:hover { color: var(--error); background: oklch(0.92 0.06 25 / 0.5); }

.cl-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 20px;
  text-align: center;
}
.cl-empty p {
  font-size: 13px;
  color: var(--ink-3);
}

/* ===== 中间消息流 ===== */
.messages-pane {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-lg);
  background: oklch(0.985 0.003 80 / 0.6);
  overflow: hidden;
  min-width: 0;
}
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.msg {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 12px;
}
.msg-avatar {
  width: 34px; height: 34px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}
.msg-user .msg-avatar {
  background: oklch(0.88 0.07 295);
  color: var(--accent);
}
.msg-assistant .msg-avatar {
  background: oklch(0.94 0.04 295);
  color: var(--accent);
  border: 1px solid var(--accent);
}

.msg-bubble {
  min-width: 0;
}
.msg-content {
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--ink);
}
.msg-content :deep(p) { margin: 0 0 0.8em; }
.msg-content :deep(p:last-child) { margin-bottom: 0; }
.msg-content :deep(strong) { color: var(--ink); }
.msg-content :deep(em) { font-family: var(--font-serif); font-style: italic; color: var(--accent-warm); }
.msg-content :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.88em;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--bg-deep);
  border: 1px solid var(--line-soft);
  color: var(--accent);
}
.msg-content :deep(pre) {
  background: var(--bg-deep);
  border: 1px solid var(--line-soft);
  border-radius: 10px;
  padding: 14px 18px;
  margin: 1em 0;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
}
.msg-content :deep(pre code) {
  background: transparent;
  padding: 0;
  border: 0;
  color: var(--ink-2);
}
.msg-content :deep(ul), .msg-content :deep(ol) {
  padding-left: 1.4em;
  margin: 0.6em 0;
}
.msg-content :deep(li) { margin: 0.3em 0; }
.msg-content :deep(h1), .msg-content :deep(h2), .msg-content :deep(h3) {
  font-family: var(--font-display);
  margin: 1.2em 0 0.5em;
  color: var(--ink);
}
.msg-content :deep(h1) { font-size: 1.4em; }
.msg-content :deep(h2) { font-size: 1.2em; }
.msg-content :deep(h3) { font-size: 1.05em; }
.msg-content :deep(a) { color: var(--accent); border-bottom: 1px solid var(--line); }

.cursor-blink {
  display: inline-block;
  color: var(--accent);
  margin-left: 2px;
  animation: blink-cursor 1s infinite;
}
@keyframes blink-cursor { 50% { opacity: 0; } }

.dot-blink {
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--accent);
  margin-right: 6px;
  animation: dot-pulse 1.2s ease-in-out infinite;
}
@keyframes dot-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}

/* 空状态 */
.msg-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  text-align: center;
  height: 100%;
  padding: 40px;
}
.me-icon {
  width: 80px; height: 80px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: oklch(0.94 0.04 295);
  color: var(--accent);
}
.msg-empty h3 {
  font-family: var(--font-display);
  font-size: 18px;
  margin: 0;
  color: var(--ink);
}
.msg-empty p { font-size: 14px; color: var(--ink-2); max-width: 360px; }
.me-suggest {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 8px;
}
.me-suggest button {
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: oklch(0.985 0.003 80);
  font-size: 12.5px;
  color: var(--ink-2);
  cursor: pointer;
  transition: color 0.3s, border-color 0.3s, background 0.3s, transform 0.3s var(--ease-out);
}
.me-suggest button:hover {
  color: var(--ink);
  border-color: var(--accent);
  background: oklch(0.94 0.04 295 / 0.5);
  transform: translateY(-1px);
}

/* 错误条 */
.chat-error {
  margin: 0 14px 8px;
  padding: 10px 14px;
  border-radius: 8px;
  background: oklch(0.92 0.06 25 / 0.4);
  border-left: 3px solid var(--error);
  font-size: 13px;
  color: var(--error);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chat-error button {
  background: transparent;
  border: 0;
  font-size: 16px;
  color: var(--error);
  cursor: pointer;
  padding: 0 6px;
}

/* 输入区 */
.composer {
  padding: 14px 16px 16px;
  border-top: 1px solid var(--line-soft);
  background: oklch(0.97 0.005 80 / 0.5);
}
.composer-input {
  width: 100%;
  min-height: 50px;
  max-height: 200px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: oklch(0.985 0.003 80);
  font-size: 14px;
  color: var(--ink);
  resize: none;
  font-family: var(--font-body);
  line-height: 1.6;
  transition: border-color 0.3s, box-shadow 0.3s;
}
.composer-input:hover { border-color: var(--ink-3); }
.composer-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px oklch(0.50 0.22 295 / 0.15);
}
.composer-input:disabled {
  background: var(--bg-deep);
  color: var(--ink-3);
  cursor: not-allowed;
}
.composer-input::placeholder { color: var(--ink-3); }

.composer-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  gap: 12px;
  flex-wrap: wrap;
}
.composer-hint {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink-3);
  display: flex;
  align-items: center;
}
.composer-actions { display: flex; gap: 8px; }

/* 通用按钮 */
.ui-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid transparent;
  transition: transform 0.3s var(--ease-out), background 0.3s, color 0.3s, border-color 0.3s;
}
.ui-btn-sm { padding: 6px 11px; font-size: 12px; }
.ui-btn[disabled], .ui-btn:disabled { opacity: 0.45; cursor: not-allowed; pointer-events: none; }
.ui-btn-ghost { background: transparent; color: var(--ink-2); border-color: var(--line); }
.ui-btn-ghost:hover { color: var(--ink); border-color: var(--ink-3); transform: translateY(-1px); }
.ui-btn-accent { background: var(--accent); color: #fff; }
.ui-btn-accent:hover { background: oklch(0.45 0.22 295); transform: translateY(-1px); box-shadow: 0 4px 12px -4px oklch(0.50 0.22 295 / 0.4); }
</style>
