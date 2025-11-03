// src/components/admin/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom'

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: '📊', badge: null },
  { name: 'Categories', href: '/admin/categories', icon: '📁', badge: null },
  { name: 'Academic Programs', href: '/admin/programs', icon: '🎓', badge: null },
  { name: 'Courses', href: '/admin/courses', icon: '📚', badge: null },
  { name: 'Subjects', href: '/admin/subjects', icon: '📖', badge: null },
  { name: 'Lessons', href: '/admin/lessons', icon: '✏️', badge: null },
  { name: 'Content', href: '/admin/content', icon: '🔄', badge: null },
  { name: 'Media Library', href: '/admin/media', icon: '🖼️', badge: null },
  { name: 'Users', href: '/admin/users', icon: '👥', badge: null },
  { name: 'Analytics', href: '/admin/analytics', icon: '📈', badge: null },
]

export function Sidebar({ isOpen, onToggle }) {
  const location = useLocation()

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
      isOpen ? 'w-64' : 'w-20'
    }`}>
      {/* Logo/Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl">🎓</span>
            <h1 className={`font-bold text-xl ml-3 ${isOpen ? 'block' : 'hidden'}`}>
              LMS Admin
            </h1>
          </div>
          <button
            onClick={onToggle}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? '‹' : '›'}
          </button>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center px-4 py-3 text-sm font-medium transition-colors group relative ${
              location.pathname === item.href 
                ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
            title={!isOpen ? item.name : ''}
          >
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            <span className={`ml-3 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 absolute left-12'}`}>
              {item.name}
            </span>
            
            {/* Badge */}
            {item.badge && (
              <span className={`ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ${
                isOpen ? 'block' : 'hidden'
              }`}>
                {item.badge}
              </span>
            )}
            
            {/* Tooltip for collapsed state */}
            {!isOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                {item.name}
              </div>
            )}
          </Link>
        ))}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'}`}>
          {isOpen && (
            <div className="text-xs text-gray-500">
              <div>LMS Platform</div>
              <div>v1.0.0</div>
            </div>
          )}
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
            A
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar