/**
 * AI 对话 store —— 经后端 /api/chat 代理（key 在服务器，前端不持有）
 * 会话纯内存，不写 localStorage（刷新即清空）
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/utils/api'
import { useNotesStore } from './notes'

function genId() {
  return 'c-' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4)
}

export const useChatStore = defineStore('chat', () => {
  const conversations = ref([])
  const currentId = ref(null)
  const model = ref('deepseek-chat') // 仅展示用
  const streaming = ref(false)
  const error = ref('')
  let controller = null

  const sorted = computed(() =>
    [...conversations.value].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
  )
  const current = computed(() =>
    currentId.value ? conversations.value.find((c) => c.id === currentId.value) : null
  )
  // 后端持有 key，前端始终视为「已配置」
  const hasKey = computed(() => true)

  function newConversation(title = '新对话') {
    const now = new Date().toISOString()
    const c = { id: genId(), title, messages: [], createdAt: now, updatedAt: now }
    conversations.value.unshift(c)
    currentId.value = c.id
    return c
  }
  function openConversation(id) {
    currentId.value = id
  }
  function removeConversation(id) {
    conversations.value = conversations.value.filter((c) => c.id !== id)
    if (currentId.value === id) currentId.value = conversations.value[0]?.id || null
  }
  function renameConversation(id, title) {
    const i = conversations.value.findIndex((c) => c.id === id)
    if (i >= 0) {
      conversations.value[i] = { ...conversations.value[i], title, updatedAt: new Date().toISOString() }
    }
  }
  function clearAll() {
    conversations.value = []
    currentId.value = null
  }

  async function send(content) {
    error.value = ''
    if (!content?.trim()) return
    if (!current.value) newConversation(content.slice(0, 24))

    const conv = current.value
    const now = new Date().toISOString()
    conv.messages.push({ role: 'user', content: content.trim(), at: now })
    conv.updatedAt = now
    if (conv.messages.filter((m) => m.role === 'user').length === 1 && conv.title === '新对话') {
      conv.title = content.trim().slice(0, 24) + (content.length > 24 ? '…' : '')
    }

    const aIdx = conv.messages.push({ role: 'assistant', content: '', at: new Date().toISOString(), streaming: true }) - 1
    streaming.value = true
    controller = new AbortController()

    try {
      // 只发 user/assistant 历史，system prompt 由后端注入
      const payload = conv.messages.slice(0, -1).map((m) => ({ role: m.role, content: m.content }))
      // 把本地知识库笔记摘要一并带给后端，让 AI 能引用站点知识库（去 frontmatter + 截断）
      const notesStore = useNotesStore()
      const knowledge = (notesStore.notes || []).slice(0, 40).map((n) => ({
        title: n.title || '',
        content: (n.content || '').replace(/^---[\s\S]*?---\n?/, '').slice(0, 500),
      }))
      const res = await api.chatStream(payload, knowledge, controller.signal)
      if (!res.ok) {
        let detail = `HTTP ${res.status}`
        try {
          const j = await res.json()
          if (j && j.error) detail = j.error
        } catch {}
        throw new Error(detail)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()
        for (const line of lines) {
          const t = line.trim()
          if (!t || !t.startsWith('data:')) continue
          const ps = t.slice(5).trim()
          if (ps === '[DONE]') continue
          try {
            const json = JSON.parse(ps)
            const delta = json.choices?.[0]?.delta
            if (delta?.content) {
              conv.messages[aIdx].content += delta.content
              conv.updatedAt = new Date().toISOString()
            }
          } catch {}
        }
      }
      conv.messages[aIdx].streaming = false
    } catch (e) {
      conv.messages[aIdx].streaming = false
      if (e.name === 'AbortError') {
        conv.messages[aIdx].content += '\n\n[已中止]'
      } else {
        error.value = e.message || '请求失败'
        conv.messages[aIdx].content = `❌ 请求失败：${error.value}`
      }
    } finally {
      streaming.value = false
      controller = null
    }
  }

  function abort() {
    if (controller) {
      controller.abort()
      controller = null
    }
  }
  function clearError() {
    error.value = ''
  }

  return {
    conversations, currentId, model, streaming, error,
    sorted, current, hasKey,
    newConversation, openConversation, removeConversation, renameConversation, clearAll,
    send, abort, clearError,
  }
})
