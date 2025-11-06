import React, { useState } from "react";
import "./Login.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Direct API call to your backend
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store authentication data
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user_role", data.user?.role || "teacher");
        localStorage.setItem("user_email", data.user?.email || email);
        
        // Notify parent component
        onLogin();
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Cannot connect to server. Please make sure the backend is running on port 8000.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Test credentials button for development
  const useTestCredentials = () => {
    setEmail("test@example.com");
    setPassword("password123");
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Acharya108 LMS</h1>
        <p>Teacher Portal</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* Development helper - remove in production */}
          <button 
            type="button" 
            onClick={useTestCredentials}
            className="test-credentials-btn"
          >
            Use Test Credentials
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? <a href="/signup">Contact administrator</a></p>
          <p className="backend-info">
            Backend: {window.location.hostname}:8000
          </p>
        </div>
      </div>
    </div>
  );
}
