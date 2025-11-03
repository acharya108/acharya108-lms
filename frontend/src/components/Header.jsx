// components/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Show logout confirmation
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  // Confirm logout - REDIRECT TO HOME PAGE
  const confirmLogout = () => {
    // Clear authentication data
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    sessionStorage.clear();
    
    // Close all menus
    closeMenu();
    setShowLogoutConfirm(false);
    
    // Redirect to HOME PAGE instead of login
    navigate('/');
  };

  // Cancel logout
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <header className={styles.header}>
        {/* Logo Container */}
        <div className={styles.logoContainer}>
          <img 
            src="/Vyasa.jpg" 
            alt="Drillmasters Logo" 
            className={styles.logo}
          />
        </div>

        {/* Caption Container */}
        <div className={styles.captionContainer}>
          <div className={styles.captionContent}>
            <div className={styles.captionLine1}>DRILLMASTERS LMS</div>
            <div className={styles.captionLine2}>
              Free Online Learning for all Recruitment, Entrance and Professional course exams as well as School Tuitions
            </div>
          </div>
        </div>

        {/* Hamburger Menu Container */}
        <div className={styles.hamburgerContainer}>
          <button 
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerActive : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Navigation */}
      {menuOpen && (
        <div className={styles.mobileMenuContainer}>
          <div className={styles.overlay} onClick={closeMenu}></div>
          <nav className={styles.mobileNav}>
            <div className={styles.mobileNavHeader}>
              <h3>Menu</h3>
              <button 
                className={styles.closeButton}
                onClick={closeMenu}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <ul className={styles.mobileNavList}>
              <li>
                <Link to="/" className={styles.mobileNavLink} onClick={closeMenu}>
                  🏠 Home
                </Link>
              </li>
              <li>
                <Link to="/about" className={styles.mobileNavLink} onClick={closeMenu}>
                  AboutUs
                </Link>
              </li>
              <li>
                <Link to="/support" className={styles.mobileNavLink} onClick={closeMenu}>
                  Support
                </Link>
              </li>
              <li>
                <Link to="/faqs" className={styles.mobileNavLink} onClick={closeMenu}>
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/career" className={styles.mobileNavLink} onClick={closeMenu}>
                  Career
                </Link>
              </li>
              <li>
                <button
                  className={styles.logoutButton}
                  onClick={handleLogoutClick}
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmationModal}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className={styles.modalButtons}>
              <button 
                className={styles.confirmButton}
                onClick={confirmLogout}
              >
                Yes, Logout
              </button>
              <button 
                className={styles.cancelButton}
                onClick={cancelLogout}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}