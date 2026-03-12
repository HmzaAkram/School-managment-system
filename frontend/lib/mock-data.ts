// Mock data for ABC School Management System
// All dummy data for both public website and dashboard

// ============================================
// STUDENTS DATA
// ============================================
export const students = [
  {
    id: "1",
    name: "Aarav Kumar",
    rollNumber: "2024001",
    class: "10A",
    section: "A",
    fatherName: "Rajesh Kumar",
    motherName: "Priya Kumar",
    email: "aarav@school.com",
    phone: "9876543210",
    address: "123 Main Street, City",
    dateOfBirth: "2010-05-15",
    admissionDate: "2022-06-01",
    status: "Active",
    attendancePercentage: 94,
    gpa: 3.8,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aarav",
  },
  {
    id: "2",
    name: "Ananya Singh",
    rollNumber: "2024002",
    class: "10A",
    section: "A",
    fatherName: "Vikram Singh",
    motherName: "Sneha Singh",
    email: "ananya@school.com",
    phone: "9876543211",
    address: "456 Oak Avenue, City",
    dateOfBirth: "2010-08-22",
    admissionDate: "2022-06-01",
    status: "Active",
    attendancePercentage: 96,
    gpa: 3.9,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ananya",
  },
  {
    id: "3",
    name: "Arjun Patel",
    rollNumber: "2024003",
    class: "10B",
    section: "B",
    fatherName: "Amit Patel",
    motherName: "Divya Patel",
    email: "arjun@school.com",
    phone: "9876543212",
    address: "789 Pine Road, City",
    dateOfBirth: "2010-03-10",
    admissionDate: "2022-06-01",
    status: "Active",
    attendancePercentage: 92,
    gpa: 3.6,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun",
  },
  {
    id: "4",
    name: "Ishita Sharma",
    rollNumber: "2024004",
    class: "9A",
    section: "A",
    fatherName: "Ravi Sharma",
    motherName: "Anjali Sharma",
    email: "ishita@school.com",
    phone: "9876543213",
    address: "321 Elm Street, City",
    dateOfBirth: "2011-07-18",
    admissionDate: "2023-06-01",
    status: "Active",
    attendancePercentage: 88,
    gpa: 3.4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ishita",
  },
  {
    id: "5",
    name: "Rohan Desai",
    rollNumber: "2024005",
    class: "8A",
    section: "A",
    fatherName: "Prakash Desai",
    motherName: "Meera Desai",
    email: "rohan@school.com",
    phone: "9876543214",
    address: "654 Maple Drive, City",
    dateOfBirth: "2012-02-28",
    admissionDate: "2024-06-01",
    status: "Active",
    attendancePercentage: 85,
    gpa: 3.2,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rohan",
  },
];

// ============================================
// TEACHERS DATA
// ============================================
export const teachers = [
  {
    id: "T1",
    name: "Dr. Ramesh Sharma",
    email: "ramesh.sharma@school.com",
    phone: "9876543220",
    qualification: "B.Sc, M.Sc, B.Ed",
    subject: "Mathematics",
    classes: ["10A", "10B"],
    experience: 15,
    joinDate: "2009-07-15",
    status: "Active",
    salary: 50000,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ramesh",
  },
  {
    id: "T2",
    name: "Ms. Priya Menon",
    email: "priya.menon@school.com",
    phone: "9876543221",
    qualification: "B.A, M.A, B.Ed",
    subject: "English",
    classes: ["9A", "10A"],
    experience: 12,
    joinDate: "2012-06-01",
    status: "Active",
    salary: 45000,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
  },
  {
    id: "T3",
    name: "Mr. Anil Kumar",
    email: "anil.kumar@school.com",
    phone: "9876543222",
    qualification: "B.Sc, M.Sc, B.Ed",
    subject: "Science",
    classes: ["8A", "9A", "10B"],
    experience: 10,
    joinDate: "2014-08-20",
    status: "Active",
    salary: 42000,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anil",
  },
  {
    id: "T4",
    name: "Ms. Sneha Gupta",
    email: "sneha.gupta@school.com",
    phone: "9876543223",
    qualification: "B.Com, M.Com, B.Ed",
    subject: "Commerce",
    classes: ["11", "12"],
    experience: 8,
    joinDate: "2016-07-01",
    status: "Active",
    salary: 40000,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sneha",
  },
];

