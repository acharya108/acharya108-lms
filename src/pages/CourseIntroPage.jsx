import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CourseEnrollment from '../components/CourseEnrollment';
import styles from '../styles/Common.module.css';

// Complete course details with unique IDs
const courseDetails = {
  // Recruitment Exams
  'Rectt1': {
    name: 'TNPSC',
    category: 'Recruitment Exams',
    description: 'Tamil Nadu Public Service Commission exams for various government posts in Tamil Nadu state services. TNPSC has been the gateway to prestigious state government positions since its establishment, offering stable careers with growth opportunities.',
    duration: '6-12 months',
    level: 'Graduate and above',
    features: [
      'Complete syllabus coverage for Group 1, 2, 4 exams',
      'Current affairs and Tamil language special training',
      'Mock tests and previous year question papers',
      'Interview preparation and personality development',
      'Special focus on Tamil Nadu administration and history',
      'Comprehensive general studies and aptitude training'
    ]
  },
  'Rectt2': {
    name: 'TRB',
    category: 'Recruitment Exams',
    description: 'Tamil Nadu Teachers Recruitment Board exams for teaching positions in government schools. TRB ensures qualified educators shape future generations through rigorous selection processes.',
    duration: '6-9 months',
    level: 'B.Ed./M.Ed. required',
    features: [
      'Subject-specific pedagogy training',
      'Child psychology and teaching methodologies',
      'Classroom management techniques',
      'Educational technology integration',
      'Tamil Nadu educational policies coverage',
      'Practical teaching skill development'
    ]
  },
  'Rectt3': {
    name: 'TNUSRB & Other TN Recruitments',
    category: 'Recruitment Exams',
    description: 'Tamil Nadu Uniformed Services Recruitment Board exams for police and other uniformed services.',
    duration: '8-12 months',
    level: '12th Standard and above',
    features: [
      'Physical training and endurance building',
      'Law and order knowledge',
      'Mental ability and reasoning',
      'Medical fitness guidance'
    ]
  },
  'Rectt4': {
    name: 'SSC',
    category: 'Recruitment Exams',
    description: 'Staff Selection Commission exams for various central government posts across India.',
    duration: '10-12 months',
    level: 'Graduate and above',
    features: [
      'Comprehensive coverage of CGL, CHSL, MTS exams',
      'Quantitative aptitude and English language mastery',
      'General awareness and current affairs',
      'Computer proficiency and typing practice'
    ]
  },
  'Rectt5': {
    name: 'UPSC',
    category: 'Recruitment Exams',
    description: 'Union Public Service Commission Civil Services Examination for IAS, IPS, IFS and other central services.',
    duration: '18-24 months',
    level: 'Graduate and above',
    features: [
      'Complete GS, CSAT, and optional subject coverage',
      'Current affairs analysis and essay writing',
      'Personality test and interview preparation',
      'Answer writing practice and test series'
    ]
  },
  'Rectt6': {
    name: 'RRB',
    category: 'Recruitment Exams',
    description: 'Railway Recruitment Board exams for various technical and non-technical posts in Indian Railways.',
    duration: '8-10 months',
    level: '10th Standard to Graduate',
    features: [
      'Technical and non-technical post preparation',
      'Railway specific knowledge and rules',
      'Aptitude and reasoning training',
      'Medical standards guidance'
    ]
  },
  'Rectt7': {
    name: 'IBPS & Others',
    category: 'Recruitment Exams',
    description: 'Institute of Banking Personnel Selection exams for PO, Clerk, and SO positions in public sector banks.',
    duration: '9-12 months',
    level: 'Graduate and above',
    features: [
      'Banking awareness and financial knowledge',
      'Computer awareness and reasoning ability',
      'English language and quantitative aptitude',
      'Interview and group discussion preparation'
    ]
  },

  // Entrance Exams
  'Ent1': {
    name: 'JEE',
    category: 'Entrance Exams',
    description: 'Joint Entrance Examination for admission to engineering colleges including IITs and NITs.',
    duration: '24 months',
    level: '12th Standard Science',
    features: [
      'Physics, Chemistry, Mathematics comprehensive coverage',
      'Problem solving techniques and speed development',
      'Mock tests and previous year papers',
      'Rank improvement strategies'
    ]
  },
  'Ent2': {
    name: 'NEET',
    category: 'Entrance Exams',
    description: 'National Eligibility cum Entrance Test for medical and dental colleges across India.',
    duration: '24 months',
    level: '12th Standard Science',
    features: [
      'Biology, Chemistry, Physics detailed syllabus',
      'Diagram-based learning and concept clarity',
      'Medical entrance specific preparation',
      'Time management and accuracy training'
    ]
  },
  'Ent3': {
    name: 'CAT',
    category: 'Entrance Exams',
    description: 'Common Admission Test for MBA programs in IIMs and other top business schools.',
    duration: '12-15 months',
    level: 'Graduate with 50% marks',
    features: [
      'Quantitative ability and data interpretation',
      'Verbal ability and reading comprehension',
      'Logical reasoning and decision making',
      'GD-PI preparation and profile building'
    ]
  },
  'Ent4': {
    name: 'GATE',
    category: 'Entrance Exams',
    description: 'Graduate Aptitude Test in Engineering for PG programs and PSU recruitment.',
    duration: '12 months',
    level: 'Engineering Graduate',
    features: [
      'Subject-specific technical knowledge',
      'Engineering mathematics and general aptitude',
      'PSU recruitment pattern preparation',
      'Research orientation development'
    ]
  },
  'Ent5': {
    name: 'CLAT',
    category: 'Entrance Exams',
    description: 'Common Law Admission Test for National Law Universities across India.',
    duration: '12 months',
    level: '12th Standard and above',
    features: [
      'Legal aptitude and reasoning',
      'General knowledge and current affairs',
      'English language and comprehension',
      'Logical and analytical reasoning'
    ]
  },
  'Ent6': {
    name: 'CUET',
    category: 'Entrance Exams',
    description: 'Common University Entrance Test for undergraduate programs in central universities.',
    duration: '10 months',
    level: '12th Standard',
    features: [
      'Domain specific subject preparation',
      'General test and language training',
      'Current affairs and general knowledge',
      'Mock tests and time management'
    ]
  },
  'Ent7': {
    name: 'TET',
    category: 'Entrance Exams',
    description: 'Teacher Eligibility Test for teaching positions in primary and upper primary schools.',
    duration: '6 months',
    level: 'Diploma/Degree in Education',
    features: [
      'Child development and pedagogy',
      'Language and subject knowledge',
      'Teaching methodologies and assessment',
      'Classroom management techniques'
    ]
  },
  'Ent8': {
    name: 'TANCET',
    category: 'Entrance Exams',
    description: 'Tamil Nadu Common Entrance Test for PG programs in engineering, management, and architecture.',
    duration: '8 months',
    level: 'Graduate in relevant field',
    features: [
      'Engineering and management streams',
      'Technical knowledge and aptitude',
      'Previous year pattern analysis',
      'State-specific preparation'
    ]
  },
  'Ent9': {
    name: 'MAT',
    category: 'Entrance Exams',
    description: 'Management Aptitude Test for MBA programs in various B-schools across India.',
    duration: '9 months',
    level: 'Graduate in any discipline',
    features: [
      'Language comprehension and mathematical skills',
      'Data analysis and sufficiency',
      'Intelligence and critical reasoning',
      'Indian and global environment awareness'
    ]
  },

  // Professional Courses
  'Prof1': {
    name: 'CA',
    category: 'Professional Courses',
    description: 'Chartered Accountancy program offering expertise in accounting, auditing, and taxation.',
    duration: '4-5 years',
    level: '12th Standard/ Graduate',
    features: [
      'Accounting and financial reporting',
      'Auditing and assurance standards',
      'Taxation laws and corporate laws',
      'Strategic management and ethics'
    ]
  },
  'Prof2': {
    name: 'CMA',
    category: 'Professional Courses',
    description: 'Cost and Management Accounting focusing on cost control and strategic decision making.',
    duration: '3-4 years',
    level: '12th Standard/ Graduate',
    features: [
      'Cost accounting and financial management',
      'Operations management and strategic management',
      'Direct and indirect taxation',
      'Corporate laws and ethics'
    ]
  },
  'Prof3': {
    name: 'CS',
    category: 'Professional Courses',
    description: 'Company Secretaryship program specializing in corporate laws and governance.',
    duration: '3-4 years',
    level: '12th Standard/ Graduate',
    features: [
      'Company law and corporate governance',
      'Securities laws and capital markets',
      'Economic and commercial laws',
      'Tax laws and drafting appearances'
    ]
  },
  'Prof4': {
    name: 'CFA',
    category: 'Professional Courses',
    description: 'Chartered Financial Analyst focusing on investment management and financial analysis.',
    duration: '2-3 years',
    level: 'Graduate/Working Professionals',
    features: [
      'Investment analysis and portfolio management',
      'Corporate finance and equity investments',
      'Fixed income and derivatives',
      'Ethical and professional standards'
    ]
  },
  'Prof5': {
    name: 'FRM',
    category: 'Professional Courses',
    description: 'Financial Risk Manager specializing in risk management and financial markets.',
    duration: '1-2 years',
    level: 'Graduate/Finance Professionals',
    features: [
      'Risk management concepts and tools',
      'Market risk measurement and management',
      'Credit risk and operational risk',
      'Regulatory frameworks and compliance'
    ]
  },
  'Prof6': {
    name: 'ACCA',
    category: 'Professional Courses',
    description: 'Association of Chartered Certified Accountants for global accounting careers.',
    duration: '2-3 years',
    level: '12th Standard/ Graduate',
    features: [
      'International accounting standards',
      'Financial management and reporting',
      'Business analysis and strategy',
      'Global taxation and audit practices'
    ]
  },

  // Technology & IT Certification
  'IT1': {
    name: 'Computer Programming',
    category: 'Technology & IT Certification',
    description: 'Comprehensive programming skills from basics to advanced software development.',
    duration: '6-9 months',
    level: '12th Standard and above',
    features: [
      'Multiple programming languages (Python, Java, C++)',
      'Data structures and algorithms',
      'Web development and databases',
      'Software engineering principles'
    ]
  },
  'IT2': {
    name: 'Data Science',
    category: 'Technology & IT Certification',
    description: 'Data analysis, machine learning, and statistical modeling for business insights.',
    duration: '8-10 months',
    level: 'Graduate with mathematics background',
    features: [
      'Statistical analysis and probability',
      'Machine learning algorithms',
      'Data visualization tools',
      'Big data technologies'
    ]
  },
  'IT3': {
    name: 'ML & AI',
    category: 'Technology & IT Certification',
    description: 'Machine Learning and Artificial Intelligence for intelligent system development.',
    duration: '10-12 months',
    level: 'Engineering/Mathematics background',
    features: [
      'Deep learning and neural networks',
      'Natural language processing',
      'Computer vision and robotics',
      'AI ethics and responsible AI'
    ]
  },
  'IT4': {
    name: 'Cloud Computing',
    category: 'Technology & IT Certification',
    description: 'Cloud infrastructure, services, and deployment models for modern applications.',
    duration: '6-8 months',
    level: 'Basic IT knowledge',
    features: [
      'AWS, Azure, GCP platform expertise',
      'Cloud security and compliance',
      'Containerization and orchestration',
      'Serverless architecture'
    ]
  },
  'IT5': {
    name: 'Cyber Security',
    category: 'Technology & IT Certification',
    description: 'Network security, ethical hacking, and information protection strategies.',
    duration: '9-12 months',
    level: 'Networking basics required',
    features: [
      'Network security and cryptography',
      'Vulnerability assessment',
      'Incident response and forensics',
      'Security compliance and auditing'
    ]
  },
  'IT6': {
    name: 'Ethical Hacking',
    category: 'Technology & IT Certification',
    description: 'Penetration testing and security assessment to protect digital assets.',
    duration: '8-10 months',
    level: 'Networking and programming basics',
    features: [
      'Penetration testing methodologies',
      'Web application security',
      'Wireless network security',
      'Social engineering techniques'
    ]
  },
  'IT7': {
    name: 'Dev Ops',
    category: 'Technology & IT Certification',
    description: 'Development and operations integration for continuous delivery and deployment.',
    duration: '7-9 months',
    level: 'Software development basics',
    features: [
      'CI/CD pipeline implementation',
      'Containerization with Docker',
      'Orchestration with Kubernetes',
      'Infrastructure as Code'
    ]
  },
  'IT8': {
    name: 'Blockchain',
    category: 'Technology & IT Certification',
    description: 'Web3 & Blockchain Development for decentralized applications and systems.',
    duration: '8-10 months',
    level: 'Programming knowledge required',
    features: [
      'Blockchain fundamentals and cryptography',
      'Smart contract development',
      'Decentralized application architecture',
      'Web3 technologies and protocols'
    ]
  },
  'IT9': {
    name: 'IoT',
    category: 'Technology & IT Certification',
    description: 'Internet of Things for connected devices and smart systems development.',
    duration: '7-9 months',
    level: 'Electronics/Programming basics',
    features: [
      'IoT architecture and protocols',
      'Sensor networks and data acquisition',
      'Edge computing and cloud integration',
      'IoT security and implementation'
    ]
  },

  // ================= SCHOOL TUITIONS =================
    // Tamil Nadu Board - Various Classes
    'ST_TN_09_E': {
      name: 'Tamil Nadu Board - Class 9 - English Medium',
      description: 'Complete syllabus coverage for TN Board Class 9 English Medium',
      category: 'School Tuitions',
      board: 'TN',
      classGrade: '9',
      medium: 'E',
      longDescription: 'Comprehensive coaching for Tamil Nadu State Board Class 9 English Medium students. Covering all subjects with expert guidance and regular assessments.',
      features: [
        'Complete TN Board Class 9 syllabus',
        'English medium instruction',
        'Mathematics, Science, Social Science',
        'English and Tamil languages',
        'Regular tests and assignments',
        'Doubt clearing sessions'
      ]
    },
    'ST_TN_09_T': {
      name: 'Tamil Nadu Board - Class 9 - Tamil Medium',
      description: 'Complete syllabus coverage for TN Board Class 9 Tamil Medium',
      category: 'School Tuitions',
      board: 'TN',
      classGrade: '9',
      medium: 'T',
      longDescription: 'Comprehensive coaching for Tamil Nadu State Board Class 9 Tamil Medium students.',
      features: [
        'Complete TN Board Class 9 syllabus',
        'Tamil medium instruction',
        'All subjects covered',
        'Regular assessments'
      ]
    },
    'ST_TN_10_E': {
      name: 'Tamil Nadu Board - Class 10 - English Medium',
      description: 'Complete syllabus coverage for TN Board Class 10 English Medium',
      category: 'School Tuitions',
      board: 'TN',
      classGrade: '10',
      medium: 'E',
      longDescription: 'SSLC preparation for Tamil Nadu State Board Class 10 English Medium. Comprehensive coverage with focus on board exam preparation.',
      features: [
        'Complete SSLC syllabus coverage',
        'English medium instruction',
        'Board exam focused preparation',
        'Previous year question papers',
        'Model tests and revisions',
        'Special focus on important topics'
      ]
    },
    'ST_TN_10_T': {
      name: 'Tamil Nadu Board - Class 10 - Tamil Medium',
      description: 'Complete syllabus coverage for TN Board Class 10 Tamil Medium',
      category: 'School Tuitions',
      board: 'TN',
      classGrade: '10',
      medium: 'T',
      longDescription: 'SSLC preparation for Tamil Nadu State Board Class 10 Tamil Medium.',
      features: [
        'Complete SSLC syllabus coverage',
        'Tamil medium instruction',
        'Board exam preparation',
        'Comprehensive study materials'
      ]
    },

    // CBSE Board
    'ST_CB_09_E': {
      name: 'CBSE Board - Class 9 - English Medium',
      description: 'Complete syllabus coverage for CBSE Board Class 9',
      category: 'School Tuitions',
      board: 'CB',
      classGrade: '9',
      medium: 'E',
      longDescription: 'Comprehensive coaching for CBSE Board Class 9 students.',
      features: [
        'Complete CBSE Class 9 syllabus',
        'NCERT based instruction',
        'All main subjects',
        'Regular assessments'
      ]
    },
    'ST_CB_10_E': {
      name: 'CBSE Board - Class 10 - English Medium',
      description: 'Complete syllabus coverage for CBSE Board Class 10',
      category: 'School Tuitions',
      board: 'CB',
      classGrade: '10',
      medium: 'E',
      longDescription: 'Board preparation for CBSE Class 10 with comprehensive syllabus coverage.',
      features: [
        'Complete CBSE Class 10 syllabus',
        'NCERT focused teaching',
        'Sample papers practice',
        'Board exam strategy'
      ]
    },

  // Insert these in the courseDetails object in CourseIntroPage.jsx

// Skill Development Courses
'Skill1': {
  name: 'Digital Marketing',
  category: 'Skill Development',
  description: 'Comprehensive digital marketing training covering SEO, SEM, and social media marketing strategies. In the digital-first economy, businesses are shifting marketing budgets from traditional to digital channels, creating high demand for skilled digital marketers. This course provides hands-on experience with the latest tools and platforms to drive online visibility, engagement, and conversions.',
  duration: '4-6 months',
  level: 'Marketing Professionals/Business Owners/Beginners',
  features: [
    'Search Engine Optimization (SEO) techniques',
    'Search Engine Marketing (SEM) and PPC advertising',
    'Social media marketing across major platforms',
    'Content marketing strategy and execution',
    'Email marketing and automation',
    'Analytics and performance measurement',
    'Conversion rate optimization',
    'Digital marketing campaign management'
  ]
},
'Skill2': {
  name: 'Project Management',
  category: 'Skill Development',
  description: 'Professional project management training covering PMP, Agile, and Scrum methodologies. With organizations increasingly adopting structured project management approaches, certified project managers are in high demand across industries. This course prepares you for PMP certification while providing practical skills for managing projects of all sizes in both traditional and agile environments.',
  duration: '5-7 months',
  level: 'Working Professionals/Team Leads/Aspiring Managers',
  features: [
    'PMP certification preparation and exam strategies',
    'Agile methodology and Scrum framework',
    'Project planning and scheduling techniques',
    'Risk management and mitigation strategies',
    'Stakeholder management and communication',
    'Budgeting and resource allocation',
    'Quality management and control',
    'Project documentation and reporting'
  ]
},
'Skill3': {
  name: 'Business Analytics',
  category: 'Skill Development',
  description: 'Data analysis and business intelligence training for data-driven decision making. In the era of big data, organizations rely on business analytics to gain competitive insights and drive strategic decisions. This course covers the complete analytics lifecycle from data collection to visualization and storytelling, using industry-standard tools and techniques.',
  duration: '6-8 months',
  level: 'Analysts/Managers/Data Enthusiasts',
  features: [
    'Statistical analysis and hypothesis testing',
    'Data visualization with modern BI tools',
    'Predictive modeling and forecasting',
    'Database querying and data manipulation',
    'Business intelligence dashboard creation',
    'Data-driven decision making frameworks',
    'Storytelling with data techniques',
    'Industry case studies and real-world projects'
  ]
},
'Skill4': {
  name: 'UI/UX Design',
  category: 'Skill Development',
  description: 'User Interface and User Experience design training for creating intuitive digital products. As user expectations for digital experiences continue to rise, UI/UX design has become critical for product success. This course combines design principles with user research methodologies to create interfaces that are both beautiful and functional across web and mobile platforms.',
  duration: '5-7 months',
  level: 'Designers/Developers/Product Managers',
  features: [
    'User research and persona development',
    'Wireframing and prototyping techniques',
    'Visual design principles and color theory',
    'Interaction design and micro-interactions',
    'Usability testing and user feedback',
    'Design systems and component libraries',
    'Mobile-first and responsive design',
    'Portfolio development with real projects'
  ]
},
'Skill5': {
  name: 'Content Writing',
  category: 'Skill Development',
  description: 'Professional writing and copywriting skills for digital and traditional media. Quality content has become the backbone of digital marketing, brand building, and customer engagement. This course develops versatile writing skills for various formats including blogs, social media, marketing copy, technical documentation, and corporate communications.',
  duration: '3-5 months',
  level: 'Writers/Marketers/Business Professionals',
  features: [
    'SEO writing and keyword optimization',
    'Copywriting for conversions and sales',
    'Blog and article writing techniques',
    'Social media content creation',
    'Technical and business writing',
    'Editing and proofreading skills',
    'Content strategy and planning',
    'Freelance writing business setup'
  ]
},
'Skill6': {
  name: 'Public Speaking',
  category: 'Skill Development',
  description: 'Communication and presentation skills training for confident public speaking. Effective public speaking is a critical leadership skill that influences career advancement, business success, and personal confidence. This course provides practical techniques to overcome stage fright, structure compelling presentations, and engage diverse audiences in various settings.',
  duration: '2-4 months',
  level: 'Professionals/Students/Leaders/All Levels',
  features: [
    'Overcoming stage fright and building confidence',
    'Speech structure and content organization',
    'Vocal variety and body language mastery',
    'Visual aids and presentation design',
    'Audience engagement and interaction techniques',
    'Handling Q&A sessions effectively',
    'Persuasive speaking and storytelling',
    'Practice sessions with personalized feedback'
  ]
},
  // Language Courses
  'Lang1': {
    name: 'English Proficiency',
    category: 'Language Courses',
    description: 'Comprehensive English language training for international proficiency tests including IELTS, TOEFL, and PTE. In todays globalized world, English proficiency has become essential for higher education abroad, international career opportunities, and global communication. Our program focuses on all four language skills: reading, writing, listening, and speaking, with special emphasis on test-taking strategies and real-world communication.',
    duration: '4-6 months',
    level: 'Intermediate to Advanced',
    features: [
      'IELTS, TOEFL, PTE test preparation',
      'Academic and general training modules',
      'Speaking practice with native accent training',
      'Writing skills for essays and reports',
      'Listening comprehension and note-taking',
      'Reading strategies for complex texts',
      'Mock tests and performance analysis',
      'Personalized feedback and improvement plans'
    ]
  },
  'Lang2': {
    name: 'Spoken English',
    category: 'Language Courses',
    description: 'Fluency development and communication skills for professional and social contexts. Effective spoken English is crucial for career advancement, business communication, and social confidence. This course focuses on practical conversation skills, pronunciation improvement, and building confidence in various speaking situations from formal presentations to casual conversations.',
    duration: '3-5 months',
    level: 'Beginner to Intermediate',
    features: [
      'Pronunciation and accent neutralization',
      'Everyday conversation practice',
      'Professional communication skills',
      'Public speaking and presentation training',
      'Vocabulary building and idiom usage',
      'Listening and comprehension exercises',
      'Role-playing and situational dialogues',
      'Confidence building activities'
    ]
  },
  'Lang3': {
    name: 'French',
    category: 'Language Courses',
    description: 'Comprehensive French language training from beginner to advanced levels. French is not only the language of love and culture but also an official language in 29 countries and crucial for international diplomacy, tourism, and business. Learning French opens doors to opportunities in Europe, Canada, Africa, and international organizations.',
    duration: '6-9 months',
    level: 'Beginner to Advanced',
    features: [
      'DELF/DALF certification preparation',
      'Grammar and vocabulary building',
      'Conversational French practice',
      'French culture and civilization',
      'Business French communication',
      'Reading and writing skills',
      'Listening comprehension exercises',
      'Interactive cultural immersion'
    ]
  },
  'Lang4': {
    name: 'German',
    category: 'Language Courses',
    description: 'German language certification training for academic and professional purposes. Germany is Europes economic powerhouse and offers excellent opportunities for education and employment. German language skills are highly valued in engineering, automotive, and research fields, making it a strategic choice for career development.',
    duration: '6-8 months',
    level: 'Beginner to Intermediate',
    features: [
      'Goethe-Zertifikat preparation',
      'German grammar and syntax',
      'Business German communication',
      'Technical vocabulary development',
      'Cultural context and etiquette',
      'Reading and comprehension skills',
      'Speaking practice with native speakers',
      'Test preparation strategies'
    ]
  },
  'Lang5': {
    name: 'Japanese',
    category: 'Language Courses',
    description: 'Japanese Language Proficiency Test (JLPT) preparation and cultural immersion. Japan is a global leader in technology, automotive, and innovation industries. Learning Japanese provides access to unique career opportunities, cultural understanding, and business relationships with one of the worlds most advanced economies.',
    duration: '8-12 months',
    level: 'Beginner to Advanced',
    features: [
      'JLPT N5 to N1 level preparation',
      'Hiragana, Katakana, and Kanji writing',
      'Japanese grammar and sentence structure',
      'Business etiquette and communication',
      'Cultural context and traditions',
      'Listening and speaking practice',
      'Reading comprehension exercises',
      'Interactive cultural activities'
    ]
  },
  'Lang6': {
    name: 'Spanish',
    category: 'Language Courses',
    description: 'Spanish for beginners focusing on practical communication skills. Spanish is the second most spoken native language globally and official in 21 countries. Learning Spanish opens up opportunities in tourism, international business, and cultural exchange across Latin America, Spain, and the United States.',
    duration: '5-7 months',
    level: 'Beginner',
    features: [
      'Basic grammar and vocabulary',
      'Everyday conversation skills',
      'Pronunciation and accent training',
      'Hispanic culture and traditions',
      'Travel Spanish and practical phrases',
      'Listening and comprehension practice',
      'Reading simple texts and stories',
      'Interactive speaking activities'
    ]
  },
  'Lang7': {
    name: 'Tamil',
    category: 'Language Courses',
    description: 'Comprehensive Tamil language training for spoken and written proficiency. Tamil is one of the worlds oldest living languages with rich literary heritage and cultural significance. Learning Tamil connects you to ancient traditions, Tamil literature, and enables effective communication in Tamil-speaking regions worldwide.',
    duration: '4-6 months',
    level: 'Beginner to Advanced',
    features: [
      'Tamil script reading and writing',
      'Spoken Tamil for daily communication',
      'Grammar and sentence structure',
      'Tamil literature and poetry appreciation',
      'Cultural context and traditions',
      'Business Tamil communication',
      'Listening and comprehension exercises',
      'Writing skills development'
    ]
  },
  'Lang8': {
    name: 'Hindi',
    category: 'Language Courses',
    description: 'Hindi language proficiency development for effective communication. As Indias most widely spoken language and the fourth most spoken language globally, Hindi is essential for business, administration, and cultural integration in much of India. Learning Hindi facilitates better understanding of Indian culture and enhances career opportunities.',
    duration: '3-5 months',
    level: 'Beginner to Intermediate',
    features: [
      'Devanagari script reading and writing',
      'Basic to advanced conversation skills',
      'Grammar and vocabulary building',
      'Hindi literature and cinema appreciation',
      'Business and official communication',
      'Pronunciation and accent training',
      'Cultural context and regional variations',
      'Practical usage in daily life'
    ]
  },

  // Creative Arts
  'Art1': {
    name: 'Graphic Design',
    category: 'Creative Arts',
    description: 'Professional graphic design training using Adobe Photoshop and Illustrator. In the digital age, graphic design skills are essential for branding, marketing, and visual communication across all industries. This course combines technical skills with creative thinking to prepare students for careers in advertising, media, and design studios.',
    duration: '6-8 months',
    level: 'Beginner to Advanced',
    features: [
      'Adobe Photoshop mastery',
      'Adobe Illustrator vector graphics',
      'Logo design and brand identity',
      'Typography and layout principles',
      'Digital illustration techniques',
      'Print and web design preparation',
      'Portfolio development',
      'Industry-standard workflows'
    ]
  },
  'Art2': {
    name: 'Video Editing',
    category: 'Creative Arts',
    description: 'Professional video editing and post-production using Premiere Pro and After Effects. With the explosion of digital content and social media, video editing skills are in high demand for YouTube creators, filmmakers, marketers, and corporate communicators. This course covers the complete video production workflow from raw footage to finished product.',
    duration: '7-9 months',
    level: 'Beginner to Intermediate',
    features: [
      'Adobe Premiere Pro editing',
      'After Effects motion graphics',
      'Color correction and grading',
      'Audio editing and sound design',
      'Visual effects and compositing',
      'Workflow optimization techniques',
      'Project organization and management',
      'Portfolio project completion'
    ]
  },
  'Art3': {
    name: 'Photography',
    category: 'Creative Arts',
    description: 'Digital photography techniques and artistic expression. Photography has evolved from hobby to essential skill in marketing, journalism, and personal branding. This course covers both technical camera skills and artistic composition to help students capture compelling images for various purposes and build a professional portfolio.',
    duration: '5-7 months',
    level: 'Beginner to Advanced',
    features: [
      'Camera operation and settings',
      'Composition and framing techniques',
      'Lighting and exposure control',
      'Portrait and landscape photography',
      'Post-processing with Lightroom',
      'Commercial photography basics',
      'Storytelling through images',
      'Portfolio development and critique'
    ]
  },
  'Art4': {
    name: 'Music Theory',
    category: 'Creative Arts',
    description: 'Comprehensive music education covering Western classical and Carnatic music traditions. Music theory provides the foundation for understanding, creating, and appreciating music across genres. This course bridges traditional Indian music systems with Western classical theory, offering a unique perspective for aspiring musicians and music enthusiasts.',
    duration: '8-10 months',
    level: 'Beginner to Intermediate',
    features: [
      'Western music notation and scales',
      'Carnatic music raga system',
      'Rhythm and time signatures',
      'Harmony and chord progressions',
      'Ear training and sight-reading',
      'Music composition basics',
      'Historical context and evolution',
      'Practical application exercises'
    ]
  },
  'Art5': {
    name: 'Drawing & Painting',
    category: 'Creative Arts',
    description: 'Fine arts training in drawing, sketching, and painting techniques. Artistic skills enhance creativity, observation, and self-expression while providing therapeutic benefits. This course covers fundamental to advanced techniques in various media, helping students develop their unique artistic style and build a strong foundation in visual arts.',
    duration: '6-9 months',
    level: 'All Levels',
    features: [
      'Pencil sketching and shading',
      'Watercolor painting techniques',
      'Acrylic and oil painting',
      'Perspective and proportion',
      'Color theory and mixing',
      'Still life and portrait drawing',
      'Landscape and composition',
      'Personal style development'
    ]
  },
  'Art6': {
    name: 'Digital Art',
    category: 'Creative Arts',
    description: 'Digital illustration and concept art creation using modern tools and techniques. The digital art revolution has transformed illustration, animation, and game design industries. This course prepares students for careers in digital media, covering everything from basic digital painting to advanced concept development for films and games.',
    duration: '8-10 months',
    level: 'Beginner to Advanced',
    features: [
      'Digital painting fundamentals',
      'Character design and development',
      'Environment and background art',
      'Concept art creation process',
      'Tablet and stylus techniques',
      'Color theory for digital media',
      'Industry workflow and practices',
      'Professional portfolio building'
    ]
  },

  // Business & Management Courses
  'Biz1': {
    name: 'Artificial Intelligence for Business',
    category: 'Business & Management',
    description: 'Master AI applications in business strategy and operations. With AI revolutionizing industries globally, this course prepares professionals to leverage machine learning, predictive analytics, and automation for competitive advantage in the digital economy.',
    duration: '4-6 months',
    level: 'Graduates/Working Professionals',
    features: [
      'AI strategy development and implementation',
      'Machine learning applications in business',
      'Predictive analytics and data-driven decision making',
      'Automation and process optimization',
      'AI ethics and responsible AI practices',
      'Case studies from successful AI implementations',
      'Hands-on projects with AI tools'
    ]
  },
  'Biz2': {
    name: 'Sustainable Business & ESG',
    category: 'Business & Management',
    description: 'Comprehensive training in Environmental, Social, and Governance principles for modern businesses. As global focus shifts toward sustainable development, ESG expertise has become crucial for corporate leadership and investor relations.',
    duration: '3-5 months',
    level: 'Management Professionals/Entrepreneurs',
    features: [
      'ESG framework implementation',
      'Sustainable business model development',
      'Carbon footprint assessment and reduction',
      'Social responsibility and community engagement',
      'Corporate governance best practices',
      'ESG reporting and compliance',
      'Green financing and sustainable investing'
    ]
  },
  'Biz3': {
    name: 'Digital Marketing & Analytics',
    category: 'Business & Management',
    description: 'Data-driven digital marketing strategies for the modern business landscape. With digital advertising spending projected to exceed traditional media, this course provides essential skills for online brand building and customer engagement.',
    duration: '4-6 months',
    level: 'Marketing Professionals/Business Owners',
    features: [
      'SEO and SEM optimization techniques',
      'Social media marketing and analytics',
      'Content marketing strategy development',
      'Marketing automation tools',
      'Customer journey mapping and analysis',
      'ROI measurement and campaign optimization',
      'Emerging digital marketing trends'
    ]
  },
  'Biz4': {
    name: 'Global Supply Chain & Operations Management',
    category: 'Business & Management',
    description: 'International operations excellence and supply chain optimization. In an increasingly interconnected global economy, efficient supply chain management has become critical for business resilience and competitive advantage.',
    duration: '5-7 months',
    level: 'Operations Professionals/Logistics Managers',
    features: [
      'Global logistics and distribution networks',
      'Inventory management optimization',
      'Supply chain risk assessment and mitigation',
      'International trade regulations',
      'Digital supply chain technologies',
      'Sustainable supply chain practices',
      'Vendor and partner management'
    ]
  },
  'Biz5': {
    name: 'Financial Technology (FinTech) & Digital Finance',
    category: 'Business & Management',
    description: 'Modern financial systems and digital banking technologies. The FinTech revolution is transforming traditional finance, with digital payments, blockchain, and AI-driven financial services reshaping the industry landscape.',
    duration: '4-6 months',
    level: 'Finance Professionals/Technology Enthusiasts',
    features: [
      'Blockchain and cryptocurrency fundamentals',
      'Digital payment systems and mobile banking',
      'Regulatory technology (RegTech)',
      'AI in financial services',
      'Cybersecurity in finance',
      'Open banking and API integration',
      'FinTech startup ecosystem'
    ]
  },
  'Biz6': {
    name: 'Product Management & Innovation',
    category: 'Business & Management',
    description: 'End-to-end product development lifecycle management. As companies increasingly compete on innovation, product management has emerged as a critical function bridging technology, business, and user experience.',
    duration: '5-7 months',
    level: 'Tech Professionals/Aspiring Product Managers',
    features: [
      'Product strategy and roadmap development',
      'User research and market analysis',
      'Agile product development methodologies',
      'Minimum Viable Product (MVP) creation',
      'Product metrics and performance tracking',
      'Stakeholder management and communication',
      'Innovation frameworks and design thinking'
    ]
  },
  'Biz7': {
    name: 'People Analytics & Strategic HR',
    category: 'Business & Management',
    description: 'Data-driven human resources and organizational development. The digital transformation of HR enables evidence-based decision making for talent management, employee engagement, and organizational effectiveness.',
    duration: '4-6 months',
    level: 'HR Professionals/Managers',
    features: [
      'HR analytics tools and techniques',
      'Employee performance prediction models',
      'Talent acquisition optimization',
      'Workforce planning and analytics',
      'Employee engagement measurement',
      'Diversity and inclusion analytics',
      'HR technology implementation'
    ]
  },

  // Health & Wellness Courses
  'Health1': {
    name: 'Nutrition & Lifestyle Medicine',
    category: 'Health & Wellness',
    description: 'Holistic health approaches combining modern nutrition science with lifestyle interventions. With rising lifestyle diseases and increased health consciousness, evidence-based nutritional guidance has become essential for preventive healthcare.',
    duration: '6-8 months',
    level: 'Health Enthusiasts/Wellness Professionals',
    features: [
      'Evidence-based nutritional science',
      'Dietary planning for different health conditions',
      'Lifestyle disease prevention strategies',
      'Gut health and microbiome optimization',
      'Sports nutrition and performance enhancement',
      'Weight management techniques',
      'Nutritional counseling skills'
    ]
  },
  'Health2': {
    name: 'Integrative & Functional Wellness',
    category: 'Health & Wellness',
    description: 'Comprehensive wellness strategies combining traditional and modern approaches. The integrative medicine movement addresses the root causes of health issues rather than just symptoms, representing the future of holistic healthcare.',
    duration: '8-10 months',
    level: 'Healthcare Professionals/Wellness Coaches',
    features: [
      'Functional medicine principles',
      'Mind-body connection techniques',
      'Stress management and resilience building',
      'Sleep optimization strategies',
      'Detoxification and cleansing protocols',
      'Hormonal balance and metabolic health',
      'Integrative treatment planning'
    ]
  },

  // Personal Development & Soft Skills
  'PD1': {
    name: 'Critical Thinking & Complex Problem-Solving',
    category: 'Personal Development & Soft Skills',
    description: 'Advanced analytical thinking and problem-solving skills for the modern workplace. In an era of information overload and rapid change, critical thinking has been identified by the World Economic Forum as the most crucial skill for future employment.',
    duration: '3-5 months',
    level: 'Professionals/Students/Leaders',
    features: [
      'Logical reasoning and argument analysis',
      'Cognitive biases and decision-making psychology',
      'Systems thinking and complexity management',
      'Creative problem-solving techniques',
      'Data interpretation and evidence evaluation',
      'Strategic thinking and planning',
      'Case-based learning and real-world applications'
    ]
  },
  'PD2': {
    name: 'Leadership & Entrepreneurial Mindset',
    category: 'Personal Development & Soft Skills',
    description: 'Leadership development and entrepreneurial thinking for career advancement. The post-pandemic business environment demands adaptive leaders who can navigate uncertainty and drive innovation in dynamic market conditions.',
    duration: '4-6 months',
    level: 'Managers/Aspiring Leaders/Entrepreneurs',
    features: [
      'Leadership styles and situational leadership',
      'Change management and organizational transformation',
      'Entrepreneurial opportunity identification',
      'Risk assessment and decision-making under uncertainty',
      'Team building and talent development',
      'Strategic vision and execution planning',
      'Personal leadership brand development'
    ]
  },
  'PD3': {
    name: 'Emotional Intelligence (EQ) & Resilience',
    category: 'Personal Development & Soft Skills',
    description: 'Emotional mastery and psychological resilience for personal and professional success. Research consistently shows that emotional intelligence is a stronger predictor of success than IQ, especially in leadership roles and team environments.',
    duration: '3-4 months',
    level: 'All Professionals/Students',
    features: [
      'Self-awareness and emotional regulation',
      'Empathy and interpersonal skills development',
      'Stress management and coping strategies',
      'Conflict resolution and difficult conversations',
      'Resilience building and adaptability training',
      'Mindfulness and emotional balance practices',
      'Relationship management and social skills'
    ]
  },

  // Vocational & Technical Training
  'Voc1': {
    name: 'ITI/ISC Trades',
    category: 'Vocational & Technical Training',
    description: 'Industrial Training Institute courses for skilled workforce development. With Indias focus on "Make in India" and manufacturing growth, ITI-certified professionals are in high demand across industries for their practical technical skills.',
    duration: '1-2 years',
    level: '10th/12th Pass',
    features: [
      'Government-recognized certification',
      'Hands-on workshop training',
      'Industry-relevant skill development',
      'Apprenticeship and job placement assistance',
      'Multiple trade options (fitter, electrician, mechanic, etc.)',
      'Safety protocols and quality standards',
      'Entrepreneurship development'
    ]
  },
  'Voc2': {
    name: 'Manufacturing Skills',
    category: 'Vocational & Technical Training',
    description: 'Production and manufacturing techniques for industrial employment. As India positions itself as a global manufacturing hub, skilled manufacturing professionals are essential for quality production and operational excellence.',
    duration: '6-12 months',
    level: 'ITI/Diploma Holders',
    features: [
      'Production planning and control',
      'Quality control and assurance techniques',
      'Lean manufacturing principles',
      'Equipment operation and maintenance',
      'Safety standards and compliance',
      'Process optimization methods',
      'Team leadership in manufacturing'
    ]
  },
  'Voc3': {
    name: 'Automotive Repair',
    category: 'Vocational & Technical Training',
    description: 'Comprehensive vehicle maintenance and repair training. With increasing vehicle ownership and technological complexity, skilled automotive technicians are crucial for the growing automobile service industry.',
    duration: '8-12 months',
    level: '10th Pass and Above',
    features: [
      'Engine repair and maintenance',
      'Electrical systems and diagnostics',
      'Transmission and drivetrain systems',
      'Brake and suspension systems',
      'HVAC and comfort systems',
      'Computerized diagnostics training',
      'Customer service and workshop management'
    ]
  },
  'Voc4': {
    name: 'Culinary Arts',
    category: 'Vocational & Technical Training',
    description: 'Professional cooking, baking, and kitchen management skills. The hospitality industrys rapid growth, combined with rising food culture awareness, creates abundant opportunities for trained culinary professionals.',
    duration: '12-18 months',
    level: '10th Pass and Above',
    features: [
      'Basic to advanced cooking techniques',
      'International cuisine preparation',
      'Baking and pastry arts',
      'Food safety and sanitation',
      'Kitchen management and cost control',
      'Menu planning and development',
      'Restaurant operations knowledge'
    ]
  },
  'Voc5': {
    name: 'Plumbing',
    category: 'Vocational & Technical Training',
    description: 'Professional pipe systems installation and sanitation services. Essential infrastructure development and urban expansion drive continuous demand for skilled plumbing professionals in residential and commercial sectors.',
    duration: '6-9 months',
    level: '8th Pass and Above',
    features: [
      'Pipe fitting and installation techniques',
      'Sanitary system design and implementation',
      'Water supply and drainage systems',
      'Plumbing codes and regulations',
      'Tools and equipment handling',
      'Maintenance and repair procedures',
      'Estimation and costing skills'
    ]
  },
  'Voc6': {
    name: 'Electrical',
    category: 'Vocational & Technical Training',
    description: 'Comprehensive electrical systems installation and maintenance. With rapid electrification and smart technology integration, skilled electricians are essential for modern infrastructure development and maintenance.',
    duration: '9-12 months',
    level: '10th Pass and Above',
    features: [
      'Electrical wiring and circuit design',
      'Safety protocols and regulations',
      'Residential and commercial electrical systems',
      'Troubleshooting and repair techniques',
      'Energy efficiency and conservation',
      'Smart home electrical systems',
      'Electrical estimation and project management'
    ]
  },
  'Voc7': {
    name: 'Electronics/Mobile Repair',
    category: 'Vocational & Technical Training',
    description: 'Electronic device repair and maintenance services. The electronics repair industry offers significant entrepreneurial opportunities, especially with the proliferation of smartphones and consumer electronics.',
    duration: '6-8 months',
    level: '10th Pass and Above',
    features: [
      'Mobile phone hardware repair',
      'Circuit board troubleshooting and repair',
      'Software installation and troubleshooting',
      'Data recovery techniques',
      'Tools and equipment handling',
      'Customer service and business management',
      'Latest device repair methodologies'
    ]
  },
  'Voc8': {
    name: 'Tailoring',
    category: 'Vocational & Technical Training',
    description: 'Fashion design, garment construction, and stitching techniques. The growing fashion industry and personalized clothing需求 create excellent opportunities for skilled tailors and fashion entrepreneurs.',
    duration: '8-10 months',
    level: '8th Pass and Above',
    features: [
      'Basic to advanced stitching techniques',
      'Pattern making and garment construction',
      'Fabric knowledge and selection',
      'Fashion design principles',
      'Alteration and customization skills',
      'Industrial sewing machine operation',
      'Boutique management and entrepreneurship'
    ]
  },
  'Voc9': {
    name: 'Beautician Course',
    category: 'Vocational & Technical Training',
    description: 'Professional beauty and skin care services training. The booming beauty and wellness industry offers diverse career opportunities in salons, spas, and entrepreneurial ventures.',
    duration: '6-9 months',
    level: '10th Pass and Above',
    features: [
      'Skin care and facial treatments',
      'Hair styling and coloring techniques',
      'Makeup artistry and application',
      'Nail art and hand care',
      'Beauty product knowledge',
      'Sanitation and hygiene standards',
      'Salon management and client handling'
    ]
  },

  // Sanatana Dharmic Life Styles
  'SD1': {
    name: 'Foundations of Sanatana Dharma',
    category: 'Sanatana Dharmic Life Styles',
    description: 'Core principles and philosophical foundations of eternal dharma. This course explores the timeless wisdom of Sanatana Dharma, providing a comprehensive understanding of its philosophical roots and practical applications in modern life.',
    duration: '6-8 months',
    level: 'All Interested Learners',
    features: [
      'Vedic philosophy and core principles',
      'Concept of Dharma and righteous living',
      'Four Purusharthas framework',
      'Major scriptures and their significance',
      'Philosophical schools of thought',
      'Modern relevance of ancient wisdom',
      'Practical application in daily life'
    ]
  },
  'SD2': {
    name: 'Yoga & Meditation',
    category: 'Sanatana Dharmic Life Styles',
    description: 'Ancient spiritual practices for physical, mental, and spiritual well-being. With global recognition of yogas benefits, this course offers authentic training in traditional practices while addressing contemporary lifestyle challenges.',
    duration: '8-10 months',
    level: 'All Age Groups',
    features: [
      'Asana practice and alignment principles',
      'Pranayama and breath control techniques',
      'Meditation and mindfulness practices',
      'Yoga philosophy and history',
      'Therapeutic applications of yoga',
      'Lifestyle integration strategies',
      'Yoga for stress management'
    ]
  },
  'SD3': {
    name: 'Ayurveda & Vedic Wellness',
    category: 'Sanatana Dharmic Life Styles',
    description: 'Traditional healing systems and holistic wellness approaches. Ayurveda, the science of life, offers time-tested natural healing methods that are gaining global acceptance for their effectiveness and minimal side effects.',
    duration: '10-12 months',
    level: 'Wellness Enthusiasts/Healthcare Professionals',
    features: [
      'Ayurvedic principles and dosha theory',
      'Diet and nutrition according to constitution',
      'Herbal medicine and natural remedies',
      'Detoxification and cleansing procedures',
      'Seasonal living and daily routines',
      'Preventive healthcare strategies',
      'Integration with modern wellness practices'
    ]
  },
  'SD4': {
    name: 'Sanskrit Language & Indian Philosophy',
    category: 'Sanatana Dharmic Life Styles',
    description: 'Classical language studies and philosophical exploration. Sanskrit, the language of Indias intellectual heritage, provides direct access to original texts and profound philosophical insights of Sanatana Dharma.',
    duration: '12-15 months',
    level: 'Language Enthusiasts/Philosophy Students',
    features: [
      'Sanskrit grammar and vocabulary',
      'Reading and comprehension of simple texts',
      'Pronunciation and chanting techniques',
      'Major philosophical text studies',
      'Comparative philosophy analysis',
      'Cultural context and historical significance',
      'Practical conversation skills'
    ]
  },
  'SD5': {
    name: 'Rituals, Festivals & Dharmic Practices',
    category: 'Sanatana Dharmic Life Styles',
    description: 'Cultural traditions, ceremonies, and spiritual practices. This course explores the rich tapestry of Hindu rituals and festivals, explaining their symbolic meanings and relevance in contemporary life.',
    duration: '6-8 months',
    level: 'All Interested Learners',
    features: [
      'Significance of major Hindu festivals',
      'Ritual procedures and their meanings',
      'Temple traditions and worship methods',
      'Life cycle ceremonies (samskaras)',
      'Fast and festival observance',
      'Cultural continuity and adaptation',
      'Community participation and celebration'
    ]
  },
  'SD6': {
    name: 'Dharmic Ethics & Leadership',
    category: 'Sanatana Dharmic Life Styles',
    description: 'Moral leadership principles based on dharma. Drawing from ancient Indian leadership models, this course applies timeless ethical principles to modern organizational and community leadership challenges.',
    duration: '5-7 months',
    level: 'Leaders/Managers/Community Organizers',
    features: [
      'Dharma-based decision making',
      'Leadership lessons from epics',
      'Ethical frameworks in business',
      'Stakeholder responsibility concepts',
      'Conflict resolution through dharma',
      'Sustainable leadership practices',
      'Personal integrity development'
    ]
  },
  'SD7': {
    name: 'Indian Art, Music & Storytelling',
    category: 'Sanatana Dharmic Life Styles',
    description: 'Cultural arts heritage and expressive traditions. This course explores the rich artistic traditions of India, understanding their spiritual foundations and continuing relevance in cultural preservation.',
    duration: '8-10 months',
    level: 'Art Enthusiasts/Cultural Practitioners',
    features: [
      'Classical music theory and practice',
      'Traditional dance forms and their significance',
      'Indian painting and sculpture traditions',
      'Mythological storytelling techniques',
      'Temple architecture and symbolism',
      'Folk arts and regional traditions',
      'Contemporary adaptations of traditional arts'
    ]
  },
  'SD8': {
    name: 'Seva (Service) & Dharmic Contribution',
    category: 'Sanatana Dharmic Life Styles',
    description: 'Selfless service practices and community contribution. Seva, or selfless service, is a fundamental aspect of dharma that fosters personal growth while benefiting society, creating meaningful social impact.',
    duration: '4-6 months',
    level: 'All Interested Individuals',
    features: [
      'Philosophy of selfless service',
      'Community needs assessment',
      'Sustainable service project planning',
      'Volunteer management and coordination',
      'Cultural sensitivity in service',
      'Personal transformation through seva',
      'Creating lasting social impact'
    ]
  },
  'SD9': {
    name: 'Symbolism in Sanatana Dharma',
    category: 'Sanatana Dharmic Life Styles',
    description: 'Sacred symbols, their meanings, and spiritual significance. This course decodes the rich symbolic language of Hinduism, from deities and rituals to geometric patterns and natural elements.',
    duration: '5-7 months',
    level: 'Spiritual Seekers/Art Students',
    features: [
      'Deity symbolism and attributes',
      'Mudras and their meanings',
      'Yantra and mandala interpretation',
      'Temple architecture symbolism',
      'Natural element representations',
      'Color symbolism in rituals',
      'Contemporary symbolic applications'
    ]
  },
  'SD10': {
    name: 'Applied Family & Satvik Living',
    category: 'Sanatana Dharmic Life Styles',
    description: 'Pure, balanced lifestyle implementation in family contexts. This practical course helps families integrate dharma principles into daily life, creating harmonious, spiritually aligned households.',
    duration: '6-8 months',
    level: 'Family Members/Home-makers',
    features: [
      'Satvik diet and cooking practices',
      'Family rituals and daily routines',
      'Values-based parenting approaches',
      'Home environment optimization',
      'Conflict resolution in family settings',
      'Financial management through dharma',
      'Creating family spiritual practices'
    ]
  }
};

export default function CourseIntroPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isUserEnrolled } = useAuth();
  const [currentCourse, setCurrentCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Course ID from URL:', courseId);
    
    // Directly use courseId since we changed the route structure
    if (courseId) {
      console.log('Available courses:', Object.keys(courseDetails));
      
      const course = courseDetails[courseId];
      if (course) {
        setCurrentCourse(course);
      } else {
        console.log('Course not found for ID:', courseId);
      }
    }
    
    setLoading(false);
  }, [courseId]);

  const handleEnrollSuccess = () => {
    // After successful enrollment, redirect to course content
    setTimeout(() => {
      navigate(`/course/${courseId}`);
    }, 1500);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.textCenter}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (!currentCourse) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.textCenter}>
          <h2>Course Not Found</h2>
          <p>Course ID: {courseId}</p>
          <button onClick={handleBackToHome} className={styles.btnPrimary}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Check if user is already enrolled
  const enrolled = isUserEnrolled(courseId);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.courseHeader}>
        <button onClick={handleBackToHome} className={styles.backButton}>
          ← Back to Courses
        </button>
        <h1 className={styles.courseTitle}>{currentCourse.name}</h1>
        <p className={styles.courseCategory}>{currentCourse.category}</p>
        
        {/* Enrollment Status Badge */}
        {user && enrolled && (
          <div style={{
            background: '#28a745',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontWeight: 'bold',
            display: 'inline-block',
            marginTop: '10px'
          }}>
            ✅ Already Enrolled
          </div>
        )}
      </div>

      <div className={styles.courseContent}>
        <div className={styles.courseDescription}>
          <h3>Course Overview</h3>
          <p>{currentCourse.description}</p>
        </div>

        <div className={styles.courseDetails}>
          <div className={styles.detailItem}>
            <strong>Duration:</strong> {currentCourse.duration}
          </div>
          <div className={styles.detailItem}>
            <strong>Level:</strong> {currentCourse.level}
          </div>
        </div>

        <div className={styles.courseFeatures}>
          <h3>What You'll Learn</h3>
          <ul>
            {currentCourse.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>

        {/* Enrollment Section */}
        <div className={styles.enrollmentSection}>
          {!user ? (
            <div className={styles.guestUser}>
              <h3>Ready to Start Learning?</h3>
              <p>Login to enroll in this course and access all learning materials.</p>
              <div style={{ 
                background: '#e7f3ff', 
                padding: '1.5rem', 
                borderRadius: '8px',
                marginTop: '1rem'
              }}>
                <h4 style={{ color: '#0066cc', marginBottom: '1rem' }}>What you get after enrollment:</h4>
                <ul style={{ textAlign: 'left', display: 'inline-block' }}>
                  <li>Full access to course materials</li>
                  <li>Interactive quizzes and assessments</li>
                  <li>Progress tracking</li>
                  <li>Certificate of completion</li>
                </ul>
              </div>
              <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                Please login to enroll in this course.
              </p>
            </div>
          ) : enrolled ? (
            <div className={styles.enrolledUser}>
              <h3>🎉 You're Enrolled!</h3>
              <p>You have full access to this course. Start your learning journey now!</p>
              <button 
                onClick={() => navigate(`/course/${courseId}`)} 
                className={styles.btnSuccess}
              >
                Go to Course Content →
              </button>
            </div>
          ) : (
            <CourseEnrollment 
              courseId={courseId} 
              courseName={currentCourse.name}
              onEnrollmentSuccess={handleEnrollSuccess}
            />
          )}
        </div>

        {/* Course Preview for non-enrolled users */}
        {user && !enrolled && (
          <div className={styles.coursePreview}>
            <h3>Course Preview</h3>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '1.5rem', 
              borderRadius: '8px',
              marginTop: '1rem'
            }}>
              <h4>Learning Structure:</h4>
              <ul style={{ textAlign: 'left', display: 'inline-block' }}>
                <li><strong>5-Level Progression:</strong> Foundation → Elementary → Intermediate → Advanced → Expert</li>
                <li><strong>Rich Content:</strong> Videos, animations, interactive notes</li>
                <li><strong>Smart Assessments:</strong> MCQ quizzes and AI-powered descriptive evaluations</li>
                <li><strong>Progress Analytics:</strong> Track your learning journey</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export { courseDetails };