/**
 * Pinia store 持久化辅助
 * - 把 store.$state 自动同步到 localStorage,key 用 'apos:<storeId>'
 * - watch deep 监听变化即写入
 * - 初始化时从 localStorage 反序列化,失败用 fallback
 *
 * 使用:
 *   import { persist } from './_persist'
 *   export const useFoo = defineStore('foo', () => {
 *     const list = ref([])
 *     persist('foo', { list }, () => ({ list: [] }))
 *     return { list }
 *   })
 */
import { watch } from 'vue'

const PREFIX = 'apos'

export function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(`${PREFIX}:${key}`)
    if (!raw) return typeof fallback === 'function' ? fallback() : fallback
    return JSON.parse(raw)
  } catch (e) {
    console.warn('[apos] loadState failed', key, e)
    return typeof fallback === 'function' ? fallback() : fallback
  }
}

export function saveState(key, value) {
  try {
    localStorage.setItem(`${PREFIX}:${key}`, JSON.stringify(value))
  } catch (e) {
    console.warn('[apos] saveState failed', key, e)
  }
}

export function persist(key, refs, fallback) {
  const saved = loadState(key, fallback)
  for (const k of Object.keys(refs)) {
    if (saved && saved[k] !== undefined) refs[k].value = saved[k]
  }
  watch(
    () => Object.fromEntries(Object.keys(refs).map((k) => [k, refs[k].value])),
    (val) => saveState(key, val),
    { deep: true }
  )
}

export function clearAll() {
  const keys = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && k.startsWith(`${PREFIX}:`)) keys.push(k)
  }
  keys.forEach((k) => localStorage.removeItem(k))
}

export function exportAll() {
  const data = {}
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && k.startsWith(`${PREFIX}:`)) {
      try {
        data[k.slice(PREFIX.length + 1)] = JSON.parse(localStorage.getItem(k))
      } catch {}
    }
  }
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  }
}

export function importAll(payload) {
  if (!payload || !payload.data) throw new Error('数据格式不正确')
  Object.entries(payload.data).forEach(([k, v]) => {
    saveState(k, v)
  })
}
