import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CourseIntroPage from './pages/CourseIntroPage';
import Admin from './pages/Admin';
import AboutUs from './pages/AboutUs';
import Support from './pages/Support';
import FAQs from './pages/FAQs';
import Career from './pages/Career';
import CourseManager from './components/admin/CourseManager';
import './App.css';
import ConfirmationPage from './components/ConfirmationPage';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/intro/:courseId" element={<CourseIntroPage />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/admin/courses" element={<CourseManager />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/support" element={<Support />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/career" element={<Career />} />
        {/* Fallback to Home */}
        <Route path="*" element={<Home />} />
        <Route path="/confirm" element={<ConfirmationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
