// src/components/CourseEnrollment.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Common.module.css';

export default function CourseEnrollment({ courseId, courseName, onEnrollmentSuccess }) {
  const { user, enrollInCourse, isUserEnrolled, canEnrollInCourse, userInfo } = useAuth();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [message, setMessage] = useState('');

  const handleEnroll = async () => {
    if (!user) {
      setMessage('Please login to enroll in this course');
      return;
    }

    if (isUserEnrolled(courseId)) {
      setMessage('You are already enrolled in this course');
      return;
    }

    // Check if user has access to this course
    if (!canEnrollInCourse(courseId)) {
      setMessage('Access denied. This course is not available for your user account.');
      return;
    }

    setIsEnrolling(true);
    setMessage('');

    const result = enrollInCourse(courseId);
    
    if (result.success) {
      setMessage('Successfully enrolled in the course!');
      if (onEnrollmentSuccess) {
        onEnrollmentSuccess(result.enrollment);
      }
      
      // Refresh the page after 2 seconds to show course content
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      setMessage(result.error);
    }
    
    setIsEnrolling(false);
  };

  if (isUserEnrolled(courseId)) {
    return (
      <div style={{ 
        background: '#d4edda', 
        color: '#155724', 
        padding: '1rem', 
        borderRadius: '6px',
        textAlign: 'center',
        margin: '1rem 0'
      }}>
        <div style={{ 
          background: '#28a745', 
          color: 'white', 
          padding: '8px 16px', 
          borderRadius: '20px',
          fontWeight: 'bold',
          display: 'inline-block',
          marginBottom: '0.5rem'
        }}>
          ✅ Enrolled
        </div>
        <p style={{ margin: 0 }}>You have access to this course content.</p>
      </div>
    );
  }

  // Check if user has access to this course
  const hasAccess = canEnrollInCourse(courseId);

  return (
    <div style={{ 
      background: 'white', 
      padding: '2rem', 
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      textAlign: 'center',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <h3 style={{ color: '#333', marginBottom: '1rem' }}>Enroll in {courseName}</h3>
      
      {userInfo && userInfo.valid && (
        <div style={{
          background: hasAccess ? '#e8f5e8' : '#fff3cd',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '1rem',
          border: `1px solid ${hasAccess ? '#c3e6cb' : '#ffeaa7'}`
        }}>
          <p style={{ 
            margin: 0, 
            fontWeight: 'bold',
            color: hasAccess ? '#155724' : '#856404'
          }}>
            {hasAccess ? '✅ Access Granted' : '⚠️ Limited Access'}
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
            User: {userInfo.category} • {userInfo.board || 'General'} • {userInfo.class || 'All Levels'}
          </p>
        </div>
      )}

      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        {hasAccess 
          ? 'Enroll now to access all course materials, quizzes, and progress tracking.'
          : 'Your user account has restricted access to this course.'
        }
      </p>
      
      <button 
        onClick={handleEnroll}
        style={{
          background: hasAccess 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
            : '#6c757d',
          color: 'white',
          border: 'none',
          padding: '12px 30px',
          borderRadius: '6px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: hasAccess ? 'pointer' : 'not-allowed',
          transition: 'transform 0.2s ease',
          opacity: isEnrolling || !user || !hasAccess ? 0.6 : 1
        }}
        disabled={isEnrolling || !user || !hasAccess}
        onMouseOver={(e) => {
          if (!isEnrolling && user && hasAccess) e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
        }}
      >
        {isEnrolling ? 'Enrolling...' : (
          hasAccess ? 'Enroll Now' : 'Access Restricted'
        )}
      </button>

      {!user && (
        <p style={{ 
          color: '#dc3545', 
          fontStyle: 'italic', 
          marginTop: '1rem',
          fontSize: '0.9rem'
        }}>
          Please login first to enroll in courses.
        </p>
      )}

      {!hasAccess && user && (
        <p style={{ 
          color: '#856404', 
          fontStyle: 'italic', 
          marginTop: '1rem',
          fontSize: '0.9rem'
        }}>
          Contact support if you need access to this course.
        </p>
      )}

      {message && (
        <div style={{ 
          marginTop: '1rem',
          padding: '0.75rem',
          borderRadius: '4px',
          background: message.includes('Successfully') ? '#d4edda' : 
                     message.includes('Access denied') ? '#fff3cd' : '#f8d7da',
          color: message.includes('Successfully') ? '#155724' : 
                message.includes('Access denied') ? '#856404' : '#721c24',
          fontSize: '0.9rem'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}