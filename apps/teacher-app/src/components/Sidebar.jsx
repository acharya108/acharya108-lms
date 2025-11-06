// ============================================================================
// FILE: apps/teacher-app/src/components/Sidebar.jsx
// ============================================================================
import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  Home, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Library, 
  BarChart3, 
  Settings,
  LogOut
} from 'lucide-react'
import './Sidebar.css'

export default function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_role')
    window.location.href = '/admin'
  }

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/content', icon: BookOpen, label: 'Content Manager' },
    { path: '/lessons/create', icon: FileText, label: 'Create Lesson' },
    { path: '/questions', icon: HelpCircle, label: 'Question Bank' },
    { path: '/library', icon: Library, label: 'Content Library' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Acharya108 LMS</h2>
        <p className="sidebar-subtitle">Teacher Portal</p>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            end={item.path === '/'}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="sidebar-link logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
