// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CourseIntroPage from './pages/CourseIntroPage';
import CourseContentPage from './pages/CourseContentPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/intro/:courseId" element={<CourseIntroPage />} />
              <Route path="/course/:courseId" element={<CourseContentPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/support" element={<Support />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/career" element={<Career />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

// Simple page components
function About() {
  return (
    <div style={{ padding: '50px', textAlign: 'center', minHeight: '60vh' }}>
      <h1>About DrillMasters</h1>
      <p>Comprehensive learning platform for all your educational needs.</p>
    </div>
  );
}

function Contact() {
  return (
    <div style={{ padding: '50px', textAlign: 'center', minHeight: '60vh' }}>
      <h1>Contact Us</h1>
      <p>Email: support@drillmasters.in | Phone: +91-XXXXXXXXXX</p>
    </div>
  );
}

function Support() {
  return (
    <div style={{ padding: '50px', textAlign: 'center', minHeight: '60vh' }}>
      <h1>Support</h1>
      <p>We're here to help you with any questions or issues.</p>
    </div>
  );
}

function FAQs() {
  return (
    <div style={{ padding: '50px', textAlign: 'center', minHeight: '60vh' }}>
      <h1>FAQs</h1>
      <p>Frequently Asked Questions will be listed here.</p>
    </div>
  );
}

function Career() {
  return (
    <div style={{ padding: '50px', textAlign: 'center', minHeight: '60vh' }}>
      <h1>Careers</h1>
      <p>Join our team and help shape the future of education!</p>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/" style={{ 
        color: '#667eea', 
        textDecoration: 'none',
        fontWeight: 'bold',
        marginTop: '20px'
      }}>
        Return to Home
      </a>
    </div>
  );
}

export default App;