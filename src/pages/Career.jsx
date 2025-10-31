import React from 'react';
import styles from '../styles/Common.module.css';

const Career = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <h1>Careers at DrillMasters</h1>
        <p>Join our team and help shape the future of education!</p>
        
        <div className={styles.careerInfo}>
          <h2>Current Openings</h2>
          <div className={styles.jobListing}>
            <h3>Subject Matter Expert</h3>
            <p>Create and review course content for various subjects.</p>
          </div>
          
          <div className={styles.jobListing}>
            <h3>Online Tutor</h3>
            <p>Provide live tutoring sessions and doubt clarification.</p>
          </div>
          
          <div className={styles.jobListing}>
            <h3>Content Developer</h3>
            <p>Develop engaging educational materials and resources.</p>
          </div>
        </div>
        
        <div className={styles.applicationInfo}>
          <h2>How to Apply</h2>
          <p>Send your resume and portfolio to: careers@drillmasters.in</p>
        </div>
      </div>
    </div>
  );
};

export default Career;