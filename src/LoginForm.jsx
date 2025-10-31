import React from 'react';
import Header from './Header';
import Footer from './Footer';

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
