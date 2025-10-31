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
        </div>
      </div>
    </Layout>
  );
}
