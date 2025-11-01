import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/SchoolBoardTabs.module.css';

const SchoolBoardTabs = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cbse');
  const [selectedMedium, setSelectedMedium] = useState({});

  const boardData = {
    cbse: {
      name: 'CBSE',
      description: 'Central Board of Secondary Education',
      mediums: ['English', 'Hindi'],
      classes: [
        { id: 'cbse-1', name: 'Class 1', subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Computer'] },
        { id: 'cbse-2', name: 'Class 2', subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Computer'] },
        { id: 'cbse-3', name: 'Class 3', subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Computer'] },
        { id: 'cbse-4', name: 'Class 4', subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Computer'] },
        { id: 'cbse-5', name: 'Class 5', subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Computer'] },
        { id: 'cbse-6', name: 'Class 6', subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer'] },
        { id: 'cbse-7', name: 'Class 7', subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer'] },
        { id: 'cbse-8', name: 'Class 8', subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer'] },
        { id: 'cbse-9', name: 'Class 9', subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer'] },
        { id: 'cbse-10', name: 'Class 10', subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer'] },
        { id: 'cbse-11-sci', name: 'Class 11 Science', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'English'] },
        { id: 'cbse-12-sci', name: 'Class 12 Science', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'English'] },
        { id: 'cbse-11-com', name: 'Class 11 Commerce', subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'Computer Science', 'English'] },
        { id: 'cbse-12-com', name: 'Class 12 Commerce', subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'Computer Science', 'English'] }
      ]
    },
    state: {
      name: 'State Board',
      description: 'Tamil Nadu State Board',
      mediums: ['English', 'Tamil'],
      classes: [
        { id: 'state-1', name: 'Class 1', subjects: ['Tamil', 'English', 'Mathematics', 'EVS'] },
        { id: 'state-2', name: 'Class 2', subjects: ['Tamil', 'English', 'Mathematics', 'EVS'] },
        { id: 'state-3', name: 'Class 3', subjects: ['Tamil', 'English', 'Mathematics', 'EVS'] },
        { id: 'state-4', name: 'Class 4', subjects: ['Tamil', 'English', 'Mathematics', 'EVS'] },
        { id: 'state-5', name: 'Class 5', subjects: ['Tamil', 'English', 'Mathematics', 'EVS'] },
        { id: 'state-6', name: 'Class 6', subjects: ['Tamil', 'English', 'Mathematics', 'Science', 'Social Science'] },
        { id: 'state-7', name: 'Class 7', subjects: ['Tamil', 'English', 'Mathematics', 'Science', 'Social Science'] },
        { id: 'state-8', name: 'Class 8', subjects: ['Tamil', 'English', 'Mathematics', 'Science', 'Social Science'] },
        { id: 'state-9', name: 'Class 9', subjects: ['Tamil', 'English', 'Mathematics', 'Science', 'Social Science'] },
        { id: 'state-10', name: 'Class 10', subjects: ['Tamil', 'English', 'Mathematics', 'Science', 'Social Science'] },
        { id: 'state-11-sci', name: 'Class 11 Science', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'English'] },
        { id: 'state-12-sci', name: 'Class 12 Science', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'English'] },
        { id: 'state-11-com', name: 'Class 11 Commerce', subjects: ['Accountancy', 'Commerce', 'Economics', 'Business Mathematics', 'English'] },
        { id: 'state-12-com', name: 'Class 12 Commerce', subjects: ['Accountancy', 'Commerce', 'Economics', 'Business Mathematics', 'English'] }
      ]
    },
    icse: {
      name: 'ICSE/ISC',
      description: 'Indian Certificate of Secondary Education',
      mediums: ['English', 'Hindi'],
      classes: [
        { id: 'icse-1', name: 'Class 1', subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Computer'] },
        { id: 'icse-2', name: 'Class 2', subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Computer'] },
        { id: 'icse-3', name: 'Class 3', subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Computer'] },
        { id: 'icse-4', name: 'Class 4', subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Computer'] },
        { id: 'icse-5', name: 'Class 5', subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Computer'] },
        { id: 'icse-6', name: 'Class 6', subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'History', 'Geography', 'Computer'] },
        { id: 'icse-7', name: 'Class 7', subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'History', 'Geography', 'Computer'] },
        { id: 'icse-8', name: 'Class 8', subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'History', 'Geography', 'Computer'] },
        { id: 'icse-9', name: 'Class 9', subjects: ['English', 'Hindi', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'] },
        { id: 'icse-10', name: 'Class 10', subjects: ['English', 'Hindi', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'] },
        { id: 'icse-11-sci', name: 'Class 11 Science', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'English'] },
        { id: 'icse-12-sci', name: 'Class 12 Science', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'English'] },
        { id: 'icse-11-com', name: 'Class 11 Commerce', subjects: ['Accounts', 'Commerce', 'Economics', 'Business Studies', 'English'] },
        { id: 'icse-12-com', name: 'Class 12 Commerce', subjects: ['Accounts', 'Commerce', 'Economics', 'Business Studies', 'English'] }
      ]
    },
    pearson: {
      name: 'Pearson Edexcel',
      description: 'Pearson Edexcel International Curriculum',
      mediums: ['English'],
      classes: [
        { id: 'pearson-1', name: 'Year 1', subjects: ['English', 'Mathematics', 'Science', 'Global Perspectives'] },
        { id: 'pearson-2', name: 'Year 2', subjects: ['English', 'Mathematics', 'Science', 'Global Perspectives'] },
        { id: 'pearson-3', name: 'Year 3', subjects: ['English', 'Mathematics', 'Science', 'Global Perspectives'] },
        { id: 'pearson-4', name: 'Year 4', subjects: ['English', 'Mathematics', 'Science', 'Global Perspectives'] },
        { id: 'pearson-5', name: 'Year 5', subjects: ['English', 'Mathematics', 'Science', 'Global Perspectives'] },
        { id: 'pearson-6', name: 'Year 6', subjects: ['English', 'Mathematics', 'Science', 'Global Perspectives', 'ICT'] },
        { id: 'pearson-7', name: 'Year 7', subjects: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'ICT'] },
        { id: 'pearson-8', name: 'Year 8', subjects: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'ICT'] },
        { id: 'pearson-9', name: 'Year 9', subjects: ['English Language', 'Mathematics', 'Additional Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics'] },
        { id: 'pearson-10', name: 'Year 10', subjects: ['English Language', 'Mathematics', 'Additional Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics'] },
        { id: 'pearson-11', name: 'AS Level', subjects: ['Mathematics', 'Further Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Studies'] },
        { id: 'pearson-12', name: 'A Level', subjects: ['Mathematics', 'Further Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Studies'] }
      ]
    },
    uk: {
      name: 'UK Curriculum',
      description: 'United Kingdom National Curriculum',
      mediums: ['English'],
      classes: [
        { id: 'uk-1', name: 'Year 1', subjects: ['English', 'Mathematics', 'Science', 'Geography', 'History'] },
        { id: 'uk-2', name: 'Year 2', subjects: ['English', 'Mathematics', 'Science', 'Geography', 'History'] },
        { id: 'uk-3', name: 'Year 3', subjects: ['English', 'Mathematics', 'Science', 'Geography', 'History'] },
        { id: 'uk-4', name: 'Year 4', subjects: ['English', 'Mathematics', 'Science', 'Geography', 'History'] },
        { id: 'uk-5', name: 'Year 5', subjects: ['English', 'Mathematics', 'Science', 'Geography', 'History'] },
        { id: 'uk-6', name: 'Year 6', subjects: ['English', 'Mathematics', 'Science', 'Geography', 'History', 'French'] },
        { id: 'uk-7', name: 'Year 7', subjects: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'French'] },
        { id: 'uk-8', name: 'Year 8', subjects: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'French'] },
        { id: 'uk-9', name: 'Year 9', subjects: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'French', 'Economics'] },
        { id: 'uk-10', name: 'Year 10', subjects: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'French', 'Economics'] },
        { id: 'uk-11', name: 'Year 11 (GCSE)', subjects: ['English Literature', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'Business Studies'] },
        { id: 'uk-12', name: 'Year 12 (A-Level)', subjects: ['Mathematics', 'Further Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Studies'] }
      ]
    },
    canada: {
      name: 'Canada Curriculum',
      description: 'Canadian Provincial Curriculum',
      mediums: ['English', 'French'],
      classes: [
        { id: 'canada-1', name: 'Grade 1', subjects: ['English', 'Mathematics', 'Science', 'Social Studies', 'French'] },
        { id: 'canada-2', name: 'Grade 2', subjects: ['English', 'Mathematics', 'Science', 'Social Studies', 'French'] },
        { id: 'canada-3', name: 'Grade 3', subjects: ['English', 'Mathematics', 'Science', 'Social Studies', 'French'] },
        { id: 'canada-4', name: 'Grade 4', subjects: ['English', 'Mathematics', 'Science', 'Social Studies', 'French'] },
        { id: 'canada-5', name: 'Grade 5', subjects: ['English', 'Mathematics', 'Science', 'Social Studies', 'French'] },
        { id: 'canada-6', name: 'Grade 6', subjects: ['English', 'Mathematics', 'Science', 'Social Studies', 'French', 'ICT'] },
        { id: 'canada-7', name: 'Grade 7', subjects: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Social Studies', 'French', 'ICT'] },
        { id: 'canada-8', name: 'Grade 8', subjects: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Social Studies', 'French', 'ICT'] },
        { id: 'canada-9', name: 'Grade 9', subjects: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'French', 'Economics'] },
        { id: 'canada-10', name: 'Grade 10', subjects: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'French', 'Economics'] },
        { id: 'canada-11', name: 'Grade 11', subjects: ['English', 'Advanced Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics', 'Business'] },
        { id: 'canada-12', name: 'Grade 12', subjects: ['English', 'Advanced Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics', 'Business'] }
      ]
    }
  };

  const handleEnrollClick = (classId, medium) => {
    const boardName = boardData[activeTab].name;
    alert(`Please contact support to enroll in ${classId} - ${boardName} (${medium} Medium)`);
  };

  const handleMediumChange = (medium) => {
    setSelectedMedium(prev => ({
      ...prev,
      [activeTab]: medium
    }));
  };

  const getCurrentMedium = () => {
    return selectedMedium[activeTab] || boardData[activeTab].mediums[0];
  };

  return (
    <div className={styles.schoolTabsContainer}>
      {/* Tab Headers */}
      <div className={styles.tabHeaders}>
        {Object.keys(boardData).map((boardKey) => (
          <button
            key={boardKey}
            className={`${styles.tabHeader} ${activeTab === boardKey ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(boardKey)}
          >
            {boardData[boardKey].name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        <div className={styles.boardInfo}>
          <h3>{boardData[activeTab].name}</h3>
          <p>{boardData[activeTab].description}</p>
          
          {/* Language Medium Selection */}
          <div className={styles.mediumSelector}>
            <label>Select Medium:</label>
            <div className={styles.mediumButtons}>
              {boardData[activeTab].mediums.map((medium) => (
                <button
                  key={medium}
                  className={`${styles.mediumButton} ${getCurrentMedium() === medium ? styles.activeMedium : ''}`}
                  onClick={() => handleMediumChange(medium)}
                >
                  {medium}
                  {medium === 'Tamil' && ' 🇮🇳'}
                  {medium === 'Hindi' && ' 🇮🇳'}
                  {medium === 'English' && ' 🇬🇧'}
                  {medium === 'French' && ' 🇫🇷'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.classesGrid}>
          {boardData[activeTab].classes.map((classItem) => (
            <div key={classItem.id} className={styles.classCard}>
              <div className={styles.classHeader}>
                <h4>{classItem.name}</h4>
                <div className={styles.classInfo}>
                  <span className={styles.mediumBadge}>
                    {getCurrentMedium()} Medium
                  </span>
                  <span className={styles.classLevel}>
                    {classItem.id.includes('1') || classItem.id.includes('2') || classItem.id.includes('3') || 
                     classItem.id.includes('4') || classItem.id.includes('5') ? 'Primary' : 
                     classItem.id.includes('6') || classItem.id.includes('7') || classItem.id.includes('8') ? 'Middle School' :
                     classItem.id.includes('9') || classItem.id.includes('10') ? 'Secondary' : 'Senior Secondary'}
                  </span>
                </div>
              </div>
              
              <div className={styles.subjectsList}>
                <h5>Subjects Offered ({getCurrentMedium()}):</h5>
                <div className={styles.subjectsGrid}>
                  {classItem.subjects.map((subject, index) => (
                    <span key={index} className={styles.subjectTag}>
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.classFeatures}>
                <div className={styles.feature}>
                  <span>📚</span>
                  Complete Syllabus
                </div>
                <div className={styles.feature}>
                  <span>🎥</span>
                  Video Lectures
                </div>
                <div className={styles.feature}>
                  <span>📝</span>
                  Regular Tests
                </div>
                <div className={styles.feature}>
                  <span>🤝</span>
                  Doubt Sessions
                </div>
                {getCurrentMedium() === 'French' && (
                  <div className={styles.feature}>
                    <span>🇫🇷</span>
                    Bilingual Support
                  </div>
                )}
                {(getCurrentMedium() === 'Tamil' || getCurrentMedium() === 'Hindi') && (
                  <div className={styles.feature}>
                    <span>🇮🇳</span>
                    Regional Language Expert
                  </div>
                )}
              </div>

              <button 
                className={styles.enrollButton}
                onClick={() => handleEnrollClick(classItem.name, getCurrentMedium())}
              >
                Enroll in {classItem.name} ({getCurrentMedium()})
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchoolBoardTabs;