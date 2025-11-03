// src/components/CourseCard.jsx
import React from 'react';
import styles from '../styles/CourseCard.module.css';

const CourseCard = ({ course, onClick }) => {
  return (
    <div className={styles.courseCard} onClick={() => onClick(course.id)}>
      <div className={styles.courseIcon}>
        {course.name.charAt(0)}
      </div>
      <div className={styles.courseInfo}>
        <h4 className={styles.courseName}>{course.name}</h4>
        <p className={styles.courseDescription}>
          {course.description && course.description.length > 120 
            ? `${course.description.substring(0, 120)}...` 
            : course.description || 'Course details available after enrollment'
          }
        </p>
        <div className={styles.courseMeta}>
          {course.duration && (
            <span className={styles.courseDuration}>⏱️ {course.duration}</span>
          )}
          {course.level && (
            <span className={styles.courseLevel}>{course.level}</span>
          )}
        </div>
        <button className={styles.learnMoreBtn}>
          Explore Course →
        </button>
      </div>
    </div>
  );
};

export default CourseCard;