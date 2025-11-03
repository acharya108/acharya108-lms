// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react'

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalLessons: 0,
    activePrograms: 0
  })

  const recentActivities = [
    { id: 1, action: 'Course created', target: 'Physics 101', time: '2 hours ago', user: 'Admin' },
    { id: 2, action: 'Lesson updated', target: 'Laws of Motion', time: '5 hours ago', user: 'Content Team' },
    { id: 3, action: 'User registered', target: 'student@example.com', time: '1 day ago', user: 'System' },
    { id: 4, action: 'Program created', target: 'Class 10 - CBSE', time: '2 days ago', user: 'Admin' }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to your LMS administration panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">✏️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Lessons</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLessons}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <span className="text-2xl">🎓</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Programs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activePrograms}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">📝</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {activity.action}: <span className="text-blue-600">{activity.target}</span>
                    </p>
                    <p className="text-sm text-gray-500">By {activity.user}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-center">
              <span className="text-2xl block mb-2">➕</span>
              Create Course
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-center">
              <span className="text-2xl block mb-2">🎓</span>
              Add Program
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-center">
              <span className="text-2xl block mb-2">👥</span>
              Manage Users
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-center">
              <span className="text-2xl block mb-2">📊</span>
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard