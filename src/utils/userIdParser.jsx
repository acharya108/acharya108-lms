// src/utils/userIdParser.jsx

export const parseUserId = (userId) => {
  if (!userId) return { 
    category: '', 
    subcategory: '', 
    categoryCode: '',
    isValid: false 
  };

  // School Tuitions Pattern: ST_Board_Class_Medium_StudentID
  if (userId.startsWith('ST_')) {
    const parts = userId.split('_');
    if (parts.length >= 4) {
      const [, board, classGrade, medium] = parts;
      return {
        category: 'School Tuitions',
        subcategory: `${board} Board - Class ${classGrade} - ${medium}`,
        categoryCode: 'ST',
        board,
        classGrade,
        medium,
        isValid: true
      };
    }
  }

  // Recruitment Exams Pattern: RE_Exam_00_Medium_StudentID
  if (userId.startsWith('RE_')) {
    const parts = userId.split('_');
    if (parts.length >= 4) {
      const [, examCode] = parts;
      const examMap = {
        'TP': 'TNPSC',
        'TR': 'TRB',
        'TU': 'TNUSRB & Other TN Recruitments',
        'SS': 'SSC',
        'UP': 'UPSC',
        'RR': 'RRB',
        'IB': 'IBPS & Others'
      };
      return {
        category: 'Recruitment Exams',
        subcategory: examMap[examCode] || 'Unknown Recruitment Exam',
        categoryCode: 'RE',
        examCode,
        isValid: true
      };
    }
  }

  // Add patterns for other user types as needed...

  return {
    category: '',
    subcategory: '',
    categoryCode: '',
    isValid: false
  };
};

export const hasCourseAccess = (userInfo, courseId) => {
  if (!userInfo || !userInfo.isValid) return false;

  // School Tuitions access
  if (courseId === 'school-tuitions' && userInfo.categoryCode === 'ST') {
    return true;
  }

  // Recruitment Exams access
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
    return courseMap[courseId] === userInfo.examCode;
  }

  return false;
};

// Sample test users for development
export const SAMPLE_USER_IDS = {
  SCHOOL_TN_10_ENGLISH: 'ST_TN_10_E_000001',
  SCHOOL_CB_12_ENGLISH: 'ST_CB_12_E_000003',
  RECRUITMENT_TNPSC: 'RE_TP_00_E_000006'
};