import React from 'react';
import styles from '../styles/Common.module.css';

const Support = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <h1>Support</h1>
        <p>We're here to help you with any questions or issues you may have.</p>
        
        <div className={styles.contactInfo}>
          <h2>Contact Support</h2>
          <p>📧 Email: support@drillmasters.in</p>
          <p>📞 Phone: +91-XXXXXXXXXX</p>
          <p>🕒 Support Hours: 9:00 AM - 6:00 PM (IST)</p>
        </div>
        
        <div className={styles.faqSection}>
          <h2>Common Issues</h2>
          <ul>
            <li>Course access problems</li>
            <li>Payment and enrollment issues</li>
            <li>Technical difficulties</li>
            <li>Account management</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Support;