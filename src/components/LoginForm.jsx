import React, { useState } from 'react';


const LoginForm = ({ onLoginSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    isNewUser: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = formData.isNewUser ? '/api/auth/register' : '/api/auth/login';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Try to parse error message from response
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Something went wrong');
      }

      const data = await response.json();

      localStorage.setItem('drillmasters_user', JSON.stringify(data.user));
      onLoginSuccess(data.user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2>{formData.isNewUser ? 'Student Registration' : 'Student Login'}</h2>
          <button onClick={onClose} style={closeButtonStyle}>✕</button>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
          {formData.isNewUser && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                required
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={inputStyle}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={inputStyle}
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            required
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            required
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={inputStyle}
          />
          <label style={labelStyle}>
            <input
              type="checkbox"
              checked={formData.isNewUser}
              onChange={(e) => setFormData({ ...formData, isNewUser: e.target.checked })}
              style={checkboxStyle}
            />
            I'm a new student
          </label>
          <button type="submit" disabled={loading} style={submitButtonStyle}>
            {loading ? 'Processing...' : (formData.isNewUser ? 'Register' : 'Login')}
          </button>

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
        de5d653 (Initial commit of backend files in backend-lms)
        </form>
      </div>
    </div>
  );

};

// Style objects (use your existing styles here)
const modalOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalStyle = {
  background: 'white',
  padding: '25px',
  borderRadius: '10px',
  width: '90%',
  maxWidth: '400px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px'
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
  color: '#666'
};

const errorStyle = {
  background: '#ffebee',
  color: '#c62828',
  padding: '10px',
  borderRadius: '5px',
  marginBottom: '15px',
  fontSize: '14px'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  fontSize: '16px',
  boxSizing: 'border-box'
};

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  fontSize: '14px'
};

const checkboxStyle = {
  margin: 0
};

const submitButtonStyle = {
  width: '100%',
  padding: '12px',
  background: '#1e3c72',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  fontSize: '16px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default LoginForm;

}
de5d653 (Initial commit of backend files in backend-lms)
