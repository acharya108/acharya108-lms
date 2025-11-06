// ============================================================================
// FILE: apps/teacher-app/src/App.jsx
// ============================================================================
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ContentManager from './pages/ContentManager'
import LessonCreator from './pages/LessonCreator'
import QuestionBankManager from './pages/QuestionBankManager'
import ContentLibrary from './pages/ContentLibrary'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Login from './pages/Login'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)

  React.useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token')
    const role = localStorage.getItem('user_role')
    
    if (token && (role === 'teacher' || role === 'admin')) {
      setIsAuthenticated(true)
    }
  }, [])

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/content" element={<ContentManager />} />
        <Route path="/lessons/create" element={<LessonCreator />} />
        <Route path="/lessons/:id/edit" element={<LessonCreator />} />
        <Route path="/questions" element={<QuestionBankManager />} />
        <Route path="/library" element={<ContentLibrary />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
