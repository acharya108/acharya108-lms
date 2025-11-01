// src/pages/CourseContent.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import styles from '../styles/CourseContent.module.css';

const CourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, userInfo, isUserEnrolled, getEnrollmentProgress, updateProgress } = useAuth();
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [progress, setProgress] = useState({});

  // Course content data for ALL courses including school tuitions
  const courseContentData = {
    // ================= SCHOOL TUITIONS COURSES =================
    'ST_TN_09_E': {
      name: 'Tamil Nadu Board - Class 9 - English Medium',
      category: 'School Tuitions',
      board: 'TN',
      classGrade: '9',
      medium: 'English',
      modules: [
        {
          title: 'Mathematics',
          lessons: [
            { title: 'Number Systems', duration: '45 min', type: 'video', completed: false },
            { title: 'Algebra', duration: '60 min', type: 'video', completed: false },
            { title: 'Geometry', duration: '50 min', type: 'video', completed: false },
            { title: 'Coordinate Geometry', duration: '40 min', type: 'video', completed: false },
            { title: 'Mathematics Quiz 1', duration: '30 min', type: 'quiz', completed: false }
          ]
        },
        {
          title: 'Science',
          lessons: [
            { title: 'Matter in Our Surroundings', duration: '40 min', type: 'video', completed: false },
            { title: 'Atoms and Molecules', duration: '50 min', type: 'video', completed: false },
            { title: 'Force and Laws of Motion', duration: '45 min', type: 'video', completed: false },
            { title: 'Science Practical 1', duration: '60 min', type: 'lab', completed: false }
          ]
        },
        {
          title: 'Social Science',
          lessons: [
            { title: 'French Revolution', duration: '35 min', type: 'video', completed: false },
            { title: 'India - Size and Location', duration: '30 min', type: 'video', completed: false },
            { title: 'Constitutional Design', duration: '40 min', type: 'video', completed: false }
          ]
        },
        {
          title: 'English',
          lessons: [
            { title: 'Literature - The Fun They Had', duration: '35 min', type: 'video', completed: false },
            { title: 'Grammar - Tenses', duration: '40 min', type: 'video', completed: false },
            { title: 'Writing Skills', duration: '45 min', type: 'video', completed: false }
          ]
        },
        {
          title: 'Revision & Tests',
          lessons: [
            { title: 'Full Syllabus Revision', duration: '90 min', type: 'video', completed: false },
            { title: 'Model Question Paper 1', duration: '120 min', type: 'test', completed: false },
            { title: 'Model Question Paper 2', duration: '120 min', type: 'test', completed: false }
          ]
        }
      ]
    },

    'ST_TN_10_E': {
      name: 'Tamil Nadu Board - Class 10 - English Medium',
      category: 'School Tuitions',
      board: 'TN',
      classGrade: '10',
      medium: 'English',
      modules: [
        {
          title: 'Mathematics - SSLC',
          lessons: [
            { title: 'Relations and Functions', duration: '50 min', type: 'video', completed: false },
            { title: 'Numbers and Sequences', duration: '45 min', type: 'video', completed: false },
            { title: 'Algebra', duration: '60 min', type: 'video', completed: false },
            { title: 'Geometry', duration: '55 min', type: 'video', completed: false },
            { title: 'Coordinate Geometry', duration: '40 min', type: 'video', completed: false },
            { title: 'Trigonometry', duration: '50 min', type: 'video', completed: false },
            { title: 'Mensuration', duration: '45 min', type: 'video', completed: false },
            { title: 'Statistics and Probability', duration: '35 min', type: 'video', completed: false }
          ]
        },
        {
          title: 'Science - SSLC',
          lessons: [
            { title: 'Laws of Motion', duration: '45 min', type: 'video', completed: false },
            { title: 'Optics', duration: '50 min', type: 'video', completed: false },
            { title: 'Thermal Physics', duration: '40 min', type: 'video', completed: false },
            { title: 'Electricity', duration: '55 min', type: 'video', completed: false },
            { title: 'Atomic and Nuclear Physics', duration: '35 min', type: 'video', completed: false },
            { title: 'Periodic Classification', duration: '45 min', type: 'video', completed: false },
            { title: 'Carbon and its Compounds', duration: '50 min', type: 'video', completed: false },
            { title: 'Chemical Reactions', duration: '40 min', type: 'video', completed: false }
          ]
        },
        {
          title: 'Social Science - SSLC',
          lessons: [
            { title: 'Outbreak of World War I', duration: '35 min', type: 'video', completed: false },
            { title: 'World Between Two World Wars', duration: '40 min', type: 'video', completed: false },
            { title: 'World War II', duration: '45 min', type: 'video', completed: false },
            { title: 'The World After 1945', duration: '35 min', type: 'video', completed: false },
            { title: 'Social and Religious Reform Movements', duration: '40 min', type: 'video', completed: false },
            { title: 'Freedom Struggle in Tamil Nadu', duration: '45 min', type: 'video', completed: false }
          ]
        },
        {
          title: 'English - SSLC',
          lessons: [
            { title: 'Prose - His First Flight', duration: '35 min', type: 'video', completed: false },
            { title: 'Poem - The Secret of the Machines', duration: '30 min', type: 'video', completed: false },
            { title: 'Grammar - Parts of Speech', duration: '40 min', type: 'video', completed: false },
            { title: 'Writing - Letter Writing', duration: '45 min', type: 'video', completed: false },
            { title: 'Writing - Essay Writing', duration: '50 min', type: 'video', completed: false }
          ]
        },
        {
          title: 'SSLC Board Exam Preparation',
          lessons: [
            { title: 'Important Questions - Mathematics', duration: '60 min', type: 'video', completed: false },
            { title: 'Important Questions - Science', duration: '60 min', type: 'video', completed: false },
            { title: 'Important Questions - Social Science', duration: '55 min', type: 'video', completed: false },
            { title: 'SSLC Model Question Paper 1', duration: '180 min', type: 'test', completed: false },
            { title: 'SSLC Model Question Paper 2', duration: '180 min', type: 'test', completed: false },
            { title: 'SSLC Previous Year Paper Discussion', duration: '90 min', type: 'video', completed: false }
          ]
        }
      ]
    },

    // Add other school tuition courses similarly...
    'ST_TN_09_T': {
      name: 'Tamil Nadu Board - Class 9 - Tamil Medium',
      category: 'School Tuitions',
      board: 'TN',
      classGrade: '9',
      medium: 'Tamil',
      modules: [
        {
          title: 'கணிதம்',
          lessons: [
            { title: 'எண் முறைமைகள்', duration: '45 min', type: 'video', completed: false },
            { title: 'இயற்கணிதம்', duration: '60 min', type: 'video', completed: false },
            // ... more lessons in Tamil
          ]
        }
        // ... other modules
      ]
    },

    'ST_CB_10_E': {
      name: 'CBSE Board - Class 10 - English Medium',
      category: 'School Tuitions',
      board: 'CBSE',
      classGrade: '10',
      medium: 'English',
      modules: [
        {
          title: 'Mathematics - CBSE',
          lessons: [
            { title: 'Real Numbers', duration: '40 min', type: 'video', completed: false },
            { title: 'Polynomials', duration: '45 min', type: 'video', completed: false },
            { title: 'Pair of Linear Equations', duration: '50 min', type: 'video', completed: false },
            // ... CBSE specific lessons
          ]
        }
        // ... other CBSE modules
      ]
    },

    // ================= RECRUITMENT EXAM COURSES =================
    'Rectt1': {
      name: 'TNPSC Preparation',
      category: 'Recruitment Exams',
      modules: [
        {
          title: 'General Studies',
          lessons: [
            { title: 'Indian Polity', duration: '60 min', type: 'video', completed: false },
            { title: 'Indian Economy', duration: '55 min', type: 'video', completed: false },
            { title: 'Geography of India', duration: '50 min', type: 'video', completed: false },
            { title: 'History of India', duration: '65 min', type: 'video', completed: false }
          ]
        },
        {
          title: 'Aptitude & Mental Ability',
          lessons: [
            { title: 'Quantitative Aptitude', duration: '45 min', type: 'video', completed: false },
            { title: 'Logical Reasoning', duration: '40 min', type: 'video', completed: false },
            { title: 'Verbal Ability', duration: '35 min', type: 'video', completed: false }
          ]
        }
        // ... more modules
      ]
    },

    'Rectt2': {
      name: 'TRB Preparation',
      category: 'Recruitment Exams',
      modules: [
        {
          title: 'Teaching Methodology',
          lessons: [
            { title: 'Educational Psychology', duration: '50 min', type: 'video', completed: false },
            { title: 'Teaching Techniques', duration: '45 min', type: 'video', completed: false },
            // ... more lessons
          ]
        }
        // ... more modules
      ]
    },

    // ================= ENTRANCE EXAM COURSES =================
    'Ent1': {
      name: 'JEE Preparation',
      category: 'Entrance Exams',
      modules: [
        {
          title: 'Physics',
          lessons: [
            { title: 'Mechanics', duration: '60 min', type: 'video', completed: false },
            { title: 'Thermodynamics', duration: '55 min', type: 'video', completed: false },
            // ... more lessons
          ]
        }
        // ... more modules
      ]
    },

    'Ent2': {
      name: 'NEET Preparation',
      category: 'Entrance Exams',
      modules: [
        {
          title: 'Biology',
          lessons: [
            { title: 'Botany - Plant Physiology', duration: '50 min', type: 'video', completed: false },
            { title: 'Zoology - Human Physiology', duration: '55 min', type: 'video', completed: false },
            // ... more lessons
          ]
        }
        // ... more modules
      ]
    }

    // Add other courses as needed...
  };

  const course = courseContentData[courseId];

  // Load progress when component mounts
  useEffect(() => {
    if (user && courseId) {
      const enrollmentProgress = getEnrollmentProgress(courseId);
      if (enrollmentProgress) {
        setProgress(enrollmentProgress);
      }
    }
  }, [user, courseId, getEnrollmentProgress]);

  // Redirect if not enrolled
  useEffect(() => {
    if (user && !isUserEnrolled(courseId)) {
      navigate(`/intro/${courseId}`);
    }
  }, [user, courseId, isUserEnrolled, navigate]);

  const handleLessonComplete = (moduleIndex, lessonIndex) => {
    if (!user) return;

    const updatedProgress = {
      ...progress,
      completedLevels: [...(progress.completedLevels || [])],
      lastUpdated: new Date().toISOString()
    };

    const lessonKey = `${moduleIndex}-${lessonIndex}`;
    if (!updatedProgress.completedLevels.includes(lessonKey)) {
      updatedProgress.completedLevels.push(lessonKey);
    }

    // Calculate overall progress
    const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
    updatedProgress.progress = Math.round((updatedProgress.completedLevels.length / totalLessons) * 100);

    setProgress(updatedProgress);
    updateProgress(courseId, updatedProgress);
  };

  const isLessonCompleted = (moduleIndex, lessonIndex) => {
    const lessonKey = `${moduleIndex}-${lessonIndex}`;
    return progress.completedLevels?.includes(lessonKey) || false;
  };

  const getCourseProgress = () => {
    const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
    const completedLessons = progress.completedLevels?.length || 0;
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  if (!user) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>Please Login</h2>
            <p>You need to be logged in to access course content.</p>
            <button onClick={() => navigate('/')} className={styles.backButton}>
              Go to Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isUserEnrolled(courseId)) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>Not Enrolled</h2>
            <p>You are not enrolled in this course. Please enroll first.</p>
            <button onClick={() => navigate(`/intro/${courseId}`)} className={styles.backButton}>
              Go to Course Intro
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>Course Not Found</h2>
            <p>The course content is not available.</p>
            <button onClick={() => navigate('/')} className={styles.backButton}>
              Back to Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    //<Layout>
      <div className={styles.container}>
        {/* Course Header */}
        <div className={styles.courseHeader}>
          <div className={styles.courseInfo}>
            <h1 className={styles.courseTitle}>{course.name}</h1>
            <p className={styles.courseCategory}>{course.category}</p>
            {course.board && (
              <div className={styles.courseDetails}>
                <span>Board: {course.board}</span>
                <span>Class: {course.classGrade}</span>
                <span>Medium: {course.medium}</span>
              </div>
            )}
          </div>
          <div className={styles.progressSection}>
            <div className={styles.progressCircle}>
              <span className={styles.progressText}>{getCourseProgress()}%</span>
            </div>
            <p className={styles.progressLabel}>Course Complete</p>
          </div>
        </div>

        {/* Course Content */}
        <div className={styles.courseLayout}>
          {/* Modules Sidebar */}
          <div className={styles.modulesSidebar}>
            <h3>Course Modules</h3>
            <div className={styles.modulesList}>
              {course.modules.map((module, moduleIndex) => (
                <div
                  key={moduleIndex}
                  className={`${styles.moduleItem} ${activeModule === moduleIndex ? styles.activeModule : ''}`}
                  onClick={() => setActiveModule(moduleIndex)}
                >
                  <div className={styles.moduleHeader}>
                    <h4>{module.title}</h4>
                    <span className={styles.lessonCount}>
                      {module.lessons.length} lessons
                    </span>
                  </div>
                  <div className={styles.moduleProgress}>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill}
                        style={{ 
                          width: `${Math.round((module.lessons.filter((_, lessonIndex) => isLessonCompleted(moduleIndex, lessonIndex)).length / module.lessons.length) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lessons Content */}
          <div className={styles.lessonsContent}>
            {course.modules[activeModule] && (
              <>
                <div className={styles.moduleTitle}>
                  <h2>{course.modules[activeModule].title}</h2>
                  <p>{course.modules[activeModule].lessons.length} lessons in this module</p>
                </div>

                <div className={styles.lessonsList}>
                  {course.modules[activeModule].lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lessonIndex}
                      className={`${styles.lessonItem} ${isLessonCompleted(activeModule, lessonIndex) ? styles.completed : ''} ${activeLesson === lessonIndex ? styles.activeLesson : ''}`}
                      onClick={() => setActiveLesson(lessonIndex)}
                    >
                      <div className={styles.lessonIcon}>
                        {lesson.type === 'video' && '📹'}
                        {lesson.type === 'quiz' && '📝'}
                        {lesson.type === 'test' && '🧪'}
                        {lesson.type === 'lab' && '🔬'}
                      </div>
                      <div className={styles.lessonInfo}>
                        <h4>{lesson.title}</h4>
                        <p className={styles.lessonMeta}>
                          <span className={styles.duration}>{lesson.duration}</span>
                          <span className={styles.type}>{lesson.type}</span>
                        </p>
                      </div>
                      <div className={styles.lessonActions}>
                        {isLessonCompleted(activeModule, lessonIndex) ? (
                          <span className={styles.completedBadge}>✅ Completed</span>
                        ) : (
                          <button
                            className={styles.completeButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLessonComplete(activeModule, lessonIndex);
                            }}
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Lesson Content Area */}
                <div className={styles.lessonContent}>
                  <h3>{course.modules[activeModule].lessons[activeLesson]?.title}</h3>
                  <div className={styles.contentPlaceholder}>
                    <div className={styles.placeholderIcon}>
                      {course.modules[activeModule].lessons[activeLesson]?.type === 'video' && '🎬'}
                      {course.modules[activeModule].lessons[activeLesson]?.type === 'quiz' && '📊'}
                      {course.modules[activeModule].lessons[activeLesson]?.type === 'test' && '📄'}
                      {course.modules[activeModule].lessons[activeLesson]?.type === 'lab' && '🔍'}
                    </div>
                    <h4>Lesson Content Will Appear Here</h4>
                    <p>This is where the actual {course.modules[activeModule].lessons[activeLesson]?.type} content would be displayed.</p>
                    <p>Duration: {course.modules[activeModule].lessons[activeLesson]?.duration}</p>
                    
                    <div className={styles.lessonActions}>
                      <button className={styles.primaryButton}>
                        Start {course.modules[activeModule].lessons[activeLesson]?.type}
                      </button>
                      {!isLessonCompleted(activeModule, activeLesson) && (
                        <button
                          className={styles.secondaryButton}
                          onClick={() => handleLessonComplete(activeModule, activeLesson)}
                        >
                          Mark as Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    //</Layout>
  );
};

export default CourseContent;