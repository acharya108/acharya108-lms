import React from 'react';
import Header from './Header';
import Footer from './Footer';

const API_BASE_URL = 'https://api.acharya108.com'; // or your real backend URL



export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh', padding: '1rem 2rem' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}

const handleRegister = async (formData) => {
  try {
    const response = await fetch('http://localhost:8000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert('Registration successful! Please check your email for confirmation.');
      // Switch to login form or redirect
    } else {
      alert(data.detail || 'Registration failed');
    }
  } catch (error) {
    alert('Network error: ' + error.message);
  }
};