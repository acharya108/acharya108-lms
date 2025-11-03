// src/components/CourseGrid.jsx
import React from 'react';
import CourseCard from './CourseCard';
import styles from '../styles/CourseGrid.module.css';

const CourseGrid = ({ courses, onCourseClick }) => {
  return (
    <div className={styles.courseGrid}>
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onClick={() => onCourseClick(course.id)}
        />
      ))}
    </div>
  );
};

export default CourseGrid;