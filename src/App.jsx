import { useEffect, useState } from 'react'
import { api } from './api.js'
import Login from './Login.jsx'
import Customer from './Customer.jsx'
import Staff from './Staff.jsx'
import Admin from './Admin.jsx'

export default function App() {
  const [user, setUser] = useState() // undefined = checking session, null = logged out
  const [activePage, setActivePage] = useState('overview')

  useEffect(() => {
    const out = () => setUser(null)
    api('/me').then(setUser, out)
    window.addEventListener('unauthorized', out)
    return () => window.removeEventListener('unauthorized', out)
  }, [])

  if (user === undefined) return null
  if (!user) return <Login onLogin={setUser} />

  const staff = user.role === 'staff'
  const admin = user.role === 'admin'
  return (
    <div className={`app ${user.role}`}>
      
<header className={`topbar ${admin ? 'topbar-admin' : ''}`}>
  <div className="wrap">
    <div className="topbar-main">
      <h1 className="brand">
        <span className="logo" aria-hidden="true">🍽️</span>
        ครัวอร่อย
        <span className="badge">
          {admin ? 'ระบบผู้ดูแล' : staff ? 'ระบบพนักงาน' : 'สั่งอาหาร'}
        </span>
      </h1>

      <div className="who">
        <span className="avatar" aria-hidden="true">
          {[...user.username][0].toUpperCase()}
        </span>
        <span className="name">
          <small>{admin ? 'ผู้ดูแลระบบ' : staff ? 'พนักงาน' : 'ลูกค้า'}</small>
          {user.username}
        </span>
        <button
          onClick={() => api('/logout', { method: 'POST' }).finally(() => setUser(null))}
        >
          ออกจากระบบ
        </button>
      </div>
    </div>

    {admin && (
      <nav className="admin-navigation">
        <button
          type="button"
          className={activePage === 'overview' ? 'admin-primary' : 'admin-secondary'}
          onClick={() => setActivePage('overview')}
        >
          📊 ภาพรวมร้านและออเดอร์
        </button>

        <button
          type="button"
          className={activePage === 'menu' ? 'admin-primary' : 'admin-secondary'}
          onClick={() => setActivePage('menu')}
        >
          🍽️ จัดการเมนูอาหาร
        </button>
      </nav>
    )}
  </div>
</header>

      <div className="wrap">
        {admin ? (
  <Admin activePage={activePage} setActivePage={setActivePage} />
) : staff ? (
  <Staff />
) : (
  <Customer />
)}</div>
    </div>
  )
}
