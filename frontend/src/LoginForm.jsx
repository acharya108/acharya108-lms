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