// ============================================
// CLASSES DATA
// ============================================
export const classes = [
  {
    id: "CLS1",
    name: "10A",
    classTeacher: "Dr. Ramesh Sharma",
    strength: 45,
    section: "A",
    standard: "X",
    subjects: ["Mathematics", "English", "Science", "Social Studies", "Urdu"],
  },
  {
    id: "CLS2",
    name: "10B",
    classTeacher: "Mr. Anil Kumar",
    strength: 42,
    section: "B",
    standard: "X",
    subjects: ["Mathematics", "English", "Science", "Social Studies", "Urdu"],
  },
  {
    id: "CLS3",
    name: "9A",
    classTeacher: "Ms. Priya Menon",
    strength: 48,
    section: "A",
    standard: "IX",
    subjects: ["Mathematics", "English", "Science", "Social Studies", "Urdu"],
  },
  {
    id: "CLS4",
    name: "8A",
    classTeacher: "Ms. Sneha Gupta",
    strength: 50,
    section: "A",
    standard: "VIII",
    subjects: ["Mathematics", "English", "Science", "Social Studies", "Urdu"],
  },
];

// ============================================
// SUBJECTS DATA
// ============================================
export const subjects = [
  { id: "S1", name: "Mathematics", code: "MAT101", credits: 4 },
  { id: "S2", name: "English", code: "ENG101", credits: 3 },
  { id: "S3", name: "Science", code: "SCI101", credits: 4 },
  { id: "S4", name: "Social Studies", code: "SOC101", credits: 3 },
  { id: "S5", name: "Urdu", code: "URD101", credits: 3 },
  { id: "S6", name: "Physical Education", code: "PE101", credits: 2 },
  { id: "S7", name: "Art", code: "ART101", credits: 2 },
];

// ============================================
// ATTENDANCE DATA
// ============================================
export const attendanceRecords = [
  {
    id: "ATT1",
    studentId: "1",
    studentName: "Aarav Kumar",
    date: "2024-03-11",
    status: "Present",
    class: "10A",
  },
  {
    id: "ATT2",
    studentId: "2",
    studentName: "Ananya Singh",
    date: "2024-03-11",
    status: "Present",
    class: "10A",
  },
  {
    id: "ATT3",
    studentId: "3",
    studentName: "Arjun Patel",
    date: "2024-03-11",
    status: "Absent",
    class: "10B",
  },
  {
    id: "ATT4",
    studentId: "4",
    studentName: "Ishita Sharma",
    date: "2024-03-11",
    status: "Present",
    class: "9A",
  },
  {
    id: "ATT5",
    studentId: "5",
    studentName: "Rohan Desai",
    date: "2024-03-11",
    status: "Leave",
    class: "8A",
  },
];

// ============================================
// EXAMS DATA
// ============================================
export const exams = [
  {
    id: "EX1",
    name: "Midterm Exam 2024",
    startDate: "2024-02-15",
    endDate: "2024-03-01",
    classes: ["8A", "9A", "10A", "10B"],
    totalMarks: 100,
    passingMarks: 35,
    status: "Completed",
  },
  {
    id: "EX2",
    name: "Final Exam 2024",
    startDate: "2024-05-01",
    endDate: "2024-05-20",
    classes: ["8A", "9A", "10A", "10B"],
    totalMarks: 100,
    passingMarks: 35,
    status: "Scheduled",
  },
];

// ============================================
// MARKS DATA
// ============================================
export const marks = [
  {
    id: "M1",
    studentId: "1",
    studentName: "Aarav Kumar",
    examId: "EX1",
    subject: "Mathematics",
    marksObtained: 92,
    totalMarks: 100,
    grade: "A",
  },
  {
    id: "M2",
    studentId: "1",
    studentName: "Aarav Kumar",
    examId: "EX1",
    subject: "English",
    marksObtained: 88,
    totalMarks: 100,
    grade: "A",
  },
  {
    id: "M3",
    studentId: "2",
    studentName: "Ananya Singh",
    examId: "EX1",
    subject: "Mathematics",
    marksObtained: 95,
    totalMarks: 100,
    grade: "A+",
  },
];

