/**
 * 管理员登录态 —— 口令换 token，存 sessionStorage（会话级，关标签即清）
 * 仅用于文章增删改、删除留言等写操作；读操作全部公开。
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/utils/api'

export const useAdminStore = defineStore('admin', () => {
  const token = ref('')
  try {
    token.value = sessionStorage.getItem('apos:admin') || ''
  } catch {}
  const isAdmin = ref(!!token.value)

  async function login(password) {
    const r = await api.post('/admin/login', { password })
    token.value = r.token
    isAdmin.value = true
    try {
      sessionStorage.setItem('apos:admin', r.token)
    } catch {}
    return true
  }

  function logout() {
    token.value = ''
    isAdmin.value = false
    try {
      sessionStorage.removeItem('apos:admin')
    } catch {}
  }

  return { token, isAdmin, login, logout }
})
