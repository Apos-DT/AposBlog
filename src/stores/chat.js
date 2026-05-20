/**
 * AI 对话 store — 基于 DeepSeek API(OpenAI 兼容)
 * 数据结构:
 *   apiKey:     用户在 settings 页输入(localStorage 存,不上传)
 *   baseUrl:    https://api.deepseek.com
 *   model:      'deepseek-chat' / 'deepseek-reasoner'
 *   systemPrompt: 全局 system message
 *   conversations: 多轮会话历史 [{ id, title, messages[], createdAt, updatedAt }]
 *   currentId:  当前打开的会话 id
 *
 * API key 永远只在本地 localStorage,绝不写进代码。
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { persist } from './_persist'

function genId() {
  return 'c-' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4)
}

function defaultSystem() {
  return '你是 APOS 博客内置的 AI 助手,基于 DeepSeek。请用中文简洁、专业、不啰嗦地回答用户的问题。'
}

export const useChatStore = defineStore('chat', () => {
  const apiKey = ref('')
  const baseUrl = ref('https://api.deepseek.com')
  const model = ref('deepseek-chat')
  const systemPrompt = ref(defaultSystem())
  const conversations = ref([])
  const currentId = ref(null)

  // 运行时状态(不持久化)
  const streaming = ref(false)
  const error = ref('')
  const abortController = ref(null)

  persist(
    'chat',
    { apiKey, baseUrl, model, systemPrompt, conversations, currentId },
    () => ({
      apiKey: '',
      baseUrl: 'https://api.deepseek.com',
      model: 'deepseek-chat',
      systemPrompt: defaultSystem(),
      conversations: [],
      currentId: null,
    })
  )

  // ===== 计算 =====
  const sorted = computed(() =>
    [...conversations.value].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
  )

  const current = computed(() =>
    currentId.value ? conversations.value.find((c) => c.id === currentId.value) : null
  )

  const hasKey = computed(() => apiKey.value.trim().length > 0)

  // ===== 会话操作 =====
  function newConversation(title = '新对话') {
    const now = new Date().toISOString()
    const c = {
      id: genId(),
      title,
      messages: [],
      createdAt: now,
      updatedAt: now,
    }
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
      conversations.value[i] = {
        ...conversations.value[i],
        title,
        updatedAt: new Date().toISOString(),
      }
    }
  }

  function clearAll() {
    conversations.value = []
    currentId.value = null
  }

  // ===== 发送消息(流式) =====
  /**
   * send(content) — 把用户消息追加到 current,调 DeepSeek API 流式生成 assistant
   * 返回 Promise(完成时 resolve,中止时 reject AbortError)
   */
  async function send(content) {
    error.value = ''
    if (!hasKey.value) {
      error.value = '请先在「设置 → AI」填入 API Key'
      throw new Error(error.value)
    }
    if (!content?.trim()) return

    // 没有当前会话则新建
    if (!current.value) {
      newConversation(content.slice(0, 24))
    }

    const conv = current.value
    const now = new Date().toISOString()
    conv.messages.push({ role: 'user', content: content.trim(), at: now })
    conv.updatedAt = now

    // 第一条用户消息时,顺手把标题改成消息开头
    if (conv.messages.filter((m) => m.role === 'user').length === 1 && conv.title === '新对话') {
      conv.title = content.trim().slice(0, 24) + (content.length > 24 ? '…' : '')
    }

    // 占位 assistant 消息
    const assistantIdx = conv.messages.push({
      role: 'assistant',
      content: '',
      at: new Date().toISOString(),
      streaming: true,
    }) - 1

    streaming.value = true
    const controller = new AbortController()
    abortController.value = controller

    try {
      const messages = [{ role: 'system', content: systemPrompt.value }]
      // 只送除当前占位之外的消息
      conv.messages.slice(0, -1).forEach((m) => {
        messages.push({ role: m.role, content: m.content })
      })

      const res = await fetch(`${baseUrl.value.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.value.trim()}`,
        },
        body: JSON.stringify({
          model: model.value,
          messages,
          stream: true,
          temperature: 0.7,
        }),
      })

      if (!res.ok) {
        let detail = `HTTP ${res.status}`
        try {
          const j = await res.json()
          if (j?.error?.message) detail += ` — ${j.error.message}`
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
        buffer = lines.pop() // 留最后不完整的一行下轮处理

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('data:')) continue
          const payload = trimmed.slice(5).trim()
          if (payload === '[DONE]') continue
          try {
            const json = JSON.parse(payload)
            const delta = json.choices?.[0]?.delta
            if (delta?.content) {
              conv.messages[assistantIdx].content += delta.content
              conv.updatedAt = new Date().toISOString()
            }
          } catch (e) {
            // 单条解析失败不致命,继续
          }
        }
      }

      conv.messages[assistantIdx].streaming = false
    } catch (e) {
      conv.messages[assistantIdx].streaming = false
      if (e.name === 'AbortError') {
        conv.messages[assistantIdx].content += '\n\n[已中止]'
      } else {
        error.value = e.message || '请求失败'
        conv.messages[assistantIdx].content = `❌ 请求失败:${error.value}\n\n请检查 API Key 是否正确,以及是否能访问 ${baseUrl.value}。`
      }
    } finally {
      streaming.value = false
      abortController.value = null
    }
  }

  function abort() {
    if (abortController.value) {
      abortController.value.abort()
      abortController.value = null
    }
  }

  function clearError() {
    error.value = ''
  }

  return {
    apiKey,
    baseUrl,
    model,
    systemPrompt,
    conversations,
    currentId,
    streaming,
    error,
    sorted,
    current,
    hasKey,
    newConversation,
    openConversation,
    removeConversation,
    renameConversation,
    clearAll,
    send,
    abort,
    clearError,
  }
})