// ============================================
// FEES DATA
// ============================================
export const feeStructure = [
  {
    id: "FS1",
    class: "8A",
    admissionFee: 5000,
    tuitionFee: 3000,
    transportFee: 1000,
    activityFee: 500,
    totalFee: 9500,
  },
  {
    id: "FS2",
    class: "9A",
    admissionFee: 5500,
    tuitionFee: 3500,
    transportFee: 1000,
    activityFee: 500,
    totalFee: 10500,
  },
  {
    id: "FS3",
    class: "10A",
    admissionFee: 6000,
    tuitionFee: 4000,
    transportFee: 1000,
    activityFee: 500,
    totalFee: 11500,
  },
];

export const feeCollections = [
  {
    id: "FC1",
    studentId: "1",
    studentName: "Aarav Kumar",
    class: "10A",
    totalFee: 11500,
    amountPaid: 11500,
    amountPending: 0,
    status: "Paid",
    dueDate: "2024-03-31",
    paidDate: "2024-03-10",
  },
  {
    id: "FC2",
    studentId: "2",
    studentName: "Ananya Singh",
    class: "10A",
    totalFee: 11500,
    amountPaid: 11500,
    amountPending: 0,
    status: "Paid",
    dueDate: "2024-03-31",
    paidDate: "2024-03-05",
  },
  {
    id: "FC3",
    studentId: "3",
    studentName: "Arjun Patel",
    class: "10B",
    totalFee: 11500,
    amountPaid: 5000,
    amountPending: 6500,
    status: "Pending",
    dueDate: "2024-03-31",
    paidDate: null,
  },
];

// ============================================
// LIBRARY DATA
// ============================================
export const libraryBooks = [
  {
    id: "LB1",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780061120084",
    category: "Fiction",
    totalCopies: 5,
    availableCopies: 3,
    publisher: "J.B. Lippincott",
    publicationYear: 1960,
  },
  {
    id: "LB2",
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    category: "Dystopian",
    totalCopies: 4,
    availableCopies: 2,
    publisher: "Signet",
    publicationYear: 1949,
  },
  {
    id: "LB3",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    category: "Fiction",
    totalCopies: 6,
    availableCopies: 4,
    publisher: "Scribner",
    publicationYear: 1925,
  },
];

export const bookIssues = [
  {
    id: "BI1",
    studentId: "1",
    studentName: "Aarav Kumar",
    bookId: "LB1",
    bookTitle: "To Kill a Mockingbird",
    issueDate: "2024-02-20",
    dueDate: "2024-03-06",
    returnDate: null,
    status: "Active",
  },
  {
    id: "BI2",
    studentId: "2",
    studentName: "Ananya Singh",
    bookId: "LB2",
    bookTitle: "1984",
    issueDate: "2024-03-01",
    dueDate: "2024-03-15",
    returnDate: null,
    status: "Active",
  },
];

// ============================================
// INVENTORY DATA
// ============================================
export const inventory = [
  {
    id: "INV1",
    itemName: "Projector",
    category: "Technology",
    quantity: 8,
    location: "Classrooms",
    condition: "Good",
    purchaseDate: "2022-05-10",
    cost: 45000,
  },
  {
    id: "INV2",
    itemName: "Desk",
    category: "Furniture",
    quantity: 150,
    location: "Classrooms",
    condition: "Good",
    purchaseDate: "2021-06-15",
    cost: 8000,
  },
  {
    id: "INV3",
    itemName: "Computer",
    category: "Technology",
    quantity: 30,
    location: "Lab",
    condition: "Good",
    purchaseDate: "2023-01-20",
    cost: 65000,
  },
];

