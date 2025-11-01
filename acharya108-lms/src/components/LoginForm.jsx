import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Common.module.css';

export default function LoginForm({ onLoginSuccess, onClose }) {
  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = login(formData.userId, formData.password);
    
    if (result.success) {
      onLoginSuccess(result.user);
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  const fillTestCredentials = () => {
    setFormData({
      userId: 'ST_TN_10_E_000001',
      password: 'std123'
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <h2>Student Login</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close login form"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="userId" className={styles.formLabel}>
              Student ID
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Enter your student ID"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className={styles.btnPrimary}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>

          <div className={styles.testCredentials}>
            <button 
              type="button"
              className={styles.testBtn}
              onClick={fillTestCredentials}
            >
              Fill Test Credentials
            </button>
            <p className={styles.credentialsNote}>
              Test User: Ravi (ST_TN_10_E_000001)
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}