import { Module } from '../models/types';

export const CURRICULUM: Module[] = [
  // YEAR 1, SEMESTER 1
  { code: 'CE1010', name: 'Electrical Engineering Fundamentals', credits: 3, gpaIncluded: true, semester: 1, year: 1 },
  { code: 'CO1010', name: 'Introduction to Computer Engineering', credits: 3, gpaIncluded: true, semester: 1, year: 1 },
  { code: 'EE1010', name: 'Electrical Fundamentals', credits: 3, gpaIncluded: true, semester: 1, year: 1 },
  { code: 'EF1010', name: 'Engineering Fundamentals', credits: 3, gpaIncluded: false, semester: 1, year: 1 },
  { code: 'EM1010', name: 'Mathematics I', credits: 4, gpaIncluded: true, semester: 1, year: 1 },
  { code: 'MA1100', name: 'Mathematics for Computing', credits: 2, gpaIncluded: true, semester: 1, year: 1 },

  // YEAR 1, SEMESTER 2
  { code: 'CO1020', name: 'Programming Methodology', credits: 5, gpaIncluded: true, semester: 2, year: 1 },
  { code: 'CO1030', name: 'Computer Systems', credits: 2, gpaIncluded: true, semester: 2, year: 1 },
  { code: 'EE1810', name: 'Electronics I', credits: 3, gpaIncluded: true, semester: 2, year: 1 },
  { code: 'EM1020', name: 'Mathematics II', credits: 3, gpaIncluded: true, semester: 2, year: 1 },
  { code: 'EM1030', name: 'Probability & Statistics I', credits: 2, gpaIncluded: true, semester: 2, year: 1 },
  { code: 'EM1050', name: 'Discrete Mathematics', credits: 3, gpaIncluded: true, semester: 2, year: 1 },

  // YEAR 2, SEMESTER 3
  { code: 'CO2010', name: 'Digital Circuits Design', credits: 4, gpaIncluded: true, semester: 3, year: 2 },
  { code: 'CO2020', name: 'Computer Networking', credits: 3, gpaIncluded: true, semester: 3, year: 2 },
  { code: 'CO2030', name: 'Data Structures & Algorithms II', credits: 3, gpaIncluded: true, semester: 3, year: 2 },
  { code: 'CO2040', name: 'Software Design & Development', credits: 2, gpaIncluded: true, semester: 3, year: 2 },
  { code: 'CO2060', name: '2YP: Software Systems Design Project', credits: 2, gpaIncluded: true, semester: 3, year: 2 },
  { code: 'EM2020', name: 'Probability & Statistics II', credits: 2, gpaIncluded: true, semester: 3, year: 2 },
  { code: 'EM2060', name: 'Numerical Methods', credits: 3, gpaIncluded: true, semester: 3, year: 2 },

  // YEAR 2, SEMESTER 4
  { code: 'CO2050', name: 'Computer Architecture', credits: 2, gpaIncluded: true, semester: 4, year: 2 },
  { code: 'CO2070', name: 'Signals & Systems', credits: 4, gpaIncluded: true, semester: 4, year: 2 },
  { code: 'CO2080', name: 'Operating Systems', credits: 3, gpaIncluded: true, semester: 4, year: 2 },
  { code: 'EE2820', name: 'Electronics II', credits: 3, gpaIncluded: true, semester: 4, year: 2 },
  { code: 'EM2010', name: 'Linear Algebra', credits: 2, gpaIncluded: true, semester: 4, year: 2 },

  // YEAR 3, SEMESTER 5
  { code: 'CO3010', name: 'Embedded Systems', credits: 4, gpaIncluded: true, semester: 5, year: 3 },
  { code: 'CO3040', name: 'Cloud Computing Systems', credits: 3, gpaIncluded: true, semester: 5, year: 3 },
  { code: 'CO3060', name: '3YP: Final Year Project (Part 1)', credits: 6, gpaIncluded: true, semester: 5, year: 3 },

  // YEAR 3, SEMESTER 6
  { code: 'CO3020', name: 'Database Systems', credits: 3, gpaIncluded: true, semester: 6, year: 3 },
  { code: 'CO3030', name: 'Computer Systems Security', credits: 2, gpaIncluded: true, semester: 6, year: 3 },
  { code: 'CO3050', name: 'Software Engineering', credits: 3, gpaIncluded: true, semester: 6, year: 3 },
  { code: 'CO3090', name: 'Machine Learning Theory', credits: 2, gpaIncluded: true, semester: 6, year: 3 },
  { code: 'CO3100', name: 'Research Methods', credits: 1, gpaIncluded: true, semester: 6, year: 3 },

  // YEAR 4, SEMESTER 7
  { code: 'CO4010', name: 'Professional Practices', credits: 2, gpaIncluded: true, semester: 7, year: 4 },
  { code: 'CO4020', name: 'Project Management', credits: 2, gpaIncluded: true, semester: 7, year: 4 },
  { code: 'CO4030', name: 'Information Systems Management', credits: 2, gpaIncluded: true, semester: 7, year: 4 },
  { code: 'CO4060', name: '4YP: Final Year Project', credits: 6, gpaIncluded: true, semester: 7, year: 4 },

  // YEAR 4, SEMESTER 8
  { code: 'CO3070', name: 'Selected Topics in CE I', credits: 3, gpaIncluded: true, semester: 8, year: 4 },
  { code: 'CO3080', name: 'Selected Topics in CE II', credits: 2, gpaIncluded: true, semester: 8, year: 4 },
  // CO4060 is linked to S7

  // INDUSTRIAL TRAINING
  { code: 'EF4010', name: 'Industrial Training', credits: 6, gpaIncluded: false, semester: 0, year: 4 },
];