// ============================================
// FINANCIAL DATA
// ============================================
export const financialSummary = {
  totalIncome: 2500000,
  totalExpenditure: 1800000,
  salaryExpenditure: 1200000,
  maintenanceExpenditure: 300000,
  otherExpenditure: 300000,
  netProfit: 700000,
};

export const incomeExpenseData = [
  { month: "January", income: 150000, expense: 120000 },
  { month: "February", income: 165000, expense: 125000 },
  { month: "March", income: 155000, expense: 130000 },
  { month: "April", income: 170000, expense: 135000 },
  { month: "May", income: 180000, expense: 140000 },
  { month: "June", income: 175000, expense: 138000 },
];

// ============================================
// NOTICES & ANNOUNCEMENTS
// ============================================
export const notices = [
  {
    id: "N1",
    title: "School Annual Function on April 15",
    content:
      "Dear parents and students, we are proud to announce our annual function on April 15, 2024. All students are encouraged to participate in various events.",
    date: "2024-03-10",
    priority: "High",
    category: "Event",
    postedBy: "Principal",
  },
  {
    id: "N2",
    title: "Final Exams Schedule Released",
    content:
      "The final exams schedule for all classes has been released. Please check the school portal for the detailed timetable.",
    date: "2024-03-08",
    priority: "High",
    category: "Academic",
    postedBy: "Principal",
  },
  {
    id: "N3",
    title: "Summer Camp Registration Open",
    content:
      "Registration for summer camp 2024 is now open. Limited seats available. Register by March 20.",
    date: "2024-03-05",
    priority: "Medium",
    category: "Event",
    postedBy: "Sports Coordinator",
  },
];

// ============================================
// GALLERY DATA (for public website)
// ============================================
export const galleryCategories = [
  {
    id: "G1",
    name: "School Building",
    image: "https://images.unsplash.com/photo-1427504494785-cdfc993d4d3d?w=500&h=300&fit=crop",
    description: "Main school building and campus",
  },
  {
    id: "G2",
    name: "Classrooms",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=300&fit=crop",
    description: "Modern and well-equipped classrooms",
  },
  {
    id: "G3",
    name: "Sports",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop",
    description: "Sports facilities and activities",
  },
  {
    id: "G4",
    name: "Laboratory",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=300&fit=crop",
    description: "Science and computer labs",
  },
  {
    id: "G5",
    name: "Events",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    description: "School events and celebrations",
  },
  {
    id: "G6",
    name: "Library",
    image: "https://images.unsplash.com/photo-150784272343-583f20270319?w=500&h=300&fit=crop",
    description: "Modern library facility",
  },
];

// ============================================
// EVENTS DATA (for public website)
// ============================================
export const events = [
  {
    id: "E1",
    title: "Annual Sports Day",
    date: "2024-03-25",
    time: "09:00 AM",
    location: "School Ground",
    description: "Inter-class sports competition with various events for all students.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop",
  },
  {
    id: "E2",
    title: "Science Exhibition",
    date: "2024-04-10",
    time: "10:00 AM",
    location: "School Auditorium",
    description: "Students showcase their science projects and innovations.",
    image: "https://images.unsplash.com/photo-1581092915763-b94d440726f9?w=500&h=300&fit=crop",
  },
  {
    id: "E3",
    title: "Cultural Fest",
    date: "2024-05-15",
    time: "03:00 PM",
    location: "School Campus",
    description: "Celebration of diverse cultures with dance, music, and food.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=300&fit=crop",
  },
  {
    id: "E4",
    title: "Graduation Ceremony",
    date: "2024-06-20",
    time: "10:00 AM",
    location: "School Auditorium",
    description: "Celebrating the achievements of class X and XII students.",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500&h=300&fit=crop",
  },
];

// ============================================
// TESTIMONIALS (for public website)
// ============================================
export const testimonials = [
  {
    id: "T1",
    name: "Rajesh Kumar",
    relation: "Parent",
    message:
      "ABC School has been a wonderful place for my child to grow. The teachers are dedicated and the infrastructure is excellent.",
    rating: 5,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh",
  },
  {
    id: "T2",
    name: "Priya Singh",
    relation: "Parent",
    message:
      "Impressed with the quality of education and the holistic development approach. Highly recommend ABC School!",
    rating: 5,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
  },
  {
    id: "T3",
    name: "Amit Patel",
    relation: "Parent",
    message:
      "Great school with a balanced approach to academics and extracurricular activities. Very satisfied!",
    rating: 4,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=amit",
  },
];

