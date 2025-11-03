// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Updated path to styles folder
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);