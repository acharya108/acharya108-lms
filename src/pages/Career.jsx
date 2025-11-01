import React from 'react';

import Layout from '../components/layout';

const Career = () => {
  return (
    <Layout>
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#1e3c72', textAlign: 'center' }}>Careers at DrillMasters</h1>
        <p>Join our team and help shape the future of education!</p>
        
        <div style={{ marginTop: '30px' }}>
          <h2>Current Openings</h2>
          <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>

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
 de5d653 (Initial commit of backend files in backend-lms)
            <h3>Subject Matter Expert</h3>
            <p>Create and review course content for various subjects.</p>
          </div>
          

          <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>

          <div className={styles.jobListing}>
de5d653 (Initial commit of backend files in backend-lms)
            <h3>Online Tutor</h3>
            <p>Provide live tutoring sessions and doubt clarification.</p>
          </div>
          

          <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>

          <div className={styles.jobListing}>
 de5d653 (Initial commit of backend files in backend-lms)
            <h3>Content Developer</h3>
            <p>Develop engaging educational materials and resources.</p>
          </div>
        </div>
        

        <div style={{ marginTop: '30px' }}>

        <div className={styles.applicationInfo}>
de5d653 (Initial commit of backend files in backend-lms)
          <h2>How to Apply</h2>
          <p>Send your resume and portfolio to: careers@drillmasters.in</p>
        </div>
      </div>

    </Layout>

    </div>
 de5d653 (Initial commit of backend files in backend-lms)
  );
};

export default Career;