// src/components/admin/CourseManager.jsx
import React, { useState, useEffect } from 'react';
import styles from '../../styles/Admin.module.css';

const CourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCourse, setNewCourse] = useState({
    courseId: '',
    name: '',
    category: 'School Tuitions',
    description: '',
    duration: '',
    level: '',
    board: '',
    classGrade: '',
    medium: 'English',
    subjects: '',
    price: '',
    status: 'active'
  });

  // Categories from your Excel structure
  const categories = [
    'School Tuitions',
    'Recruitment Exams', 
    'Entrance Exams',
    'Professional Courses',
    'Technology & IT Certification',
    'Skill Development',
    'Language Courses',
    'Creative Arts',
    'Business & Management',
    'Health & Wellness',
    'Personal Development & Soft Skills',
    'Vocational & Technical Training',
    'Sanatana Dharmic Life Styles'
  ];

  // Boards for school tuitions
  const boards = [
    'TN State Board',
    'CBSE', 
    'ICSE',
    'Pearson,UK',
    'Canada'
  ];

  // Fetch existing courses (mock data for now)
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        const mockCourses = [
          {
            id: '1',
            courseId: 'STTNE10',
            name: 'Class 10 - English Medium',
            category: 'School Tuitions',
            description: 'Complete TN Board Class 10 English Medium syllabus with SSLC preparation',
            duration: '12 months',
            level: 'SSLC',
            board: 'TN State Board',
            classGrade: '10',
            medium: 'English',
            subjects: 'Mathematics,Science,Social Science,English,Tamil',
            price: '₹8,999',
            status: 'active',
            createdAt: new Date().toISOString()
          },
          {
            id: '2', 
            courseId: 'RETPE1',
            name: 'TNPSC Group 1 - English Medium',
            category: 'Recruitment Exams',
            description: 'Complete preparation for TNPSC Group 1 examinations',
            duration: '18 months',
            level: 'Graduate',
            board: '',
            classGrade: '',
            medium: 'English',
            subjects: 'General Studies,Aptitude,Current Affairs',
            price: '₹15,999',
            status: 'active',
            createdAt: new Date().toISOString()
          }
        ];
        setCourses(mockCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Generate a unique ID for the new course
      const courseToAdd = {
        ...newCourse,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      // Add to local state (replace with API call later)
      setCourses(prev => [courseToAdd, ...prev]);
      
      // Reset form
      setNewCourse({
        courseId: '',
        name: '',
        category: 'School Tuitions',
        description: '',
        duration: '',
        level: '',
        board: '',
        classGrade: '',
        medium: 'English',
        subjects: '',
        price: '',
        status: 'active'
      });
      
      alert('Course added successfully!');
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to add course');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setNewCourse(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const deleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(prev => prev.filter(course => course.id !== courseId));
    }
  };

  return (
    <div className={styles.courseManager}>
      <div className={styles.header}>
        <h1>Course Management</h1>
        <p>Add and manage all courses in the system</p>
      </div>

      {/* Add New Course Form */}
      <form onSubmit={handleSubmit} className={styles.courseForm}>
        <h2>Add New Course</h2>
        
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Course ID *</label>
            <input
              type="text"
              value={newCourse.courseId}
              onChange={(e) => handleInputChange('courseId', e.target.value)}
              placeholder="STTNE10, RETPE1, EEMENE1"
              required
            />
            <small>Follow Excel pattern: STTNE10, STTNE6, RETPE1, EEMENE1</small>
          </div>

          <div className={styles.formGroup}>
            <label>Course Name *</label>
            <input
              type="text"
              value={newCourse.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Class 10 - English Medium"
              required
            />
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Category *</label>
            <select
              value={newCourse.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Duration</label>
            <input
              type="text"
              value={newCourse.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              placeholder="6-12 months"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Description *</label>
          <textarea
            value={newCourse.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Detailed course description..."
            rows="3"
            required
          />
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Level</label>
            <input
              type="text"
              value={newCourse.level}
              onChange={(e) => handleInputChange('level', e.target.value)}
              placeholder="SSLC, Graduate, Beginner, Intermediate, Advanced"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Price</label>
            <input
              type="text"
              value={newCourse.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="₹8,999"
            />
          </div>
        </div>

        {/* School-specific fields */}
        {newCourse.category === 'School Tuitions' && (
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Board</label>
              <select
                value={newCourse.board}
                onChange={(e) => handleInputChange('board', e.target.value)}
              >
                <option value="">Select Board</option>
                {boards.map(board => (
                  <option key={board} value={board}>{board}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Class/Grade</label>
              <input
                type="text"
                value={newCourse.classGrade}
                onChange={(e) => handleInputChange('classGrade', e.target.value)}
                placeholder="6, 7, 8, 9, 10, 11, 12"
              />
            </div>
          </div>
        )}

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Medium</label>
            <select
              value={newCourse.medium}
              onChange={(e) => handleInputChange('medium', e.target.value)}
            >
              <option value="English">English</option>
              <option value="Tamil">Tamil</option>
              <option value="Hindi">Hindi</option>
              <option value="Bilingual">Bilingual</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Status</label>
            <select
              value={newCourse.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Subjects (comma separated)</label>
          <input
            type="text"
            value={newCourse.subjects}
            onChange={(e) => handleInputChange('subjects', e.target.value)}
            placeholder="Mathematics, Science, Social Science, English, Tamil"
          />
        </div>

        <div className={styles.formFooter}>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Adding Course...' : 'Add Course'}
          </button>
        </div>
      </form>

      {/* Courses List */}
      <div className={styles.coursesList}>
        <h2>Existing Courses ({courses.length})</h2>
        
        {loading ? (
          <div className={styles.loading}>Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No courses added yet. Create your first course above!</p>
          </div>
        ) : (
          <div className={styles.coursesGrid}>
            {courses.map((course) => (
              <div key={course.id} className={styles.courseCard}>
                <div className={styles.courseHeader}>
                  <h3>{course.name}</h3>
                  <div>
                    <span className={styles.courseId}>{course.courseId}</span>
                    <span className={`${styles.status} ${styles[course.status]}`}>
                      {course.status}
                    </span>
                  </div>
                </div>
                
                <div className={styles.courseMeta}>
                  <span className={styles.category}>{course.category}</span>
                  {course.board && <span className={styles.board}>{course.board}</span>}
                  {course.classGrade && <span className={styles.grade}>Class {course.classGrade}</span>}
                  {course.level && <span className={styles.level}>{course.level}</span>}
                </div>

                <p className={styles.description}>{course.description}</p>
                
                <div className={styles.courseDetails}>
                  {course.duration && <span>⏱️ {course.duration}</span>}
                  {course.medium && <span>🗣️ {course.medium}</span>}
                  {course.price && <span>💰 {course.price}</span>}
                </div>

                {course.subjects && (
                  <div className={styles.subjects}>
                    <strong>Subjects:</strong> {course.subjects}
                  </div>
                )}

                <div className={styles.courseActions}>
                  <button className={styles.editButton}>Edit</button>
                  <button 
                    className={styles.deleteButton}
                    onClick={() => deleteCourse(course.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManager;