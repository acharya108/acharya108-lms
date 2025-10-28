import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load stored user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('drillmasters_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Persist user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('drillmasters_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('drillmasters_user');
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Helper hook for consuming the context
export function useAuth() {
  return useContext(AuthContext);
}

