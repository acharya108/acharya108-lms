import React from 'react';

import Layout from '../components/layout';

const FAQs = () => {
  return (
    <Layout>
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#1e3c72', textAlign: 'center' }}>Frequently Asked Questions</h1>
        
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>

import styles from '../styles/Common.module.css';

const FAQs = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <h1>Frequently Asked Questions</h1>
        
        <div className={styles.faqItem}>
 de5d653 (Initial commit of backend files in backend-lms)
          <h3>How do I enroll in a course?</h3>
          <p>Click on any course card from the home page and follow the enrollment instructions.</p>
        </div>
        

        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>

        <div className={styles.faqItem}>
 de5d653 (Initial commit of backend files in backend-lms)
          <h3>Are the courses free?</h3>
          <p>Yes, all our courses are completely free as mentioned in our platform description.</p>
        </div>
        

        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>

        <div className={styles.faqItem}>
 de5d653 (Initial commit of backend files in backend-lms)
          <h3>Do I get a certificate after completion?</h3>
          <p>Yes, certificates are provided upon successful completion of courses.</p>
        </div>
        

        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>

        <div className={styles.faqItem}>
 de5d653 (Initial commit of backend files in backend-lms)
          <h3>Can I access courses on mobile?</h3>
          <p>Yes, our platform is fully responsive and works on all devices.</p>
        </div>
        

        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>

        <div className={styles.faqItem}>
 de5d653 (Initial commit of backend files in backend-lms)
          <h3>How do I reset my password?</h3>
          <p>Please contact support for password reset assistance.</p>
        </div>
      </div>

    </Layout>

    </div>
>>>>>>> de5d653 (Initial commit of backend files in backend-lms)
  );
};

export default FAQs;