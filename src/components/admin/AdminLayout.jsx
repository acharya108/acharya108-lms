// src/components/admin/AdminLayout.jsx
import { useState } from 'react'
import { Sidebar } from './Sidebar.jsx'
import { AdminHeader } from './AdminHeader.jsx'
import { Outlet } from 'react-router-dom'

export function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        
        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

// Default export for easier imports
export default AdminLayout