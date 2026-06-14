/**
 * 统一 API 封装 —— 同源 /api，由 nginx 反代到后端
 * 管理写操作自动带 x-admin-token（从 sessionStorage 取）
 */
const BASE = '/api'

export function adminToken() {
  try {
    return sessionStorage.getItem('apos:admin') || ''
  } catch {
    return ''
  }
}

async function req(method, path, body, { admin = false } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (admin) headers['x-admin-token'] = adminToken()
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const ct = res.headers.get('content-type') || ''
  const data = ct.includes('application/json') ? await res.json().catch(() => null) : await res.text()
  if (!res.ok) {
    const err = new Error((data && data.error) || `请求失败 (${res.status})`)
    err.status = res.status
    throw err
  }
  return data
}

export const api = {
  get: (p) => req('GET', p),
  post: (p, b, o) => req('POST', p, b, o),
  put: (p, b, o) => req('PUT', p, b, o),
  del: (p, o) => req('DELETE', p, undefined, o),
  // AI 流式：直接返回 Response 供调用方读取 SSE 流
  chatStream: (messages, knowledge, signal) =>
    fetch(BASE + '/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, knowledge }),
      signal,
    }),
  adminToken,
}
