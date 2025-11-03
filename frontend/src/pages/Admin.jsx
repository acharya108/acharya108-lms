// src/pages/Admin.jsx
import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
//import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout';
import DecisionManager from '../components/admin/DecisionManager';
import styles from '../styles/Admin.module.css';
import CourseManager from '../components/admin/CourseManager';

const AdminDashboard = () => {
  return (
    <div className={styles.dashboard}>
      <h1>Admin Dashboard</h1>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Courses</h3>
          <p className={styles.statNumber}>150+</p>
        </div>
        <div className={styles.statCard}>
          <h3>Active Students</h3>
          <p className={styles.statNumber}>20,000+</p>
        </div>
        <div className={styles.statCard}>
          <h3>Decisions Logged</h3>
          <p className={styles.statNumber}>15+</p>
        </div>
      </div>
    </div>
  );
};

const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/decisions', label: 'Decision Log', icon: '📝' },
    { path: '/admin/courses', label: 'Course Management', icon: '📚' },
    { path: '/admin/users', label: 'User Management', icon: '👥' },
    { path: '/admin/content', label: 'Content Manager', icon: '🎬' },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>Admin Panel</h2>
      </div>
      <nav className={styles.sidebarNav}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`${styles.navLink} ${
              location.pathname === item.path ? styles.active : ''
            }`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

const Admin = () => {
  // TEMPORARILY COMMENT OUT AUTH FOR DEVELOPMENT
  // const { user } = useAuth();
  // if (!user) {
  //   return (
  //     <Layout>
  //       <div className={styles.accessDenied}>
  //         <h2>Access Denied</h2>
  //         <p>Please log in to access the admin panel.</p>
  //       </div>
  //     </Layout>
  //   );
  // }

  return (
    <Layout>
      <div className={styles.adminContainer}>
        <AdminSidebar />
        <div className={styles.adminContent}>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/decisions" element={<DecisionManager />} />
            
            <Route path="/users" element={<div>User Management - Coming Soon</div>} />
            <Route path="/content" element={<div>Content Manager - Coming Soon</div>} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
            <Route path="/courses" element={<CourseManager />} />
          </Routes>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;