// ============================================
// SCHOOL INFO (for public website)
// ============================================
export const schoolInfo = {
  name: "ABC School",
  tagline: "Excellence in Education",
  established: 1995,
  principal: "Dr. Vikram Sharma",
  students: 542,
  teachers: 42,
  address: "123 Education Lane, City",
  phone: "0123-456789",
  email: "info@abcschool.com",
  website: "www.abcschool.com",
  description:
    "ABC School is a premier educational institution dedicated to providing world-class education with a focus on holistic development of students.",
  mission:
    "To nurture young minds and develop them into responsible citizens with strong moral values and academic excellence.",
  vision:
    "To be a leading institution in providing quality education that prepares students for the challenges of modern world.",
  facilities: [
    "Smart Classrooms",
    "Science & Computer Labs",
    "Sports Complex",
    "Library",
    "Auditorium",
    "Cafeteria",
    "Transportation",
    "Medical Facility",
  ],
};

// ============================================
// NEWS (for public website)
// ============================================
export const newsArticles = [
  {
    id: "N1",
    title: "ABC School Student Wins National Science Award",
    excerpt: "Aarav Kumar from Class X won the National Science Award for his innovative project.",
    date: "2024-03-10",
    image: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=300&fit=crop",
  },
  {
    id: "N2",
    title: "New Computer Lab Inaugurated",
    excerpt: "The school inaugurated a state-of-the-art computer lab with 50 new workstations.",
    date: "2024-03-05",
    image: "https://images.unsplash.com/photo-1522252234503-42c08e5202ca?w=500&h=300&fit=crop",
  },
  {
    id: "N3",
    title: "Inter-School Debate Competition",
    excerpt: "ABC School students won the regional inter-school debate competition.",
    date: "2024-02-28",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
  },
];

// ============================================
// ACADEMICS DATA (for public website)
// ============================================
export const academicsInfo = {
  classes: [
    {
      id: "8",
      name: "Class VIII",
      subjects: ["Mathematics", "English", "Science", "Social Studies", "Urdu"],
    },
    {
      id: "9",
      name: "Class IX",
      subjects: ["Mathematics", "English", "Science", "Social Studies", "Urdu"],
    },
    {
      id: "10",
      name: "Class X",
      subjects: ["Mathematics", "English", "Science", "Social Studies", "Urdu"],
    },
  ],
  curriculum: "CBSE",
};

// ============================================
// ADMISSION DATA
// ============================================
export const admissionProcess = [
  {
    step: 1,
    title: "Apply Online",
    description: "Fill the online admission form with required information",
  },
  {
    step: 2,
    title: "Submit Documents",
    description: "Submit birth certificate, previous school records, and other documents",
  },
  {
    step: 3,
    title: "Entrance Test",
    description: "Appear for the entrance test (if applicable)",
  },
  {
    step: 4,
    title: "Interview",
    description: "Parent-teacher interview to discuss child's background",
  },
  {
    step: 5,
    title: "Confirmation",
    description: "Confirm admission and pay the required fees",
  },
];

// ============================================
// MESSAGES/COMMUNICATIONS
// ============================================
export const messages = [
  {
    id: "MSG1",
    from: "Dr. Vikram Sharma",
    fromRole: "Principal",
    to: "Aarav Kumar",
    toRole: "Student",
    subject: "Academic Performance",
    message: "Great work in your recent exams. Keep up the excellent performance!",
    date: "2024-03-10",
    read: true,
  },
  {
    id: "MSG2",
    from: "Dr. Ramesh Sharma",
    fromRole: "Teacher",
    to: "Rajesh Kumar",
    toRole: "Parent",
    subject: "Homework Assignment",
    message: "Please ensure your child completes the math assignment by tomorrow.",
    date: "2024-03-09",
    read: false,
  },
];
