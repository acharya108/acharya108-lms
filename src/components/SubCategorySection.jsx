// src/components/SubCategorySection.jsx
import React, { useState } from 'react';
import CourseGrid from './CourseGrid';
import styles from '../styles/SubCategorySection.module.css';

const SubCategorySection = ({ subCategory, onCourseClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.subCategorySection}>
      <div 
        className={styles.subCategoryHeader}
        onClick={toggleExpand}
      >
        <div className={styles.subCategoryInfo}>
          <h4 className={styles.subCategoryTitle}>
            {subCategory.name}
          </h4>
          <span className={styles.subCategoryDescription}>
            {subCategory.description}
          </span>
        </div>
        
        <div className={styles.subCategoryStats}>
          <span className={styles.courseCount}>
            {subCategory.courses?.length || 0} Courses
          </span>
          <span className={`${styles.arrow} ${isExpanded ? styles.arrowOpen : ''}`}>
            ▼
          </span>
        </div>
      </div>

      <div className={`${styles.subCategoryContent} ${isExpanded ? styles.contentVisible : styles.contentHidden}`}>
        {subCategory.courses && subCategory.courses.length > 0 ? (
          <CourseGrid 
            courses={subCategory.courses}
            onCourseClick={onCourseClick}
          />
        ) : (
          <div className={styles.noCourses}>
            Courses coming soon...
          </div>
        )}
      </div>
    </div>
  );
};

export default SubCategorySection;