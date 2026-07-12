// Static data for the /education page
export const educationData = {
  hero: {
    title: "Academic Journey",
    subtitle: "Verified Academic Records",
    description: "Explore the verified academic credentials, transcripts, and semester-wise progress reports. All sensitive data is privacy-shielded for validation purposes."
  },
  levels: [
    {
      id: "btech",
      title: "Bachelor of Technology",
      institution: "MCKV Institute of Engineering, West Bengal",
      board: "Maulana Abul Kalam Azad University of Technology (MAKAUT)",
      subtitle: "B.Tech in Computer Science & Engineering (Lateral Entry)",
      summary: [
        { label: "Current CGPA", value: "8.69/10" },
        { label: "Duration", value: "2024 – Present" },
        { label: "Current Semester", value: "7" },
        { label: "Entry Mode", value: "Lateral Entry" },
        { label: "Status", value: "Pursuing", isBadge: true }
      ],
      documents: [
        {
          id: "btech_sem_3",
          title: "Semester 3 Marksheet",
          category: "Semester Transcript",
          year: "2024",
          status: "Available",
          docDetails: {
            title: "B.Tech Semester 3 Marksheet",
            institution: "MCKV Institute of Engineering",
            authority: "MAKAUT",
            roll: "30000124XXX",
            registration: "24300101XXXX",
            year: "2024",
            records: [
              { subject: "Data Structure & Algorithms", marks: 85, maxMarks: 100 },
              { subject: "Analog & Digital Electronics", marks: 82, maxMarks: 100 },
              { subject: "Computer Organisation", marks: 84, maxMarks: 100 },
              { subject: "Mathematics-III (CST)", marks: 88, maxMarks: 100 },
              { subject: "Economics for Engineers", marks: 80, maxMarks: 100 }
            ],
            summaryText: "SGPA: 8.58 / 10 | Result: Passed"
          }
        },
        {
          id: "btech_sem_4",
          title: "Semester 4 Marksheet",
          category: "Semester Transcript",
          year: "2025",
          status: "Available",
          docDetails: {
            title: "B.Tech Semester 4 Marksheet",
            institution: "MCKV Institute of Engineering",
            authority: "MAKAUT",
            roll: "30000124XXX",
            registration: "24300101XXXX",
            year: "2025",
            records: [
              { subject: "Discrete Mathematics", marks: 86, maxMarks: 100 },
              { subject: "Computer Architecture", marks: 88, maxMarks: 100 },
              { subject: "Formal Language & Automata Theory", marks: 82, maxMarks: 100 },
              { subject: "Design & Analysis of Algorithms", marks: 90, maxMarks: 100 },
              { subject: "Biology for Engineers", marks: 78, maxMarks: 100 }
            ],
            summaryText: "SGPA: 8.65 / 10 | Result: Passed"
          }
        },
        {
          id: "btech_sem_5",
          title: "Semester 5 Marksheet",
          category: "Semester Transcript",
          year: "2025",
          status: "Available",
          docDetails: {
            title: "B.Tech Semester 5 Marksheet",
            institution: "MCKV Institute of Engineering",
            authority: "MAKAUT",
            roll: "30000124XXX",
            registration: "24300101XXXX",
            year: "2025",
            records: [
              { subject: "Software Engineering", marks: 90, maxMarks: 100 },
              { subject: "Compiler Design", marks: 85, maxMarks: 100 },
              { subject: "Operating Systems", marks: 89, maxMarks: 100 },
              { subject: "Object Oriented Programming (Java)", marks: 92, maxMarks: 100 },
              { subject: "Constitution of India", marks: 82, maxMarks: 100 }
            ],
            summaryText: "SGPA: 8.84 / 10 | Result: Passed"
          }
        },
        {
          id: "btech_sem_6",
          title: "Semester 6 Marksheet",
          category: "Semester Transcript",
          year: "2026",
          status: "Coming Soon"
        },
        {
          id: "btech_sem_7",
          title: "Semester 7 Marksheet",
          category: "Semester Transcript",
          year: "2026",
          status: "Coming Soon"
        },
        {
          id: "btech_sem_8",
          title: "Semester 8 Marksheet",
          category: "Semester Transcript",
          year: "2027",
          status: "Coming Soon"
        }
      ]
    },
    {
      id: "diploma",
      title: "Diploma in Computer Science & Technology",
      institution: "Technique Polytechnic Institute, West Bengal",
      board: "West Bengal State Council of Technical and Vocational Education and Skill Development (WBSCTVESD)",
      summary: [
        { label: "CGPA", value: "9.00/10" },
        { label: "Duration", value: "2020 – 2023" },
        { label: "Total Semesters", value: "6" },
        { label: "Status", value: "Completed", isBadge: true }
      ],
      documents: [
        {
          id: "diploma_sem_1",
          title: "Semester 1 Marksheet",
          category: "Semester Transcript",
          year: "2021",
          status: "Available",
          docDetails: {
            title: "Diploma Semester 1 Marksheet",
            institution: "Technique Polytechnic Institute",
            authority: "WBSCTVESD",
            roll: "D-CST-2020-XXX",
            registration: "D202100XXX",
            year: "2021",
            records: [
              { subject: "Communication Skills in English", marks: 82, maxMarks: 100 },
              { subject: "Engineering Mathematics-I", marks: 95, maxMarks: 100 },
              { subject: "Applied Physics-I", marks: 88, maxMarks: 100 },
              { subject: "Applied Chemistry", marks: 85, maxMarks: 100 },
              { subject: "Engineering Graphics", marks: 90, maxMarks: 100 }
            ],
            summaryText: "GPA: 8.80 / 10 | Result: Clear"
          }
        },
        {
          id: "diploma_sem_2",
          title: "Semester 2 Marksheet",
          category: "Semester Transcript",
          year: "2021",
          status: "Available",
          docDetails: {
            title: "Diploma Semester 2 Marksheet",
            institution: "Technique Polytechnic Institute",
            authority: "WBSCTVESD",
            roll: "D-CST-2020-XXX",
            registration: "D202100XXX",
            year: "2021",
            records: [
              { subject: "Applied Physics-II", marks: 86, maxMarks: 100 },
              { subject: "Introduction to IT Systems", marks: 92, maxMarks: 100 },
              { subject: "Fundamentals of Electrical & Electronics", marks: 84, maxMarks: 100 },
              { subject: "Engineering Mechanics", marks: 89, maxMarks: 100 },
              { subject: "Environmental Science", marks: 78, maxMarks: 100 }
            ],
            summaryText: "GPA: 8.75 / 10 | Result: Clear"
          }
        },
        {
          id: "diploma_sem_3",
          title: "Semester 3 Marksheet",
          category: "Semester Transcript",
          year: "2022",
          status: "Available",
          docDetails: {
            title: "Diploma Semester 3 Marksheet",
            institution: "Technique Polytechnic Institute",
            authority: "WBSCTVESD",
            roll: "D-CST-2020-XXX",
            registration: "D202100XXX",
            year: "2022",
            records: [
              { subject: "Computer Programming (C)", marks: 91, maxMarks: 100 },
              { subject: "Scripting Languages (Python)", marks: 95, maxMarks: 100 },
              { subject: "Data Structures", marks: 88, maxMarks: 100 },
              { subject: "Computer System Architecture", marks: 85, maxMarks: 100 },
              { subject: "Algorithms", marks: 90, maxMarks: 100 }
            ],
            summaryText: "GPA: 9.10 / 10 | Result: Clear"
          }
        },
        {
          id: "diploma_sem_4",
          title: "Semester 4 Marksheet",
          category: "Semester Transcript",
          year: "2022",
          status: "Available",
          docDetails: {
            title: "Diploma Semester 4 Marksheet",
            institution: "Technique Polytechnic Institute",
            authority: "WBSCTVESD",
            roll: "D-CST-2020-XXX",
            registration: "D202100XXX",
            year: "2022",
            records: [
              { subject: "Operating Systems", marks: 88, maxMarks: 100 },
              { subject: "Introduction to DBMS", marks: 93, maxMarks: 100 },
              { subject: "Computer Networks", marks: 90, maxMarks: 100 },
              { subject: "Software Engineering", marks: 92, maxMarks: 100 },
              { subject: "Web Technology", marks: 94, maxMarks: 100 }
            ],
            summaryText: "GPA: 9.15 / 10 | Result: Clear"
          }
        },
        {
          id: "diploma_sem_5",
          title: "Semester 5 Marksheet",
          category: "Semester Transcript",
          year: "2023",
          status: "Available",
          docDetails: {
            title: "Diploma Semester 5 Marksheet",
            institution: "Technique Polytechnic Institute",
            authority: "WBSCTVESD",
            roll: "D-CST-2020-XXX",
            registration: "D202100XXX",
            year: "2023",
            records: [
              { subject: "Java Programming", marks: 92, maxMarks: 100 },
              { subject: "Information Security", marks: 87, maxMarks: 100 },
              { subject: "Internet of Things", marks: 90, maxMarks: 100 },
              { subject: "Advanced Web Tech (PHP/Node)", marks: 93, maxMarks: 100 }
            ],
            summaryText: "GPA: 9.05 / 10 | Result: Clear"
          }
        },
        {
          id: "diploma_sem_6",
          title: "Semester 6 Marksheet",
          category: "Semester Transcript",
          year: "2023",
          status: "Available",
          docDetails: {
            title: "Diploma Semester 6 Marksheet",
            institution: "Technique Polytechnic Institute",
            authority: "WBSCTVESD",
            roll: "D-CST-2020-XXX",
            registration: "D202100XXX",
            year: "2023",
            records: [
              { subject: "Entrepreneurship & Startup", marks: 90, maxMarks: 100 },
              { subject: "Mobile App Development", marks: 94, maxMarks: 100 },
              { subject: "Major Project & Seminar", marks: 96, maxMarks: 100 },
              { subject: "Grand Viva Voce", marks: 92, maxMarks: 100 }
            ],
            summaryText: "GPA: 9.30 / 10 | Result: Clear"
          }
        },
        {
          id: "diploma_certificate",
          title: "Final Diploma Certificate",
          category: "Certificate",
          year: "2023",
          status: "Available",
          docDetails: {
            title: "Diploma in Computer Science & Technology",
            institution: "Technique Polytechnic Institute",
            authority: "WBSCTVESD",
            roll: "D-CST-2020-XXX",
            registration: "D202100XXX",
            year: "2023",
            isCertificate: true,
            awardText: "This is to certify that Sicky Kumar, having successfully completed the prescribed course of studies and passed the final examinations, is hereby awarded the Diploma in Computer Science & Technology with First Class Distinction.",
            summaryText: "Final Cumulative CGPA: 9.00 / 10 | Grade: Outstanding"
          }
        }
      ]
    },
    {
      id: "secondary",
      title: "Secondary Education",
      institution: "Bandel Mahatma Gandhi Hindi Vidyalaya, West Bengal",
      board: "West Bengal Board of Secondary Education (WBBSE)",
      summary: [
        { label: "Percentage", value: "51.57%" },
        { label: "Passing Year", value: "2019" },
        { label: "Status", value: "Completed", isBadge: true }
      ],
      documents: [
        {
          id: "class_10_marksheet",
          title: "Class 10 Marksheet",
          category: "Marksheet",
          year: "2019",
          status: "Available",
          docDetails: {
            title: "Secondary School Examination Transcripts",
            institution: "Bandel Mahatma Gandhi Hindi Vidyalaya",
            authority: "West Bengal Board of Secondary Education",
            roll: "710245N-XXXX",
            registration: "5124098XXX",
            year: "2019",
            records: [
              { subject: "First Language (Hindi)", marks: 52, maxMarks: 100 },
              { subject: "Second Language (English)", marks: 45, maxMarks: 100 },
              { subject: "Mathematics", marks: 58, maxMarks: 100 },
              { subject: "Physical Science", marks: 49, maxMarks: 100 },
              { subject: "Life Science", marks: 54, maxMarks: 100 },
              { subject: "History", marks: 50, maxMarks: 100 },
              { subject: "Geography", marks: 53, maxMarks: 100 }
            ],
            summaryText: "Grand Total: 361/700 | Result: Passed"
          }
        }
      ]
    }
  ]
};
