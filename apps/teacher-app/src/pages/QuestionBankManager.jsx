// apps/teacher-app/src/pages/QuestionBankManager.jsx
import React, { useState } from 'react'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import './QuestionBankManager.css'

export default function QuestionBankManager() {
  const [questions, setQuestions] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [formData, setFormData] = useState({
    type: 'MCQ',
    questionText: '',
    difficulty: 1,
    options: ['', '', '', ''],
    correctAnswer: '',
    keyTerms: []
  })

  const handleAddQuestion = () => {
    setCurrentQuestion(null)
    setFormData({
      type: 'MCQ',
      questionText: '',
      difficulty: 1,
      options: ['', '', '', ''],
      correctAnswer: '',
      keyTerms: []
    })
    setShowModal(true)
  }

  const handleSaveQuestion = () => {
    if (currentQuestion) {
      setQuestions(questions.map(q => q.id === currentQuestion.id ? {...formData, id: currentQuestion.id} : q))
    } else {
      setQuestions([...questions, {...formData, id: Date.now().toString()}])
    }
    setShowModal(false)
  }

  const handleDeleteQuestion = (id) => {
    if (confirm('Delete this question?')) {
      setQuestions(questions.filter(q => q.id !== id))
    }
  }

  return (
    <div className="question-bank">
      <div className="question-header">
        <h1>Question Bank Manager</h1>
        <button onClick={handleAddQuestion} className="btn btn-primary">
          <Plus size={20} />
          Add Question
        </button>
      </div>

      <div className="question-filters">
        <div className="search-box">
          <Search size={20} />
          <input type="text" placeholder="Search questions..." />
        </div>
        <select className="filter-select">
          <option value="all">All Types</option>
          <option value="MCQ">MCQ</option>
          <option value="Descriptive">Descriptive</option>
        </select>
      </div>

      <div className="questions-list">
        {questions.map(q => (
          <div key={q.id} className="question-card">
            <div className="question-content">
              <span className="question-type">{q.type}</span>
              <p className="question-text">{q.questionText}</p>
              <span className="question-difficulty">Level {q.difficulty}</span>
            </div>
            <div className="question-actions">
              <button className="btn-icon"><Edit size={16} /></button>
              <button onClick={() => handleDeleteQuestion(q.id)} className="btn-icon btn-danger">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{currentQuestion ? 'Edit Question' : 'Add New Question'}</h2>
            
            <div className="form-group">
              <label>Question Type</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="MCQ">Multiple Choice</option>
                <option value="Descriptive">Descriptive</option>
              </select>
            </div>

            <div className="form-group">
              <label>Question Text</label>
              <textarea
                value={formData.questionText}
                onChange={(e) => setFormData({...formData, questionText: e.target.value})}
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>Difficulty Level</label>
              <select value={formData.difficulty} onChange={(e) => setFormData({...formData, difficulty: parseInt(e.target.value)})}>
                {[1,2,3,4,5].map(l => <option key={l} value={l}>Level {l}</option>)}
              </select>
            </div>

            {formData.type === 'MCQ' && (
              <>
                <div className="form-group">
                  <label>Options</label>
                  {formData.options.map((opt, i) => (
                    <input
                      key={i}
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...formData.options]
                        newOptions[i] = e.target.value
                        setFormData({...formData, options: newOptions})
                      }}
                      placeholder={`Option ${i+1}`}
                    />
                  ))}
                </div>
                <div className="form-group">
                  <label>Correct Answer</label>
                  <select value={formData.correctAnswer} onChange={(e) => setFormData({...formData, correctAnswer: e.target.value})}>
                    <option value="">Select correct answer</option>
                    {formData.options.map((opt, i) => opt && <option key={i} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </>
            )}

            <div className="modal-actions">
              <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleSaveQuestion} className="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}