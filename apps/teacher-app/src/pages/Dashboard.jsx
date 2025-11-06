// ============================================================================
// FILE: apps/teacher-app/src/pages/Dashboard.jsx
// ============================================================================
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Users, FileText, TrendingUp } from 'lucide-react'
//import { apiClient } from '@acharya108/api-client'
import './Dashboard.css'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalLessons: 0,
    totalStudents: 0,
    totalQuestions: 0,
    avgProgress: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard statistics
      // const data = await apiClient.get('/api/cms/dashboard')
      // setStats(data.stats)
      // setRecentActivity(data.recentActivity)
      
      // Mock data for now
      setStats({
        totalLessons: 45,
        totalStudents: 234,
        totalQuestions: 567,
        avgProgress: 68
      })
      
      setRecentActivity([
        { id: 1, type: 'lesson', title: 'Created: Photosynthesis', time: '2 hours ago' },
        { id: 2, type: 'student', title: 'New enrollment: John Doe', time: '5 hours ago' },
        { id: 3, type: 'question', title: 'Added 10 questions to Algebra', time: '1 day ago' },
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { icon: BookOpen, label: 'Total Lessons', value: stats.totalLessons, color: 'blue' },
    { icon: Users, label: 'Total Students', value: stats.totalStudents, color: 'green' },
    { icon: FileText, label: 'Questions Created', value: stats.totalQuestions, color: 'orange' },
    { icon: TrendingUp, label: 'Avg. Progress', value: `${stats.avgProgress}%`, color: 'purple' }
  ]

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your courses.</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat) => (
          <div key={stat.label} className={`stat-card stat-${stat.color}`}>
            <div className="stat-icon">
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <Link to="/lessons/create" className="action-btn">
              <BookOpen size={20} />
              Create New Lesson
            </Link>
            <Link to="/questions" className="action-btn">
              <FileText size={20} />
              Add Questions
            </Link>
            <Link to="/library" className="action-btn">
              <BookOpen size={20} />
              Browse Library
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'lesson' && <BookOpen size={16} />}
                  {activity.type === 'student' && <Users size={16} />}
                  {activity.type === 'question' && <FileText size={16} />}
                </div>
                <div className="activity-content">
                  <p className="activity-title">{activity.title}</p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
