// src/components/ProtectedCourseRoute.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import CourseEnrollment from './CourseEnrollment';
import styles from '../styles/Common.module.css';

export default function ProtectedCourseRoute({ 
  courseId, 
  courseName, 
  children 
}) {
  const { user, isUserEnrolled, loading } = useAuth();

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.textCenter}>
          <div className={styles.loadingSpinner}></div>
          <p>Checking course access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.textCenter}>
          <h2>Access Required</h2>
          <p>Please log in to access course content.</p>
        </div>
      </div>
    );
  }

  if (!isUserEnrolled(courseId)) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.textCenter}>
          <h2>Enrollment Required for {courseName}</h2>
          <p>You need to enroll in this course to access the content.</p>
          
          <div style={{ marginTop: '2rem' }}>
            <CourseEnrollment 
              courseId={courseId} 
              courseName={courseName}
            />
          </div>
          
          <div style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '600px', margin: '2rem auto' }}>
            <h3>Course Preview</h3>
            <p>This course covers comprehensive preparation materials and practice tests.</p>
            <ul style={{ textAlign: 'left', display: 'inline-block' }}>
              <li>Structured learning path</li>
              <li>Interactive quizzes</li>
              <li>Progress tracking</li>
              <li>Expert guidance</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // User is enrolled, show course content
  return (
    <div className={styles.pageContainer}>
      <div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '8px',
        marginBottom: '2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h1 style={{ margin: 0, color: '#333' }}>{courseName}</h1>
          <div style={{ 
            background: '#28a745', 
            color: 'white', 
            padding: '8px 16px', 
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}>
            ✅ Enrolled
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}