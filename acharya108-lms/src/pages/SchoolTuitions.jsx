// src/pages/SchoolTuitions.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SchoolBoardTabs from '../components/SchoolBoardTabs';
import styles from '../styles/SchoolTuitions.module.css';

const SchoolTuitions = () => {
  const navigate = useNavigate();
  const { user, userInfo, enrollInCourse, isUserEnrolled } = useAuth();

  const handleEnrollSchoolTuitions = () => {
    if (!user) {
      alert('Please login to enroll in school tuitions');
      return;
    }

    const result = enrollInCourse('school-tuitions');
    if (result.success) {
      alert('Successfully enrolled in school tuitions!');
      navigate('/course/school-tuitions');
    } else {
      alert(result.error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>School Tuitions</h1>
      
      {userInfo && userInfo.categoryCode === 'ST' && (
        <div className={styles.userInfo}>
          <h3>Your School Profile</h3>
          <p>Board: {userInfo.board}</p>
          <p>Class: {userInfo.classGrade}</p>
          <p>Medium: {userInfo.medium}</p>
        </div>
      )}

      {isUserEnrolled('school-tuitions') ? (
        <div className={styles.enrolledSection}>
          <h2>You are enrolled in School Tuitions</h2>
          <button onClick={() => navigate('/course/school-tuitions')}>
            Go to Course Content
          </button>
        </div>
      ) : (
        <div className={styles.enrollSection}>
          <h2>Enroll in School Tuitions</h2>
          <p>Access comprehensive school curriculum support for your board and class</p>
          <button onClick={handleEnrollSchoolTuitions}>
            Enroll Now
          </button>
        </div>
      )}

      <div className={styles.boardsSection}>
        <SchoolBoardTabs />
      </div>
    </div>
  );
};

export default SchoolTuitions;