export interface SchoolContract {
  id: string;
  name: string;
  admin: string;
  phone: string;
  email: string;
  location: string;
  students: number;
  teachers: number;
  perStudentFee: number;          // Total fee per student (e.g. 20 PKR)
  schoolSharePercent: number;     // e.g. 50% (10 PKR to school)
  saasSharePercent: number;       // e.g. 50% (10 PKR to SaaS platform)
  saasFeePerStudent: number;      // e.g. 10 PKR
  monthlySaaSRevenue: number;     // students * saasFeePerStudent
  contractDurationMonths: number; // e.g. 12 months (1 year)
  contractStart: string;
  contractEnd: string;
  monthsElapsed: number;          // e.g. 9 of 12
  totalContractValue: number;     // monthlySaaSRevenue * contractDurationMonths
  totalPaidAmount: number;
  totalPendingAmount: number;
  currentMonthStatus: 'Paid' | 'Pending' | 'Overdue';
  status: 'Active' | 'Pending Renewal' | 'Expired' | 'Inactive';
}

export const mockSchools: SchoolContract[] = [
  {
    id: 'SCH-001',
    name: 'Crescent International School',
    admin: 'Ahmad Raza',
    phone: '+92 300 1234567',
    email: 'admin@crescent.edu',
    location: 'Lahore, Punjab',
    students: 1250,
    teachers: 85,
    perStudentFee: 20,
    schoolSharePercent: 50,
    saasSharePercent: 50,
    saasFeePerStudent: 10,
    monthlySaaSRevenue: 12500,
    contractDurationMonths: 12,
    contractStart: '2026-01-01',
    contractEnd: '2026-12-31',
    monthsElapsed: 10,
    totalContractValue: 150000,
    totalPaidAmount: 125000,
    totalPendingAmount: 25000,
    currentMonthStatus: 'Paid',
    status: 'Active',
  },
  {
    id: 'SCH-002',
    name: 'Beaconhouse Model Town',
    admin: 'Fatima Ali',
    phone: '+92 321 7654321',
    email: 'info@beaconhouse.edu',
    location: 'Lahore, Punjab',
    students: 3400,
    teachers: 210,
    perStudentFee: 25,
    schoolSharePercent: 60,
    saasSharePercent: 40,
    saasFeePerStudent: 10,
    monthlySaaSRevenue: 34000,
    contractDurationMonths: 12,
    contractStart: '2026-03-01',
    contractEnd: '2027-02-28',
    monthsElapsed: 8,
    totalContractValue: 408000,
    totalPaidAmount: 238000,
    totalPendingAmount: 34000,
    currentMonthStatus: 'Pending',
    status: 'Active',
  },
  {
    id: 'SCH-003',
    name: 'City School Gulberg',
    admin: 'Zain Malik',
    phone: '+92 333 9876543',
    email: 'contact@cityschool.edu',
    location: 'Lahore, Punjab',
    students: 2800,
    teachers: 150,
    perStudentFee: 20,
    schoolSharePercent: 50,
    saasSharePercent: 50,
    saasFeePerStudent: 10,
    monthlySaaSRevenue: 28000,
    contractDurationMonths: 12,
    contractStart: '2025-11-01',
    contractEnd: '2026-10-31',
    monthsElapsed: 11,
    totalContractValue: 336000,
    totalPaidAmount: 280000,
    totalPendingAmount: 56000,
    currentMonthStatus: 'Overdue',
    status: 'Active',
  },
  {
    id: 'SCH-004',
    name: 'Lahore Grammar School',
    admin: 'Sara Khan',
    phone: '+92 345 1122334',
    email: 'admin@lgs.edu',
    location: 'Lahore, Punjab',
    students: 4100,
    teachers: 280,
    perStudentFee: 30,
    schoolSharePercent: 50,
    saasSharePercent: 50,
    saasFeePerStudent: 15,
    monthlySaaSRevenue: 61500,
    contractDurationMonths: 24,
    contractStart: '2026-01-01',
    contractEnd: '2027-12-31',
    monthsElapsed: 10,
    totalContractValue: 1476000,
    totalPaidAmount: 615000,
    totalPendingAmount: 0,
    currentMonthStatus: 'Paid',
    status: 'Active',
  },
  {
    id: 'SCH-005',
    name: 'Roots Millennium Campus',
    admin: 'Usman Tariq',
    phone: '+92 301 5566778',
    email: 'hello@roots.edu',
    location: 'Islamabad',
    students: 1800,
    teachers: 110,
    perStudentFee: 20,
    schoolSharePercent: 50,
    saasSharePercent: 50,
    saasFeePerStudent: 10,
    monthlySaaSRevenue: 18000,
    contractDurationMonths: 12,
    contractStart: '2026-04-01',
    contractEnd: '2027-03-31',
    monthsElapsed: 7,
    totalContractValue: 216000,
    totalPaidAmount: 108000,
    totalPendingAmount: 18000,
    currentMonthStatus: 'Pending',
    status: 'Active',
  },
  {
    id: 'SCH-006',
    name: 'Army Public School & College',
    admin: 'Col. Farhan Akhtar',
    phone: '+92 312 9988776',
    email: 'admin@apsacs.edu',
    location: 'Rawalpindi',
    students: 3200,
    teachers: 190,
    perStudentFee: 20,
    schoolSharePercent: 50,
    saasSharePercent: 50,
    saasFeePerStudent: 10,
    monthlySaaSRevenue: 32000,
    contractDurationMonths: 12,
    contractStart: '2026-02-01',
    contractEnd: '2027-01-31',
    monthsElapsed: 9,
    totalContractValue: 384000,
    totalPaidAmount: 288000,
    totalPendingAmount: 0,
    currentMonthStatus: 'Paid',
    status: 'Active',
  }
];

