
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

// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { parseUserId } from '../utils/userIdParser';

// Create the context FIRST
const AuthContext = createContext();

// Pre-defined test users with restricted access
const HARDCODED_USERS = [
  {
    name: 'Ravi',
    id: 'ST_TN_10_E_000001',
    password: 'std123'
    // Remove allowedCourses - access determined by ID parsing
  },
  {
    name: 'Priya', 
    id: 'ST_CB_12_E_000003',
    password: 'std123'
    // Remove allowedCourses - access determined by ID parsing
  },
  {
    name: 'Arun',
    id: 'RE_TP_00_E_000006', 
    password: 'std123',
    allowedCourses: ['Rectt1'] // Only TNPSC course access
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState({});
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  // Load auth state from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('drillmasters_user');
    const savedEnrollments = localStorage.getItem('drillmasters_enrollments');
    
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setUserInfo(parseUserId(userData.id));
    }
    if (savedEnrollments) {
      setEnrollments(JSON.parse(savedEnrollments));
    }
    setLoading(false);
  }, []);

  const login = (userId, password) => {
    console.log('Login attempt:', userId);
    
    const foundUser = HARDCODED_USERS.find(u => u.id === userId && u.password === password);
    
    if (foundUser) {
      const userData = { ...foundUser };
      const parsedInfo = parseUserId(userId);
      
      console.log('User found:', userData);
      console.log('Parsed user info:', parsedInfo);
      
      setUser(userData);
      setUserInfo(parsedInfo);
      localStorage.setItem('drillmasters_user', JSON.stringify(userData));
      return { success: true, user: userData, userInfo: parsedInfo };
    }
    
    console.log('User not found');
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    setUserInfo(null);
    setEnrollments({});
    localStorage.removeItem('drillmasters_user');
    localStorage.removeItem('drillmasters_enrollments');
  };

  const canEnrollInCourse = (courseId) => {
    if (!user || !userInfo || !userInfo.isValid) return false;
    
    console.log('Checking enrollment for:', { 
      userId: user.id, 
      courseId, 
      userInfo
    });

    // Check explicit allowed courses (for non-school tuition users)
    if (user.allowedCourses && user.allowedCourses.includes(courseId)) {
      console.log('Access granted via allowedCourses');
      return true;
    }
    
    // Check school tuition access via ID parsing
    if (courseId.startsWith('ST_') && userInfo.categoryCode === 'ST') {
      // Extract board, class, medium from courseId (format: ST_Board_Class_Medium)
      const parts = courseId.split('_');
      if (parts.length >= 4) {
        const [, courseBoard, courseClass, courseMedium] = parts;
        const canAccess = userInfo.board === courseBoard && 
               userInfo.classGrade === courseClass && 
               userInfo.medium === courseMedium;
        console.log('School tuition access check:', { 
          userBoard: userInfo.board, courseBoard,
          userClass: userInfo.classGrade, courseClass,
          userMedium: userInfo.medium, courseMedium,
          canAccess 
        });
        return canAccess;
      }
    }
    
    // Check recruitment exam access via ID parsing
    if (courseId.startsWith('Rectt') && userInfo.categoryCode === 'RE') {
      const courseMap = {
        'Rectt1': 'TP', // TNPSC
        'Rectt2': 'TR', // TRB
        'Rectt3': 'TU', // TNUSRB
        'Rectt4': 'SS', // SSC
        'Rectt5': 'UP', // UPSC
        'Rectt6': 'RR', // RRB
        'Rectt7': 'IB'  // IBPS
      };
      const canAccess = courseMap[courseId] === userInfo.examCode;
      console.log('Recruitment exam access check:', canAccess);
      return canAccess;
    }
    
    console.log('No access granted');
    return false;
  };

  const enrollInCourse = (courseId) => {
    if (!user) return { success: false, error: 'User not logged in' };
    if (!canEnrollInCourse(courseId)) {
      return { 
        success: false, 
        error: 'Access denied. This course is not available for your user account.' 
      };
    }

    const newEnrollments = {
      ...enrollments,
      [user.id]: {
        ...enrollments[user.id],
        [courseId]: {
          enrolledAt: new Date().toISOString(),
          progress: 0,
          completedLevels: []
        }
      }
    };

    setEnrollments(newEnrollments);
    localStorage.setItem('drillmasters_enrollments', JSON.stringify(newEnrollments));
    
    return { success: true, enrollment: newEnrollments[user.id][courseId] };
  };

  const isUserEnrolled = (courseId) => {
    if (!user) return false;
    return !!(enrollments[user.id]?.[courseId]);
  };

  const getEnrollmentProgress = (courseId) => {
    if (!user || !enrollments[user.id]?.[courseId]) return null;
    return enrollments[user.id][courseId];
  };

  const updateProgress = (courseId, progressData) => {
    if (!user || !enrollments[user.id]?.[courseId]) return false;

    const updatedEnrollments = {
      ...enrollments,
      [user.id]: {
        ...enrollments[user.id],
        [courseId]: {
          ...enrollments[user.id][courseId],
          ...progressData,
          lastUpdated: new Date().toISOString()
        }
      }
    };

    setEnrollments(updatedEnrollments);
    localStorage.setItem('drillmasters_enrollments', JSON.stringify(updatedEnrollments));
    return true;
  };

  const value = {
    user,
    userInfo,
    enrollments,
    loading,
    login,
    logout,
    enrollInCourse,
    isUserEnrolled,
    canEnrollInCourse,
    getEnrollmentProgress,
    updateProgress
  };

  return (
    <AuthContext.Provider value={value}>
 de5d653 (Initial commit of backend files in backend-lms)
      {children}
    </AuthContext.Provider>
  );
}


// Helper hook for consuming the context
export function useAuth() {
  return useContext(AuthContext);
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the context itself if needed elsewhere
export default AuthContext;
 de5d653 (Initial commit of backend files in backend-lms)
