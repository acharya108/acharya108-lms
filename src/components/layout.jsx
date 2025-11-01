// src/components/Layout.jsx
import React from 'react';

import { useLocation } from 'react-router-dom';
 de5d653 (Initial commit of backend files in backend-lms)
import Header from './Header';
import Footer from './Footer';
import styles from './Layout.module.css';

const Layout = ({ children }) => {

  return (
    <div className={styles.layout}>
      {/* Always show header */}
      <Header />
      
      <main className={styles.main}>

  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className={styles.layout}>
      {/* Hide header only on home page */}
      {!isHomePage && <Header />}
      
      <main className={isHomePage ? styles.homeMain : styles.main}>
 de5d653 (Initial commit of backend files in backend-lms)
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;