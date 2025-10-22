import React from 'react';
import Layout from '../components/Layout';

const Support = () => {
  return (
    <Layout> {/* Fixed: was <laout> */}
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#1e3c72', textAlign: 'center' }}>Support</h1>
        <p>We're here to help you with any questions or issues you may have.</p>
        
        <div style={{ marginTop: '30px' }}>
          <h2>Contact Support</h2>
          <p>📧 Email: support@drillmasters.in</p>
          <p>📞 Phone: +91-XXXXXXXXXX</p>
          <p>🕒 Support Hours: 9:00 AM - 6:00 PM (IST)</p>
        </div>
        
        <div style={{ marginTop: '30px' }}>
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
  );
};

export default Support;