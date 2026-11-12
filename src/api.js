
const API_URL = import.meta.env.VITE_API_URL || ''
const TOKEN_KEY = 'token'

export async function api(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem(TOKEN_KEY)

  const headers = {
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const res = await fetch(API_URL + '/api' + path, {
    method,
    headers,
    body: body && JSON.stringify(body),
  })

  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY)
    window.dispatchEvent(new Event('unauthorized'))
  }

  if (res.status === 204) {
    if (path === '/logout') {
      localStorage.removeItem(TOKEN_KEY)
    }
    return null
  }

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.error?.message || data.error || 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้')
  }

  if ((path === '/login' || path === '/register') && data.token) {
    localStorage.setItem(TOKEN_KEY, data.token)
  }

  return data
}

export const statusLabel = {
  pending: 'รอรับออเดอร์',
  cooking: 'กำลังทำ',
  ready: 'พร้อมเสิร์ฟ',
  done: 'เสร็จสิ้น',
  cancelled: 'ยกเลิก',
}

export const baht = (n) => '฿' + n.toLocaleString('th-TH')

export const itemText = (i) => `${i.name}${i.options.length ? ` (${i.options.join(', ')})` : ''} ×${i.qty}`

export const formatTime = (iso) => new Date(iso).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })
