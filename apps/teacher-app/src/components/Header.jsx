// ============================================================================
// FILE: apps/teacher-app/src/components/Header.jsx
// ============================================================================
import React from 'react'
import { Bell, User, Menu } from 'lucide-react'
import './Header.css'

export default function Header() {
  const [user, setUser] = React.useState(null)

  React.useEffect(() => {
    const userName = localStorage.getItem('user_name')
    const userEmail = localStorage.getItem('user_email')
    setUser({ name: userName, email: userEmail })
  }, [])

  return (
    <header className="header">
      <button className="header-menu-btn">
        <Menu size={24} />
      </button>
      
      <div className="header-right">
        <button className="header-icon-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        
        <div className="header-user">
          <div className="header-user-info">
            <p className="header-user-name">{user?.name || 'Teacher'}</p>
            <p className="header-user-email">{user?.email || 'teacher@acharya108.com'}</p>
          </div>
          <div className="header-user-avatar">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  )
}