export interface SuperAdminExpense {
  id: string;
  title: string;
  category: 'Hosting & Cloud Infrastructure' | 'SMS & WhatsApp Gateway' | 'Dev & Engineering' | 'Sales & Marketing' | 'Operations & Support' | 'Office & Misc';
  amount: number;
  date: string;
  status: 'Paid' | 'Pending';
  paymentMethod: 'Bank Transfer' | 'Credit Card' | 'JazzCash / EasyPaisa' | 'Cash';
  notes: string;
}

export const mockExpenses: SuperAdminExpense[] = [
  {
    id: 'EXP-101',
    title: 'AWS & Vercel Cloud Server Infrastructure',
    category: 'Hosting & Cloud Infrastructure',
    amount: 38500,
    date: '2026-10-01',
    status: 'Paid',
    paymentMethod: 'Credit Card',
    notes: 'Primary database cluster & edge CDN compute nodes',
  },
  {
    id: 'EXP-102',
    title: 'Twilio & WhatsApp Business Gateway Messages (150k sms)',
    category: 'SMS & WhatsApp Gateway',
    amount: 24000,
    date: '2026-10-02',
    status: 'Paid',
    paymentMethod: 'Credit Card',
    notes: 'Monthly OTPs, attendance alerts and fee reminders',
  },
  {
    id: 'EXP-103',
    title: 'Fullstack Core Platform Engineering & Maintenance',
    category: 'Dev & Engineering',
    amount: 55000,
    date: '2026-10-05',
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    notes: 'Bi-weekly sprint deliverables & security audits',
  },
  {
    id: 'EXP-104',
    title: 'School Outreach & Field Sales Commission',
    category: 'Sales & Marketing',
    amount: 18000,
    date: '2026-10-06',
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    notes: 'Commission for onboarding 2 new school campuses',
  },
  {
    id: 'EXP-105',
    title: '24/7 School Support Staff Salaries',
    category: 'Operations & Support',
    amount: 22000,
    date: '2026-10-08',
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    notes: 'Dedicated live customer support agent stipend',
  },
  {
    id: 'EXP-106',
    title: 'Domain, SSL Certificates & Security Scanner',
    category: 'Hosting & Cloud Infrastructure',
    amount: 6500,
    date: '2026-09-28',
    status: 'Paid',
    paymentMethod: 'Credit Card',
    notes: 'Annual Wildcard SSL renewal for multi-tenant subdomains',
  },
];

export const mockMonthlyFinancials = [
  { month: 'May', grossRevenue: 142000, expenses: 95000, netProfit: 47000 },
  { month: 'Jun', grossRevenue: 158000, expenses: 98000, netProfit: 60000 },
  { month: 'Jul', grossRevenue: 165000, expenses: 104000, netProfit: 61000 },
  { month: 'Aug', grossRevenue: 172000, expenses: 110000, netProfit: 62000 },
  { month: 'Sep', grossRevenue: 186000, expenses: 118000, netProfit: 68000 },
  { month: 'Oct', grossRevenue: 196000, expenses: 124000, netProfit: 72000 },
];

export const mockStudents = [
  { id: 'STD-1001', rollNo: '10-A-01', name: 'Ali Hassan', class: '10-A', parent: 'Muhammad Hassan', phone: '+92 300 1112233', attendance: 98, feeStatus: 'Paid', status: 'Active' },
  { id: 'STD-1002', rollNo: '10-A-02', name: 'Ayesha Khan', class: '10-A', parent: 'Kamran Khan', phone: '+92 321 2223344', attendance: 92, feeStatus: 'Pending', status: 'Active' },
  { id: 'STD-1003', rollNo: '10-B-01', name: 'Omar Sheikh', class: '10-B', parent: 'Tariq Sheikh', phone: '+92 333 3334455', attendance: 95, feeStatus: 'Paid', status: 'Active' },
  { id: 'STD-1004', rollNo: '9-A-01', name: 'Zara Qureshi', class: '9-A', parent: 'Bilal Qureshi', phone: '+92 345 4445566', attendance: 88, feeStatus: 'Overdue', status: 'Active' },
  { id: 'STD-1005', rollNo: '9-B-01', name: 'Bilal Nawaz', class: '9-B', parent: 'Shahid Nawaz', phone: '+92 301 5556677', attendance: 97, feeStatus: 'Paid', status: 'Active' },
];

