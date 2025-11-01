import React from 'react';

import Layout from '../components/layout';

const Support = () => {
  return (
    <Layout> {/* Fixed: was <laout> */}
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#1e3c72', textAlign: 'center' }}>Support</h1>
        <p>We're here to help you with any questions or issues you may have.</p>
        
        <div style={{ marginTop: '30px' }}>

import styles from '../styles/Common.module.css';

const Support = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <h1>Support</h1>
        <p>We're here to help you with any questions or issues you may have.</p>
        
        <div className={styles.contactInfo}>
 de5d653 (Initial commit of backend files in backend-lms)
          <h2>Contact Support</h2>
          <p>📧 Email: support@drillmasters.in</p>
          <p>📞 Phone: +91-XXXXXXXXXX</p>
          <p>🕒 Support Hours: 9:00 AM - 6:00 PM (IST)</p>
        </div>
        

        <div style={{ marginTop: '30px' }}>

        <div className={styles.faqSection}>
 de5d653 (Initial commit of backend files in backend-lms)
          <h2>Common Issues</h2>
          <ul>
            <li>Course access problems</li>
            <li>Payment and enrollment issues</li>
            <li>Technical difficulties</li>
            <li>Account management</li>
          </ul>
        </div>
      </div>

    </Layout>

    </div>
 de5d653 (Initial commit of backend files in backend-lms)
  );
};

export default Support;