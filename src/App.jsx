// src/App.jsx  added <Route path="/admin/courses" element={<CourseManager />} /> import CourseManager from './components/Admin/CourseManager';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Remove AuthContext import for now
// import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import CourseIntroPage from './pages/CourseIntroPage';
import CourseManager from './components/Admin/CourseManager';
import Admin from './pages/Admin';
import './App.css';
import AboutUs from './pages/AboutUs';
import Support from './pages/Support'; 
import FAQs from './pages/FAQs';
import Career from './pages/Career';

function App() {
  return (
    // Remove AuthProvider wrapper for now
    // <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/intro/:courseId" element={<CourseIntroPage />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="*" element={<Home />} />
          <Route path="/admin/courses" element={<CourseManager />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/support" element={<Support />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/career" element={<Career />} />
        </Routes>
      </Router>
    // </AuthProvider>
  );
}

export default App;