export const mockTeachers = [
  { id: 'EMP-001', name: 'Mr. Ahmad Shah', email: 'a.shah@school.edu', role: 'Senior Teacher', department: 'Mathematics', phone: '+92 300 9998877', assignedClass: '10-A', attendance: 96, salaryStatus: 'Paid', status: 'Active' },
  { id: 'EMP-002', name: 'Ms. Fatima Ali', email: 'f.ali@school.edu', role: 'Teacher', department: 'English', phone: '+92 321 8887766', assignedClass: '10-B', attendance: 99, salaryStatus: 'Paid', status: 'Active' },
  { id: 'EMP-003', name: 'Mr. Zain Khan', email: 'z.khan@school.edu', role: 'Teacher', department: 'Physics', phone: '+92 333 7776655', assignedClass: '9-A', attendance: 92, salaryStatus: 'Pending', status: 'Active' },
  { id: 'EMP-004', name: 'Ms. Sara Malik', email: 's.malik@school.edu', role: 'Teacher', department: 'Biology', phone: '+92 345 6665544', assignedClass: '9-B', attendance: 95, salaryStatus: 'Paid', status: 'Active' },
  { id: 'EMP-005', name: 'Mr. Usman Raza', email: 'u.raza@school.edu', role: 'Senior Teacher', department: 'Chemistry', phone: '+92 301 5554433', assignedClass: '8-A', attendance: 88, salaryStatus: 'Overdue', status: 'Active' },
];

export const mockClasses = [
  { id: 'CLS-001', name: 'Class 10', section: 'A', classTeacher: 'Mr. Ahmad Shah', studentsCount: 45, avgAttendance: 92, status: 'Active' },
  { id: 'CLS-002', name: 'Class 10', section: 'B', classTeacher: 'Ms. Fatima Ali', studentsCount: 42, avgAttendance: 88, status: 'Active' },
  { id: 'CLS-003', name: 'Class 9', section: 'A', classTeacher: 'Mr. Zain Khan', studentsCount: 48, avgAttendance: 95, status: 'Active' },
  { id: 'CLS-004', name: 'Class 9', section: 'B', classTeacher: 'Ms. Sara Malik', studentsCount: 44, avgAttendance: 90, status: 'Active' },
  { id: 'CLS-005', name: 'Class 8', section: 'A', classTeacher: 'Mr. Usman Raza', studentsCount: 50, avgAttendance: 87, status: 'Active' },
];

export const mockTransactions = [
  { id: 'TXN-9081', date: '2026-10-01', description: 'Monthly SaaS Fee - Crescent International', type: 'Credit', amount: 12500, method: 'Bank Transfer', status: 'Completed' },
  { id: 'TXN-9082', date: '2026-10-01', description: 'AWS & Vercel Cloud Server Infrastructure', type: 'Debit', amount: 38500, method: 'Credit Card', status: 'Completed' },
  { id: 'TXN-9083', date: '2026-10-02', description: 'Monthly SaaS Fee - Lahore Grammar School', type: 'Credit', amount: 61500, method: 'Bank Transfer', status: 'Completed' },
  { id: 'TXN-9084', date: '2026-10-02', description: 'Twilio & WhatsApp Messaging Gateway', type: 'Debit', amount: 24000, method: 'Credit Card', status: 'Completed' },
  { id: 'TXN-9085', date: '2026-10-03', description: 'Monthly SaaS Fee - Army Public School', type: 'Credit', amount: 32000, method: 'Online Transfer', status: 'Completed' },
  { id: 'TXN-9086', date: '2026-10-05', description: 'Core Platform Engineering Sprint', type: 'Debit', amount: 55000, method: 'Bank Transfer', status: 'Completed' },
];

export const mockSupportQueries = [
  { id: 'TKT-101', subject: 'Customized Fee Voucher Template', user: 'Ahmad Raza', role: 'School Admin (Crescent)', status: 'Open', priority: 'High', date: '2026-10-01' },
  { id: 'TKT-102', subject: 'Biometric Attendance Machine Sync API', user: 'Zain Malik', role: 'School Admin (City School)', status: 'In Progress', priority: 'Medium', date: '2026-10-02' },
  { id: 'TKT-103', subject: 'Add Additional Branch Campus (500 Students)', user: 'Sara Khan', role: 'School Admin (LGS)', status: 'Resolved', priority: 'Low', date: '2026-09-28' },
];
