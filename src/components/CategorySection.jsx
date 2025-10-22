// src/components/CategorySection.jsx
import React, { useState } from 'react';
import SubCategorySection from './SubCategorySection';
import styles from '../styles/CategorySection.module.css';

const CategorySection = ({ category, onCourseClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getTotalCourses = () => {
    return category.subCategories.reduce((total, subCategory) => 
      total + (subCategory.courses?.length || 0), 0
    );
  };

  return (
    <div className={styles.categorySection}>
      <div 
        className={styles.categoryHeader}
        onClick={toggleExpand}
      >
        <div className={styles.categoryInfo}>
          <h3 className={styles.categoryTitle}>
            {category.name}
          </h3>
          <span className={styles.categoryDescription}>
            {category.description}
          </span>
        </div>
        
        <div className={styles.categoryStats}>
          <span className={styles.subCategoryCount}>
            {category.subCategories.length} Sub-Categories
          </span>
          <span className={styles.courseCount}>
            {getTotalCourses()} Courses
          </span>
          <span className={`${styles.arrow} ${isExpanded ? styles.arrowOpen : ''}`}>
            ▼
          </span>
        </div>
      </div>

      <div className={`${styles.categoryContent} ${isExpanded ? styles.contentVisible : styles.contentHidden}`}>
        {category.subCategories.map((subCategory) => (
          <SubCategorySection
            key={subCategory.id}
            subCategory={subCategory}
            onCourseClick={onCourseClick}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;