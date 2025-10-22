// src/pages/Home.jsx Removed import { useAuth } from '../context/AuthContext';

//Removed const { isUserEnrolled, canEnrollInCourse } = useAuth();

//Kept all other functionality intact
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import LoginForm from '../components/LoginForm';
import CategorySection from '../components/CategorySection';
import styles from '../styles/Home.module.css';

// Import your existing course details structure
import { courseDetails } from './CourseIntroPage';

const Home = () => {
  const navigate = useNavigate();
  //const { isUserEnrolled, canEnrollInCourse } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('drillmasters_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper functions to match your Excel structure
  const getCategoryCode = (categoryName) => {
    const codes = {
      'School Tuitions': 'ST',
      'Recruitment': 'RE', 
      'Entrance Exams': 'EE',
      'Professional Courses': 'PC',
      'Technology & IT Certification': 'IT',
      'Skill Development': 'SD',
      'Language Courses': 'LA',
      'Creative Arts': 'CA',
      'Business & Management': 'BM',
      'Health & Wellness': 'HW',
      'Personal Development & Soft Skills': 'PD',
      'Vocational & Technical Training': 'VT',
      'Sanatana Dharmic Life Styles': 'SD'
    };
    return codes[categoryName] || categoryName.replace(/\s+/g, '_').toUpperCase();
  };

  const getSubCategoryName = (categoryName, course) => {
    // Map course names to proper sub-category names from Excel
    if (categoryName === 'School Tuitions') {
      if (course.name.includes('Tamil Nadu Board')) return 'TN State Board';
      if (course.name.includes('CBSE')) return 'CBSE';
      if (course.name.includes('ICSE')) return 'ICSE';
      if (course.name.includes('Pearson')) return 'Pearson,UK';
      if (course.name.includes('Canada')) return 'Canada';
    }
    if (categoryName === 'Recruitment') {
      if (course.name === 'TNPSC') return 'TNPSC';
      if (course.name === 'TRB') return 'TRB';
      if (course.name === 'TNUSRB & Other TN Recruitments') return 'TNUSRB';
      if (course.name === 'SSC') return 'SSC';
      if (course.name === 'UPSC') return 'UPSC';
      if (course.name === 'RRB') return 'RRB';
      if (course.name === 'IBPS & Others') return 'IBPS';
      if (course.name === 'SBI') return 'SBI';
      if (course.name === 'NDA') return 'NDA';
    }
    if (categoryName === 'Entrance Exams') {
      if (course.name === 'JEE') return 'IIT';
      if (course.name === 'NEET') return 'MEDICAL';
      if (course.name === 'CAT') return 'MANAGEMENT';
      if (course.name === 'GATE') return 'ENGINEERING';
      if (course.name === 'CLAT') return 'LAW';
      if (course.name === 'CUET') return 'CENTRAL UNIVERSITIES';
      if (course.name === 'TANCET') return 'ANNA UNIVERSITY';
      if (course.name === 'NET' || course.name === 'SLET') return 'EDUCATION';
      if (course.name === 'MAT') return 'MANAGEMENT';
      if (course.name === 'TET') return 'EDUCATION';
    }
    if (categoryName === 'Professional Courses') {
      if (course.name === 'CA') return 'ICAI';
      if (course.name === 'CMA') return 'ICMAI';
      if (course.name === 'CS') return 'ICS';
      if (course.name === 'CFA') return 'CFA Institute';
      if (course.name === 'FRM') return 'GARP';
      if (course.name === 'ACCA') return 'ACCA';
    }
    return course.name.split(' - ')[0] || 'General';
  };

  const getSubCategoryCode = (categoryName, subCategoryName) => {
    // Map to your Excel sub-category codes
    const codes = {
      // School Tuitions
      'TN State Board': 'TN',
      'CBSE': 'CB',
      'ICSE': 'IC',
      'Pearson,UK': 'PE',
      'Canada': 'CA',
      
      // Recruitment
      'TNPSC': 'TP',
      'TRB': 'TR',
      'TNUSRB': 'TU',
      'RRB': 'RR',
      'SSC': 'SS',
      'NDA': 'ND',
      'IBPS': 'IB',
      'SBI': 'SB',
      'UPSC': 'UP',
      
      // Entrance Exams
      'IIT': 'II',
      'MEDICAL': 'ME',
      'MANAGEMENT': 'MG',
      'LAW': 'CL',
      'ENGINEERING': 'GA',
      'CENTRAL UNIVERSITIES': 'CU',
      'ANNA UNIVERSITY': 'AU',
      'EDUCATION': 'ED',
      
      // Professional Courses
      'ICAI': 'CA',
      'ICS': 'CS',
      'ICMAI': 'MA',
      
      // Others (to be updated)
      'Technology & IT Certification': 'IT',
      'Skill Development': 'SD',
      'Language Courses': 'LA',
      'Creative Arts': 'CA',
      'Business & Management': 'BM',
      'Health & Wellness': 'HW',
      'Personal Development & Soft Skills': 'PD',
      'Vocational & Technical Training': 'VT',
      'Sanatana Dharmic Life Styles': 'SD'
    };
    return codes[subCategoryName] || subCategoryName.replace(/\s+/g, '_').toUpperCase();
  };

  // Organize courses into categories based on your courseDetails structure
  useEffect(() => {
    const organizeCoursesByCategory = () => {
      const categoryMap = {};
      
      // Process all courses from your courseDetails
      Object.entries(courseDetails).forEach(([courseId, course]) => {
        const categoryName = course.category;
        
        if (!categoryMap[categoryName]) {
          categoryMap[categoryName] = {
            id: getCategoryCode(categoryName),
            name: categoryName,
            description: `${categoryName} courses and programs`,
            subCategories: {}
          };
        }
        
        // Get proper sub-category name and code from your Excel structure
        let subCategoryName = getSubCategoryName(categoryName, course);
        let subCategoryCode = getSubCategoryCode(categoryName, subCategoryName);
        
        if (!categoryMap[categoryName].subCategories[subCategoryName]) {
          categoryMap[categoryName].subCategories[subCategoryName] = {
            id: subCategoryCode,
            name: subCategoryName,
            description: `${subCategoryName} courses`,
            courses: []
          };
        }
        
        categoryMap[categoryName].subCategories[subCategoryName].courses.push({
          id: courseId, // This uses your existing course IDs (Rectt1, ST_TN_09_E, etc.)
          name: course.name,
          description: course.description,
          duration: course.duration,
          level: course.level
        });
      });
      
      // Convert to array format for components
      return Object.values(categoryMap).map(category => ({
        ...category,
        subCategories: Object.values(category.subCategories)
      }));
    };

    const categoriesData = organizeCoursesByCategory();
    setCategories(categoriesData);
    setLoading(false);
  }, []);

  const handleCourseClick = (courseId) => {
    console.log('Course clicked:', courseId);
    navigate(`/intro/${courseId}`);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLoginForm(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('drillmasters_user');
    localStorage.removeItem('drillmasters_enrollments');
    window.location.reload();
  };

  if (loading) {
    return (
      <Layout>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading courses...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.homeContainer}>
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Welcome to DrillMasters</h1>
            <p className={styles.heroSubtitle}>
              Your comprehensive learning platform with structured curriculum across multiple categories
            </p>

            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <h3>{Object.keys(courseDetails).length}+</h3>
                <p>Courses</p>
              </div>
              <div className={styles.statItem}>
                <h3>20,000+</h3>
                <p>Students</p>
              </div>
              <div className={styles.statItem}>
                <h3>97%</h3>
                <p>Success Rate</p>
              </div>
            </div>

            {/* Home-specific Auth Section */}
            <div className={styles.homeAuthSection}>
              {user ? (
                <div className={styles.userInfo}>
                  <span className={styles.welcomeText}>Welcome, {user.name}!</span>
                  <button 
                    className={styles.logoutBtn}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  className={styles.loginBtn}
                  onClick={() => setShowLoginForm(true)}
                >
                  Student Login
                </button>
                
              )}
            </div>
          </div>
        </div>

        {/* Login Form Modal */}
        {showLoginForm && (
          <LoginForm 
            onLoginSuccess={handleLoginSuccess}
            onClose={() => setShowLoginForm(false)}
          />
        )}

        {/* Categories Section */}
        <div className={styles.categoriesSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Our Learning Programs</h2>
            <p className={styles.sectionSubtitle}>
              Explore {Object.keys(courseDetails).length}+ courses across {categories.length} categories
            </p>

            {categories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                onCourseClick={handleCourseClick}
              />
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className={styles.featuresSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Why Choose DrillMasters?</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>👨‍🏫</div>
                <h3>Expert Faculty</h3>
                <p>Learn from experienced professionals and subject matter experts</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>💻</div>
                <h3>Interactive Learning</h3>
                <p>Engaging video lectures, quizzes, and interactive sessions</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📱</div>
                <h3>Flexible Schedule</h3>
                <p>Learn at your own pace with 24/7 access to course materials</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🎯</div>
                <h3>Result Oriented</h3>
                <p>Proven track record of success in competitive exams</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📚</div>
                <h3>Comprehensive Curriculum</h3>
                <p>Wide range of courses from academics to professional skills</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🤝</div>
                <h3>Personalized Support</h3>
                <p>Individual attention and doubt clearing sessions</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={styles.ctaSection}>
          <div className={styles.container}>
            <h2>Ready to Start Your Journey?</h2>
            <p>Join thousands of successful students who achieved their dreams with DrillMasters</p>
            <div className={styles.contactInfo}>
              <p>📧 support@drillmasters.in | 📞 +91-XXXXXXXXXX</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;