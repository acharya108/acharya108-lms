
import React, { useState, useEffect } from 'react';
import Layout from '../components/layout';
import LoginForm from '../components/LoginForm';
import CategorySection from '../components/CategorySection';
import styles from '../styles/Home.module.css'; // Use your original CSS module
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, setUser } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Assuming a function or logic to organize courses by categories retrieved somewhere
    // For example, fetch categories and courses from an API or local data
    async function fetchCategories() {
      // fetch or compute categories here
      // setCategories(fetchedCategories);
      setCategories([]); // placeholder
      setLoading(false);
    }
    fetchCategories();
  }, []);

// src/pages/Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import LoginForm from '../components/LoginForm';
import styles from '../styles/Home.module.css';

const Home = () => {
  const navigate = useNavigate();
  const { isUserEnrolled, canEnrollInCourse } = useAuth();
  const [openCategories, setOpenCategories] = useState({
    'Recruitment Exams': true,
    'Entrance Exams': false,
    'Professional Courses': false,
    'Technology & IT Certification': false,
    'School Tuitions': false,
    'Skill Development': false,
    'Language Courses': false,
    'Creative Arts': false,
    'Business & Management': false,
    'Health & Wellness': false,
    'Personal Development & Soft Skills': false,
    'Vocational & Technical Training': false,
    'Sanatana Dharmic Life Styles': false
  });
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('drillmasters_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Complete courseCategories object with ALL courses
  const courseCategories = {
    'School Tuitions': [
      { id: 'ST_TN_09_E', name: 'Class 9 - English Medium', description: 'Tamil Nadu Board - English Medium' },
      { id: 'ST_TN_09_T', name: 'Class 9 - Tamil Medium', description: 'Tamil Nadu Board - Tamil Medium' },
      { id: 'ST_TN_10_E', name: 'Class 10 - English Medium', description: 'Tamil Nadu Board - English Medium' },
      { id: 'ST_TN_10_T', name: 'Class 10 - Tamil Medium', description: 'Tamil Nadu Board - Tamil Medium' },
      { id: 'ST_TN_11_E', name: 'Class 11 - English Medium', description: 'Tamil Nadu Board - English Medium' },
      { id: 'ST_TN_11_T', name: 'Class 11 - Tamil Medium', description: 'Tamil Nadu Board - Tamil Medium' },
      { id: 'ST_TN_12_E', name: 'Class 12 - English Medium', description: 'Tamil Nadu Board - English Medium' },
      { id: 'ST_TN_12_T', name: 'Class 12 - Tamil Medium', description: 'Tamil Nadu Board - Tamil Medium' },
      { id: 'ST_CB_09_E', name: 'Class 9 - CBSE', description: 'CBSE Board - English Medium' },
      { id: 'ST_CB_10_E', name: 'Class 10 - CBSE', description: 'CBSE Board - English Medium' },
      { id: 'ST_CB_11_E', name: 'Class 11 - CBSE', description: 'CBSE Board - English Medium' },
      { id: 'ST_CB_12_E', name: 'Class 12 - CBSE', description: 'CBSE Board - English Medium' },
      { id: 'ST_IC_09_E', name: 'Class 9 - ICSE', description: 'ICSE Board - English Medium' },
      { id: 'ST_IC_10_E', name: 'Class 10 - ICSE', description: 'ICSE Board - English Medium' }
    ],

    'Recruitment Exams': [
      { id: 'Rectt1', name: 'TNPSC', description: 'Tamil Nadu Public Service Commission' },
      { id: 'Rectt2', name: 'TRB', description: 'Tamil Nadu Teachers Recruitment Board' },
      { id: 'Rectt3', name: 'TNUSRB & Other TN Recruitments', description: 'Tamil Nadu Uniformed Services' },
      { id: 'Rectt4', name: 'SSC', description: 'Staff Selection Commission' },
      { id: 'Rectt5', name: 'UPSC', description: 'Union Public Service Commission' },
      { id: 'Rectt6', name: 'RRB', description: 'Railway Recruitment Board' },
      { id: 'Rectt7', name: 'IBPS & Others', description: 'Banking and Financial Sector' }
    ],

    'Entrance Exams': [
      { id: 'Ent1', name: 'JEE', description: 'Joint Entrance Examination' },
      { id: 'Ent2', name: 'NEET', description: 'National Eligibility cum Entrance Test' },
      { id: 'Ent3', name: 'CAT', description: 'Common Admission Test' },
      { id: 'Ent4', name: 'GATE', description: 'Graduate Aptitude Test in Engineering' },
      { id: 'Ent5', name: 'CLAT', description: 'Common Law Admission Test' },
      { id: 'Ent6', name: 'CUET', description: 'Common University Entrance Test' },
      { id: 'Ent7', name: 'TET', description: 'Teacher Eligibility Test' },
      { id: 'Ent8', name: 'TANCET', description: 'Tamil Nadu Common Entrance Test' },
      { id: 'Ent9', name: 'MAT', description: 'Management Aptitude Test' }
    ],

    'Professional Courses': [
      { id: 'Prof1', name: 'CA', description: 'Chartered Accountancy' },
      { id: 'Prof2', name: 'CMA', description: 'Cost and Management Accounting' },
      { id: 'Prof3', name: 'CS', description: 'Company Secretaryship' },
      { id: 'Prof4', name: 'CFA', description: 'Chartered Financial Analyst' },
      { id: 'Prof5', name: 'FRM', description: 'Financial Risk Manager' },
      { id: 'Prof6', name: 'ACCA', description: 'Association of Chartered Certified Accountants' }
    ],

    'Technology & IT Certification': [
      { id: 'IT1', name: 'Computer Programming', description: 'Full Stack Development' },
      { id: 'IT2', name: 'Data Science', description: 'Data Analysis & Machine Learning' },
      { id: 'IT3', name: 'ML & AI', description: 'Machine Learning & Artificial Intelligence' },
      { id: 'IT4', name: 'Cloud Computing', description: 'AWS, Azure, GCP' },
      { id: 'IT5', name: 'Cyber Security', description: 'Network Security & Protection' },
      { id: 'IT6', name: 'Ethical Hacking', description: 'Penetration Testing' },
      { id: 'IT7', name: 'Dev Ops', description: 'Development & Operations' },
      { id: 'IT8', name: 'Blockchain', description: 'Web3 & Blockchain Development' },
      { id: 'IT9', name: 'IoT', description: 'Internet of Things' }
    ],

    'Skill Development': [
      { id: 'Skill1', name: 'Digital Marketing', description: 'SEO, SEM, Social Media Marketing' },
      { id: 'Skill2', name: 'Project Management', description: 'PMP, Agile, Scrum Methodologies' },
      { id: 'Skill3', name: 'Business Analytics', description: 'Data Analysis & Business Intelligence' },
      { id: 'Skill4', name: 'UI/UX Design', description: 'User Interface & Experience Design' },
      { id: 'Skill5', name: 'Content Writing', description: 'Professional Writing & Copywriting' },
      { id: 'Skill6', name: 'Public Speaking', description: 'Communication & Presentation Skills' }
    ],

    'Language Courses': [
      { id: 'Lang1', name: 'English Proficiency', description: 'IELTS, TOEFL, PTE Preparation' },
      { id: 'Lang2', name: 'Spoken English', description: 'Fluency & Communication Skills' },
      { id: 'Lang3', name: 'French', description: 'Beginner to Advanced Levels' },
      { id: 'Lang4', name: 'German', description: 'German Language Certification' },
      { id: 'Lang5', name: 'Japanese', description: 'JLPT Preparation' },
      { id: 'Lang6', name: 'Spanish', description: 'Spanish for Beginners' },
      { id: 'Lang7', name: 'Tamil', description: 'Spoken & Written Tamil' },
      { id: 'Lang8', name: 'Hindi', description: 'Hindi Language Proficiency' }
    ],

    'Creative Arts': [
      { id: 'Art1', name: 'Graphic Design', description: 'Adobe Photoshop, Illustrator' },
      { id: 'Art2', name: 'Video Editing', description: 'Premiere Pro, After Effects' },
      { id: 'Art3', name: 'Photography', description: 'Digital Photography Techniques' },
      { id: 'Art4', name: 'Music Theory', description: 'Western & Carnatic Music' },
      { id: 'Art5', name: 'Drawing & Painting', description: 'Fine Arts & Sketching' },
      { id: 'Art6', name: 'Digital Art', description: 'Digital Illustration & Concept Art' }
    ],

    'Business & Management': [
      { id: 'Biz1', name: 'Artificial Intelligence for Business', description: 'AI Applications in Business Strategy' },
      { id: 'Biz2', name: 'Sustainable Business & ESG', description: 'Environmental Social Governance' },
      { id: 'Biz3', name: 'Digital Marketing & Analytics', description: 'Data-Driven Marketing Strategies' },
      { id: 'Biz4', name: 'Global Supply Chain & Operations Management', description: 'International Operations Excellence' },
      { id: 'Biz5', name: 'Financial Technology (FinTech) & Digital Finance', description: 'Modern Financial Systems' },
      { id: 'Biz6', name: 'Product Management & Innovation', description: 'Product Development Lifecycle' },
      { id: 'Biz7', name: 'People Analytics & Strategic HR', description: 'Data-Driven Human Resources' }
    ],

    'Health & Wellness': [
      { id: 'Health1', name: 'Nutrition & Lifestyle Medicine', description: 'Holistic Health Approaches' },
      { id: 'Health2', name: 'Integrative & Functional Wellness', description: 'Comprehensive Wellness Strategies' }
    ],

    'Personal Development & Soft Skills': [
      { id: 'PD1', name: 'Critical Thinking & Complex Problem-Solving', description: 'Analytical Thinking Skills' },
      { id: 'PD2', name: 'Leadership & Entrepreneurial Mindset', description: 'Leadership Development' },
      { id: 'PD3', name: 'Emotional Intelligence (EQ) & Resilience', description: 'Emotional Mastery & Adaptability' }
    ],

    'Vocational & Technical Training': [
      { id: 'Voc1', name: 'ITI/ISC Trades', description: 'Industrial Training Institute Courses' },
      { id: 'Voc2', name: 'Manufacturing Skills', description: 'Production & Manufacturing Techniques' },
      { id: 'Voc3', name: 'Automotive Repair', description: 'Vehicle Maintenance & Repair' },
      { id: 'Voc4', name: 'Culinary Arts', description: 'Professional Cooking & Baking' },
      { id: 'Voc5', name: 'Plumbing', description: 'Pipe Systems & Sanitation' },
      { id: 'Voc6', name: 'Electrical', description: 'Electrical Systems & Wiring' },
      { id: 'Voc7', name: 'Electronics/Mobile Repair', description: 'Electronic Device Repair' },
      { id: 'Voc8', name: 'Tailoring', description: 'Fashion Design & Stitching' },
      { id: 'Voc9', name: 'Beautician Course', description: 'Beauty & Skin Care Services' }
    ],

    'Sanatana Dharmic Life Styles': [
      { id: 'SD1', name: 'Foundations of Sanatana Dharma', description: 'Core Principles & Philosophy' },
      { id: 'SD2', name: 'Yoga & Meditation', description: 'Ancient Spiritual Practices' },
      { id: 'SD3', name: 'Ayurveda & Vedic Wellness', description: 'Traditional Healing Systems' },
      { id: 'SD4', name: 'Sanskrit Language & Indian Philosophy', description: 'Classical Language Studies' },
      { id: 'SD5', name: 'Rituals, Festivals & Dharmic Practices', description: 'Cultural Traditions & Ceremonies' },
      { id: 'SD6', name: 'Dharmic Ethics & Leadership', description: 'Moral Leadership Principles' },
      { id: 'SD7', name: 'Indian Art, Music & Storytelling', description: 'Cultural Arts Heritage' },
      { id: 'SD8', name: 'Seva (Service) & Dharmic Contribution', description: 'Selfless Service Practices' },
      { id: 'SD9', name: 'Symbolism in Sanatana Dharma', description: 'Sacred Symbols & Meanings' },
      { id: 'SD10', name: 'Applied Family & Satvik Living', description: 'Pure & Balanced Lifestyle' }
    ]
  };

  const handleCourseClick = (courseId) => {
    console.log('Course clicked:', courseId);
    navigate(`/intro/${courseId}`);
  };

  const handleCategoryToggle = (category) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const isCategoryOpen = (category) => {
    return openCategories[category];
  };
 de5d653 (Initial commit of backend files in backend-lms)

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLoginForm(false);
  };

  const handleLogout = () => {
    setUser(null);

    // Clear any stored user data if present
    localStorage.removeItem('drillmasters_user');
    localStorage.removeItem('drillmasters_enrollments');
    window.location.reload(); // Refresh to reflect logout state
  };

  const handleCourseClick = (courseId) => {
    // Navigate to course intro or course detail
  };

  if (loading) {
    return (
      <Layout>
        <div className={styles.loadingContainer}>Loading courses...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero section with preserved styles */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Welcome to DrillMasters</h1>
          <p className={styles.heroSubtitle}>
            Your comprehensive learning platform with structured curriculum across multiple categories
          </p>

          <div className={styles.heroStats}>
            {/* Example stats */}
            <div className={styles.statItem}>
              <h3>{categories.length}+</h3>
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

          {/* Authentication part */}
          <div className={styles.homeAuthSection}>
            {user ? (
              <div className={styles.userInfo}>
                <span className={styles.welcomeText}>Welcome, {user.name}!</span>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <button className={styles.loginBtn} onClick={() => setShowLoginForm(true)}>
                Student Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* LoginForm modal */}
      {showLoginForm && (
        <LoginForm onLoginSuccess={handleLoginSuccess} onClose={() => setShowLoginForm(false)} />
      )}

      {/* Categories Section */}
      <div className={styles.categoriesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Learning Programs</h2>
          <p className={styles.sectionSubtitle}>
            Explore {categories.length}+ courses across {categories.length} categories
          </p>

          {categories.map((category) => (
            <CategorySection key={category.id} category={category} onCourseClick={handleCourseClick} />
          ))}

    localStorage.removeItem('drillmasters_user');
    localStorage.removeItem('drillmasters_enrollments');
    window.location.reload();
  };

  const renderCourseContent = (category, courses) => {
    return (
      <div className={`${styles.courseContent} ${isCategoryOpen(category) ? styles.contentVisible : styles.contentHidden}`}>
        <div className={styles.courseGrid}>
          {courses.map((course) => (
            <div 
              key={course.id} 
              className={styles.courseCard}
              onClick={() => handleCourseClick(course.id)}
            >
              <div className={styles.courseIcon}>
                {course.name.charAt(0)}
              </div>
              <div className={styles.courseInfo}>
                <h4 className={styles.courseName}>{course.name}</h4>
                <p className={styles.courseDescription}>{course.description}</p>
                <button className={styles.learnMoreBtn}>
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className={styles.homeContainer}>
        {/* Hero Section with Login Button */}
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Welcome to DrillMasters</h1>
            <p className={styles.heroSubtitle}>
              Your comprehensive learning platform for academic excellence, professional growth, and personal development
            </p>
            
            {/* Login/User Info in Hero Section */}
            <div className={styles.authSection}>
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

            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <h3>100+</h3>
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
          </div>
        </div>

        {/* Login Form Modal */}
        {showLoginForm && (
          <LoginForm 
            onLoginSuccess={handleLoginSuccess}
            onClose={() => setShowLoginForm(false)}
          />
        )}

        {/* Course Categories Section */}
        <div className={styles.categoriesSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Our Courses</h2>
            <p className={styles.sectionSubtitle}>
              Explore our comprehensive range of courses across multiple categories designed for holistic development
            </p>

            {Object.entries(courseCategories).map(([category, courses]) => (
              <div key={category} className={styles.categorySection}>
                {/* Category Header */}
                <div 
                  className={styles.categoryHeader}
                  onClick={() => handleCategoryToggle(category)}
                >
                  <h3 className={styles.categoryTitle}>
                    {category}
                    <span className={styles.courseCount}>({courses.length} courses)</span>
                  </h3>
                  <span className={`${styles.arrow} ${isCategoryOpen(category) ? styles.arrowOpen : ''}`}>
                    ▼
                  </span>
                </div>

                {/* Course Content */}
                {renderCourseContent(category, courses)}
              </div>
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
 de5d653 (Initial commit of backend files in backend-lms)
        </div>
      </div>
    </Layout>
  );

}


export default Home;
de5d653 (Initial commit of backend files in backend-lms)
