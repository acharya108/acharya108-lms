import React from 'react';
import styles from '../styles/Common.module.css';

const FAQs = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <h1>Frequently Asked Questions</h1>
        
        <div className={styles.faqItem}>
          <h3>How do I enroll in a course?</h3>
          <p>Click on any course card from the home page and follow the enrollment instructions.</p>
        </div>
        
        <div className={styles.faqItem}>
          <h3>Are the courses free?</h3>
          <p>Yes, all our courses are completely free as mentioned in our platform description.</p>
        </div>
        
        <div className={styles.faqItem}>
          <h3>Do I get a certificate after completion?</h3>
          <p>Yes, certificates are provided upon successful completion of courses.</p>
        </div>
        
        <div className={styles.faqItem}>
          <h3>Can I access courses on mobile?</h3>
          <p>Yes, our platform is fully responsive and works on all devices.</p>
        </div>
        
        <div className={styles.faqItem}>
          <h3>How do I reset my password?</h3>
          <p>Please contact support for password reset assistance.</p>
        </div>
      </div>
    </div>
  );
};

export default FAQs;