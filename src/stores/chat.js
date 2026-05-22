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
import portfolio from '@/data/portfolio.json'

function genId() {
  return 'c-' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4)
}

/**
 * 默认 system prompt — 注入 portfolio 数据
 * 招聘者 / 访客问"赵祥生做过什么 / 会什么 / 在哪工作过"等,AI 直接基于真实数据回答
 */
function defaultSystem() {
  const p = portfolio
  const lines = [
    '你是赵祥生(Apos)个人博客的 AI 助手。下面是关于他的完整真实资料 —— 当用户(尤其是招聘者)询问他的工作经历、项目经验、技能、教育背景时,请基于这些资料用中文简洁、专业地回答。其他与他工作无关的一般性技术或闲聊问题,正常作答即可。',
    '',
    '【个人简介】',
    `- 姓名:${p.profile.name}(${p.profile.alias})`,
    `- 年龄 / 性别:${p.profile.age} 岁 · ${p.profile.gender}`,
    `- 所在地:${p.profile.location}`,
    `- 教育:${p.profile.education.school} · ${p.profile.education.major}(${p.profile.education.period})`,
    `- ${p.profile.education.extra}`,
    `- 语言能力:${p.profile.languages.join('、')}`,
    `- 联系:邮箱 ${p.profile.contact.email} · GitHub ${p.profile.contact.github}`,
    '',
    '【自我概述】',
    p.profile.summary,
    '',
    '【工作经历】',
    ...p.experience.flatMap((e) => [
      `- ${e.company} · ${e.role}(${e.period})${e.current ? ' [在职]' : ''}`,
      `  技术栈:${e.stack.join(' / ')}`,
      ...e.achievements.map((a) => `  · ${a}`),
    ]),
    '',
    '【项目经历】',
    ...p.projects.flatMap((proj) => [
      `- ${proj.name} · ${proj.role}(${proj.period})${proj.ongoing ? ' [进行中]' : ''}`,
      `  技术栈:${proj.stack.join(' / ')}`,
      `  概要:${proj.summary}`,
      ...proj.highlights.map((h) => `  · ${h}`),
    ]),
    '',
    '【技能栈】',
    `- 编程语言:${p.skills.programmingLanguages.join(' / ')}`,
    `- Web 开发:${p.skills.webDev.join(' / ')}`,
    `- ERP & 工业:${p.skills.erpAndIndustrial.join(' / ')}`,
    `- 数据 & 分析:${p.skills.dataAndAnalysis.join(' / ')}`,
    `- 工程化 & 运维:${p.skills.engineering.join(' / ')}`,
    `- AI 协作工具:${p.skills.aiTools.join(' / ')}`,
    '',
    '【奖项与证书】',
    ...p.awards.map((a) => `- ${a}`),
    '',
    '【兴趣方向】',
    ...p.interests.map((i) => `- ${i}`),
    '',
    '回答规则:',
    '1. 招聘类问题(做过什么、会什么、在哪工作、最近的项目),直接基于以上资料回答,不要编造未提及的项目或技术',
    '2. 资料里没有的信息,如实告知"博客资料里没有提及",而不是编造',
    '3. 回答简洁、有条理,优先用要点列举而不是长段落',
    '4. 如果用户想约面试或合作,引导发邮件到上面提供的邮箱',
  ]
  return lines.join('\n')
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
      // 始终注入 portfolio 简历数据(独立 system message),
      // 这样即使用户改过 systemPrompt(localStorage 持久化),招聘类问题也能基于真实数据回答。
      const messages = [
        { role: 'system', content: defaultSystem() },
      ]
      // 用户自定义 prompt 不等于默认时,作为追加 system message 提供个性化指令
      const userPrompt = (systemPrompt.value || '').trim()
      if (userPrompt && userPrompt !== defaultSystem().trim()) {
        messages.push({ role: 'system', content: userPrompt })
      }
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
