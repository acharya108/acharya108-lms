import React from 'react';
import Layout from '../components/Layout';

const AboutUs = () => {
  return (
    <Layout>
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#1e3c72', textAlign: 'center' }}>About DrillMasters LMS</h1>
        
        <div style={{ marginTop: '30px', lineHeight: '1.6' }}>
          <h2>Our Mission</h2>
          <p>DrillMasters LMS provides free online learning for recruitment, entrance exams, professional courses, and school tuitions.</p>
          
          <h2>What We Offer</h2>
          <ul>
            <li>Comprehensive course materials</li>
            <li>Expert faculty guidance</li>
            <li>Flexible learning schedules</li>
            <li>Regular assessments and feedback</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;