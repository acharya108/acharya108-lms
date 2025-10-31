// src/components/Layout.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className={styles.layout}>
      {/* Hide header only on home page */}
      {!isHomePage && <Header />}
      
      <main className={isHomePage ? styles.homeMain : styles.main}>
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;