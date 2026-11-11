import { useState } from 'react'
import { api } from './api.js'

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      onLogin(await api('/' + mode, { method: 'POST', body: { username, password } }))
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  const tab = (m, label) => (
    <button type="button" aria-pressed={mode === m} onClick={() => { setMode(m); setError('') }}>
      {label}
    </button>
  )

  return (
    <div className="app login-page">
      <aside className="login-hero">
        <img src="/menu/tom-yum-kung.jpg" alt="" />
        <div className="login-hero-text">
          <span className="logo" aria-hidden="true">🍽️</span>
          <h2>ครัวอร่อย</h2>
          <p>อาหารไทยรสจัดจ้าน สั่งง่าย ปรับรสได้ตามใจ</p>
        </div>
      </aside>
      <main className="login">
        <form className="panel login-card" onSubmit={submit}>
          <h1>{mode === 'login' ? 'ยินดีต้อนรับกลับมา' : 'สร้างบัญชีใหม่'}</h1>
          <p className="muted">
            {mode === 'login' ? 'เข้าสู่ระบบเพื่อสั่งอาหารหรือจัดการออเดอร์' : 'สมัครฟรี แล้วเริ่มสั่งอาหารได้ทันที'}
          </p>
          <div className="tabs">
            {tab('login', 'เข้าสู่ระบบ')}
            {tab('register', 'สมัครสมาชิก')}
          </div>
          <label>
            ชื่อผู้ใช้
            <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
          </label>
          <label>
            รหัสผ่าน
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </label>
          <button className="primary" disabled={busy}>
            {mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
          </button>
          {error && <p role="alert" className="error">{error}</p>}
          <p className="muted small note">
            {mode === 'login'
              ? 'พนักงานและลูกค้าเข้าสู่ระบบที่หน้านี้ ระบบจะพาไปหน้าตามสิทธิ์ของบัญชี'
              : 'สมัครได้เฉพาะบัญชีลูกค้า บัญชีพนักงานสร้างโดยผู้ดูแลระบบ'}
          </p>
        </form>
      </main>
    </div>
  )
}
