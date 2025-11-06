// ============================================================================
// FILE: apps/teacher-app/src/pages/ContentManager.jsx
// ============================================================================
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
//import { apiClient } from '@acharya108/api-client'
import './ContentManager.css'

export default function ContentManager() {
  const [lessons, setLessons] = useState([])
  const [filteredLessons, setFilteredLessons] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBoard, setSelectedBoard] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLessons()
  }, [])

  useEffect(() => {
    filterLessons()
  }, [searchTerm, selectedBoard, lessons])

  const fetchLessons = async () => {
    try {
      // const data = await apiClient.get('/api/cms/lessons')
      // setLessons(data)
      
      // Mock data
      setLessons([
        { id: '1', title: 'Photosynthesis', board: 'CBSE', grade: 'Class 10', subject: 'Biology', status: 'Published' },
        { id: '2', title: 'Algebra Basics', board: 'TN State Board', grade: 'Class 9', subject: 'Mathematics', status: 'Draft' },
        { id: '3', title: 'World War II', board: 'ICSE', grade: 'Class 11', subject: 'History', status: 'Published' },
      ])
    } catch (error) {
      console.error('Error fetching lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterLessons = () => {
    let filtered = lessons

    if (searchTerm) {
      filtered = filtered.filter(lesson =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.subject.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedBoard !== 'all') {
      filtered = filtered.filter(lesson => lesson.board === selectedBoard)
    }

    setFilteredLessons(filtered)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return

    try {
      // await apiClient.delete(`/api/cms/lessons/${id}`)
      setLessons(lessons.filter(lesson => lesson.id !== id))
    } catch (error) {
      console.error('Error deleting lesson:', error)
      alert('Failed to delete lesson')
    }
  }

  if (loading) {
    return <div className="content-loading">Loading lessons...</div>
  }

  return (
    <div className="content-manager">
      <div className="content-header">
        <h1>Content Manager</h1>
        <Link to="/lessons/create" className="btn btn-primary">
          <Plus size={20} />
          Create New Lesson
        </Link>
      </div>

      <div className="content-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={selectedBoard}
          onChange={(e) => setSelectedBoard(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Boards</option>
          <option value="CBSE">CBSE</option>
          <option value="TN State Board">TN State Board</option>
          <option value="ICSE">ICSE</option>
        </select>
      </div>

      <div className="lessons-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Board</th>
              <th>Grade</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLessons.map(lesson => (
              <tr key={lesson.id}>
                <td className="lesson-title">{lesson.title}</td>
                <td>{lesson.board}</td>
                <td>{lesson.grade}</td>
                <td>{lesson.subject}</td>
                <td>
                  <span className={`status-badge status-${lesson.status.toLowerCase()}`}>
                    {lesson.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/lessons/${lesson.id}/edit`} className="btn-icon">
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="btn-icon btn-danger"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLessons.length === 0 && (
          <div className="empty-state">
            <p>No lessons found. Create your first lesson!</p>
          </div>
        )}
      </div>
    </div>
  )
}
