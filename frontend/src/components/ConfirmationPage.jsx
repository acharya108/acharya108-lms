import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setError(true);
      setMessage('Invalid confirmation link.');
      return;
    }

    // Call backend /api/auth/confirm with token
    fetch(`/api/auth/confirm?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setMessage(data.message || 'Email confirmed successfully! You can now login.');
        } else {
          setError(true);
          setMessage(data.error || 'Failed to confirm email.');
        }
      })
      .catch(() => {
        setError(true);
        setMessage('Network error. Please try again.');
      });
  }, [searchParams]);

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h1>{error ? 'Error' : 'Success'}</h1>
        <p>{message}</p>
        {error && <p>Please contact support if the problem persists.</p>}
        {!error && <a href="/login" style={linkStyle}>Go to Login</a>}
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '80vh',
  fontFamily: 'Arial, sans-serif',
};

const boxStyle = {
  border: '1px solid #ddd',
  padding: '40px 30px',
  borderRadius: '8px',
  maxWidth: 400,
  textAlign: 'center',
  background: '#f9f9f9',
};

const linkStyle = {
  display: 'inline-block',
  marginTop: 20,
  textDecoration: 'none',
  color: '#1e3c72',
  fontWeight: 'bold',
};

export default ConfirmationPage;
