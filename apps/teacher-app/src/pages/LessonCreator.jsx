// apps/teacher-app/src/pages/LessonCreator.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Upload, Save, Eye } from 'lucide-react'
//import { apiClient } from '@acharya108/api-client'
import './LessonCreator.css'

export default function LessonCreator() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    board: '',
    grade: '',
    subject: '',
    description: '',
    pdfFile: null
  })
  const [levels, setLevels] = useState({
    1: { notes: '', videos: [], interactives: [] },
    2: { notes: '', videos: [], interactives: [] },
    3: { notes: '', videos: [], interactives: [] },
    4: { notes: '', videos: [], interactives: [] },
    5: { notes: '', videos: [], interactives: [] }
  })
  const [activeLevel, setActiveLevel] = useState(1)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    if (id) {
      fetchLesson(id)
    }
  }, [id])

  const fetchLesson = async (lessonId) => {
    try {
      // const data = await apiClient.get(`/api/cms/lessons/${lessonId}`)
      // setFormData(data)
      // setLevels(data.levels)
    } catch (error) {
      console.error('Error fetching lesson:', error)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setFormData({ ...formData, pdfFile: file })
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('pdf', file)

      // Upload PDF and extract text
      // const result = await apiClient.post('/api/cms/upload-pdf', formData, {
      //   onUploadProgress: (progressEvent) => {
      //     const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      //     setUploadProgress(progress)
      //   }
      // })

      // Auto-generate notes for all levels
      // const generatedLevels = await apiClient.post('/api/cms/generate-notes', {
      //   text: result.extractedText,
      //   lessonId: id
      // })
      // setLevels(generatedLevels)

      alert('PDF uploaded and notes generated successfully!')
    } catch (error) {
      console.error('Error uploading PDF:', error)
      alert('Failed to upload PDF')
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  const handleSave = async () => {
    setLoading(true)

    try {
      const lessonData = {
        ...formData,
        levels
      }

      if (id) {
        // await apiClient.put(`/api/cms/lessons/${id}`, lessonData)
        alert('Lesson updated successfully!')
      } else {
        // await apiClient.post('/api/cms/lessons', lessonData)
        alert('Lesson created successfully!')
      }

      navigate('/content')
    } catch (error) {
      console.error('Error saving lesson:', error)
      alert('Failed to save lesson')
    } finally {
      setLoading(false)
    }
  }

  const handleAddVideo = (level, url) => {
    setLevels({
      ...levels,
      [level]: {
        ...levels[level],
        videos: [...levels[level].videos, url]
      }
    })
  }

  return (
    <div className="lesson-creator">
      <div className="creator-header">
        <h1>{id ? 'Edit Lesson' : 'Create New Lesson'}</h1>
        <div className="creator-actions">
          <button onClick={() => navigate('/content')} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary" disabled={loading}>
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Lesson'}
          </button>
        </div>
      </div>

      <div className="creator-grid">
        <div className="creator-sidebar">
          <div className="creator-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label>Lesson Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter lesson title"
              />
            </div>

            <div className="form-group">
              <label>Board</label>
              <select
                value={formData.board}
                onChange={(e) => setFormData({...formData, board: e.target.value})}
              >
                <option value="">Select Board</option>
                <option value="CBSE">CBSE</option>
                <option value="TN State Board">TN State Board</option>
                <option value="ICSE">ICSE</option>
              </select>
            </div>

            <div className="form-group">
              <label>Grade</label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({...formData, grade: e.target.value})}
              >
                <option value="">Select Grade</option>
                {Array.from({length: 12}, (_, i) => (
                  <option key={i+1} value={`Class ${i+1}`}>Class {i+1}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                placeholder="Enter subject"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of the lesson"
                rows={4}
              />
            </div>
          </div>

          <div className="creator-section">
            <h3>Upload PDF</h3>
            <div className="upload-area">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                id="pdf-upload"
                hidden
              />
              <label htmlFor="pdf-upload" className="upload-label">
                <Upload size={32} />
                <p>Click to upload PDF</p>
                <span>PDF will be processed automatically</span>
              </label>
              {uploadProgress > 0 && (
                <div className="upload-progress">
                  <div className="progress-bar" style={{width: `${uploadProgress}%`}} />
                  <span>{uploadProgress}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="creator-main">
          <div className="level-tabs">
            {[1, 2, 3, 4, 5].map(level => (
              <button
                key={level}
                className={`level-tab ${activeLevel === level ? 'active' : ''}`}
                onClick={() => setActiveLevel(level)}
              >
                Level {level}
              </button>
            ))}
          </div>

          <div className="level-content">
            <div className="form-group">
              <label>Rich Text Notes</label>
              <textarea
                value={levels[activeLevel].notes}
                onChange={(e) => setLevels({
                  ...levels,
                  [activeLevel]: {...levels[activeLevel], notes: e.target.value}
                })}
                placeholder={`Enter notes for Level ${activeLevel}`}
                rows={15}
                className="notes-textarea"
              />
            </div>

            <div className="form-group">
              <label>Video URLs</label>
              <div className="video-list">
                {levels[activeLevel].videos.map((url, index) => (
                  <div key={index} className="video-item">
                    <input type="text" value={url} readOnly />
                    <button 
                      onClick={() => {
                        const newVideos = levels[activeLevel].videos.filter((_, i) => i !== index)
                        setLevels({
                          ...levels,
                          [activeLevel]: {...levels[activeLevel], videos: newVideos}
                        })
                      }}
                      className="btn-icon btn-danger"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => {
                    const url = prompt('Enter video URL:')
                    if (url) handleAddVideo(activeLevel, url)
                  }}
                  className="btn btn-secondary"
                >
                  Add Video
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}